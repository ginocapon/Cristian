(function () {
  var overlay = document.getElementById("overlay");
  var openBtn = document.getElementById("open-menu");
  var closeBtn = document.getElementById("close-menu");
  if (openBtn) openBtn.onclick = function () { overlay.classList.add("open"); document.body.style.overflow = "hidden"; };
  if (closeBtn) closeBtn.onclick = function () { overlay.classList.remove("open"); document.body.style.overflow = ""; };

  function tick() {
    var t = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" });
    var clock = document.getElementById("clock");
    var hero = document.getElementById("clock-hero");
    if (clock) clock.textContent = t;
    if (hero) hero.textContent = t;
  }
  tick();
  setInterval(tick, 1000);

  var copy = document.getElementById("copy-email");
  if (copy) {
    copy.onclick = function () {
      navigator.clipboard.writeText("hello@cristian.film").then(function () {
        copy.textContent = "Copied";
        setTimeout(function () { copy.textContent = "hello@cristian.film"; }, 1400);
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
