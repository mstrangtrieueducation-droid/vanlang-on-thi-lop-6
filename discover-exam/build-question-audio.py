import json,re,hashlib,subprocess,concurrent.futures,threading
from pathlib import Path
import av,imageio_ffmpeg
from faster_whisper import WhisperModel
_open=av.open
def compatible_open(*args,**kwargs):kwargs.pop('metadata_errors',None);return _open(*args,**kwargs)
av.open=compatible_open
base=Path(__file__).resolve().parent.parent;cache=base/'discover-exam/alignment.private';cache.mkdir(exist_ok=True)
out=base/'discover-exam/audio/questions-v1';out.mkdir(parents=True,exist_ok=True)
model=WhisperModel('tiny.en',device='cpu',compute_type='int8',cpu_threads=2,num_workers=3,local_files_only=True)
jobs=[]
for file in (base/'discover-exam/data').glob('discover-*-test-*.json'):
 data=json.loads(file.read_text(encoding='utf8'))
 for sectionIndex,section in enumerate(data['sections']):
  section['letter']=section.get('letter') or 'part-'+str(sectionIndex+1);section['sectionIndex']=sectionIndex
  if section.get('audio'):jobs.append((data['id'],section))
numbers={v:i+1 for i,v in enumerate(['one','two','three','four','five','six','seven','eight','nine','ten'])}
def job(row):
 test,s=row;source=(base/'discover-exam'/s['audio']).resolve();cp=cache/(source.stem+'.json')
 if cp.exists():record=json.loads(cp.read_text(encoding='utf8'))
 else:
  segments,info=model.transcribe(str(source),word_timestamps=True,beam_size=5,language='en')
  words=[{'word':w.word,'start':w.start,'end':w.end} for segment in segments for w in segment.words]
  record={'duration':info.duration,'words':words};cp.write_text(json.dumps(record,indent=2),encoding='utf8')
 words=record['words'];groups={}
 for q in s['questions']:
  m=re.match(r'\s*(\d+)[ab]\.',q['prompt']);group=int(m.group(1)) if m else len(groups)+1
  groups.setdefault(group,[]).append(q)
 count=len(groups);markers=[];expected=1;content_markers=False;content_starts=set();instruction_anchor=None
 for i,w in enumerate(words[:-1]):
  token=w['word'].strip().lower();v=numbers.get(re.sub(r'[^a-z]','',token))
  if re.fullmatch(r'\d+[.,:?!]?',token):v=int(re.sub(r'\D','',token))
  if v==expected and w['start']>3 and (token.endswith(('.',':')) or words[i+1]['start']-w['end']>=.3):
   markers.append(i);expected+=1
   if expected>count:break
 if len(markers)!=count:
  # ASR often omits the spoken 'one'. Anchor the first item after the last
  # instruction sentence; later numbered boundaries must still be in order.
  endwords={'word','words','sentences','answers','answer','picture','pictures','color','colour','questions'}
  instruction=[i for i,w in enumerate(words[:-1]) if 4<w['start']<20 and re.sub(r'[^a-z]','',w['word'].lower()) in endwords and (w['word'].strip().endswith('.') or words[i+1]['start']-w['end']>.6)]
  end=instruction[-1] if instruction else -1
  # Stop the instruction search at the first explicit item number.
  explicit=[i for i,w in enumerate(words) if w['start']>6 and re.fullmatch(r'\s*1[.:]',w['word'])]
  twos=[i for i,w in enumerate(words) if w['start']>6 and re.fullmatch(r'\s*(?:2[.:]|Two\.)',w['word'],re.I)]
  if twos:explicit=[i for i in explicit if i<twos[0]]
  if explicit:instruction=[i for i in instruction if i<explicit[0]];end=instruction[-1] if instruction else end
  instruction_anchor=end
  if end>=0:
   if 'colo' in s['title'].lower():
    markers=[i for i,w in enumerate(words[:-1]) if i>end and w['word'].strip().lower() in ['color','colour'] and words[i+1]['word'].strip().lower()=='the'];content_markers=True
   else:
    markers=[explicit[0] if explicit and explicit[0]>end else end];expected=2
    for i,w in enumerate(words[:-1]):
     if i<=markers[-1]:continue
     token=w['word'].strip().lower();v=numbers.get(re.sub(r'[^a-z]','',token))
     if re.fullmatch(r'\d+[.,:?!]?',token):v=int(re.sub(r'\D','',token))
     if v==expected and (token.endswith(('.',':')) or words[i+1]['start']-w['end']>=.3):markers.append(i);expected+=1
     if expected>count:break
  if end>=0 and len(markers)!=count and not content_markers:
   known={1:explicit[0] if explicit and explicit[0]>end else end}
   for i,w in enumerate(words[:-1]):
    if i<=end:continue
    token=w['word'].strip().lower();v=numbers.get(re.sub(r'[^a-z]','',token))
    if re.fullmatch(r'\d+[.,:?!]?',token):v=int(re.sub(r'\D','',token))
    if v and 2<=v<=count and v not in known and (token.endswith('.') or words[i+1]['start']-w['end']>.3):known[v]=i
   for number in range(2,count+1):
    if number in known:continue
    before=known.get(number-1,end)+1;after=min([idx for n,idx in known.items() if n>number] or [len(words)])
    boundaries=[i for i in range(before+1,after) if words[i]['start']-words[i-1]['end']>1.4 and re.search(r'[.!?]$',words[i-1]['word'].strip()) and not re.fullmatch(r'\s*(?:\d+[.:]?|one[.:]?|two[.:]?|three[.:]?)',words[i]['word'],re.I)]
    if len(boundaries)==1:known[number]=boundaries[0];content_starts.add(boundaries[0])
   if len(known)==count:markers=[known[n] for n in range(1,count+1)]
 if len(markers)!=count:return {'test':test,'part':s['letter'],'error':'Question markers '+str(len(markers))+'/'+str(count),'text':' '.join(w['word'] for w in words)}
 result={};ends=[]
 for j,m in enumerate(markers):
  first=m if content_markers or m in content_starts else m+1;last=(markers[j+1] if j+1<count else len(words))-1
  if j==count-1:
   for k in range(first+1,len(words)-1):
    token=words[k]['word'].strip().lower()
    if (re.fullmatch(r'\d+[.:]',token) or token.strip('.:') in numbers) and words[k+1]['start']-words[k]['end']>.45:last=k-1;break
   while last>first and re.fullmatch(r'\s*\d+[.:]?',words[last]['word']) and re.search(r'[.!?]$',words[last-1]['word'].strip()):last-=1
  start=max(0,words[first]['start']-.35);end=min(record['duration'],words[last]['end']+.65)
  if j+1<count:end=min(end,max(words[last]['end']+.15,words[markers[j+1]]['end']-.5))
  if end-start<.3:return {'test':test,'part':s['letter'],'error':'Invalid clip length'}
  qs=list(groups.values())[j];q=qs[0];name=f'{test}-{q["id"]}.mp3';target=out/name
  subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(source),'-ss',str(round(start,3)),'-t',str(round(end-start,3)),'-c:a','libmp3lame','-q:a','2',str(target)],check=True)
  for q in qs:result[q['id']]={'src':'../discover-exam/audio/questions-v1/'+name,'start':round(start,3),'end':round(end,3),'text':''.join(w['word'] for w in words[first:last+1]).strip(),'originalAudio':s['audio'],'originalSha256':hashlib.sha256(source.read_bytes()).hexdigest()}
 intro_end=max(0,words[markers[0]]['end']+.2 if markers[0]==instruction_anchor else words[markers[0]]['start']-.25);intro=out/f'{test}-{s["letter"]}-instruction.mp3'
 subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(source),'-t',str(round(intro_end,3)),'-c:a','libmp3lame','-q:a','2',str(intro)],check=True)
 return {'test':test,'part':s['letter'],'sectionIndex':s['sectionIndex'],'instruction':'../discover-exam/audio/questions-v1/'+intro.name,'questions':result}
rows=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for r in pool.map(job,jobs):
  rows.append(r);print(r['test'],r['part'],(r.get('error') or 'OK '+str(len(r['questions']))),flush=True)
(base/'discover-exam/audio/question-segments.json').write_text(json.dumps({'version':1,'method':'Source MP3 split at spoken numbered-question boundaries; no synthetic replacement','parts':rows},indent=2),encoding='utf8')
print('TOTAL',len(rows),'ERRORS',sum('error' in r for r in rows),flush=True)
