# Capturas integradas del portfolio

Inventario verificado de las 16 capturas WebP de Sifuentes Colombia y GB Audio.
Todas están integradas, utilizan rutas relativas y declaran
`data-frame-mode="embedded"` porque el navegador o dispositivo, el fondo exterior y
la sombra ya forman parte de cada imagen.

## Sifuentes Colombia

| Captura | Dimensiones | Presentación | Estado |
|---|---:|---|---|
| `assets/images/projects/sifuentes/sifuentes-bentobox-desktop-safari.webp` | 2240 × 1749 | Principal visible | Integrada |
| `assets/images/projects/sifuentes/sifuentes-productos-categoria-desktop-safari.webp` | 2240 × 1902 | Secundaria destacada visible | Integrada |
| `assets/images/projects/sifuentes/sifuentes-contacto-mobile-safari.webp` | 1140 × 2576 | Móvil destacada visible | Integrada |
| `assets/images/projects/sifuentes/sifuentes-contacto-desktop-safari.webp` | 2240 × 1570 | Galería expandible | Integrada |
| `assets/images/projects/sifuentes/sifuentes-destacada-desktop-safari.webp` | 2240 × 1267 | Galería expandible | Integrada |
| `assets/images/projects/sifuentes/sifuentes-bentobox-mobile-safari.webp` | 1140 × 3772 | Galería expandible, recorte controlado | Integrada |
| `assets/images/projects/sifuentes/sifuentes-productos-categoria-mobile-safari.webp` | 1140 × 4446 | Galería expandible, recorte controlado | Integrada |
| `assets/images/projects/sifuentes/sifuentes-destacada-mobile-safari.webp` | 1140 × 1788 | Galería expandible | Integrada |

La captura principal muestra la organización de áreas y especialidades. La captura
técnica secundaria mantiene activa la categoría Maxilofacial. La vista móvil destacada
documenta el formulario y los canales de contacto.

### Referencias del sitio anterior

Estas tres capturas documentan la versión anterior como punto de comparación. No
representan trabajo realizado por Nils.

| Captura | Dimensiones | Fuente | Estado |
|---|---:|---|---|
| `assets/images/projects/sifuentes/before/sifuentes-anterior-quienes.webp` | 1440 × 1000 | `quienes.html` | Integrada |
| `assets/images/projects/sifuentes/before/sifuentes-anterior-productos.webp` | 1440 × 1000 | `productos.html` | Integrada |
| `assets/images/projects/sifuentes/before/sifuentes-anterior-contactenos.webp` | 1440 × 1000 | `contactenos.html` | Integrada |

Se capturaron con el mismo viewport de escritorio y se exportaron a WebP. El portfolio
las muestra primero como “Sitio anterior” y continúa con las capturas del rediseño como
“Nueva experiencia”. Todas pueden ampliarse en el lightbox existente.

## GB Audio

| Captura | Dimensiones | Presentación | Estado |
|---|---:|---|---|
| `assets/images/projects/gb-audio/gb-audio-hero-desktop-safari.webp` | 2240 × 1458 | Principal visible | Integrada |
| `assets/images/projects/gb-audio/gb-audio-catalogo-desktop-safari.webp` | 2240 × 2124 | Secundaria destacada visible | Integrada |
| `assets/images/projects/gb-audio/gb-audio-hero-mobile-safari.webp` | 1140 × 1876 | Móvil destacada visible | Integrada |
| `assets/images/projects/gb-audio/gb-audio-testimonios-desktop-safari.webp` | 2240 × 1344 | Galería expandible | Integrada |
| `assets/images/projects/gb-audio/gb-audio-destacada-desktop-safari.webp` | 2240 × 1336 | Galería expandible | Integrada |
| `assets/images/projects/gb-audio/gb-audio-catalogo-mobile-safari.webp` | 1140 × 3542 | Galería expandible, recorte controlado | Integrada |
| `assets/images/projects/gb-audio/gb-audio-testimonios-mobile-safari.webp` | 1140 × 3250 | Galería expandible, recorte controlado | Integrada |
| `assets/images/projects/gb-audio/gb-audio-destacada-mobile-safari.webp` | 1140 × 3624 | Galería expandible, recorte controlado | Integrada |

La captura principal muestra la entrada comercial. El catálogo tiene un segundo nivel
de protagonismo por su valor eCommerce. La captura adicional “destacada” corresponde a
la propuesta de valor “Por qué elegir GB Audio”; no representa una ficha de producto.

## Comportamiento de la galería

- Cada proyecto presenta tres imágenes prioritarias sin expandir la página.
- El botón “Ver 5 capturas más” revela las cinco vistas complementarias.
- Todas las capturas se pueden ampliar en un `<dialog>` accesible.
- Al cerrar el visor, el foco vuelve al botón que lo abrió.
- Las capturas móviles largas se recortan solo en la galería; el visor muestra el
  archivo completo con desplazamiento.
- Si una imagen falla, se oculta el recurso roto, aparece un mensaje visible y se
  desactiva su botón de ampliación.

## Producción y respaldo

Las copias de producción se encuentran en:

- `assets/images/projects/sifuentes/`
- `assets/images/projects/gb-audio/`

El archivo maestro permanece en `portfolio-captures/`, junto con
`portfolio-captures/CAPTURE_REPORT.md`. Se verificaron formato, dimensiones y apertura
de los 16 WebP. También se comparó el SHA-256 de cada copia de producción con el archivo
maestro del mismo nombre: las 16 coincidencias fueron exactas.

La copia del portfolio anterior a esta integración está en
`backups/20260725-pre-real-captures/`.

## Validación de integración

La versión integrada se revisó en `320`, `375`, `390`, `430`, `768`, `1024`, `1280`
y `1440 px` de ancho. En las ocho pruebas:

- no se detectó overflow horizontal;
- se mantuvieron tres capturas prioritarias visibles por proyecto;
- las galerías secundarias permanecieron cerradas al cargar;
- las 16 imágenes cargaron correctamente y sin respuestas HTTP fallidas;
- el visor abrió con foco en el control de cierre, cerró con Escape y devolvió el
  foco al activador;
- el fallback ocultó la imagen fallida, mostró un aviso y desactivó la ampliación.

Las capturas tomadas para esta revisión se guardaron fuera de `assets/` y no forman
parte de la interfaz ni del despliegue del portfolio.

## Previews de Concept Lab

Los ocho previews se exportaron en WebP a 1280 × 800 px y representan el estado real de
cada demo después de su auditoría de contenido:

- `assets/images/labs/sonora.webp`
- `assets/images/labs/wavelab.webp`
- `assets/images/labs/loadout-store.webp`
- `assets/images/labs/frameforge-lab.webp`
- `assets/images/labs/retina-lab.webp`
- `assets/images/labs/clarity-house.webp`
- `assets/images/labs/tiny-turbo.webp`
- `assets/images/labs/diecast-gallery.webp`

Son previews de navegación; los ocho prototipos completos permanecen accesibles en sus
rutas `lab/<slug>/` y no se cargan mediante iframes en la página principal.
