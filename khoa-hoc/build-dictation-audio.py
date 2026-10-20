"""Rebuild bounded source excerpts and explicit Titi transcript fallbacks.
Requires faster-whisper, av, imageio-ffmpeg, edge-tts and a cached Whisper model.
Use --course/--unit for a focused repair; source audio stays read-only.
"""
import json,re,difflib,hashlib,subprocess,concurrent.futures,asyncio,argparse,os,tempfile
import edge_tts
args=argparse.ArgumentParser()
args.add_argument('--course');args.add_argument('--unit',type=int)
args.add_argument('--model',default='tiny.en')
args.add_argument('--media-root')
options=args.parse_args()
from pathlib import Path
import av,imageio_ffmpeg
from faster_whisper import WhisperModel
_open=av.open
def compatible_open(*args,**kwargs):kwargs.pop('metadata_errors',None);return _open(*args,**kwargs)
av.open=compatible_open
base=Path(__file__).resolve().parent.parent;media=Path(options.media_root) if options.media_root else base/'titi-game-media/assets';out=base/'game-kit/adventures/dictation-sentences-v1';out.mkdir(exist_ok=True)
cache=Path(tempfile.gettempdir())/('titi-dictation-alignment-'+options.model);cache.mkdir(exist_ok=True)
model=WhisperModel(options.model,device='cpu',compute_type='int8',cpu_threads=1,num_workers=6,local_files_only=True)
norm=lambda s:re.sub(r'[^a-z0-9]','',s.lower().replace('’',"'"))
contractions={"i'm":"i am","you're":"you are","we're":"we are","they're":"they are","it's":"it is","he's":"he is","she's":"she is","that's":"that is","what's":"what is","there's":"there is","here's":"here is","don't":"do not","doesn't":"does not","isn't":"is not","aren't":"are not","can't":"can not","won't":"will not","didn't":"did not","wasn't":"was not","weren't":"were not","let's":"let us","i've":"i have","we've":"we have","they've":"they have","you've":"you have"}
numberwords='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split()
def terms(text):
 words=[]
 for word in re.findall(r"[A-Za-z0-9]+(?:['’][A-Za-z]+)*",text.lower().replace('’',"'")):
  words.extend(norm(w) for w in contractions.get(word,numberwords[int(word)] if word.isdigit() and int(word)<len(numberwords) else word).split())
 return words
def sentences(doc):
 rows=[]
 for p in doc['paragraphs']:
  buf=[]
  for token in p['tokens']:
   buf.append(token)
   if re.search(r'[.!?][”"\s]*$',token['text']) and token['text'].strip() not in ['Mr.','Mrs.','Ms.','Dr.']:
    rows.append({'text':''.join(t['text'] for t in buf),'ids':[t['id'] for t in buf if t.get('id')]});buf=[]
  if buf:rows.append({'text':''.join(t['text'] for t in buf),'ids':[t['id'] for t in buf if t.get('id')]})
 return rows
def job(file):
 pack=json.loads(file.read_text(encoding='utf8'));audio=pack['items'][0]['sourceAudio'];assert len(audio)==1
 source=media/audio[0].split('/assets/',1)[1];sha=hashlib.sha256(source.read_bytes()).hexdigest();cp=cache/(sha+'.json')
 record=None
 if cp.exists():
  try:record=json.loads(cp.read_text())
  except (ValueError,OSError):pass
 if record is None:
  segments,info=model.transcribe(str(source),word_timestamps=True,beam_size=1,best_of=1,temperature=0.0,condition_on_previous_text=False,language='en',vad_filter=True)
  record={'duration':info.duration,'words':[{'word':w.word,'start':w.start,'end':w.end} for s in segments for w in s.words]};cp.write_text(json.dumps(record),encoding='utf8')
 spoken=[{**w,'word':part} for w in record['words'] for part in terms(w['word'])];rows=sentences(pack['items'][0]['dictationDocument']);expected=[]
 for row in rows:row['offset']=len(expected);row['words']=terms(row['text']);expected+=row['words']
 matcher=difflib.SequenceMatcher(None,expected,[norm(w['word']) for w in spoken],autojunk=False);mapping={}
 for a,b,size in matcher.get_matching_blocks():
  for i in range(size):mapping[a+i]=b+i
 result={};audit=[];pending=[]
 for i,row in enumerate(rows):
  if not row['ids']:continue
  indices=[j for j in range(row['offset'],row['offset']+len(row['words'])) if j in mapping];coverage=len(indices)/max(1,len(row['words']))
  before=[j for j in mapping if j<row['offset']];after=[j for j in mapping if j>=row['offset']+len(row['words'])];method='source word alignment'
  if indices:first,last=mapping[indices[0]],mapping[indices[-1]];start=max(0,spoken[first]['start']-.45);end=min(record['duration'],spoken[last]['end']+.65)
  else:first=last=None;start=0;end=record['duration']
  # Retain the complete source turn when ASR misses a contraction, name or
  # non-lexical cue. Bounds come from neighbouring verified transcript words,
  # never from a guessed translation or newly synthesised speech.
  if not indices or indices[0]>row['offset']:
   method='bounded source context'
   if before:start=max(0,spoken[mapping[max(before)]]['end']+.05)
   elif first is not None:
    gaps=[j for j in range(max(1,first-8),first+1) if spoken[j]['start']-spoken[j-1]['end']>.65];start=max(0,spoken[gaps[-1]]['start']-.25) if gaps else max(0,spoken[first]['start']-2)
  if not indices or indices[-1]<row['offset']+len(row['words'])-1:
   method='bounded source context'
   end=min(record['duration'],spoken[mapping[min(after)]]['start']-.05) if after else record['duration']
  if end-start>40:return {'course':pack['course'],'unit':pack['unit'],'error':'Source boundary needs review','sentence':row['text'],'coverage':coverage,'seconds':end-start}
  # Unmatched textbook lines must never borrow an unrelated source sentence.
  # The explicit Titi transcript fallback is recorded in a later build step.
  fallback=coverage<.8 or end-start<.4
  sentenceId=f"{pack['course']}-unit-{pack['unit']}-sentence-{i+1}";name=sentenceId+'.mp3';target=out/name
  if not fallback:pending.append((target,start,end))
  clip={'id':sentenceId,'audio':'../game-kit/adventures/dictation-sentences-v1/'+name,'text':row['text'],'start':round(start,3),'end':round(end,3),'coverage':round(coverage,3),'alignmentMethod':method,'originalSha256':sha,'originalAudio':audio[0],'ids':row['ids']};audit.append(clip)
  if fallback:clip['alignmentMethod']='Titi transcript fallback';clip['start']=None;clip['end']=None
  for qid in row['ids']:result[qid]={'dictationSentence':sentenceId,'dictationSentenceNumber':len(audit),'questionAudio':[clip['audio']]}
 if len(result)!=len(pack['items']):return {'course':pack['course'],'unit':pack['unit'],'error':'Incomplete blank mapping'}
 labels=''.join(f'[a{i}]' for i in range(len(pending)))
 filters=f'[0:a]asplit={len(pending)}'+labels+';'+ ';'.join(f'[a{i}]atrim=start={start:.3f}:end={end:.3f},asetpts=PTS-STARTPTS[c{i}]' for i,(_,start,end) in enumerate(pending))
 command=[imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(source),'-filter_complex_threads','1','-filter_complex',filters]
 for i,(target,_,_) in enumerate(pending):command+=['-map',f'[c{i}]','-c:a','libmp3lame','-q:a','2',str(target)]
 subprocess.run(command,check=True)
 for q in result.values():q['dictationSentenceCount']=len(audit)
 return {'course':pack['course'],'unit':pack['unit'],'items':result,'sentences':audit}

files=[f for f in (base/'khoa-hoc/dictation').glob('*/*.json') if (not options.course or f.parent.name==options.course) and (not options.unit or f.stem=='unit-'+str(options.unit))]
manifest=out/'manifest.json'
data=json.loads(manifest.read_text(encoding='utf8')) if manifest.exists() else {'version':1,'units':[]}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for unit in pool.map(job,files):
  if unit.get('error'):raise RuntimeError(str(unit))
  data['units']=[u for u in data['units'] if (u['course'],u['unit'])!=(unit['course'],unit['unit'])]+[unit]
async def recordings():
 sem=asyncio.Semaphore(4)
 async def record(clip):
  async with sem:
   target=base/'khoa-hoc'/clip['audio']
   for attempt in range(5):
    try:
     await edge_tts.Communicate(clip['text'].strip(),'en-US-AnaNeural',rate='-8%').save(str(target));return
    except Exception:
     if attempt==4:raise
     await asyncio.sleep(attempt+1)
 jobs=[]
 for unit in data['units']:
  if options.course and unit['course']!=options.course:continue
  if options.unit and unit['unit']!=options.unit:continue
  for clip in unit['sentences']:
   fallback=clip['coverage']<.8 or clip['alignmentMethod']=='Titi transcript fallback'
   if fallback:
    clip['alignmentMethod']='Titi transcript fallback';clip['start']=None;clip['end']=None
    clip['narrator']='Titi · Classroom transcript (native English)';jobs.append(record(clip))
   else:clip['narrator']='Class Resources · Original recording excerpt'
   for qid in clip['ids']:unit['items'][qid]['audioNarration']=clip['narrator']
 await asyncio.gather(*jobs)
asyncio.run(recordings())
for unit in data['units']:
 file=base/f"khoa-hoc/dictation/{unit['course']}/unit-{unit['unit']}.json"
 pack=json.loads(file.read_text(encoding='utf8'));doc=pack['items'][0]['dictationDocument']
 canonical=json.dumps([[p.get('speaker',''),''.join(t['text'] for t in p['tokens'])] for p in doc['paragraphs']],ensure_ascii=False,separators=(',',':'))
 unit['documentSha256']=hashlib.sha256(canonical.encode()).hexdigest()
 for clip in unit['sentences']:
  old=base/'khoa-hoc'/clip['audio']
  key=':'.join([unit['course'],str(unit['unit']),clip['originalSha256'],format(clip['start'],'.3f') if clip['start'] is not None else '',format(clip['end'],'.3f') if clip['end'] is not None else '',clip['alignmentMethod'],clip['text'] if clip['start'] is None else ''])
  name=hashlib.sha256(key.encode()).hexdigest()[:20]+'.mp3';dest=out/name
  if old.resolve()!=dest.resolve():dest.write_bytes(old.read_bytes())
  clip['audio']='../game-kit/adventures/dictation-sentences-v1/'+name
  for qid in clip['ids']:unit['items'][qid]['questionAudio']=[clip['audio']]
 for q in pack['items']:q.update(unit['items'][q['id']])
 pack['sentenceAudioVersion']=1;file.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
data['source']='Original Class Resources excerpts; low-confidence alignments use labelled native Titi narration of the teacher transcript'
manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Sentence audio mapped for',len(data['units']),'Units')
