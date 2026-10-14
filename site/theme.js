// Light/dark theme switcher shared by every page.
// Loaded in <head> so the saved theme applies before first paint.
(function () {
  var KEY = 'malay-theme', root = document.documentElement;
  var dark = window.matchMedia('(prefers-color-scheme: dark)');
  var sun = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var moon = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';

  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function effective() { return root.getAttribute('data-theme') || (dark.matches ? 'dark' : 'light'); }

  function apply(t) {
    if (t === 'light' || t === 'dark') { root.setAttribute('data-theme', t); root.style.colorScheme = t; }
    else { root.removeAttribute('data-theme'); root.style.colorScheme = ''; }
    paint();
  }

  function paint() {
    var next = effective() === 'dark' ? 'light' : 'dark';
    var btns = document.querySelectorAll('.theme-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].innerHTML = (next === 'dark' ? moon : sun) + '<span class="theme-label">' + (next === 'dark' ? 'Dark' : 'Light') + '</span>';
      btns[i].setAttribute('aria-label', 'Switch to ' + next + ' mode');
      btns[i].title = 'Switch to ' + next + ' mode';
    }
  }

  apply(saved());

  document.addEventListener('DOMContentLoaded', paint);
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.theme-btn')) return;
    var t = effective() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, t); } catch (err) {}
    apply(t);
  });
  // Follow the system setting until the user picks one; sync other open tabs.
  if (dark.addEventListener) dark.addEventListener('change', function () { if (!saved()) paint(); });
  window.addEventListener('storage', function (e) { if (e.key === KEY) apply(e.newValue); });
})();
