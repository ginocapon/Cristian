(function () {
  function decorateHeader() {
    var bar = document.querySelector(".topbar");
    if (!bar || bar.querySelector(".nav-pill")) return;
    var stats = document.createElement("div");
    stats.className = "header-stats";
    stats.innerHTML = "<p><b>8+</b> YEARS <span>OF CREATIVITY</span></p><p><b>750+</b> VIDEOS <span>DELIVERED</span></p><p><b>120+</b> BRANDS <span>TRUSTED</span></p>";
    var pill = document.createElement("div");
    pill.className = "nav-pill";
    while (bar.firstChild) pill.appendChild(bar.firstChild);
    var dots = pill.querySelector(".dots");
    if (dots) {
      dots.innerHTML = "<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>";
    }
    bar.appendChild(stats);
    bar.appendChild(pill);
  }
  decorateHeader();
  var overlay = document.getElementById("overlay");
  var dim = document.getElementById("overlay-dim");
  var openBtn = document.getElementById("open-menu");
  var closeBtn = document.getElementById("close-menu");
  var menuOpen = false;
  var navigating = false;

  function wrapStage() {
    if (document.getElementById("stage")) return document.getElementById("stage");
    var stage = document.createElement("div");
    stage.id = "stage";
    var nodes = [].slice.call(document.body.children);
    nodes.forEach(function (n) {
      if (n.id === "overlay" || n.id === "overlay-dim") return;
      if (n.classList && (n.classList.contains("topbar") || n.classList.contains("glows") || n.classList.contains("tech-grid"))) return;
      if (n.tagName === "SCRIPT") return;
      stage.appendChild(n);
    });
    document.body.appendChild(stage);
    return stage;
  }
  var stage = wrapStage();

  function openMenu() {
    menuOpen = true;
    document.body.classList.add("menu-open");
    if (dim) dim.classList.add("is-open");
    if (overlay) overlay.classList.add("is-open");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
  function closeMenu() {
    menuOpen = false;
    document.body.classList.remove("menu-open");
    document.body.classList.remove("is-peeking");
    if (dim) dim.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  if (openBtn) openBtn.onclick = openMenu;
  if (closeBtn) closeBtn.onclick = closeMenu;
  if (dim) dim.onclick = function () { if (!navigating) closeMenu(); };
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !navigating) closeMenu();
  });

  function rewriteUrls(root, pageUrl) {
    ["src", "href"].forEach(function (attr) {
      [].forEach.call(root.querySelectorAll("[" + attr + "]"), function (n) {
        var v = n.getAttribute(attr);
        if (!v || /^(#|mailto:|tel:|javascript:|https?:|data:)/i.test(v)) return;
        try { n.setAttribute(attr, new URL(v, pageUrl).href); } catch (err) {}
      });
    });
  }

  function stageHTMLFrom(doc, pageUrl) {
    var html = "";
    [].forEach.call(doc.body.children, function (n) {
      if (n.id === "overlay" || n.id === "overlay-dim" || n.id === "stage") return;
      if (n.classList && (n.classList.contains("topbar") || n.classList.contains("glows") || n.classList.contains("tech-grid"))) return;
      if (n.tagName === "SCRIPT") return;
      html += n.outerHTML;
    });
    var box = document.createElement("div");
    box.innerHTML = html;
    rewriteUrls(box, pageUrl);
    return box.innerHTML;
  }

  function bindPage() {
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
    }
    var copyPage = document.getElementById("copy-email-page");
    if (copyPage) {
      copyPage.onclick = function () {
        navigator.clipboard.writeText("hello@cristian.film");
      };
    }
  }
  bindPage();

  function goTo(href) {
    if (navigating) return;
    navigating = true;
    document.body.classList.add("is-peeking");
    var abs = new URL(href, location.href).href;
    fetch(abs, { credentials: "same-origin" }).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var next = stageHTMLFrom(doc, abs);
      stage.classList.remove("is-swap");
      void stage.offsetWidth;
      stage.innerHTML = next;
      stage.classList.add("is-swap");
      bindPage();
      history.pushState({ peek: true }, "", abs);
      document.title = doc.title || document.title;
      setTimeout(function () {
        closeMenu();
        navigating = false;
        window.scrollTo(0, 0);
      }, 720);
    }).catch(function () {
      location.href = abs;
    });
  }

  [].forEach.call(document.querySelectorAll(".nav-grid a"), function (a) {
    var href = a.getAttribute("href");
    if (!href || href === "#") return;
    a.setAttribute("href", new URL(href, location.href).href);
    a.addEventListener("click", function (e) {
      e.preventDefault();
      if (!menuOpen) openMenu();
      goTo(a.getAttribute("href"));
    });
  });

  window.addEventListener("popstate", function () {
    location.reload();
  });

  function tick() {
    var t = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" });
    ["clock", "clock-hero", "clock-strip"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = t;
    });
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
})();
