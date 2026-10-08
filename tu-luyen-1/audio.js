(() => {
  'use strict';
  const bank = window.GAME_AUDIO_MAP || {};
  const speech = document.createElement('audio');
  speech.id = 'game-speech'; speech.preload = 'none'; speech.hidden = true;
  const effect = document.createElement('audio');
  effect.id = 'game-effect'; effect.preload = 'auto'; effect.hidden = true;
  effect.volume = 0.32;
  document.body.append(speech, effect);
  let enabled = true, mode = 'both', epoch = 0, last = null, status = '', active = false;
  try { const p = JSON.parse(localStorage.getItem('mtt-game-audio-v1') || '{}'); enabled = p.enabled !== false; if (['en','both'].includes(p.mode)) mode = p.mode; } catch {}
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const persist = () => { try { localStorage.setItem('mtt-game-audio-v1', JSON.stringify({enabled,mode})); } catch {} };
  function controls() {
    const b = document.getElementById('audio-toggle');
    b.textContent = enabled ? '🔊 Tiếng: Bật' : '🔇 Tiếng: Tắt';
    b.setAttribute('aria-pressed', String(enabled));
    document.getElementById('audio-mode').value = mode;
  }
  function mount() {
    const host = document.getElementById('pronunciation-panel'); if (!host) return;
    if (!last) { host.innerHTML = '<p class="audio-tip">🔊 Bấm thẻ từ hoặc câu trả lời để nghe tiếng Anh và nghĩa tiếng Việt.</p>'; return; }
    host.innerHTML = `<div class="heard-words"><b lang="en">${escape(last.en)}</b><span lang="vi">${escape(last.vi)}</span></div><div class="repeat-buttons"><button type="button" data-repeat="en" aria-label="Nghe lại tiếng Anh">🔊 Anh</button><button type="button" data-repeat="vi" aria-label="Nghe lại tiếng Việt">🔊 Việt</button><button type="button" data-stop aria-label="Dừng đọc" ${active?'':'disabled'}>■</button></div><small class="audio-status" role="status" aria-live="polite">${escape(status)}</small>`;
    host.querySelectorAll('[data-repeat]').forEach(b => b.onclick = () => say(last.en,b.dataset.repeat));
    host.querySelector('[data-stop]').onclick = () => stop(false);
  }
  function stop(clear = true) {
    epoch++; speech.pause(); speech.onended = null; speech.onerror = null;
    active = false; status = ''; if (clear) last = null;
    effect.pause(); mount();
  }
  function say(text, requested = mode) {
    const item = bank[text]; if (!item) return;
    epoch++; const ticket = epoch;
    speech.pause(); speech.onended = null; speech.onerror = null;
    last = item; active = false;
    if (!enabled) { status = 'Bật tiếng ở thanh phía trên để nghe nhé.'; mount(); return; }
    const list = requested === 'both' ? ['en','vi'] : [requested];
    let index = 0;
    function failed(error) {
      if (ticket !== epoch || error?.name === 'AbortError') return;
      active = false; status = 'Chưa phát được âm thanh. Bấm Anh hoặc Việt để thử lại nhé.'; mount();
    }
    function next() {
      if (ticket !== epoch) return;
      if (index >= list.length) { active = false; status = 'Bấm Anh hoặc Việt để nghe lại.'; mount(); return; }
      const lang = list[index++];
      speech.src = item[lang + 'File']; speech.volume = 0.9;
      active = true; status = lang === 'en' ? 'Đang nghe tiếng Anh…' : 'Đang nghe nghĩa tiếng Việt…'; mount();
      speech.onended = next; speech.onerror = failed;
      const play = speech.play(); if (play) play.catch(failed);
    }
    next();
  }
  function sound(kind) {
    if (!enabled) return;
    if (!['correct','retry','pair','finish'].includes(kind)) return;
    effect.pause(); effect.src = `audio/${kind}.wav`;
    const promise = effect.play(); if (promise) promise.catch(() => {});
  }
  document.getElementById('audio-toggle').onclick = () => {
    enabled = !enabled; if (!enabled) stop(false); else sound('pair'); persist(); controls(); mount();
  };
  document.getElementById('audio-mode').onchange = e => { mode = e.target.value === 'en' ? 'en' : 'both'; stop(false); persist(); };
  document.getElementById('audio-demo').onclick = () => sound('correct');
  document.getElementById('app').addEventListener('click', e => {
    const b = e.target.closest('[data-say]');
    if (b && !b.disabled) say(b.dataset.say);
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(false); });
  window.GameAudio = {say, sound, stop, mount}; persist(); controls();
})();
