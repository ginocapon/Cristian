(function () {
  var overlay = document.getElementById("overlay");
  var dim = document.getElementById("overlay-dim");
  var openBtn = document.getElementById("open-menu");
  var closeBtn = document.getElementById("close-menu");

  function openMenu() {
    if (dim) dim.classList.add("is-open");
    if (overlay) overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (dim) dim.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (openBtn) openBtn.onclick = openMenu;
  if (closeBtn) closeBtn.onclick = closeMenu;
  if (dim) dim.onclick = closeMenu;
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  function tick() {
    var t = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" });
    var clock = document.getElementById("clock");
    var hero = document.getElementById("clock-hero");
    var strip = document.getElementById("clock-strip");
    if (clock) clock.textContent = t;
    if (hero) hero.textContent = t;
    if (strip) strip.textContent = t;
  }
  tick();
  setInterval(tick, 1000);

  var copy = document.getElementById("copy-email");
  if (copy) {
    copy.onclick = function () {
      navigator.clipboard.writeText("hello@cristian.film").then(function () {
        var prev = copy.innerHTML;
        copy.textContent = "Copied";
        setTimeout(function () { copy.innerHTML = prev; }, 1400);
      });
    };
  }

  var pills = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll("[data-cat]");
  pills.forEach(function (pill) {
    pill.onclick = function () {
      var f = pill.getAttribute("data-filter");
      pills.forEach(function (p) { p.classList.remove("pill-lime"); p.classList.add("pill-ghost"); });
      pill.classList.add("pill-lime");
      pill.classList.remove("pill-ghost");
      cards.forEach(function (c) {
        c.style.display = f === "all" || c.getAttribute("data-cat").indexOf(f) > -1 ? "" : "none";
      });
    };
  });

  var show = document.getElementById("services");
  if (show) {
    var slides = show.querySelectorAll(".slide");
    var nav = show.querySelectorAll(".slide-nav button");
    var i = 0;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, idx) { s.classList.toggle("is-on", idx === i); });
      nav.forEach(function (b, idx) { b.classList.toggle("on", idx === i); });
    }
    nav.forEach(function (b) {
      b.onclick = function () { go(parseInt(b.getAttribute("data-slide"), 10)); };
    });
    setInterval(function () { go(i + 1); }, 5600);
  }
})();
