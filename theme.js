/* 表示のきりかえ（ダーク／ライト）  むん先生の学習クエスト
   ・ふだんはダーク（サイバー）の見た目です。ボタンでライトに変えられます。
   ・えらんだ表示は、この端末の中だけ（mun_theme）に覚えます。学習の記録にはさわりません。 */
(function () {
  var KEY = 'mun_theme', root = document.documentElement;
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function cur() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function apply(t) {
    if (t === 'light') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', t === 'light' ? '#eef2f7' : '#050914');
    var b = document.getElementById('mq-theme'); if (b) { b.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false'); b.textContent = t === 'light' ? '◐ ダーク' : '◐ ライト'; b.title = t === 'light' ? 'ダーク（暗い）表示にもどす' : 'ライト（明るい）表示にする'; }
  }
  var t = get(); if (t === 'auto') t = (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  apply(t === 'light' ? 'light' : 'dark');
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('button'); b.type = 'button'; b.id = 'mq-theme'; b.className = 'mq-theme'; b.setAttribute('aria-label', '表示を ライト・ダーク で切りかえる');
    var host = document.querySelector('.header-actions') || document.querySelector('.lab-nav');
    if (host) host.insertBefore(b, host.firstChild); else { b.className += ' float'; document.body.appendChild(b); }
    b.addEventListener('click', function () { var n = cur() === 'light' ? 'dark' : 'light'; set(n); apply(n); });
    apply(cur());
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) apply(e.newValue === 'light' ? 'light' : 'dark'); });
})();
