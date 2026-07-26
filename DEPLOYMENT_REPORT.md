# Informe de publicación

Fecha de revisión: 25 de julio de 2026.

## Resumen

El portfolio de Nils Tovar está publicado mediante GitHub Pages con HTTPS. El
formulario de contacto funciona mediante Formspree y está restringido al host de
producción.

## Git

- Rama: `main`.
- Identidad local: Nils Tovar — `niltovap@gmail.com`.
- Commit inicial: `5de1966` — `feat: publish initial portfolio`.
- Commit final de producción: `chore: finalize production metadata and documentation`.
- Remoto: `https://github.com/AlTi1912/Portafolio.git`.
- Propietario: `AlTi1912`.
- Repositorio: `Portafolio`.

## GitHub

- Repositorio público: [github.com/AlTi1912/Portafolio](https://github.com/AlTi1912/Portafolio).
- Visibilidad: pública.
- Rama principal: `main`.

## GitHub Pages

- Fuente: **Deploy from a branch**.
- Rama: `main`.
- Carpeta: `/(root)`.
- URL: [alti1912.github.io/Portafolio](https://alti1912.github.io/Portafolio/).
- HTTPS: activo.
- Estado: publicado.

## Formspree

- Proyecto: Portfolio Nils Tovar.
- Formulario: Contacto Portfolio.
- Correo receptor: `niltovap@gmail.com`.
- Endpoint: `https://formspree.io/f/xr****vo`.
- Restrict to Domain: `alti1912.github.io`.
- Form Enabled: activo.
- Submission Archive: activo.
- Formshield: activo.
- CAPTCHA: desactivado.
- Prueba local: respuesta HTTP 200 en JSON.
- Prueba pública: completada.
- Recepción en Gmail: confirmada.

La prueba pública, la recepción y la configuración del formulario fueron confirmadas
por el usuario. El endpoint público del frontend no se considera una credencial.

## Seguridad

- Archivos `.env` excluidos mediante `.gitignore`.
- `backups/` y `portfolio-captures/` excluidos del repositorio.
- Directorios temporales, logs y configuraciones de editor excluidos.
- Sin tokens, cookies, contraseñas, sesiones ni bases de datos en los archivos publicados.
- Sin rutas privadas del sistema local en el contenido publicado.
- `.nojekyll` incluido en la raíz.

## Validación

### Comprobado por Codex

- Rama local `main` sincronizada con `origin/main` antes de esta actualización.
- Revisión de secretos, archivos ignorados y rutas privadas.
- Rutas relativas y coincidencia exacta de mayúsculas y minúsculas.
- Las 16 capturas WebP existen y corresponden con las referencias de `index.html`.
- Navegación, menú móvil, galerías, lightbox, footer, correo e Instagram.
- Validación responsive en 320, 375, 390, 430, 768, 1024, 1280 y 1440 px.
- Ausencia de scroll horizontal, errores JavaScript y recursos locales 404 en la
  validación previa al despliegue.
- URL pública con respuesta HTTP 200, HTTPS válido y protocolo HTTP/2.
- CSS, JavaScript y las 16 capturas cargados en la versión pública sin respuestas 404,
  mixed content ni errores de consola.
- Cero solicitudes `POST` a Formspree durante las validaciones local y pública de esta
  actualización.
- La acción de copiar correo y su fallback accesible fueron ejecutados; el navegador
  headless no tuvo permiso para escribir en el portapapeles del sistema.

### Confirmado previamente por el usuario

- GitHub Pages publicado mediante HTTPS.
- Formulario habilitado, restringido al dominio y aceptado en producción.
- Recepción del mensaje público en Gmail con los campos correctos.
- Formshield y Submission Archive activos; CAPTCHA desactivado.

### Pendiente al redactar este informe

- Verificación del nuevo despliegue de GitHub Pages después del commit final. El
  resultado y el hash corto se informan en la entrega de Codex para evitar un commit
  adicional dedicado al propio informe.

## Pendientes

- Imagen Open Graph de 1200 × 630 px.
- Dominio personalizado opcional.
- Enlaces públicos de los proyectos cuando sean estables.
