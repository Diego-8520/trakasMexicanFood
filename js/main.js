(function () {
  "use strict";
  var C = window.TRAKAS;
  if (!C) return;

  var DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  var ORDEN = [3, 4, 5, 6, 0, 1, 2]; // mostrar desde miércoles
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function money(v) {
    return v == null ? "Pregunta" : "$" + v.toLocaleString("es-CO");
  }
  function waLink(text) {
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text);
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  var d = C.direccion;
  var direccionTxt = [d.calle, d.barrio, d.ciudad].filter(Boolean).join(", ");

  /* ---- Menú ---- */
  $("#dishes").innerHTML = C.menu.platos.map(function (p) {
    return '<li class="dish">' +
      (p.destacado ? '<span class="dish__tag">🔥 Favorito</span>' : "") +
      "<h3>" + esc(p.nombre) + "</h3><p>" + esc(p.desc) + "</p>" +
      '<div class="dish__row"><span class="price">' + money(p.precio) + "<small>COP</small></span>" +
      '<a class="btn btn--wa" href="' + waLink("Hola Trakas! Quiero pedir: " + p.nombre + " 🌮") + '" target="_blank" rel="noopener" aria-label="Pedir ' + esc(p.nombre) + ' por WhatsApp">Pedir</a></div></li>';
  }).join("");
  $("#proteins").innerHTML = C.menu.proteinas.map(function (p) {
    return "<li><div><strong>" + esc(p.nombre) + "</strong><span>" + esc(p.desc) + "</span></div></li>";
  }).join("");
  $("#drinks").innerHTML = C.menu.bebidas.map(function (b) {
    return "<li><div><strong>" + esc(b.nombre) + "</strong><span>" + money(b.precio) + "</span></div></li>";
  }).join("");

  /* ---- Tabs accesibles ---- */
  var tabs = $$('[role="tab"]');
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) {
      var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (k) { var n = tabs[(i + k + tabs.length) % tabs.length]; select(n); n.focus(); }
    });
  });
  select(tabs[0]);

  /* ---- WhatsApp, NAP, enlaces ---- */
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"));
    a.target = "_blank"; a.rel = "noopener";
  });
  $$('[data-bind="direccion"]').forEach(function (el) { el.textContent = direccionTxt; });
  $$('[data-bind="telefono"]').forEach(function (el) { el.textContent = "+57 " + C.telefonoVisible; el.href = "tel:+" + C.whatsapp; });
  $$('[data-bind="maps"]').forEach(function (el) { el.href = C.googleMapsUrl; });
  $$('[data-bind="resena"]').forEach(function (el) { el.href = C.googleResenaUrl; });
  $("#year").textContent = new Date().getFullYear();

  /* ---- Horario + estado abierto ---- */
  function toMin(h) { var p = h.split(":"); return +p[0] * 60 + +p[1]; }
  var now = new Date(), today = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
  $("#hours").innerHTML = ORDEN.map(function (dia) {
    var h = C.horario.filter(function (x) { return x.dia === dia; })[0];
    var cls = (dia === today ? "is-today " : "") + (h ? "" : "is-off");
    return '<tr class="' + cls.trim() + '"><td>' + DIAS[dia] + (dia === today ? " (hoy)" : "") + "</td><td>" + (h ? h.abre + " – " + h.cierra : "Cerrado") + "</td></tr>";
  }).join("");
  var hoy = C.horario.filter(function (x) { return x.dia === today; })[0];
  var st = $("#status");
  if (hoy && mins >= toMin(hoy.abre) && mins < toMin(hoy.cierra)) {
    st.textContent = "Abierto ahora · cierra a las " + hoy.cierra; st.classList.add("is-open");
  } else {
    var next = null;
    for (var i = 0; i < 7 && !next; i++) {
      var dd = (today + i) % 7;
      var h = C.horario.filter(function (x) { return x.dia === dd; })[0];
      if (h && (i > 0 || mins < toMin(h.abre))) next = { dia: dd, h: h, i: i };
    }
    st.textContent = next ? "Cerrado · abrimos " + (next.i === 0 ? "hoy" : next.i === 1 ? "mañana" : "el " + DIAS[next.dia].toLowerCase()) + " a las " + next.h.abre : "Cerrado";
    st.classList.add("is-closed");
  }

  /* ---- Mapa diferido (no carga Google hasta el clic) ---- */
  var mapBtn = $(".map__load");
  if (mapBtn) mapBtn.addEventListener("click", function () {
    var q = C.geo ? C.geo.lat + "," + C.geo.lng : encodeURIComponent(C.nombre + " " + direccionTxt);
    $("#map").innerHTML = '<iframe title="Mapa de ubicación de Trakas Mexican Food" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + q + '&z=16&output=embed"></iframe>';
  });

  /* ---- Redes ---- */
  var REDES = { instagram: ["Instagram", "i-ig"], facebook: ["Facebook", "i-fb"], tiktok: ["TikTok", "i-tt"] };
  var items = Object.keys(REDES).filter(function (k) { return C.redes[k]; }).map(function (k) {
    return '<li><a href="' + esc(C.redes[k]) + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#' + REDES[k][1] + '"/></svg>' + REDES[k][0] + "</a></li>";
  });
  items.push('<li><a href="' + waLink("Hola Trakas! 👋") + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>WhatsApp</a></li>');
  $("#social").innerHTML = items.join("");

  /* ---- Datos estructurados para Google (Schema.org) ---- */
  var DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: C.nombre,
    alternateName: C.nombresAlternos,
    url: C.url,
    logo: C.url + "/assets/logo.png",
    image: [C.url + "/assets/logo.png", C.url + "/assets/og-image.jpg"],
    telephone: "+" + C.whatsapp,
    servesCuisine: ["Mexicana", "Tacos", "Birria"],
    priceRange: "$$",
    currenciesAccepted: "COP",
    acceptsReservations: false,
    address: {
      "@type": "PostalAddress",
      streetAddress: d.calle,
      addressLocality: d.ciudad,
      addressRegion: d.departamento,
      postalCode: d.codigoPostal,
      addressCountry: d.pais,
    },
    geo: C.geo ? { "@type": "GeoCoordinates", latitude: C.geo.lat, longitude: C.geo.lng } : undefined,
    hasMap: C.googleMapsUrl,
    openingHoursSpecification: C.horario.map(function (h) {
      return { "@type": "OpeningHoursSpecification", dayOfWeek: DOW[h.dia], opens: h.abre, closes: h.cierra };
    }),
    sameAs: Object.keys(C.redes).map(function (k) { return C.redes[k]; }).filter(Boolean),
    potentialAction: { "@type": "OrderAction", target: "https://wa.me/" + C.whatsapp },
    hasMenu: {
      "@type": "Menu",
      name: "Menú Trakas",
      inLanguage: "es",
      hasMenuSection: [
        {
          "@type": "MenuSection", name: "Platos",
          hasMenuItem: C.menu.platos.map(function (p) {
            return { "@type": "MenuItem", name: p.nombre, description: p.desc,
              offers: { "@type": "Offer", price: p.precio, priceCurrency: "COP" } };
          }),
        },
        {
          "@type": "MenuSection", name: "Bebidas",
          hasMenuItem: C.menu.bebidas.map(function (b) { return { "@type": "MenuItem", name: b.nombre }; }),
        },
      ],
    },
  };
  var s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(ld);
  document.head.appendChild(s);
})();
