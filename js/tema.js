/* Theme, applied in <head> before the page is drawn, so it never flashes the wrong colours.
   Three settings, as on thepowerset.github.io: 'system' follows the device, 'light' and 'dark' fix it.
   A link can carry the setting (?tema=light, as the website's links do): it wins, is remembered,
   and is taken out of the address. The button in the header (js/app.js) cycles the three. */
(function () {
  'use strict';
  const TEMI = ['system', 'light', 'dark'];
  let tema = null;
  try {
    const dalLink = new URLSearchParams(location.search).get('tema');
    if (TEMI.includes(dalLink)) {
      tema = dalLink;
      history.replaceState(null, '', location.pathname + location.hash);
    }
  } catch (e) { /* no address to read */ }
  try {
    if (tema) localStorage.setItem('palestra.tema', tema);
    else tema = localStorage.getItem('palestra.tema');
  } catch (e) { /* this visit only */ }
  if (tema === 'light' || tema === 'dark') document.documentElement.dataset.theme = tema;
})();
