"use strict";

/* ==========================================================================
   Capa de interacción — implementaciones propias, sin dependencias externas
   Fold Text · Specular Button · Border Glow · Accordion Gallery · Gradual Blur
   ========================================================================== */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  document.addEventListener("DOMContentLoaded", () => {
    setupFoldText();
    setupSpecularButtons();
    setupBorderGlow();
    setupAccordionGalleries();
    setupGradualBlur();
  });

  /* ------------------------------------------------------------------------
     Fold Text
     Cada palabra se pliega sobre una bisagra y cae hasta quedar plana.
     ------------------------------------------------------------------------ */

  function setupFoldText() {
    const targets = document.querySelectorAll("[data-fold-text]");
    if (!targets.length) return;

    targets.forEach((target) => {
      const stagger = Number(target.dataset.foldStagger || 55);
      const pieces = [];

      splitNode(target, pieces);

      if (!pieces.length) return;

      pieces.forEach((piece, index) => {
        piece.style.transitionDelay = reduceMotion ? "0ms" : `${index * stagger}ms`;
        piece.querySelector(".fold-text__piece").style.transitionDelay = piece.style.transitionDelay;
      });

      target.classList.add("fold-text");
      target.setAttribute("data-fold-ready", "");

      if (target.dataset.foldTrigger === "load" || !("IntersectionObserver" in window)) {
        window.requestAnimationFrame(() => target.classList.add("is-folded"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-folded");
            currentObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );

      observer.observe(target);
    });

    function splitNode(node, pieces) {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === "BR") return;
          splitNode(child, pieces);
          return;
        }

        if (child.nodeType !== Node.TEXT_NODE) return;

        const text = child.textContent;
        if (!text.trim()) return;

        const fragment = document.createDocumentFragment();

        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;

          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
            return;
          }

          const segment = document.createElement("span");
          segment.className = "fold-text__seg";

          const piece = document.createElement("span");
          piece.className = "fold-text__piece";
          piece.textContent = part;

          segment.append(piece);
          fragment.append(segment);
          pieces.push(segment);
        });

        child.replaceWith(fragment);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Specular Button
     Un reflejo simétrico recorre el borde en función de dónde está el cursor.
     ------------------------------------------------------------------------ */

  function setupSpecularButtons() {
    const buttons = [...document.querySelectorAll("[data-specular]")];
    if (!buttons.length) return;

    buttons.forEach((button) => {
      const label = document.createElement("span");
      label.className = "specular__label";
      label.append(...button.childNodes);

      const effect = document.createElement("span");
      effect.className = "specular__fx";
      effect.setAttribute("aria-hidden", "true");

      button.append(label, effect);
      button.classList.add("specular");
      if (button.dataset.specular === "dark") button.classList.add("specular--dark");
    });

    let ticking = false;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      ticking = false;

      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        if (!rect.width) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = pointerX - centerX;
        const deltaY = pointerY - centerY;
        const distance = Math.hypot(deltaX, deltaY);
        const proximity = Number(button.dataset.specularProximity || 280);
        const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;

        button.style.setProperty("--sb-angle", `${angle.toFixed(1)}deg`);
        button.style.setProperty(
          "--sb-intensity",
          clamp(1 - distance / proximity, 0.14, 1).toFixed(3)
        );
      });
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType === "touch") return;

        pointerX = event.clientX;
        pointerY = event.clientY;

        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------------
     Border Glow
     El borde se ilumina según el ángulo del cursor y su cercanía al filo.
     ------------------------------------------------------------------------ */

  function setupBorderGlow() {
    document.querySelectorAll("[data-border-glow]").forEach((card) => {
      card.classList.add("glow-card");

      const edge = document.createElement("span");
      edge.className = "glow-card__edge";
      edge.setAttribute("aria-hidden", "true");
      card.prepend(edge);

      card.addEventListener(
        "pointermove",
        (event) => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const deltaX = x - centerX;
          const deltaY = y - centerY;

          const ratioX = deltaX === 0 ? Infinity : centerX / Math.abs(deltaX);
          const ratioY = deltaY === 0 ? Infinity : centerY / Math.abs(deltaY);
          const proximity = clamp(1 / Math.min(ratioX, ratioY), 0, 1);

          let angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
          if (angle < 0) angle += 360;

          card.style.setProperty("--edge-proximity", (proximity * 100).toFixed(2));
          card.style.setProperty("--cursor-angle", `${angle.toFixed(2)}deg`);
        },
        { passive: true }
      );

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--edge-proximity", "0");
      });
    });
  }

  /* ------------------------------------------------------------------------
     Accordion Gallery
     Paneles que se expanden, recuperan color y desplazan la imagen.
     ------------------------------------------------------------------------ */

  function setupAccordionGalleries() {
    document.querySelectorAll("[data-accordion-gallery]").forEach((gallery) => {
      const panels = [...gallery.querySelectorAll(".ag-panel")];
      if (!panels.length) return;

      const expandRatio = clamp(Number(gallery.dataset.expandRatio || 0.55), 0.2, 0.9);
      const tilt = Number(gallery.dataset.tilt || 7);
      const parallax = Number(gallery.dataset.parallax || 0.5);
      const count = panels.length;
      const grow = count > 1 ? (expandRatio * (count - 1)) / (1 - expandRatio) : 1;
      const stackedQuery = window.matchMedia("(max-width: 620px)");
      const coarseQuery = window.matchMedia("(hover: none)");

      let active = clamp(Number(gallery.dataset.defaultIndex || 0), 0, count - 1);

      const measure = () => {
        const rect = gallery.getBoundingClientRect();
        const size = stackedQuery.matches
          ? Math.round(rect.height || 260)
          : Math.round(rect.width * expandRatio);
        gallery.style.setProperty("--ag-media-size", `${Math.max(size, 240)}px`);
        return Math.max(size, 240);
      };

      let mediaSize = measure();

      const render = () => {
        panels.forEach((panel, index) => {
          const isActive = index === active;
          const media = panel.querySelector(".ag-panel__media");
          const overlay = panel.querySelector(".ag-panel__overlay");
          const rotation = isActive ? 0 : index < active ? tilt : -tilt;

          panel.classList.toggle("is-active", isActive);
          panel.style.flexGrow = isActive ? String(grow) : "1";
          panel.setAttribute("aria-expanded", String(isActive));
          panel.style.transform =
            stackedQuery.matches || reduceMotion ? "" : `rotateY(${rotation}deg)`;

          if (media) {
            const drift = clamp(active - index, -1.5, 1.5);
            const shift = drift * parallax * mediaSize * 0.06;
            media.style.setProperty("--ag-gray", isActive ? "0" : "1");
            media.style.transform = stackedQuery.matches
              ? `translate(-50%, -50%)`
              : `translate(calc(-50% + ${isActive ? 0 : shift.toFixed(1)}px), -50%)`;
          }

          if (overlay) {
            overlay.style.setProperty("--ag-dim", isActive ? "0" : "0.42");
          }
        });
      };

      const setActive = (index) => {
        if (index === active) return;
        active = index;
        render();
      };

      panels.forEach((panel, index) => {
        panel.setAttribute("aria-expanded", String(index === active));
        panel.addEventListener("pointerenter", (event) => {
          if (event.pointerType === "touch") return;
          setActive(index);
        });
        panel.addEventListener("focus", () => setActive(index));
      });

      // En pantallas táctiles el primer toque abre el panel; el segundo amplía.
      gallery.addEventListener(
        "click",
        (event) => {
          const panel = event.target.closest(".ag-panel");
          if (!panel) return;

          const index = panels.indexOf(panel);
          if (index === -1) return;

          if (coarseQuery.matches && index !== active) {
            event.preventDefault();
            event.stopPropagation();
            setActive(index);
            return;
          }

          setActive(index);
        },
        true
      );

      window.addEventListener(
        "resize",
        () => {
          mediaSize = measure();
          render();
        },
        { passive: true }
      );

      render();
    });
  }

  /* ------------------------------------------------------------------------
     Gradual Blur
     Capas superpuestas de desenfoque con máscaras escalonadas.
     ------------------------------------------------------------------------ */

  function setupGradualBlur() {
    const curves = {
      linear: (p) => p,
      bezier: (p) => p * p * (3 - 2 * p),
      "ease-in": (p) => p * p,
      "ease-out": (p) => 1 - Math.pow(1 - p, 2),
      "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
    };

    const directions = {
      top: "to top",
      bottom: "to bottom",
      left: "to left",
      right: "to right"
    };

    document.querySelectorAll("[data-gradual-blur]").forEach((container) => {
      const position = container.dataset.blurPosition || "bottom";
      const strength = Number(container.dataset.blurStrength || 2);
      const divCount = Math.max(2, Number(container.dataset.blurDivs || 6));
      const opacity = Number(container.dataset.blurOpacity || 1);
      const exponential = container.dataset.blurExponential === "true";
      const curve = curves[container.dataset.blurCurve] || curves.linear;
      const direction = directions[position] || directions.bottom;

      container.classList.add("gradual-blur", `gradual-blur--${position}`);
      container.setAttribute("aria-hidden", "true");

      if (container.dataset.blurHeight) {
        container.style.setProperty("--blur-height", container.dataset.blurHeight);
      }

      const inner = document.createElement("div");
      inner.className = "gradual-blur__inner";

      const increment = 100 / divCount;

      for (let index = 1; index <= divCount; index += 1) {
        const progress = curve(index / divCount);
        const blur = exponential
          ? Math.pow(2, progress * 4) * 0.0625 * strength
          : 0.0625 * (progress * divCount + 1) * strength;

        const p1 = Math.round((increment * index - increment) * 10) / 10;
        const p2 = Math.round(increment * index * 10) / 10;
        const p3 = Math.round((increment * index + increment) * 10) / 10;
        const p4 = Math.round((increment * index + increment * 2) * 10) / 10;

        let gradient = `transparent ${p1}%, #000 ${p2}%`;
        if (p3 <= 100) gradient += `, #000 ${p3}%`;
        if (p4 <= 100) gradient += `, transparent ${p4}%`;

        const layer = document.createElement("div");
        const mask = `linear-gradient(${direction}, ${gradient})`;

        layer.style.position = "absolute";
        layer.style.inset = "0";
        layer.style.maskImage = mask;
        layer.style.webkitMaskImage = mask;
        layer.style.backdropFilter = `blur(${blur.toFixed(3)}rem)`;
        layer.style.webkitBackdropFilter = `blur(${blur.toFixed(3)}rem)`;
        layer.style.opacity = String(opacity);

        inner.append(layer);
      }

      container.append(inner);
    });
  }
})();
