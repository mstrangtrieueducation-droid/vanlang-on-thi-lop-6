(() => {
  'use strict';
  const normalize = (value, max) => {
    if (typeof value !== 'string' || /[\u0000-\u001f\u007f-\u009f]/.test(value)) return '';
    const name = value.normalize('NFC').trim().replace(/\s+/g, ' ');
    return name && name.length <= max ? name : '';
  };
  function read(search) {
    const query = new URLSearchParams(search);
    const names = query.getAll('mtt_name'), classes = query.getAll('mtt_class'), english = query.getAll('mtt_english');
    if (names.length !== 1 || classes.length !== 1 || english.length > 1) return null;
    const name = normalize(names[0], 60), className = normalize(classes[0], 80);
    const englishName = english.length ? normalize(english[0], 60) : '';
    if (!name || !className || (english.length && !englishName)) return null;
    return Object.freeze({name, className, displayName: englishName || name,
      storageKey: 'mtt-tu-luyen-1-v1:profile:' + encodeURIComponent(JSON.stringify([className, name]))});
  }
  let profile = null, hasViewer = false;
  // The active viewer is authoritative. Never reuse a name from another tab or storage.
  try {
    const parent = window.parent;
    if (parent !== window && parent.location.origin === location.origin &&
        /^\/(?:student-learning|kids-learning)\/(?:index\.html)?$/.test(parent.location.pathname) &&
        parent.document.getElementById('lesson')?.contentWindow === window) {
      hasViewer = true;
      profile = read(parent.location.search);
    }
  } catch {}
  if (!hasViewer) profile = read(location.search);
  window.GameProfile = profile;
})();
