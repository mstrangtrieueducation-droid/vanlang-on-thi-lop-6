/* Small reusable local recordings; numbering never advances the question. */
(()=>{'use strict';window.QuestionNumbers={text(n){return 'Question '+Math.max(1,Math.trunc(n)||1)+'.';},clips(n){const raw=window.TitiVoice?.lookup(this.text(n));return (Array.isArray(raw)?raw:[raw]).filter(Boolean);}};})();
