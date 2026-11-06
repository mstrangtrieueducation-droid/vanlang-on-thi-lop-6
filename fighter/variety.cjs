/* Variety layer: more task types per level, harder contexts, plausible distractors and short feedback.
   Runs after training-depth.cjs. Source rows stay untouched; game sentences live in game-sentences.json. */
const fs = require('fs'), path = require('path');

// Which task types each level gets. Easier levels warm up with meaning, sound and true/false;
// advanced levels lean on reading evidence and spotting misused words.
const LEVELS = {
  'Vocabulary 1': ['meaning', 'listen', 'flash', 'define', 'pick'],
  'Vocabulary 2': ['meaning', 'listen', 'flash', 'define', 'pick', 'swap'],
  'Reading 1': ['meaning', 'listen', 'define', 'pick', 'swap'],
  'Reading 2': ['meaning', 'define', 'pick', 'swap'],
  'Reading 3': ['pick', 'swap'],
  'Reading 4': ['pick', 'swap'],
  'Reading 5': ['pick', 'swap']
};
const PASSAGE_SENTENCES = { 'Vocabulary 1': 2, 'Vocabulary 2': 2 }; // others: 3
const PREPS = { to: ['for', 'with', 'at', 'of'], of: ['for', 'from', 'with', 'to'], for: ['to', 'of', 'with', 'at'], with: ['to', 'for', 'by', 'at'], in: ['on', 'at', 'to', 'of'], on: ['in', 'at', 'to', 'by'], at: ['in', 'on', 'to', 'by'], from: ['of', 'by', 'with', 'to'], about: ['on', 'for', 'to', 'at'], up: ['out', 'off', 'down', 'away'], out: ['up', 'off', 'away', 'down'], off: ['out', 'up', 'away', 'down'], down: ['up', 'out', 'off', 'away'], into: ['in', 'to', 'onto', 'at'], by: ['with', 'from', 'of', 'at'], away: ['off', 'out', 'up', 'down'], after: ['for', 'at', 'into', 'to'] };
// Pairs where both prepositions are normal English, so neither can be a wrong option for the other.
const BOTH_OK = ['think of|about', 'dream of|about', 'hear of|about', 'talk of|about', 'complain of|about', 'care for|about', 'worry about|over', 'angry with|at', 'agree with|on', 'good at|in', 'arrive at|in', 'speak to|with', 'talk to|with', 'meet with|up', 'look for|after', 'wait for|on', 'part of|in', 'in time|on'];
const IRREGULAR = new Set('be have do go make take give get see come know think find tell become leave feel bring begin keep hold write stand hear let mean set meet run pay sit speak lie lead read grow lose fall send build understand draw break spend cut rise drive buy wear choose seek throw catch deal win forget sell fight teach eat drink sing swim fly hide shake steal strike bear beat bend bind bite bleed blow breed burn burst cast cling creep dig feed flee forbid forgive freeze grind hang hurt kneel lay lend light quit ride ring shine shoot shrink shut sink slide spin split spread spring sting stink strive swear sweep swing tear wake weave weep wind undergo withdraw overcome arise'.split(' '));

const seedOf = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = seed => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffle = (a, r) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const root = w => w.toLowerCase().replace(/^(be|to|get) /, '').replace(/[^a-z]/g, '').slice(0, 5);

// One short Vietnamese meaning: first sense, without an English "word:" label that would give the answer away.
function shortMeaning(w) {
  let m = String(w.meaning || '').replace(/^\s*[A-Za-z][A-Za-z\s'()\/-]*:\s*/, '');
  m = m.split(/\s*#\s*|\s+·\s+|;|\s*><\s*|\s*↔\s*|\s+~\s+/)[0].replace(/[.…]+$/, '').replace(/\s+/g, ' ').trim();
  return m.length > 70 ? m.slice(0, m.lastIndexOf(' ', 68)) + '…' : m;
}
function findForm(sentence, head) {
  if (/\s/.test(head)) { const i = sentence.toLowerCase().indexOf(head.toLowerCase()); return i < 0 ? null : { index: i, text: sentence.slice(i, i + head.length) }; }
  const h = head.toLowerCase(), forms = [h, h + 's', h + 'es', h + 'ed', h + 'd', h + 'ing', h.replace(/e$/, 'ing'), h.replace(/y$/, 'ies'), h.replace(/y$/, 'ied')];
  const m = new RegExp('\\b(' + [...new Set(forms)].sort((a, b) => b.length - a.length).map(esc).join('|') + ')\\b', 'i').exec(sentence);
  return m ? { index: m.index, text: m[0] } : null;
}
// The suffix the target carries in its sentence, so a distractor can wear the same ending.
function suffixOf(form, head) {
  const f = form.toLowerCase(), h = head.toLowerCase();
  if (f === h) return '';
  if (f === h + 's' || f === h + 'es' || f === h.replace(/y$/, 'ies')) return 's';
  if (f === h + 'ed' || f === h + 'd' || f === h.replace(/y$/, 'ied')) return 'ed';
  if (f === h + 'ing' || f === h.replace(/e$/, 'ing')) return 'ing';
  return null;
}
function inflect(word, suffix, pos) {
  const w = word.toLowerCase(), consonantY = /[^aeiou]y$/.test(w);
  if (!suffix) return word;
  if (/\s/.test(w)) return null;
  if (suffix === 's') return /(s|x|z|ch|sh)$/.test(w) ? w + 'es' : consonantY ? w.slice(0, -1) + 'ies' : w + 's';
  if (pos !== 'verb') return null;
  if (IRREGULAR.has(w)) return null;
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(w)) return null; // short CVC words double their last letter; skip them
  if (suffix === 'ed') return w.endsWith('e') ? w + 'd' : consonantY ? w.slice(0, -1) + 'ied' : w + 'ed';
  if (suffix === 'ing') return w.endsWith('ie') ? w.slice(0, -2) + 'ying' : /[^e]e$/.test(w) ? w.slice(0, -1) + 'ing' : w + 'ing';
  return null;
}
const keepCase = (like, w) => like[0] === like[0].toUpperCase() ? w[0].toUpperCase() + w.slice(1) : w;
const sameSense = (a, b) => { const words = s => new Set(shortMeaning(s).toLowerCase().split(/[\s,()\/]+/).filter(x => x.length >= 3 && !['một', 'của', 'cho', 'với', 'người', 'được', 'việc', 'những', 'các'].includes(x))); const A = words(a); return [...words(b)].some(x => A.has(x)); };

function tip(w) {
  const coll = (w.collocation || []).find(c => c.toLowerCase() !== w.word.toLowerCase());
  if (coll) return 'Cụm hay gặp: ' + coll + '.';
  const fam = w.family && Object.entries(w.family).filter(([, v]) => v && v.toLowerCase() !== w.word.toLowerCase()).map(([p, v]) => v + ' (' + ({ noun: 'danh từ', verb: 'động từ', adj: 'tính từ', adv: 'trạng từ' }[p] || p) + ')');
  if (fam?.length) return 'Họ từ: ' + fam.slice(0, 2).join(', ') + '.';
  return ipaOf(w) ? 'Phát âm: ' + ipaOf(w) + '.' : '';
}
const ipaOf = w => { if (/\b(sb|st|sth|someone|something|somebody)\b/i.test(w.word)) return ''; const parts = String(w.ipa || '').replace(/\//g, '').trim().split(/\s+/).filter(Boolean), n = w.word.split(/\s+/).length; return parts.length ? '/' + parts.slice(0, n).join(' ') + '/' : ''; };
const line = (w, form) => '“' + (form || w.word) + '” = ' + shortMeaning(w) + '.';

module.exports = function variety(data) {
  const sentences = fs.existsSync(path.join(__dirname, 'game-sentences.json')) ? require('./game-sentences.json') : {};
  const byTrack = {};
  for (const u of data.units) (byTrack[u.track] ??= []).push(u);
  for (const u of data.units) {
    const r = rng(seedOf(u.id));
    // Natural game sentence for each word: the reviewed replacement when the source one is crammed.
    for (const w of u.words) {
      const g = sentences[w.id];
      w.gameExample = g ? g.sentence : w.example || '';
      const f = g ? { index: g.sentence.toLowerCase().indexOf(g.form.toLowerCase()), text: g.form } : findForm(w.gameExample, w.word);
      w.gameForm = f && f.index >= 0 ? { index: f.index, text: w.gameExample.slice(f.index, f.index + f.text.length) } : null;
      w.short = shortMeaning(w);
    }
    const usable = u.words.filter(w => w.gameForm && w.short);
    const earlier = (byTrack[u.track] || []).filter(x => x.unit < u.unit).flatMap(x => x.words.filter(w => w.gameForm && w.short));
    const others = (w, n, test = () => true) => {
      const pick = list => shuffle(list.filter(x => x.id !== w.id && x.word.toLowerCase() !== w.word.toLowerCase() && root(x.word) !== root(w.word) && x.short !== w.short && test(x)), rng(seedOf(w.id + n)));
      const out = [];
      for (const x of [...pick(u.words.filter(x => x.pos === w.pos)), ...pick(u.words), ...pick(earlier.filter(x => x.pos === w.pos))]) if (!out.some(o => o.id === x.id || o.word.toLowerCase() === x.word.toLowerCase())) out.push(x);
      return out.slice(0, n);
    };

    // 1. Upgrade "Vocabulary in Context": the target now hides among other Unit words in a short passage.
    for (const t of u.tasks.filter(t => t.kind === 'context')) {
      const w = u.words.find(x => x.id === t.wordId);
      const headWords = w ? w.word.split(/\s+/).filter(x => !/^(sb|st|sth|someone|something|somebody|one's|doing|do)$/i.test(x)).length : 0;
      if (!w?.gameForm || w.gameForm.text.split(/\s+/).length > headWords) continue;
      const count = (PASSAGE_SENTENCES[u.track] || 3) - 1;
      const clueRoots = (String(t.prompt || '').match(/“([^”]+)”/) || [, ''])[1].toLowerCase().split(/[^a-z]+/).filter(x => x.length >= 5).map(x => x.slice(0, 5));
      const companions = shuffle(usable.filter(x => x.id !== w.id && !clueRoots.some(c => x.gameExample.toLowerCase().includes(c)) && !x.gameExample.toLowerCase().includes(w.gameForm.text.toLowerCase()) && root(x.word) !== root(w.word)), rng(seedOf(t.id))).slice(0, count);
      const at = Math.floor(rng(seedOf(t.id + 'pos'))() * (companions.length + 1));
      const parts = [...companions.map(x => x.gameExample)];
      parts.splice(at, 0, w.gameExample);
      const excerpt = parts.join(' '), start = parts.slice(0, at).reduce((n, s) => n + s.length + 1, 0) + w.gameForm.index;
      if (excerpt.slice(start, start + w.gameForm.text.length).toLowerCase() !== w.gameForm.text.toLowerCase()) throw Error('Passage offset ' + t.id);
      Object.assign(t, { excerpt, start, end: start + w.gameForm.text.length, answer: excerpt.slice(start, start + w.gameForm.text.length), origin: companions.length ? 'Đoạn ngắn ghép từ câu ví dụ của Unit' : 'Câu ví dụ của Unit' });
      t.explanation = line(w, t.answer) + ' ' + tip(w);
    }

    u.tasks = u.tasks.filter(t => {
      if (!['context', 'clue'].includes(t.kind)) return true;
      const clue = (String(t.prompt || '').match(/“([^”]+)”/) || [, ''])[1].toLowerCase(), r = root(t.word?.word || '');
      const head = (t.word?.word || '').split(/\s+/).filter(x => !/^(sb|st|sth|someone|something|somebody)$/i.test(x)).length;
      const r4 = r.slice(0, 4), clueWords = clue.split(/[^a-z]+/).filter(x => x.length >= 4);
      return !(r4.length >= 4 && clueWords.some(x => x.startsWith(r4))) && !(r.length >= 5 && clue.includes(r)) && t.answer.trim().split(/\s+/).length <= head + 1;
    });
    for (const t of u.tasks.filter(t => ['context', 'clue'].includes(t.kind))) {
      const lead = t.answer.length - t.answer.trimStart().length, tail = t.answer.length - t.answer.trimEnd().length;
      if (lead || tail) { t.start += lead; t.end -= tail; t.answer = t.answer.trim(); }
      const w = u.words.find(x => x.id === t.wordId);
      if (w && /Đọc phần xung quanh|Bằng chứng:/.test(t.explanation || '')) t.explanation = line(w, t.answer) + ' ' + tip(w);
    }

    // 2. Prepositions: distractors people actually confuse, never the fixed on/in/at trio.
    for (const t of u.tasks.filter(t => t.kind === 'clasp' && PREPS[t.answer])) {
      const before = (t.sentence.split('___')[0].match(/([A-Za-z]+)\W*$/) || [])[1]?.toLowerCase() || '';
      const attested = new Set(data.units.flatMap(x => x.words.flatMap(w => [...(w.collocation || []), w.sourceFamily || '', w.note || ''])).join(' · ').toLowerCase().match(/[a-z]+ [a-z]+/g) || []);
      const notes = (String(t.explanation || '') + ' ' + [...(t.word?.collocation || []), t.word?.sourceFamily || '', t.word?.note || ''].join(' ')).toLowerCase();
      const alsoRight = d => new RegExp('\\b' + esc(before) + '\\s+([a-z]+\\s*/\\s*)*' + d + '\\b').test(notes) || notes.includes(t.answer + '/' + d) || notes.includes(d + '/' + t.answer);
      const ok = d => !alsoRight(d) && !attested.has(before + ' ' + d) && !BOTH_OK.some(p => { const [h, alt] = p.split(' '); const [a, b] = alt.split('|'); return (before.startsWith(h) || h === before) && [a, b].includes(d) && [a, b].includes(t.answer); });
      const w = t.word, g = sentences[t.wordId];
      if (g && before) { const m = new RegExp('\\b(' + esc(before) + ')\\s+(' + esc(t.answer) + ')\\b', 'i').exec(g.sentence); if (m) { t.sentence = g.sentence.slice(0, m.index + m[1].length + 1) + '___' + g.sentence.slice(m.index + m[0].length); t.gameSentence = true; t.origin = 'Câu luyện tập của trung tâm · cụm từ trong Unit'; } }
      const pool = PREPS[t.answer].filter(ok);
      if (pool.length < 3) continue;
      t.choices = [t.answer, ...shuffle(pool, rng(seedOf(t.id))).slice(0, 3)];
    }

    // 3. Word family: an -ed form after "be/feel/seem" is an adjective, not a verb.
    for (const t of u.tasks.filter(t => t.kind === 'family'))
      if (/ed$/.test(t.answer) && /\b(am|is|are|was|were|be|been|being|feel|feels|felt|seem|seems|seemed|become|became|get|got)\s+(very |so |really |more |most |quite )?___/i.test(t.sentence)) { t.answerPos = 'adj'; if (t.choicePos) t.choicePos[t.answer] = 'adj'; }

    // 4. Shorter, friendlier feedback for the source-generated types (authored reading/syntax notes stay).
    for (const t of u.tasks) {
      const w = u.words.find(x => x.id === t.wordId);
      if (!w) continue;
      if (t.kind === 'clue') t.explanation = line(w, t.answer) + ' ' + tip(w);
      if (t.kind === 'magnet') t.explanation = 'Cụm đúng: “' + t.answer + '”. ' + line(w);
      if (['clasp', 'family'].includes(t.kind) || t.kind === 'proofread' && t.training30) t.explanation = String(t.explanation || '').replace(/Câu gốc:.*$/s, '').replace(/Đọc phần xung quanh[^.]*\.\s*/g, '').replace(/Xác định chức năng của chỗ trống[^.]*\.\s*/g, '').replace(/(Bốn|Các) lựa chọn thuộc cùng (gốc|họ) từ[^.]*\.\s*/g, '').replace(/Dùng đúng cấu trúc kết hợp của từ; sb là viết tắt của somebody, st là viết tắt của something\.\s*/g, '').replace(/Học các từ cùng gốc[^.]*\.\s*/g, '').replace(/Cách kết hợp:[^“]*“[^”]*”\s*/g, '').replace(/\.{2,}|…\./g, '.').replace(/\s+/g, ' ').trim() + (t.kind === 'family' ? '' : ' ' + line(w));
      if (t.prompt) t.prompt = t.prompt.replace(/\s{2,}/g, ' ');
    }

    // Two source tasks can now share one natural sentence; keep only the first of any identical question.
    const seenQ = new Set();
    u.tasks = u.tasks.filter(t => { const k = t.kind + '|' + (t.sentence || t.excerpt || '') + '|' + t.answer; if (seenQ.has(k)) return false; seenQ.add(k); return true; });

    // 5. New task types, chosen by level.
    const kinds = LEVELS[u.track] || [];
    const add = (w, kind, extra) => u.tasks.push({ id: w.id + '-v-' + kind, wordId: w.id, word: w, unitId: u.id, kind, sourceIndex: w.sourceIndex, origin: 'Câu luyện tập của trung tâm · từ vựng Unit ' + u.unit, ...extra });
    for (const w of usable) {
      const wr = rng(seedOf(w.id));
      if (kinds.includes('meaning')) {
        const d = others(w, 3, x => !sameSense(w, x));
        if (d.length === 3) add(w, 'meaning', { sentence: w.word, ipa: ipaOf(w), context: w.gameExample, highlight: w.gameForm.text, answer: w.short, choices: [w.short, ...d.map(x => x.short)], explanation: line(w) + ' ' + tip(w) });
      }
      if (kinds.includes('define') && w.definition && !w.definition.toLowerCase().includes(root(w.word))) {
        const d = others(w, 3);
        if (d.length === 3) add(w, 'define', { sentence: w.definition.replace(/\.$/, ''), answer: w.word, choices: [w.word, ...d.map(x => x.word)], explanation: line(w) + ' Ví dụ: ' + w.gameExample });
      }
      if (kinds.includes('listen')) {
        const near = others(w, 12).sort((a, b) => (b.word[0] === w.word[0]) - (a.word[0] === w.word[0]) || Math.abs(a.word.length - w.word.length) - Math.abs(b.word.length - w.word.length)).slice(0, 3);
        if (near.length === 3) add(w, 'listen', { sentence: w.word, spoken: w.word, answer: w.word, choices: [w.word, ...near.map(x => x.word)], explanation: line(w) + (ipaOf(w) ? ' Phát âm: ' + ipaOf(w) + '.' : '') });
      }
      if (kinds.includes('flash')) {
        const truth = wr() < 0.5, fake = others(w, 1, x => !sameSense(w, x) && x.pos !== w.pos)[0] || others(w, 1, x => !sameSense(w, x))[0];
        if (truth || fake) add(w, 'flash', { sentence: '“' + w.word + '” nghĩa là “' + (truth ? w.short : fake.short) + '”.', answer: truth ? 'Đúng' : 'Sai', choices: ['Đúng', 'Sai'], fixedOrder: true, explanation: truth ? line(w) + ' ' + tip(w) : 'Sai rồi: “' + fake.short + '” là nghĩa của “' + fake.word + '”. ' + line(w) });
      }
      const suffix = !/\s/.test(w.word) && suffixOf(w.gameForm.text, w.word);
      if (suffix === null || suffix === false) continue;
      const fitting = others(w, 8, x => !/\s/.test(x.word) && x.pos === w.pos && !sameSense(w, x)).map(x => ({ x, form: inflect(x.word, suffix, x.pos) })).filter(v => v.form && v.form.toLowerCase() !== w.gameForm.text.toLowerCase());
      const s = w.gameExample, f = w.gameForm, article = (s.slice(0, f.index).match(/\b(a|an)\s+$/i) || [])[1]?.toLowerCase();
      const vowel = x => /^[aeiou]/i.test(x) && !/^(uni|use|usu|eu|one)/i.test(x) || /^(hour|honest|honou?r)/i.test(x);
      const agrees = form => !article || (article === 'an') === vowel(form);
      if (kinds.includes('pick') && fitting.filter(v => agrees(v.form)).length >= 3) {
        const d = fitting.filter(v => agrees(v.form)).slice(0, 3), answer = f.text.toLowerCase();
        add(w, 'pick', { sentence: s.slice(0, f.index) + '___' + s.slice(f.index + f.text.length), answer, choices: [answer, ...d.map(v => v.form)], explanation: line(w, answer) + ' ' + tip(w) });
      }
      const looksNoun = x => !/(ent|ous|ive|ful|ic|able|ible|less|ary)$/i.test(x);
      const nounSlot = !/\b(to|will|can|could|should|must|may|might|continue to|not)\s+$/i.test(s.slice(0, f.index));
      const swappable = w.pos === 'noun' && looksNoun(w.word) && nounSlot ? fitting.filter(v => agrees(v.form) && looksNoun(v.x.word)) : [];
      if (kinds.includes('swap') && swappable.length >= 1) {
        const v = swappable[swappable.length > 3 ? 3 : 0], wrong = keepCase(f.text, v.form), excerpt = s.slice(0, f.index) + wrong + s.slice(f.index + f.text.length);
        if (new RegExp('\\b' + esc(wrong) + '\\b', 'gi').test(s)) continue;
        add(w, 'swap', { excerpt, start: f.index, end: f.index + wrong.length, answer: wrong, correct: f.text, prompt: 'Một từ đang bị dùng sai. Chạm vào từ đó!', explanation: 'Từ đúng phải là “' + f.text + '” (' + w.short + '). “' + v.x.word + '” nghĩa là ' + v.x.short + ', không hợp ở đây.' });
      }
    }
  }
  return data;
};
module.exports.LEVELS = LEVELS;
