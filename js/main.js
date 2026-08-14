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
  formspreeEndpoint: "https://formspree.io/f/xrenojvo"
};

const portfolioContent = {
  es: {
    conceptLabs: [
      {
        slug: "sonora",
        name: "SONORA",
        category: "Audio automotriz · Dirección editorial",
        description: "Una experiencia sobria que convierte acústica, sistemas y calibración en una narrativa visual clara.",
        tags: ["Dirección editorial", "Narrativa visual", "Responsive"],
        featured: true
      },
      {
        slug: "loadout-store",
        name: "Loadout Store",
        category: "Gaming · eCommerce conceptual",
        description: "Catálogo y configurador guiado para construir un setup y obtener un resumen local de la selección.",
        tags: ["Configurador", "Catálogo", "Resumen de compra"],
        featured: true
      },
      {
        slug: "retina-lab",
        name: "Retina Lab",
        category: "Salud · Interfaz de información",
        description: "Sistema visual para organizar especialidades, equipamiento y un recorrido de atención demostrativo.",
        tags: ["Sistema visual", "Accesibilidad", "Recorrido de atención"],
        featured: true
      },
      {
        slug: "tiny-turbo",
        name: "Tiny Turbo",
        category: "Coleccionables · Catálogo interactivo",
        description: "Una tienda conceptual de alta energía con controles para activar luces, sonido, puertas y humo.",
        tags: ["Interacción", "Catálogo", "Demostración"],
        featured: true
      },
      {
        slug: "wavelab",
        name: "WAVELAB",
        category: "Audio automotriz · Interfaz técnica",
        description: "Lenguaje de laboratorio, selector de vehículo y comparador visual para explicar un sistema complejo.",
        tags: ["Interfaz técnica", "Comparador", "Movimiento"]
      },
      {
        slug: "frameforge-lab",
        name: "FrameForge Lab",
        category: "Gaming · Diagnóstico de performance",
        description: "Flujo interactivo de diagnóstico y benchmark ilustrativo con una estética inspirada en eSports.",
        tags: ["Diagnóstico", "Flujo guiado", "Movimiento"]
      },
      {
        slug: "clarity-house",
        name: "Clarity House",
        category: "Salud · Dirección editorial",
        description: "Una propuesta cálida y pausada para comunicar contenidos de salud visual sin saturar la experiencia.",
        tags: ["Editorial", "Accesibilidad", "Lectura pausada"]
      },
      {
        slug: "diecast-gallery",
        name: "Diecast Gallery",
        category: "Coleccionables · eCommerce conceptual",
        description: "Showroom digital con fichas de detalle y filtros funcionales para explorar una colección demostrativa.",
        tags: ["Filtros", "Showroom", "Fichas de detalle"]
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

  renderConceptLabs();
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

  function renderConceptLabs() {
    const grid = document.querySelector("[data-lab-grid]");
    if (!grid) return;

    const language = document.documentElement.lang.split("-")[0] || "es";
    const content = portfolioContent[language] || portfolioContent.es;

    grid.innerHTML = content.conceptLabs
      .map(
        (lab, index) => `
          <article class="lab-card${lab.featured ? " lab-card--featured" : ""} reveal" data-border-glow>
            <a
              class="lab-card__preview"
              href="lab/${lab.slug}/"
              aria-label="Abrir el simulador de ${lab.name}; podrás volver con el botón Salir"
            >
              <img
                src="assets/images/labs/${lab.slug}.webp"
                width="1280"
                height="800"
                loading="lazy"
                decoding="async"
                alt="Vista previa del prototipo conceptual ${lab.name}"
              >
              <span class="lab-card__index">${String(index + 1).padStart(2, "0")}</span>
              <span class="lab-card__open">Abrir simulador <span aria-hidden="true">↗</span></span>
            </a>
            <div class="lab-card__body">
              <p>${lab.category}</p>
              <h3>${lab.name}</h3>
              <p class="lab-card__description">${lab.description}</p>
              <ul class="lab-card__meta" aria-label="Características de ${lab.name}">
                ${lab.tags.map((tag) => `<li>${tag}</li>`).join("")}
              </ul>
            </div>
          </article>
        `
      )
      .join("");
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
