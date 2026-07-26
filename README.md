# Portfolio de Nils Tovar

Portfolio personal enfocado en desarrollo web y diseño digital, con estudios de caso
de Sifuentes Colombia y GB Audio. Es una web estática de una sola página, construida
sin frameworks ni proceso de compilación.

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

## Funcionalidades

- Diseño responsive.
- Navegación de página única y menú móvil.
- Estudios de caso de Sifuentes Colombia y GB Audio.
- Galerías expandibles con 16 capturas WebP.
- Lightbox accesible con retorno de foco.
- Formulario de contacto integrado con Formspree.
- Honeypot, validación y estados de carga, éxito y error.
- Footer con correo, Instagram y acción para copiar el correo.
- Navegación por teclado, foco visible y reducción de movimiento.

## Ejecución local

Desde la raíz del proyecto:

```bash
python -m http.server 8000
```

Después abre:

```text
http://localhost:8000
```

También es posible abrir `index.html` directamente, aunque un servidor local reproduce
mejor el comportamiento del sitio publicado.

## Despliegue

El sitio se publica mediante GitHub Pages con esta configuración:

- Fuente: **Deploy from a branch**.
- Rama: `main`.
- Carpeta: `/(root)`.
- HTTPS: activo.
- `.nojekyll`: incluido en la raíz.
- Despliegue: automático después de cada push a `main`.

Todos los recursos usan rutas relativas compatibles con la subruta `/Portafolio/`.

## Formspree

El formulario **Contacto Portfolio** del proyecto **Portfolio Nils Tovar** está
conectado a Formspree y entrega los mensajes a `niltovap@gmail.com`.

- Endpoint documentado: `https://formspree.io/f/xr****vo`.
- Fallback HTML mediante `action` y `method="POST"`.
- Envío AJAX mediante `fetch`.
- Datos enviados con `FormData`.
- Respuesta solicitada con `Accept: application/json`.
- Validación HTML y JavaScript.
- Honeypot `_gotcha`.
- Estados accesibles mediante `aria-live`.
- Botón bloqueado mientras se procesa el envío.
- Dominio autorizado: `alti1912.github.io`.

El endpoint completo está necesariamente visible en el frontend y no es una clave
privada. La integración fue verificada en local y en producción; no se simulan
respuestas exitosas y el formulario solo se limpia después de una respuesta correcta.

## Capturas de proyectos

Las 16 capturas de producción están en `assets/images/projects/`: ocho corresponden a
Sifuentes Colombia y ocho a GB Audio. Cada archivo ya incluye su propio mockup, por lo
que se presenta con `data-frame-mode="embedded"`.

Las imágenes usan rutas relativas, dimensiones reales, `loading="lazy"` y
`decoding="async"`. Para actualizar una captura:

1. Conserva el nombre y las dimensiones documentadas, o actualiza ambos en `index.html`.
2. Exporta la versión de producción en WebP.
3. Sustituye la copia correspondiente en `assets/images/projects/`.
4. Revisa la vista prioritaria, la galería y el lightbox.
5. Actualiza [CAPTURES.md](CAPTURES.md) si cambia el inventario.

Los originales y el reporte de producción permanecen en `portfolio-captures/` como
archivo maestro local; la carpeta está excluida del repositorio.

## Estructura

```text
Portafolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── favicon.svg
│   └── images/
│       └── projects/
├── README.md
├── CAPTURES.md
├── PORTFOLIO_REVIEW.md
├── DEPLOYMENT_REPORT.md
├── .gitignore
└── .nojekyll
```

## Estado de producción

- Repositorio público y rama `main` activos.
- GitHub Pages publicado mediante HTTPS.
- CSS, JavaScript, favicon y 16 capturas disponibles desde la subruta del proyecto.
- Formspree habilitado y restringido a `alti1912.github.io`.
- Correo e Instagram configurados con datos públicos confirmados.

El detalle de publicación y validación está en
[DEPLOYMENT_REPORT.md](DEPLOYMENT_REPORT.md).

## Pendientes reales

- Dominio personalizado opcional.
- Imagen Open Graph de 1200 × 630 px.
- URLs públicas verificables de los proyectos cuando sean estables.
- Perfiles profesionales adicionales, LinkedIn o CV cuando existan y puedan confirmarse.
