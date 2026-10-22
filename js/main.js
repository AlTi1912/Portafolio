"use strict";

/* ==========================================================================
   CONFIGURACIÓN EDITABLE
   Completa solo los valores que quieras mostrar. Los enlaces vacíos se ocultan.
   ========================================================================== */

const portfolioConfig = {
  email: "niltovap@gmail.com",
  instagram: "https://www.instagram.com/alexxtitoo/",
  github: "",
  linkedin: "",
  whatsapp: "",
  resume: "",
  // Memoji 3D con fondo transparente (PNG o WebP); vacío muestra el monograma.
  // gaze es opcional: 9 imágenes mirando hacia cada dirección, en orden de lectura
  // (arriba-izq., arriba, arriba-der., izq., centro, der., abajo-izq., abajo, abajo-der.).
  avatar: {
    src: "",
    gaze: []
  },
  // Resultados visibles en cada caso. Las métricas animan su cifra al aparecer:
  // { value: 1200, suffix: "+", label: "clics desde Google", detail: "Search Console · 3 meses" }
  caseResults: {
    sifuentes: {
      note: "La empresa ya recibe consultas de nuevos clientes que llegan a través del sitio.",
      metrics: []
    }
  },
  formspreeEndpoint: "https://formspree.io/f/xrenojvo"
};

const portfolioContent = {
  es: {
    labBriefs: [
      {
        sector: "Audio automotriz",
        brief: "Explicar un servicio técnico de instalación a quien no es experto, sin perderlo en especificaciones.",
        variants: [
          {
            slug: "sonora",
            direction: "Editorial",
            name: "SONORA",
            description: "Una experiencia sobria que convierte acústica, sistemas y calibración en una narrativa visual clara.",
            tags: ["Narrativa visual", "Tipografía editorial", "Responsive"]
          },
          {
            slug: "wavelab",
            direction: "Técnica",
            name: "WAVELAB",
            description: "Lenguaje de laboratorio, selector de vehículo y comparador visual para explicar un sistema complejo.",
            tags: ["Selector de vehículo", "Comparador", "Movimiento"]
          }
        ]
      },
      {
        sector: "Salud visual",
        brief: "Ordenar especialidades y equipamiento de una clínica oftalmológica y transmitir confianza.",
        variants: [
          {
            slug: "clarity-house",
            direction: "Cálida",
            name: "Clarity House",
            description: "Una propuesta pausada para comunicar contenidos de salud visual sin saturar la experiencia.",
            tags: ["Lectura pausada", "Accesibilidad", "Editorial"]
          },
          {
            slug: "retina-lab",
            direction: "Clínica",
            name: "Retina Lab",
            description: "Sistema visual para organizar especialidades, equipamiento y un recorrido de atención demostrativo.",
            tags: ["Sistema visual", "Recorrido de atención", "Accesibilidad"]
          }
        ]
      },
      {
        sector: "Gaming",
        brief: "Ayudar a elegir hardware sin abrumar: del catálogo a una recomendación concreta.",
        variants: [
          {
            slug: "loadout-store",
            direction: "Comercial",
            name: "Loadout Store",
            description: "Catálogo y configurador guiado para armar un setup y obtener un resumen de la selección.",
            tags: ["Configurador", "Catálogo", "Resumen de compra"]
          },
          {
            slug: "frameforge-lab",
            direction: "Diagnóstico",
            name: "FrameForge Lab",
            description: "Flujo de diagnóstico y benchmark ilustrativo con una estética inspirada en eSports.",
            tags: ["Flujo guiado", "Diagnóstico", "Movimiento"]
          }
        ]
      },
      {
        sector: "Coleccionables",
        brief: "Presentar modelos a escala como piezas que se desean, no solo como productos en una lista.",
        variants: [
          {
            slug: "diecast-gallery",
            direction: "Galería",
            name: "Diecast Gallery",
            description: "Showroom digital con fichas de detalle y filtros funcionales para explorar una colección.",
            tags: ["Showroom", "Filtros", "Fichas de detalle"]
          },
          {
            slug: "tiny-turbo",
            direction: "Energía",
            name: "Tiny Turbo",
            description: "Una tienda de alta energía con controles para activar luces, sonido, puertas y humo.",
            tags: ["Interacción", "Catálogo", "Demostración"]
          }
        ]
      }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-nav]");
  const navLinks = [...document.querySelectorAll("[data-nav] a[href^='#']")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const form = document.querySelector("[data-contact-form]");
  const statusRegion = document.querySelector("[data-form-status]");
  const messageField = document.querySelector("#message");
  const characterCount = document.querySelector("[data-character-count]");
  const yearElement = document.querySelector("[data-current-year]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  setupLabViewer();
  setupAvatar();
  setupCaseResults();
  setupConfiguredLinks();
  setupCopyEmail();
  setupHeader();
  setupMenu();
  setupSectionTracking();
  setupRevealAnimations();
  setupCaptureGalleries();
  setupCaptureLightbox();
  setupCaptureFallbacks();
  setupForm();
  setupMessageCounter();

  /* Visor del Concept Lab: un brief por sector, dos direcciones, prototipo en vivo. */
  function setupLabViewer() {
    const viewer = document.querySelector("[data-lab-viewer]");
    if (!viewer) return;

    const language = document.documentElement.lang.split("-")[0] || "es";
    const content = portfolioContent[language] || portfolioContent.es;
    const briefs = content.labBriefs;
    const devices = {
      desktop: { width: 1280, height: 800 },
      mobile: { width: 390, height: 844 }
    };
    const state = {
      brief: 0,
      variant: 0,
      device: window.matchMedia("(max-width: 720px)").matches ? "mobile" : "desktop",
      visible: false
    };

    viewer.innerHTML = `
      <div class="lab-viewer__briefs" role="tablist" aria-label="Sectores explorados">
        ${briefs
          .map(
            (item, index) => `
              <button class="lab-brief" type="button" role="tab" id="lab-brief-${index}"
                aria-controls="lab-stage" aria-selected="false" data-lab-brief="${index}">
                <span class="lab-brief__index">${String(index + 1).padStart(2, "0")}</span>
                <span class="lab-brief__text">
                  <strong>${item.sector}</strong>
                  <small>${item.brief}</small>
                </span>
              </button>
            `
          )
          .join("")}
      </div>

      <div class="lab-stage" id="lab-stage" role="tabpanel">
        <p class="lab-stage__brief" data-lab-brief-text></p>
        <div class="lab-stage__bar">
          <div class="lab-switch" role="group" aria-label="Dirección visual" data-lab-variants></div>
          <div class="lab-switch lab-switch--device" role="group" aria-label="Tamaño de pantalla">
            <button type="button" data-lab-device="desktop">Escritorio</button>
            <button type="button" data-lab-device="mobile">Móvil</button>
          </div>
        </div>

        <div class="lab-frame" data-border-glow data-lab-frame>
          <div class="lab-frame__chrome" aria-hidden="true">
            <span></span><span></span><span></span>
            <p data-lab-url></p>
          </div>
          <div class="lab-frame__screen" data-lab-screen>
            <img class="lab-frame__poster" data-lab-poster alt="" width="1280" height="800" decoding="async">
            <div class="lab-frame__device" data-lab-device-box>
              <iframe data-lab-iframe title="" loading="lazy" tabindex="-1"></iframe>
            </div>
            <button class="lab-frame__activate" type="button" data-lab-activate>
              <span>Pulsa para interactuar</span>
            </button>
          </div>
        </div>

        <div class="lab-stage__caption">
          <div>
            <p class="lab-stage__kicker" data-lab-kicker></p>
            <h3 data-lab-name></h3>
            <p class="lab-stage__description" data-lab-description></p>
          </div>
          <div class="lab-stage__side">
            <ul class="lab-stage__tags" data-lab-tags></ul>
            <a class="text-link lab-stage__open" data-lab-open>
              Abrir a pantalla completa <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    `;

    const briefButtons = [...viewer.querySelectorAll("[data-lab-brief]")];
    const deviceButtons = [...viewer.querySelectorAll("[data-lab-device]")];
    const variantGroup = viewer.querySelector("[data-lab-variants]");
    const frame = viewer.querySelector("[data-lab-frame]");
    const screen = viewer.querySelector("[data-lab-screen]");
    const deviceBox = viewer.querySelector("[data-lab-device-box]");
    const iframe = viewer.querySelector("[data-lab-iframe]");
    const poster = viewer.querySelector("[data-lab-poster]");
    const activate = viewer.querySelector("[data-lab-activate]");

    briefButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.brief = Number(button.dataset.labBrief);
        state.variant = 0;
        update();
      });

      button.addEventListener("keydown", (event) => {
        if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
        event.preventDefault();
        const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
        const next = (state.brief + step + briefs.length) % briefs.length;
        briefButtons[next].focus();
        briefButtons[next].click();
      });
    });

    deviceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.device = button.dataset.labDevice;
        update(false);
      });
    });

    // El prototipo no captura el scroll ni los toques hasta que se pide interactuar.
    activate.addEventListener("click", () => {
      frame.classList.add("is-interactive");
      iframe.tabIndex = 0;
      iframe.focus();
    });

    frame.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") deactivate();
    });

    iframe.addEventListener("load", () => {
      if (iframe.getAttribute("src")) frame.classList.add("is-loaded");
    });

    if ("ResizeObserver" in window) {
      new ResizeObserver(fitDevice).observe(screen);
    } else {
      window.addEventListener("resize", fitDevice);
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          state.visible = true;
          loadPrototype();
          observer.disconnect();
        },
        { rootMargin: "300px 0px" }
      );
      observer.observe(viewer);
    } else {
      state.visible = true;
    }

    update();

    function current() {
      return briefs[state.brief].variants[state.variant];
    }

    function update(reload = true) {
      const brief = briefs[state.brief];
      const lab = current();

      briefButtons.forEach((button, index) => {
        const active = index === state.brief;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        button.classList.toggle("is-active", active);
      });
      viewer.querySelector("#lab-stage").setAttribute("aria-labelledby", `lab-brief-${state.brief}`);

      variantGroup.innerHTML = brief.variants
        .map(
          (variant, index) => `
            <button type="button" data-lab-variant="${index}" aria-pressed="${index === state.variant}">
              <span aria-hidden="true">${index === 0 ? "A" : "B"}</span> ${variant.direction}
            </button>
          `
        )
        .join("");
      variantGroup.querySelectorAll("[data-lab-variant]").forEach((button) => {
        button.addEventListener("click", () => {
          if (Number(button.dataset.labVariant) === state.variant) return;
          state.variant = Number(button.dataset.labVariant);
          update();
          variantGroup.querySelector(`[data-lab-variant="${state.variant}"]`)?.focus();
        });
      });

      deviceButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.labDevice === state.device));
      });
      frame.dataset.device = state.device;

      viewer.querySelector("[data-lab-kicker]").textContent =
        `${brief.sector} · Dirección ${state.variant === 0 ? "A" : "B"}: ${lab.direction}`;
      viewer.querySelector("[data-lab-brief-text]").textContent = brief.brief;
      viewer.querySelector("[data-lab-name]").textContent = lab.name;
      viewer.querySelector("[data-lab-description]").textContent = lab.description;
      viewer.querySelector("[data-lab-tags]").innerHTML = lab.tags.map((tag) => `<li>${tag}</li>`).join("");
      viewer.querySelector("[data-lab-url]").textContent = `prototipo / ${lab.slug}`;

      const open = viewer.querySelector("[data-lab-open]");
      open.href = `lab/${lab.slug}/`;
      open.setAttribute("aria-label", `Abrir ${lab.name} a pantalla completa; podrás volver con el botón Salir`);

      iframe.title = `Prototipo conceptual ${lab.name}, dirección ${lab.direction}`;
      fitDevice();

      if (reload) {
        poster.src = `assets/images/labs/${lab.slug}.webp`;
        poster.alt = `Vista previa del prototipo conceptual ${lab.name}`;
        deactivate();
        frame.classList.remove("is-loaded");
        loadPrototype();
      }
    }

    function loadPrototype() {
      if (!state.visible) return;
      const src = `lab/${current().slug}/`;
      if (iframe.getAttribute("src") !== src) iframe.src = src;
    }

    function deactivate() {
      frame.classList.remove("is-interactive");
      iframe.tabIndex = -1;
    }

    // El prototipo se renderiza a su tamaño real y se escala para caber en el marco.
    function fitDevice() {
      const device = devices[state.device];
      const box = screen.getBoundingClientRect();
      if (!box.width || !box.height) return;

      const scale =
        state.device === "desktop"
          ? box.width / device.width
          : Math.min(box.height / device.height, box.width / device.width);
      const height = state.device === "desktop" ? box.height / scale : device.height;

      iframe.style.width = `${device.width}px`;
      iframe.style.height = `${height}px`;
      iframe.style.transform = `scale(${scale})`;
      deviceBox.style.width = `${device.width * scale}px`;
      deviceBox.style.height = `${height * scale}px`;
    }
  }

  function setupAvatar() {
    const holder = document.querySelector("[data-avatar]");
    const stage = holder?.querySelector("[data-gaze-target]");
    const { src, gaze } = portfolioConfig.avatar;
    if (!stage || !src.trim()) return;

    const image = new Image();
    image.className = "about-portrait__img";
    image.alt = "Memoji de Nils Tovar";
    image.decoding = "async";
    image.addEventListener("load", () => {
      stage.replaceChildren(image);
      holder.classList.add("has-avatar");
    });
    image.src = src.trim();

    // Con las 9 direcciones, el efecto de mirada cambia de imagen además de inclinarla.
    if (Array.isArray(gaze) && gaze.length === 9) {
      holder.dataset.gazeImages = JSON.stringify(gaze);
      gaze.forEach((path) => {
        new Image().src = path;
      });
    }
  }

  function setupCaseResults() {
    document.querySelectorAll("[data-case-results]").forEach((section) => {
      const results = portfolioConfig.caseResults[section.dataset.caseResults];
      const body = section.querySelector("[data-case-results-body]");
      if (!results || !body) return;

      const metrics = (results.metrics || []).filter((metric) => Number.isFinite(metric.value));
      if (!metrics.length && !results.note) return;

      body.innerHTML = `
        ${metrics
          .map(
            (metric) => `
              <div class="case-metric">
                <strong>${metric.prefix || ""}<span data-count-up data-count-to="${metric.value}">${metric.value.toLocaleString("es-PE")}</span>${metric.suffix || ""}</strong>
                <span>${metric.label}</span>
                ${metric.detail ? `<small>${metric.detail}</small>` : ""}
              </div>
            `
          )
          .join("")}
        ${results.note ? `<p class="case-results__note">${results.note}</p>` : ""}
      `;
      section.hidden = false;
    });
  }

  // La capa de efectos dibuja el aviso; sin ella, el estado sigue anunciándose en el formulario.
  function showToast(message, tone = "neutral") {
    document.dispatchEvent(new CustomEvent("portfolio:toast", { detail: { message, tone } }));
  }

  function setupConfiguredLinks() {
    const socialUrls = {
      github: normaliseUrl(portfolioConfig.github),
      linkedin: normaliseUrl(portfolioConfig.linkedin),
      instagram: normaliseUrl(portfolioConfig.instagram)
    };

    document.querySelectorAll("[data-social]").forEach((link) => {
      const platform = link.dataset.social;
      const url = socialUrls[platform];

      if (!url) {
        link.hidden = true;
        link.removeAttribute("href");
        return;
      }

      link.href = url;
      link.hidden = false;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    const emailLinks = document.querySelectorAll("[data-contact='email']");
    const cleanEmail = portfolioConfig.email.trim();

    emailLinks.forEach((link) => {
      if (!cleanEmail) {
        link.hidden = true;
        link.removeAttribute("href");
        return;
      }

      link.href = `mailto:${cleanEmail}`;
      link.hidden = false;
      const value = link.querySelector("[data-contact-value='email']");
      if (value) value.textContent = cleanEmail;
    });

    const whatsappLinks = document.querySelectorAll("[data-contact='whatsapp']");
    const cleanWhatsapp = portfolioConfig.whatsapp.replace(/[^\d]/g, "");

    whatsappLinks.forEach((link) => {
      if (!cleanWhatsapp) {
        link.hidden = true;
        link.removeAttribute("href");
        return;
      }

      link.href = `https://wa.me/${cleanWhatsapp}`;
      link.hidden = false;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    const resumeLinks = document.querySelectorAll("[data-resume]");
    const resumeUrl = normaliseUrl(portfolioConfig.resume);

    resumeLinks.forEach((link) => {
      if (!resumeUrl) {
        link.hidden = true;
        link.removeAttribute("href");
        return;
      }

      link.href = resumeUrl;
      link.hidden = false;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function setupCopyEmail() {
    const buttons = document.querySelectorAll("[data-copy-email]");
    const liveRegion = document.querySelector("[data-copy-status]");

    buttons.forEach((button) => {
      const label = button.querySelector("[data-copy-label]");
      const defaultLabel = label?.textContent.trim() || "Copiar correo";
      let resetTimer;

      button.addEventListener("click", async () => {
        const email = button.dataset.copyValue?.trim() || portfolioConfig.email.trim();
        if (!email) return;

        window.clearTimeout(resetTimer);

        try {
          await copyText(email, button);
          button.classList.add("is-copied");
          if (label) label.textContent = "Correo copiado";
          announceCopyStatus("Correo copiado: niltovap@gmail.com.");

          resetTimer = window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (label) label.textContent = defaultLabel;
          }, 2400);
        } catch {
          button.classList.remove("is-copied");
          if (label) label.textContent = defaultLabel;
          announceCopyStatus(
            "No se pudo copiar automáticamente. Puedes seleccionar el correo visible."
          );
        }
      });
    });

    async function copyText(value, returnFocusTo) {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(value);
          return;
        } catch {
          // Algunos navegadores exponen la API pero bloquean el permiso.
        }
      }

      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "-9999px";
      textArea.style.opacity = "0";
      document.body.append(textArea);
      textArea.select();
      textArea.setSelectionRange(0, value.length);

      const copied = document.execCommand("copy");
      textArea.remove();
      returnFocusTo.focus({ preventScroll: true });

      if (!copied) throw new Error("El navegador no permitió copiar el correo.");
    }

    function announceCopyStatus(message) {
      if (!liveRegion) return;

      liveRegion.textContent = "";
      window.requestAnimationFrame(() => {
        liveRegion.textContent = message;
      });
    }
  }

  function normaliseUrl(value) {
    const cleanValue = value.trim();
    if (!cleanValue) return "";

    try {
      return new URL(
        /^https?:\/\//i.test(cleanValue) ? cleanValue : `https://${cleanValue}`
      ).href;
    } catch {
      return "";
    }
  }

  function setupHeader() {
    if (!header) return;

    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function setupMenu() {
    if (!menuToggle || !navigation) return;

    const focusableSelector =
      "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

    const setMenuState = (isOpen, returnFocus = false) => {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
      );
      navigation.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("menu-open", isOpen);

      if (isOpen) {
        const firstLink = navigation.querySelector("a[href]");
        window.requestAnimationFrame(() => firstLink?.focus());
      } else if (returnFocus) {
        menuToggle.focus();
      }
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenuState(false);
    });

    document.addEventListener("keydown", (event) => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setMenuState(false, true);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableItems = [...navigation.querySelectorAll(focusableSelector)].filter(
        (element) => !element.hasAttribute("hidden")
      );

      if (!focusableItems.length) return;

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 841px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setMenuState(false);
    };

    desktopQuery.addEventListener?.("change", closeOnDesktop);
  }

  function setupSectionTracking() {
    if (!("IntersectionObserver" in window) || !navLinks.length) return;

    const trackedSections = sections.filter((section) =>
      navLinks.some((link) => link.getAttribute("href") === `#${section.id}`)
    );

    const activeSections = new Map();

    const setActiveLink = () => {
      const visibleSections = [...activeSections.entries()]
        .filter(([, isVisible]) => isVisible)
        .map(([section]) => section);

      const activeSection =
        visibleSections.sort(
          (first, second) =>
            Math.abs(first.getBoundingClientRect().top) -
            Math.abs(second.getBoundingClientRect().top)
        )[0] || trackedSections[0];

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeSection?.id}`;
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => activeSections.set(entry.target, entry.isIntersecting));
        setActiveLink();
      },
      {
        rootMargin: "-28% 0px -60% 0px",
        threshold: 0
      }
    );

    trackedSections.forEach((section) => observer.observe(section));
  }

  function setupRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function setupCaptureGalleries() {
    document.querySelectorAll("[data-gallery-toggle]").forEach((toggle) => {
      const panelId = toggle.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const label = toggle.querySelector("[data-gallery-label]");
      const collapsedLabel = label?.textContent.trim() || "Ver más capturas";

      if (!panel) {
        toggle.hidden = true;
        return;
      }

      toggle.addEventListener("click", () => {
        const willExpand = toggle.getAttribute("aria-expanded") !== "true";

        toggle.setAttribute("aria-expanded", String(willExpand));
        panel.hidden = !willExpand;

        if (label) {
          label.textContent = willExpand
            ? "Ocultar capturas adicionales"
            : collapsedLabel;
        }
      });
    });
  }

  function setupCaptureLightbox() {
    const dialog = document.querySelector("[data-capture-lightbox]");
    const dialogImage = dialog?.querySelector("[data-lightbox-image]");
    const dialogCaption = dialog?.querySelector("[data-lightbox-caption]");
    const closeButton = dialog?.querySelector("[data-lightbox-close]");
    let activeTrigger = null;

    document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const sourceImage = trigger.querySelector(".project-capture__image");
        if (!sourceImage || sourceImage.hidden) return;

        if (!dialog || !dialogImage || typeof dialog.showModal !== "function") {
          window.open(sourceImage.currentSrc || sourceImage.src, "_blank", "noopener,noreferrer");
          return;
        }

        const figure = trigger.closest("figure");
        const captionTitle =
          trigger.dataset.captionTitle ||
          figure?.querySelector("figcaption span")?.textContent.trim();
        const captionDetail =
          trigger.dataset.captionDetail ||
          figure?.querySelector("figcaption small")?.textContent.trim();

        activeTrigger = trigger;
        dialogImage.src = sourceImage.currentSrc || sourceImage.src;
        dialogImage.alt = sourceImage.alt;
        dialogImage.width = sourceImage.naturalWidth || Number(sourceImage.width);
        dialogImage.height = sourceImage.naturalHeight || Number(sourceImage.height);

        if (dialogCaption) {
          dialogCaption.textContent = [captionTitle, captionDetail].filter(Boolean).join(" — ");
        }

        document.body.classList.add("lightbox-open");
        dialog.showModal();
        window.requestAnimationFrame(() => closeButton?.focus({ preventScroll: true }));
      });
    });

    closeButton?.addEventListener("click", () => dialog?.close());

    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog?.addEventListener("close", () => {
      const triggerToRestore = activeTrigger;

      document.body.classList.remove("lightbox-open");
      dialogImage?.removeAttribute("src");
      activeTrigger = null;

      window.requestAnimationFrame(() => {
        triggerToRestore?.focus({ preventScroll: true });
      });
    });
  }

  function setupCaptureFallbacks() {
    document.querySelectorAll(".project-capture__image").forEach((image) => {
      const showFallback = () => {
        const media = image.closest(".capture-media");
        const fallback = media?.querySelector(".capture-fallback");
        const trigger = image.closest("[data-lightbox-trigger]");

        image.hidden = true;
        media?.classList.add("is-unavailable");
        if (fallback) fallback.hidden = false;
        if (trigger) trigger.disabled = true;

        console.warn(`No fue posible cargar la captura: ${image.getAttribute("src")}`);
      };

      image.addEventListener("error", showFallback, { once: true });

      if (image.complete && image.naturalWidth === 0) {
        showFallback();
      }
    });
  }

  function setupMessageCounter() {
    if (!messageField || !characterCount) return;

    const updateCount = () => {
      characterCount.textContent = `${messageField.value.length} / 1000`;
    };

    updateCount();
    messageField.addEventListener("input", updateCount);
  }

  function setupForm() {
    if (!form || !statusRegion) return;

    const fields = [...form.querySelectorAll("input[required], select[required], textarea[required]")];

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
      field.addEventListener("change", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearStatus();

      const isValid = fields.map(validateField).every(Boolean);
      const honeypot = form.querySelector("[name='_gotcha']");

      if (honeypot?.value) return;

      if (!isValid) {
        showStatus(
          "Revisa los campos señalados antes de continuar.",
          "error"
        );
        form.querySelector("[aria-invalid='true']")?.focus();
        return;
      }

      if (!isFormspreeConfigured()) {
        showStatus(
          "El formulario todavía no se encuentra conectado. Configura el endpoint de Formspree en js/main.js para habilitar el envío.",
          "error"
        );
        return;
      }

      const submitButton = form.querySelector("[data-submit-button]");
      const buttonLabel = submitButton?.querySelector("span");
      const previousLabel = buttonLabel?.textContent || "Enviar mensaje";

      if (submitButton) submitButton.disabled = true;
      if (buttonLabel) buttonLabel.textContent = "Enviando…";

      try {
        const response = await fetch(portfolioConfig.formspreeEndpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Formspree rechazó la solicitud.");

        form.reset();
        setupMessageCounter();
        fields.forEach(clearFieldError);
        showStatus(
          "Gracias. Tu mensaje fue enviado correctamente.",
          "success"
        );
        showToast("Mensaje enviado. Te responderé por correo.", "success");
      } catch {
        showStatus(
          "No fue posible enviar el mensaje. Inténtalo de nuevo o utiliza un canal de contacto configurado.",
          "error"
        );
      } finally {
        if (submitButton) submitButton.disabled = false;
        if (buttonLabel) buttonLabel.textContent = previousLabel;
      }
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    let message = "";

    if (field.validity.valueMissing) {
      message =
        field.tagName === "SELECT"
          ? "Selecciona un tipo de proyecto."
          : "Este campo es obligatorio.";
    } else if (field.validity.typeMismatch) {
      message = "Introduce un correo electrónico válido.";
    } else if (field.validity.tooShort) {
      message = `Escribe al menos ${field.minLength} caracteres.`;
    } else if (field.validity.tooLong) {
      message = `Utiliza como máximo ${field.maxLength} caracteres.`;
    } else if (field.type === "email" && value && !isPlausibleEmail(value)) {
      message = "Introduce un correo electrónico válido.";
    }

    const errorElement = document.querySelector(`#${field.id}-error`);

    if (message) {
      field.setAttribute("aria-invalid", "true");
      if (errorElement) errorElement.textContent = message;
      return false;
    }

    clearFieldError(field);
    return true;
  }

  function clearFieldError(field) {
    field.removeAttribute("aria-invalid");
    const errorElement = document.querySelector(`#${field.id}-error`);
    if (errorElement) errorElement.textContent = "";
  }

  function isPlausibleEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
  }

  function isFormspreeConfigured() {
    const endpoint = portfolioConfig.formspreeEndpoint.trim();
    return (
      /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(endpoint) &&
      !endpoint.includes("REEMPLAZAR_ID")
    );
  }

  function showStatus(message, type) {
    if (!statusRegion) return;
    statusRegion.textContent = message;
    statusRegion.classList.remove("is-error", "is-success");
    statusRegion.classList.add(type === "success" ? "is-success" : "is-error");
  }

  function clearStatus() {
    if (!statusRegion) return;
    statusRegion.textContent = "";
    statusRegion.classList.remove("is-error", "is-success");
  }
});
