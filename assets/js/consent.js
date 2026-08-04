/* ==== Shared cookie consent + Google Analytics loader — used on every page ==== */
(function () {
  var KEY = 'tc-cookie-consent';
  var GA_ID = 'G-M8WGG4D329';

  function readConsent() {
    var raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { functional: !!parsed.functional, analytics: !!parsed.analytics };
      }
    } catch (e) { /* fall through to legacy format below */ }
    if (raw === 'accepted') return { functional: true, analytics: true };
    if (raw === 'rejected') return { functional: false, analytics: false };
    return null;
  }

  function writeConsent(consent) {
    localStorage.setItem(KEY, JSON.stringify(consent));
  }

  function loadGoogleAnalytics() {
    if (window.__tcGaLoaded) return;
    window.__tcGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function applyConsent(consent) {
    if (consent && consent.analytics) loadGoogleAnalytics();
    document.dispatchEvent(new CustomEvent('tc-consent-updated', { detail: consent }));
  }

  window.tcConsent = {
    get: readConsent,
    apply: applyConsent
  };

  window.tcReopenBanner = function () {
    var banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.add('visible');
      banner.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var banner = document.getElementById('cookie-banner');
    var customizeBtn = document.getElementById('cookie-customize-btn');
    var customizePanel = document.getElementById('cookie-customize-panel');
    var toggleFunctional = document.getElementById('toggle-functional');
    var toggleAnalytics = document.getElementById('toggle-analytics');
    var acceptBtn = document.getElementById('cookie-accept');
    var rejectBtn = document.getElementById('cookie-reject');
    var saveBtn = document.getElementById('cookie-save-preferences');

    var consent = readConsent();

    if (!consent) {
      if (banner) banner.classList.add('visible');
    } else {
      applyConsent(consent);
    }

    if (toggleFunctional) toggleFunctional.checked = !!(consent && consent.functional);
    if (toggleAnalytics) toggleAnalytics.checked = !!(consent && consent.analytics);

    function decide(newConsent) {
      writeConsent(newConsent);
      if (banner) banner.classList.remove('visible');
      if (customizePanel) customizePanel.hidden = true;
      applyConsent(newConsent);
    }

    if (acceptBtn) acceptBtn.addEventListener('click', function () {
      decide({ functional: true, analytics: true });
    });
    if (rejectBtn) rejectBtn.addEventListener('click', function () {
      decide({ functional: false, analytics: false });
    });
    if (customizeBtn) customizeBtn.addEventListener('click', function () {
      if (customizePanel) customizePanel.hidden = !customizePanel.hidden;
    });
    if (saveBtn) saveBtn.addEventListener('click', function () {
      decide({
        functional: !!(toggleFunctional && toggleFunctional.checked),
        analytics: !!(toggleAnalytics && toggleAnalytics.checked)
      });
    });
  });
})();
