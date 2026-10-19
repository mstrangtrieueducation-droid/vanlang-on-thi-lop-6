/* Same-origin static media has its own Pages storage budget; local QA uses working copies. */
(()=>{'use strict';function url(src){return /^(localhost|127\.0\.0\.1)$/.test(location.hostname)?String(src).replace(/^\/titi-game-media\/assets\//,'../game-kit/adventures/'):src;}window.GameMedia={url};})();
