/* ==========================================================
   Muhammad Hazrin Syahmi: Portfolio interactions
   ========================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js"); // fallback; index.html also sets this before first paint

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Toast ---------- */
  var toastEl = $("#toast");
  var toastTimer;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  /* ---------- Footer year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Hero intro ---------- */
  // Wait for two frames so the starting state paints, then let the transitions run.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add("loaded"); });
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $("#menuBtn");
  var menuLabel = $(".menu-label", menuBtn);
  var navMenu = $("#navMenu");

  function setMenu(open) {
    root.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuLabel.textContent = open ? menuLabel.dataset.close : menuLabel.dataset.open;
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!root.classList.contains("menu-open"));
  });
  $$("a", navMenu).forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 760) setMenu(false);
  });

  /* ---------- Header: theme follows the section underneath, active link ---------- */
  var header = $(".site-header");
  var themed = $$("[data-theme]");
  var navLinks = $$(".nav-link");
  var ticking = false;

  function updateHeader() {
    ticking = false;
    // Probe the line just under the header: after a nav jump the target section's
    // top edge sits exactly there, so it counts as the current section.
    var probe = header.offsetHeight;
    var current = null;

    themed.forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) current = sec;
    });

    header.classList.toggle("scrolled", window.scrollY > 24);

    if (current) {
      header.setAttribute("data-header-theme", current.getAttribute("data-theme"));
      navLinks.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
      });
    }
  }
  function requestUpdate() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); }
  }
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateHeader();

  /* ---------- Scroll reveal (text blocks and images) ---------- */
  // Light stagger for reveal elements that share a parent
  $$(".reveal").forEach(function (el) {
    var siblings = $$(".reveal", el.parentElement).filter(function (s) { return s.parentElement === el.parentElement; });
    var i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", Math.min(i * 0.09, 0.45) + "s");
  });

  var revealEls = $$(".reveal, .img-reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Placeholder links ---------- */
  // Links still set to "#" show a hint instead of jumping back to the top.
  $$("a[data-placeholder]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (a.getAttribute("href") === "#") {
        e.preventDefault();
        showToast(a.getAttribute("data-placeholder") + " is a placeholder. Add your URL in index.html.");
      }
    });
  });
})();