# Portfolio de Nils Tovar

Portfolio comercial de diseño y desarrollo web. Presenta dos proyectos reales —Sifuentes
Colombia y GB Audio— y un Concept Lab independiente con ocho prototipos funcionales.
Es una web estática, sin frameworks ni proceso de compilación.

## Sitio público

[https://alti1912.github.io/Portafolio/](https://alti1912.github.io/Portafolio/)

## Repositorio

[https://github.com/AlTi1912/Portafolio](https://github.com/AlTi1912/Portafolio)

## Tecnologías

- HTML5
- CSS3
- JavaScript
- GitHub Pages
- Formspree

## Contenido y funcionalidades

- Jerarquía editorial: Hero → Trabajo seleccionado → Concept Lab → Servicios → Proceso
  → Capacidades → Sobre mí → Contacto.
- Estudios de caso reales de Sifuentes Colombia y GB Audio.
- Comparación visual de la versión anterior y la nueva experiencia de Sifuentes.
- Galerías expandibles con lightbox accesible y retorno de foco.
- Ocho Labs autocontenidos, claramente identificados como prototipos conceptuales.
- Tarjetas de Lab generadas desde datos en JavaScript para facilitar futuras ampliaciones.
- Previews WebP; ningún prototipo se carga mediante `iframe` en la página principal.
- Formulario Formspree con validación, honeypot y estados accesibles.
- Navegación responsive, foco visible y soporte para reducción de movimiento.
- Metadatos Open Graph con imagen social de 1200 × 630 px.

## Concept Lab

Cada demo conserva su propia dirección visual y vive en una ruta compatible con GitHub
Pages:

- `lab/sonora/`
- `lab/wavelab/`
- `lab/loadout-store/`
- `lab/frameforge-lab/`
- `lab/retina-lab/`
- `lab/clarity-house/`
- `lab/tiny-turbo/`
- `lab/diecast-gallery/`

Los Labs son conceptos y prototipos funcionales, no clientes ni trabajos comerciales.
No contienen contactos operativos, testimonios, resultados o métricas empresariales
simuladas. Sus previews se encuentran en `assets/images/labs/`.

Para añadir otro Lab:

1. Crea `lab/<slug>/index.html` con rutas relativas.
2. Añade un preview WebP en `assets/images/labs/`.
3. Incorpora su ficha al arreglo `portfolioContent.es.conceptLabs` de `js/main.js`.
4. Verifica el prototipo en móvil y escritorio y confirma que se identifica como concepto.

## Ejecución local

Desde la raíz del proyecto:

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000`. Un servidor local reproduce mejor las rutas y el
comportamiento del sitio publicado que abrir `index.html` directamente.

## Despliegue

El sitio se publica mediante GitHub Pages desde `main` y `/(root)`. `.nojekyll` está
incluido y todos los recursos propios usan rutas relativas, por lo que funcionan bajo
la subruta `/Portafolio/`. Cada actualización de `main` despliega automáticamente.

## Formspree

El formulario **Contacto Portfolio** del proyecto **Portfolio Nils Tovar** entrega los
mensajes a `niltovap@gmail.com`.

- Fallback HTML mediante `action` y `method="POST"`.
- Envío AJAX mediante `fetch`, `FormData` y `Accept: application/json`.
- Validación HTML y JavaScript.
- Honeypot `_gotcha`.
- Estados accesibles mediante `aria-live`.
- Botón bloqueado durante el envío.
- El formulario se limpia únicamente después de una respuesta correcta.

El endpoint visible en el frontend no es una clave privada. La configuración actual se
mantiene tanto en el HTML como en `js/main.js`.

## Capturas y assets

- Las 16 capturas nuevas de los proyectos están en `assets/images/projects/` e incluyen
  su propio mockup (`data-frame-mode="embedded"`).
- Las tres capturas del sitio anterior de Sifuentes están en
  `assets/images/projects/sifuentes/before/` y se presentan como evidencia histórica,
  sin atribuir su diseño a Nils.
- Los ocho previews de Concept Lab están en `assets/images/labs/`.
- La imagen social está en `assets/images/social/portfolio-nils-tovar.webp`.
- Los originales y el reporte de producción permanecen en `portfolio-captures/` como
  archivo maestro local; no se eliminan ni se publican.

El inventario y las dimensiones están documentados en [CAPTURES.md](CAPTURES.md).

## Estructura

```text
Portafolio/
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
│   ├── favicon.svg
│   └── images/
│       ├── labs/
│       ├── projects/
│       └── social/
├── lab/
│   ├── clarity-house/
│   ├── diecast-gallery/
│   ├── frameforge-lab/
│   ├── loadout-store/
│   ├── retina-lab/
│   ├── sonora/
│   ├── tiny-turbo/
│   └── wavelab/
├── README.md
├── CAPTURES.md
├── PORTFOLIO_REVIEW.md
├── DEPLOYMENT_REPORT.md
├── .gitignore
└── .nojekyll
```

## Privacidad y contenido

La sección profesional no utiliza fotografía, avatar ni información personal
innecesaria. Solo se publican nombre, rol, Lima (Perú), disponibilidad remota y los
canales de contacto confirmados. No se inventan perfiles, cargos, clientes, métricas ni
testimonios.

## Pendientes opcionales

- Dominio personalizado.
- Versión completa en inglés. El contenido nuevo del Lab ya está centralizado en una
  estructura de datos preparada para incorporar otra variante.
- URLs públicas adicionales de proyectos únicamente cuando sean estables y verificables.
