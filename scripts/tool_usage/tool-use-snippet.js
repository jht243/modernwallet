/* Fleet tool-usage tracker — CANONICAL copy (layer3 scripts/tool_usage/tool-use-snippet.js).
 * Internal tracking: beacons go to OUR database (growth-sites-api → Supabase
 * tool_usage_events), not GA4. Identical on every site; the API takes the
 * site from the Origin header.
 *
 * Per page view, at most:
 *   view   — once, when the page has an element marked data-tool="<tool-slug>"
 *   use    — once, on the first real interaction inside that element
 *   sample — at most once (debounced 2.5s after interaction settles), capturing ONLY
 *            privacy-safe anonymized choice buckets (<select>, radio/checkbox, or
 *            coarse numeric magnitude buckets — NEVER free-text, emails, or PII).
 * visitor = random first-party id in localStorage (no PII, no cookies).
 */
(function () {
  var API = 'https://growth-sites-api.onrender.com/api/tool-use';
  var vid = '';
  try {
    vid = localStorage.getItem('_tu_vid') || '';
    if (!vid) { vid = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); localStorage.setItem('_tu_vid', vid); }
  } catch (e) { /* storage blocked — send without an id */ }

  function numBucket(n) {
    if (!isFinite(n)) return '';
    var a = Math.abs(n);
    if (a === 0) return '0';
    if (a <= 10) return '1-10';
    if (a <= 50) return '11-50';
    if (a <= 250) return '51-250';
    if (a <= 1000) return '251-1k';
    if (a <= 10000) return '1k-10k';
    return '10k+';
  }

  function cleanKey(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 24);
  }

  function collectSafeBuckets(root) {
    var out = {};
    var count = 0;
    var els = root.querySelectorAll('select,input[type="range"],input[type="number"],input[type="radio"]:checked,input[type="checkbox"]:checked,[aria-pressed="true"],[data-bucket-value]');
    for (var i = 0; i < els.length && count < 6; i++) {
      var el = els[i];
      var k = cleanKey(el.getAttribute('data-bucket') || el.name || el.id || el.getAttribute('aria-label') || ('p' + i));
      if (!k || /email|name|phone|url|domain|address|zip|key|token/.test(k)) continue;
      var val = '';
      if (el.hasAttribute('data-bucket-value')) {
        val = cleanKey(el.getAttribute('data-bucket-value'));
      } else if (el.tagName === 'SELECT') {
        val = cleanKey(el.value);
      } else if (el.type === 'range' || el.type === 'number') {
        val = numBucket(parseFloat(el.value));
      } else if (el.type === 'radio' || el.type === 'checkbox') {
        val = cleanKey(el.value || 'on');
      } else {
        val = cleanKey(el.textContent);
      }
      if (val) { out[k] = val; count++; }
    }
    return count ? out : null;
  }

  function send(event, root, trigger, buckets) {
    var payload = { event: event, tool: root.getAttribute('data-tool'), path: location.pathname, vid: vid, trigger: trigger || '' };
    if (buckets) payload.buckets = buckets;
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(API, new Blob([body], { type: 'text/plain' }))) return;
    } catch (e) { /* fall through */ }
    try { fetch(API, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' }); } catch (e) { /* give up quietly */ }
  }

  var viewed = false;
  function checkView() {
    if (viewed) return;
    var root = document.querySelector('[data-tool]');
    if (root) { viewed = true; send('view', root); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', checkView); else checkView();
  window.addEventListener('load', function () { checkView(); setTimeout(checkView, 2500); });

  var used = false;
  var sampled = false;
  var sampleTimer = null;
  var CONTROLS = 'button,[role="button"],input,select,textarea,label,summary';
  function scheduleSample(root) {
    if (sampled) return;
    if (sampleTimer) clearTimeout(sampleTimer);
    sampleTimer = setTimeout(function () {
      if (sampled) return;
      var b = collectSafeBuckets(root);
      if (b) {
        sampled = true;
        var pairs = [];
        for (var k in b) { if (Object.prototype.hasOwnProperty.call(b, k)) pairs.push(k + '=' + b[k]); }
        send('sample', root, ('b:' + pairs.join(';')).slice(0, 120), b);
      }
    }, 2500);
  }

  function onEvent(e) {
    var el = e.target;
    if (!el || !el.closest) return;
    var root = el.closest('[data-tool]');
    if (!root) return;
    if (e.type === 'click' && !root.hasAttribute('data-tool-any-click') && !el.closest(CONTROLS)) return;
    if (!used) {
      used = true;
      if (!viewed) { viewed = true; send('view', root); }
      send('use', root, e.type, collectSafeBuckets(root));
    }
    scheduleSample(root);
  }
  ['click', 'input', 'change', 'submit'].forEach(function (t) {
    document.addEventListener(t, onEvent, true);
  });
})();
