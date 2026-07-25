# Portfolio de Nils Tovar

Portfolio estático de una sola página para Nils Tovar, desarrollador web y diseñador
digital en Lima, Perú. Está construido con HTML, CSS y JavaScript nativos, sin
dependencias, backend ni proceso de compilación.

## Abrir el proyecto

Puedes abrir `index.html` directamente en un navegador. Para trabajar con un servidor
local:

```bash
# Python
python -m http.server 8000

# PHP
php -S localhost:8000
```

Después, visita `http://localhost:8000`.

## Estructura

```text
portfolio/
├── index.html
├── README.md
├── CAPTURES.md
├── PORTFOLIO_REVIEW.md                    # auditoría y referencias profesionales
├── portfolio-captures/                      # archivo maestro y reporte de captura
├── backups/
│   └── 20260725-pre-real-captures/          # copia previa a la integración
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    ├── favicon.svg
    └── images/
        ├── profile/
        │   └── nils-tovar.webp                 # futuro / opcional
        └── projects/
            ├── sifuentes/
            │   ├── sifuentes-bentobox-desktop-safari.webp
            │   ├── sifuentes-bentobox-mobile-safari.webp
            │   ├── sifuentes-contacto-desktop-safari.webp
            │   ├── sifuentes-contacto-mobile-safari.webp
            │   ├── sifuentes-destacada-desktop-safari.webp
            │   ├── sifuentes-destacada-mobile-safari.webp
            │   ├── sifuentes-productos-categoria-desktop-safari.webp
            │   └── sifuentes-productos-categoria-mobile-safari.webp
            └── gb-audio/
                ├── gb-audio-catalogo-desktop-safari.webp
                ├── gb-audio-catalogo-mobile-safari.webp
                ├── gb-audio-destacada-desktop-safari.webp
                ├── gb-audio-destacada-mobile-safari.webp
                ├── gb-audio-hero-desktop-safari.webp
                ├── gb-audio-hero-mobile-safari.webp
                ├── gb-audio-testimonios-desktop-safari.webp
                └── gb-audio-testimonios-mobile-safari.webp
```

Las 16 imágenes de producción están incluidas en `assets/images/projects/`. Sus
originales y el reporte técnico permanecen en `portfolio-captures/` como archivo
maestro. La auditoría de integración confirmó que cada copia de producción coincide
por SHA-256 con el archivo maestro del mismo nombre.

## Presentación de las capturas

Todas las capturas incluyen navegador o dispositivo, fondo exterior y sombra. Por
eso los 16 `<figure>` utilizan:

```html
<figure class="project-capture" data-frame-mode="embedded">
```

El portfolio no añade controles, barra de dirección, borde, fondo ni sombra a estas
imágenes. Cada proyecto muestra tres vistas prioritarias y mantiene otras cinco en una
galería expandible. Las capturas móviles largas usan un recorte visual controlado; el
archivo completo se abre en un `<dialog>` accesible sin navegar a otra página.

`js/main.js` gestiona la expansión, el visor, el retorno de foco y un fallback visible
si un archivo no puede cargar. Todos los archivos usan rutas relativas, atributos
`width` y `height` reales, `loading="lazy"` y `decoding="async"`.

## Recomendaciones para las capturas

- Viewport de origen desktop: `1440 × 900 px` con DPR 2.
- Viewport de origen mobile: `390 × 844 px` con DPR 2.
- Ancho final desktop: `2240 px`.
- Ancho final mobile: `1140 px`.
- Formato: WebP a calidad 90.
- Usa `loading="lazy"` y `decoding="async"`.
- Mantén `width` y `height` reales para reservar el espacio.
- Redacta el `alt` describiendo la página o función visible, no su apariencia.

Consulta [CAPTURES.md](CAPTURES.md) para el inventario y estado de las 16 capturas y
`portfolio-captures/CAPTURE_REPORT.md` para el reporte de producción.

## Configurar contacto y redes

Al inicio de `js/main.js` se encuentra:

```js
const portfolioConfig = {
  email: "niltovap@gmail.com",
  instagram: "https://www.instagram.com/alexxtitoo/",
  github: "",
  linkedin: "",
  whatsapp: "",
  resume: "",
  formspreeEndpoint: "https://formspree.io/f/xrenojvo"
};
```

- El correo e Instagram de Nils ya están configurados.
- Para WhatsApp usa el número con código de país cuando exista un dato público confirmado.
- `resume` acepta una URL pública del CV cuando esté disponible.
- Los canales vacíos permanecen ocultos y no generan enlaces sin destino.

## Footer y copia de correo

El footer utiliza tres zonas compactas en escritorio —identidad, contacto y navegación—
y una columna ordenada en móvil. Incluye `mailto:`, Instagram, disponibilidad neutral,
anclas internas y copyright con año automático.

“Copiar correo” usa `navigator.clipboard` cuando está disponible. Si el navegador no
expone esa API, recurre a una copia compatible mediante selección temporal. El botón
cambia a “Correo copiado”, informa el resultado en una región `aria-live` y recupera
su texto original automáticamente.

GitHub, LinkedIn, WhatsApp y CV tienen puntos de configuración preparados, pero sus
enlaces permanecen completamente ocultos mientras el valor correspondiente esté vacío.

La investigación de referencias, evaluación por áreas, mejoras aplicadas y
recomendaciones futuras están documentadas en [PORTFOLIO_REVIEW.md](PORTFOLIO_REVIEW.md).

## Formspree

El formulario **Contacto Portfolio** del proyecto **Portfolio Nils Tovar** está conectado
al endpoint `https://formspree.io/f/xrenojvo` y entrega los mensajes a
`niltovap@gmail.com`.

El mismo endpoint está declarado en el atributo `action` de `index.html` —como fallback
si JavaScript no está disponible— y en `portfolioConfig.formspreeEndpoint` dentro de
`js/main.js`. El flujo principal usa `fetch`, `FormData` y `Accept: application/json`;
solo limpia los campos después de una respuesta correcta de Formspree.

El 25 de julio de 2026 se realizó una única prueba real desde la web local. Formspree
aceptó exactamente una solicitud `POST` con respuesta HTTP 200 en JSON; el estado de
éxito se anunció y los campos se limpiaron después de esa respuesta.

La opción **Restrict to Domain** se configurará después de publicar en GitHub Pages,
cuando exista el dominio de producción exacto.

## Publicar en GitHub Pages

1. Sube el proyecto a un repositorio.
2. Abre **Settings → Pages**.
3. Selecciona **Deploy from a branch**.
4. Elige la rama principal y `/ (root)`.
5. Añade el canonical y completa los metadatos sociales cuando exista un dominio definitivo.

Todos los recursos utilizan rutas relativas.

## Publicar en Vercel

1. Importa el repositorio en Vercel.
2. Selecciona **Other** como framework.
3. Deja vacío el comando de build.
4. Usa `.` como directorio de salida si se solicita.
5. Publica y actualiza el canonical con el dominio definitivo.

## Información pendiente

- GitHub, LinkedIn, WhatsApp y CV, solo si se confirman públicamente.
- Dominio, canonical, `og:url` e imagen social.
- Enlaces públicos verificables de los proyectos.
- Fotografía de perfil opcional.

Busca `TODO` y `Pendiente de configurar` para localizar los datos
provisionales que no pertenecen a las capturas.
