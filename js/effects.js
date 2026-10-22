"use strict";

/* ==========================================================================
   Capa de interacción — implementaciones propias, sin dependencias externas
   Fold Text · Specular Button · Border Glow · Accordion Gallery · Gradual Blur
   Dot Grid · Magnet · Scroll Reveal · Count Up · Gaze · Swipe Toast
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
    setupDotGrid();
    setupMagnet();
    setupScrollReveal();
    setupCountUp();
    setupGaze();
    setupToasts();
  });

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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

    const state = new Map(buttons.map((button) => [button, { idle: true }]));
    let ticking = false;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      ticking = false;

      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        const entry = state.get(button);

        if (!rect.width || rect.bottom < 0 || rect.top > window.innerHeight) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = pointerX - centerX;
        const deltaY = pointerY - centerY;
        const proximity = Number(button.dataset.specularProximity || 280);
        const distance = Math.hypot(deltaX, deltaY);

        // Fuera del radio no hay nada que animar: basta con dejarlo en reposo.
        if (distance > proximity) {
          if (entry.idle) return;
          entry.idle = true;
          button.style.removeProperty("--sb-intensity");
          return;
        }

        entry.idle = false;
        const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
        button.style.setProperty("--sb-angle", `${angle.toFixed(0)}deg`);
        button.style.setProperty("--sb-intensity", (1 - distance / proximity).toFixed(2));
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

      let queued = false;
      let pointerX = 0;
      let pointerY = 0;

      const paint = () => {
        queued = false;

        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = pointerX - rect.left - centerX;
        const deltaY = pointerY - rect.top - centerY;

        const ratioX = deltaX === 0 ? Infinity : centerX / Math.abs(deltaX);
        const ratioY = deltaY === 0 ? Infinity : centerY / Math.abs(deltaY);
        const proximity = clamp(1 / Math.min(ratioX, ratioY), 0, 1);

        let angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
        if (angle < 0) angle += 360;

        card.style.setProperty("--edge-proximity", (proximity * 100).toFixed(1));
        card.style.setProperty("--cursor-angle", `${angle.toFixed(1)}deg`);
      };

      card.addEventListener(
        "pointermove",
        (event) => {
          pointerX = event.clientX;
          pointerY = event.clientY;

          if (queued) return;
          queued = true;
          window.requestAnimationFrame(paint);
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

      let resizeTimer;
      window.addEventListener(
        "resize",
        () => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(() => {
            mediaSize = measure();
            render();
          }, 160);
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

  /* ------------------------------------------------------------------------
     Dot Grid
     Retícula de puntos que se aparta y se enciende alrededor del cursor.
     ------------------------------------------------------------------------ */

  function setupDotGrid() {
    document.querySelectorAll("[data-dot-grid]").forEach((canvas) => {
      const context = canvas.getContext("2d");
      const host = canvas.parentElement;
      if (!context || !host) return;

      const gap = Number(canvas.dataset.dotGap || 28);
      const radius = Number(canvas.dataset.dotRadius || 1.1);
      const reach = Number(canvas.dataset.dotReach || 150);
      const styles = getComputedStyle(document.documentElement);
      const base = styles.getPropertyValue("--ink").trim() || "#1c1d1a";
      const active = styles.getPropertyValue("--coral").trim() || "#ee6a4b";

      let dots = [];
      let width = 0;
      let height = 0;
      let pointer = { x: -9999, y: -9999 };
      let running = false;
      let visible = true;
      let frame = 0;

      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        dots = [];
        const offsetX = (width % gap) / 2;
        const offsetY = (height % gap) / 2;
        for (let y = offsetY; y <= height; y += gap) {
          for (let x = offsetX; x <= width; x += gap) {
            dots.push({ x, y, dx: 0, dy: 0, glow: 0 });
          }
        }
        draw();
      };

      const draw = () => {
        context.clearRect(0, 0, width, height);
        let moving = false;

        dots.forEach((dot) => {
          const deltaX = dot.x - pointer.x;
          const deltaY = dot.y - pointer.y;
          const distance = Math.hypot(deltaX, deltaY);
          const force = distance < reach ? 1 - distance / reach : 0;
          const push = force * force * 10;
          const targetX = distance ? (deltaX / distance) * push : 0;
          const targetY = distance ? (deltaY / distance) * push : 0;

          // Cada punto vuelve a su sitio con una inercia suave.
          dot.dx += (targetX - dot.dx) * 0.14;
          dot.dy += (targetY - dot.dy) * 0.14;
          dot.glow += (force - dot.glow) * 0.14;
          if (Math.abs(dot.dx) > 0.05 || Math.abs(dot.dy) > 0.05 || dot.glow > 0.01) moving = true;

          context.globalAlpha = 0.13 + dot.glow * 0.7;
          context.fillStyle = dot.glow > 0.08 ? active : base;
          context.beginPath();
          context.arc(dot.x + dot.dx, dot.y + dot.dy, radius + dot.glow * 1.1, 0, Math.PI * 2);
          context.fill();
        });

        context.globalAlpha = 1;
        return moving;
      };

      const loop = () => {
        const moving = draw();
        if (moving && visible) {
          frame = window.requestAnimationFrame(loop);
        } else {
          running = false;
        }
      };

      const wake = () => {
        if (running || !visible) return;
        running = true;
        frame = window.requestAnimationFrame(loop);
      };

      resize();
      if ("ResizeObserver" in window) {
        new ResizeObserver(resize).observe(host);
      } else {
        window.addEventListener("resize", resize);
      }

      if (reduceMotion || !finePointer) return;

      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (!visible) window.cancelAnimationFrame(frame);
        }).observe(host);
      }

      // El lienzo ocupa todo el ancho, así que el cursor se lee desde la ventana.
      window.addEventListener(
        "pointermove",
        (event) => {
          if (!visible) return;
          const rect = canvas.getBoundingClientRect();
          const inside = event.clientY >= rect.top && event.clientY <= rect.bottom;
          pointer = inside
            ? { x: event.clientX - rect.left, y: event.clientY - rect.top }
            : { x: -9999, y: -9999 };
          wake();
        },
        { passive: true }
      );
    });
  }

  /* ------------------------------------------------------------------------
     Magnet
     El elemento se desplaza levemente hacia el cursor cuando está cerca.
     ------------------------------------------------------------------------ */

  function setupMagnet() {
    if (reduceMotion || !finePointer) return;

    document.querySelectorAll("[data-magnet]").forEach((element) => {
      const padding = Number(element.dataset.magnetPadding || 60);
      const strength = Number(element.dataset.magnetStrength || 4);
      let queued = false;
      let pointerX = 0;
      let pointerY = 0;

      element.classList.add("magnet");

      const update = () => {
        queued = false;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const inside =
          Math.abs(pointerX - centerX) < rect.width / 2 + padding &&
          Math.abs(pointerY - centerY) < rect.height / 2 + padding;

        element.classList.toggle("is-attracted", inside);
        element.style.translate = inside
          ? `${((pointerX - centerX) / strength).toFixed(1)}px ${((pointerY - centerY) / strength).toFixed(1)}px`
          : "";
      };

      window.addEventListener(
        "pointermove",
        (event) => {
          pointerX = event.clientX;
          pointerY = event.clientY;
          if (queued) return;
          queued = true;
          window.requestAnimationFrame(update);
        },
        { passive: true }
      );
    });
  }

  /* ------------------------------------------------------------------------
     Scroll Reveal
     Las palabras se encienden a medida que el párrafo cruza la pantalla.
     ------------------------------------------------------------------------ */

  function setupScrollReveal() {
    const targets = [...document.querySelectorAll("[data-scroll-reveal]")];
    if (!targets.length || reduceMotion) return;

    const entries = targets.map((target) => {
      const words = target.textContent.trim().split(/\s+/);
      target.setAttribute("aria-label", words.join(" "));
      target.innerHTML = words
        .map((word) => `<span class="scroll-reveal__word" aria-hidden="true">${word}</span>`)
        .join(" ");
      target.classList.add("scroll-reveal");
      return { target, words: [...target.querySelectorAll(".scroll-reveal__word")] };
    });

    let queued = false;

    const update = () => {
      queued = false;
      const viewport = window.innerHeight;

      entries.forEach(({ target, words }) => {
        const rect = target.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) return;

        // 0 cuando el párrafo asoma por abajo; 1 cuando su final pasa el centro.
        const progress = clamp((viewport * 0.92 - rect.top) / (rect.height + viewport * 0.42), 0, 1);
        const lit = progress * words.length;

        words.forEach((word, index) => {
          word.style.opacity = (0.16 + clamp(lit - index, 0, 1) * 0.84).toFixed(2);
        });
      });
    };

    const request = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  }

  /* ------------------------------------------------------------------------
     Count Up
     La cifra sube desde cero cuando entra en pantalla.
     ------------------------------------------------------------------------ */

  function setupCountUp() {
    const counters = document.querySelectorAll("[data-count-up]");
    if (!counters.length || reduceMotion || !("IntersectionObserver" in window)) return;

    const format = (value) => Math.round(value).toLocaleString("es-PE");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          const counter = entry.target;
          const target = Number(counter.dataset.countTo);
          const duration = Number(counter.dataset.countDuration || 1600);
          const start = performance.now();

          const tick = (now) => {
            const progress = clamp((now - start) / duration, 0, 1);
            counter.textContent = format(target * (1 - Math.pow(1 - progress, 3)));
            if (progress < 1) window.requestAnimationFrame(tick);
          };

          window.requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => {
      counter.textContent = format(0);
      observer.observe(counter);
    });
  }

  /* ------------------------------------------------------------------------
     Gaze
     El avatar se inclina hacia el cursor y, si tiene estados, cambia de expresión.
     ------------------------------------------------------------------------ */

  function setupGaze() {
    document.querySelectorAll("[data-gaze]").forEach((holder) => {
      const stage = holder.querySelector("[data-gaze-target]");
      if (!stage) return;

      let states = {};
      try {
        states = JSON.parse(holder.dataset.gazeStates || "{}");
      } catch {
        states = {};
      }

      const maxTilt = Number(holder.dataset.gazeTilt || 16);
      let queued = false;
      let pointerX = window.innerWidth / 2;
      let pointerY = window.innerHeight / 2;
      let currentState = "rest";
      let touchHold = 0;

      const update = () => {
        queued = false;
        const rect = holder.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Normalizado respecto a la ventana: el gesto se nota aunque el cursor esté lejos.
        const x = clamp((pointerX - centerX) / (window.innerWidth / 2), -1, 1);
        const y = clamp((pointerY - centerY) / (window.innerHeight / 2), -1, 1);

        stage.style.setProperty("--gaze-x", x.toFixed(3));
        stage.style.setProperty("--gaze-y", y.toFixed(3));
        stage.style.setProperty("--gaze-tilt", `${maxTilt}deg`);

        if (!states.rest) return;

        const over =
          touchHold ||
          (pointerX >= rect.left && pointerX <= rect.right && pointerY >= rect.top && pointerY <= rect.bottom);
        let next = "rest";
        if (over) next = "hover";
        else if (Math.max(Math.abs(x), Math.abs(y)) > 0.35) {
          if (Math.abs(y) >= Math.abs(x)) next = y < 0 ? "up" : "down";
          else next = x < 0 ? "left" : "right";
        }
        if (!states[next]) next = "rest";
        if (next === currentState) return;

        currentState = next;
        const image = stage.querySelector("img");
        if (image) image.src = states[next];
      };

      holder.classList.add("gaze");
      if (reduceMotion) return;

      const request = () => {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(update);
      };

      window.addEventListener(
        "pointermove",
        (event) => {
          pointerX = event.clientX;
          pointerY = event.clientY;
          request();
        },
        { passive: true }
      );

      // Un toque sobre el avatar muestra su reacción un momento.
      holder.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "touch") return;
        window.clearTimeout(touchHold);
        touchHold = window.setTimeout(() => {
          touchHold = 0;
          request();
        }, 1600);
        request();
      });

      // En pantallas táctiles el avatar sigue el toque y vuelve al centro al soltar.
      window.addEventListener("pointerup", (event) => {
        if (event.pointerType !== "touch") return;
        pointerX = window.innerWidth / 2;
        pointerY = window.innerHeight / 2;
        window.setTimeout(request, 400);
      });

      window.addEventListener("scroll", request, { passive: true });
    });
  }

  /* ------------------------------------------------------------------------
     Swipe Toast
     Avisos breves que se descartan solos o deslizándolos hacia un lado.
     ------------------------------------------------------------------------ */

  function setupToasts() {
    const region = document.createElement("div");
    region.className = "toast-region";
    // Es un refuerzo visual: cada aviso ya se anuncia en su propia región accesible.
    region.setAttribute("aria-hidden", "true");
    document.body.append(region);

    document.addEventListener("portfolio:toast", (event) => {
      const { message, tone = "neutral" } = event.detail || {};
      if (!message) return;

      const toast = document.createElement("div");
      toast.className = `toast toast--${tone}`;
      toast.innerHTML = `<span class="toast__mark" aria-hidden="true"></span><p></p>`;
      toast.querySelector("p").textContent = message;
      region.append(toast);

      window.requestAnimationFrame(() => toast.classList.add("is-visible"));

      let timer = window.setTimeout(dismiss, 4200);
      let startX = null;
      let offset = 0;

      toast.addEventListener("pointerdown", (pointerEvent) => {
        startX = pointerEvent.clientX;
        toast.setPointerCapture(pointerEvent.pointerId);
        toast.classList.add("is-dragging");
        window.clearTimeout(timer);
      });

      toast.addEventListener("pointermove", (pointerEvent) => {
        if (startX === null) return;
        offset = pointerEvent.clientX - startX;
        toast.style.translate = `${offset}px 0`;
        toast.style.opacity = String(clamp(1 - Math.abs(offset) / 220, 0, 1));
      });

      toast.addEventListener("pointerup", () => {
        startX = null;
        toast.classList.remove("is-dragging");

        if (Math.abs(offset) > 90) {
          toast.style.translate = `${Math.sign(offset) * 420}px 0`;
          dismiss();
          return;
        }

        offset = 0;
        toast.style.translate = "";
        toast.style.opacity = "";
        timer = window.setTimeout(dismiss, 2400);
      });

      function dismiss() {
        window.clearTimeout(timer);
        toast.classList.remove("is-visible");
        toast.classList.add("is-leaving");
        window.setTimeout(() => toast.remove(), reduceMotion ? 0 : 400);
      }
    });
  }
})();
