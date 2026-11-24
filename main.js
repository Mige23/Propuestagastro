(function () {
  "use strict";

  window.__BRAND__ = Object.freeze({
    name: "GastroFlow",
    version: "20261124",
    locale: "es-AR"
  });

  var safe = function (fn, name) {
    try { fn(); }
    catch (error) { console.warn("GastroFlow proposal: " + name, error); }
  };

  var one = function (selector, root) { return (root || document).querySelector(selector); };
  var all = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };

  function initNavigation() {
    var nav = one("[data-nav]");
    var button = one("[data-menu-button]");
    var menu = one("[data-menu]");
    if (!nav || !button || !menu) return;

    var close = function () {
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menú");
    };

    button.addEventListener("click", function () {
      var opening = !menu.classList.contains("open");
      menu.classList.toggle("open", opening);
      button.setAttribute("aria-expanded", String(opening));
      button.setAttribute("aria-label", opening ? "Cerrar menú" : "Abrir menú");
    });
    all("a", menu).forEach(function (link) { link.addEventListener("click", close); });
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) close();
    });
    window.addEventListener("scroll", function () { nav.classList.toggle("scrolled", window.scrollY > 30); }, { passive: true });
  }

  function initScrollProgress() {
    var bar = one(".progress span");
    if (!bar) return;
    var frame = 0;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = "scaleX(" + progress + ")";
      frame = 0;
    };
    window.addEventListener("scroll", function () {
      if (!frame) frame = window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function initReveals() {
    var items = all(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (item) { observer.observe(item); });
    window.setTimeout(function () {
      items.forEach(function (item) { item.classList.add("is-visible"); });
    }, 6000);
  }

  function initFeatureTabs() {
    var root = one("[data-feature-showcase]");
    if (!root) return;
    var tabs = all("[data-feature]", root);
    var panels = all("[data-panel]", root);
    if (!tabs.length || !panels.length) return;

    var activate = function (key, moveFocus) {
      tabs.forEach(function (tab) {
        var active = tab.getAttribute("data-feature") === key;
        tab.setAttribute("aria-selected", String(active));
        tab.setAttribute("tabindex", active ? "0" : "-1");
        if (active && moveFocus) tab.focus();
      });
      panels.forEach(function (panel) {
        var active = panel.getAttribute("data-panel") === key;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
    };

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { activate(tab.getAttribute("data-feature"), false); });
      tab.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        var delta = event.key === "ArrowRight" ? 1 : -1;
        var next = (index + delta + tabs.length) % tabs.length;
        activate(tabs[next].getAttribute("data-feature"), true);
      });
    });
    activate(tabs[0].getAttribute("data-feature"), false);
  }

  var businessData = {
    restaurante: {
      label: "Restaurante", title: "Del salón a la caja, sin cortes.",
      text: "Mesas, pedidos, QR, mostrador y delivery conviven con cierres de turno, stock, clientes y reportes.",
      items: [["Mesas y sectores", "Plano editable, comandas y movimiento de ventas."], ["QR de cliente", "Cuenta actual, pedidos y solicitud de atención."], ["Mostrador", "Venta rápida con cobro simple, parcial o mixto."], ["Delivery", "Pedidos, estados e impresión."]]
    },
    cafeteria: {
      label: "Bar / cafetería", title: "Rapidez en barra, control en cada turno.",
      text: "Combina atención en mesas, venta rápida, comandas y una carta digital que mantiene los precios del catálogo.",
      items: [["Salón y barra", "Circuitos simultáneos dentro de la misma caja."], ["Carta QR", "Productos y precios vigentes para el cliente."], ["Turnos", "Responsables, arqueos y diferencias documentadas."], ["Recetas", "Consumo teórico de ingredientes por venta."]]
    },
    panaderia: {
      label: "Panadería", title: "Mostrador ágil, catálogo siempre ordenado.",
      text: "Productos por unidad, peso o volumen, control de stock, proveedores y pedidos para retirar o recibir por delivery.",
      items: [["Venta rápida", "Precios fijos o definidos al momento de vender."], ["Unidades", "Unidad, peso y volumen en el catálogo."], ["QR general", "Pedidos para retiro sin asociarlos a una mesa."], ["Proveedores", "Datos comerciales centralizados."]]
    },
    rotiseria: {
      label: "Rotisería", title: "Pedidos ordenados de punta a punta.",
      text: "Mostrador y delivery operan con productos compartidos, estados visibles, clientes y una cola de pedidos QR.",
      items: [["Delivery", "Dirección, contacto, referencias y estado."], ["Retiro", "Solicitudes QR para preparar en mostrador."], ["Impresión", "Tickets y comandas térmicas."], ["Reportes", "Ventas, gastos, canales y medios de pago."]]
    },
    despensa: {
      label: "Despensa", title: "Caja, stock y clientes en un solo lugar.",
      text: "Venta de mostrador, inventario, mínimos, proveedores, cuenta corriente y reportes para seguir la operación diaria.",
      items: [["Stock", "Movimientos, mínimos y bloqueo configurable."], ["Fiado", "Firma digital, pagos parciales e historial."], ["Proveedores", "Información comercial de consulta rápida."], ["Rentabilidad", "Costo y margen por producto."]]
    },
    heladeria: {
      label: "Heladería", title: "Formatos y sabores sin cuentas manuales.",
      text: "Un flujo especializado distribuye el precio del formato entre sabores y conserva el total exacto de la venta.",
      items: [["Formatos", "Precio y máximo de sabores configurables."], ["Sabores", "Selección guiada durante la venta."], ["Prorrateo", "Distribución exacta del precio total."], ["Delivery", "Pedidos y estados dentro de la misma operación."]]
    }
  };

  function initBusinessTabs() {
    var panel = one("[data-business-panel]");
    var tabs = all("[data-business]");
    if (!panel || !tabs.length) return;
    var label = one("[data-business-label]", panel);
    var title = one("[data-business-title]", panel);
    var text = one("[data-business-text]", panel);
    var list = one("[data-business-list]", panel);

    var render = function (key) {
      var data = businessData[key];
      if (!data) return;
      tabs.forEach(function (tab) { tab.classList.toggle("active", tab.getAttribute("data-business") === key); });
      label.textContent = data.label;
      title.textContent = data.title;
      text.textContent = data.text;
      list.innerHTML = "";
      data.items.forEach(function (item) {
        var li = document.createElement("li");
        var strong = document.createElement("strong");
        var span = document.createElement("span");
        strong.textContent = item[0];
        span.textContent = item[1];
        li.appendChild(strong);
        li.appendChild(span);
        list.appendChild(li);
      });
      panel.animate([{ opacity: .55, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 340, easing: "cubic-bezier(.2,.75,.25,1)" });
    };
    tabs.forEach(function (tab) { tab.addEventListener("click", function () { render(tab.getAttribute("data-business")); }); });
  }

  function initTilt() {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    all("[data-tilt]").forEach(function (card) {
      var move = function (event) {
        var box = card.getBoundingClientRect();
        var x = (event.clientX - box.left) / box.width - .5;
        var y = (event.clientY - box.top) / box.height - .5;
        card.style.transform = "perspective(900px) rotateX(" + (-y * 4) + "deg) rotateY(" + (x * 5) + "deg) translateY(-2px)";
      };
      var reset = function () { card.style.transform = ""; };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", reset);
    });
  }

  function initHeroParallax() {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    var hero = one(".hero");
    var orbs = all(".hero-orb", hero);
    if (!hero || !orbs.length) return;
    hero.addEventListener("pointermove", function (event) {
      var x = event.clientX / window.innerWidth - .5;
      var y = event.clientY / window.innerHeight - .5;
      orbs.forEach(function (orb, index) {
        var strength = (index + 1) * 18;
        orb.style.translate = (x * strength) + "px " + (y * strength) + "px";
      });
    });
  }

  function initCounters() {
    var counters = all("[data-count]");
    if (!counters.length || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.target.dataset.done) return;
        entry.target.dataset.done = "true";
        var target = Number(entry.target.getAttribute("data-count"));
        var start = performance.now();
        var tick = function (now) {
          var ratio = Math.min(1, (now - start) / 800);
          entry.target.textContent = String(Math.round(target * (1 - Math.pow(1 - ratio, 3))));
          if (ratio < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(entry.target);
      });
    }, { threshold: .04 });
    counters.forEach(function (counter) { observer.observe(counter); });
  }

  function initMagneticButtons() {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    all(".magnetic").forEach(function (button) {
      button.addEventListener("pointermove", function (event) {
        var box = button.getBoundingClientRect();
        var x = event.clientX - box.left - box.width / 2;
        var y = event.clientY - box.top - box.height / 2;
        button.style.transform = "translate(" + (x * .08) + "px," + (y * .12) + "px)";
      });
      button.addEventListener("pointerleave", function () { button.style.transform = ""; });
    });
  }

  safe(initNavigation, "navigation");
  safe(initScrollProgress, "scroll progress");
  safe(initReveals, "reveals");
  safe(initFeatureTabs, "feature tabs");
  safe(initBusinessTabs, "business tabs");
  safe(initTilt, "tilt cards");
  safe(initHeroParallax, "hero parallax");
  safe(initCounters, "counters");
  safe(initMagneticButtons, "buttons");
})();
