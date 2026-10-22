# Tu Pase DISA

Prototipo navegable para hackathon, con datos ficticios. No está conectado a DISA ni realiza operaciones reales.

## Abrir

Requiere Node.js 24 y npm.

```sh
npm ci
npm run dev -- --port 5173
```

Abre el puerto 5173 en tu navegador. Para generar la versión estática: `npm run build` (carpeta `dist`). Para validar las reglas: `npm test`.

## Demostración (5 minutos)

1. Omite o lee la introducción. Inicio → Ver mi pase → Objetivos.
2. Abre **Modo demostración**, simula una compra en vending y pulsa **Obtener progreso** en ese objetivo: pasarás del nivel 3 al 4. En Recompensas, abre y reclama un premio.
3. Descubrir prémium → Activar por 500 puntos → Confirmar: el saldo pasa de 750 a 250, conservando el nivel. Puedes reclamar premios prémium de niveles anteriores.
4. Mis premios → abre un cupón → Simular canje → Confirmar. El cupón cambia a Utilizado y no se puede volver a usar.
5. Recarga el navegador: el saldo, progreso y premios se conservan.
6. Reinicia desde Modo demostración. Selecciona Saldo insuficiente e intenta activar prémium: faltan 380 puntos.
7. Para el objetivo de tienda, avanza un día y simula una compra. Repetir eventos el mismo día no duplica el progreso. Puedes caducar un premio reclamado desde el panel.

## Configuración

`src/model.ts` centraliza temporada, fecha final, precio, niveles, beneficios y reglas. El progreso de temporada es independiente del saldo DISA. La temporada de colaboración ficticia DISA × McDonald’s dura dos meses: del 01/10/2026 al 30/11/2026 (fin exclusivo: 01/12/2026 UTC). Contiene 8 premios McDonald’s (40 %) y 12 DISA (60 %). Cada premio declara marca, foto, lugar y condiciones. Fuera de temporada se bloquean activación, reclamación y obtención de progreso. La fecha simulada permite probar días distintos y vencimientos.

Estado local: clave `disa-pass-${CONFIG.id}` en localStorage. Reiniciar elimina los avances de la demostración. Los QR se generan localmente y codifican exclusivamente códigos de demostración. No se utilizan imágenes ni fuentes externas.

Los accesos a servicios, Ofertas, Mapa y Hogar muestran contexto; el prototipo desarrolla solamente el pase. No incluye tarifas ni promociones oficiales.

## Validación

Nueve pruebas automatizadas de reglas: niveles y objetivos, deduplicación, prémium, saldo insuficiente, bloqueo de premios, canje, caducidad, serialización y reinicio. La prueba de serialización no sustituye una prueba de persistencia en un navegador real.

Validación adicional realizada en Chromium a 390 px y 1440 px: objetivo y subida de nivel, activación y saldo, reclamación y canje, persistencia tras recargar, reinicio y saldo insuficiente. Sin errores de JavaScript ni desbordamiento horizontal móvil.

Las fotos ilustrativas de recompensas han sido generadas para el prototipo y se sirven desde `public/rewards/rewards.png`, sin peticiones externas. No representan productos oficiales. La nueva temporada usa una clave local propia: conserva los datos de la demostración anterior sin aplicarlos a los nuevos premios.

## Recompensas y línea de niveles

El catálogo explícito `rewardLevels` define una recompensa gratuita y una prémium superior por nivel. Los niveles iniciales incluyen patatas pequeñas/grandes, snacks al 15/25% y lavado básico/completo. Después aparecen peluches, descuentos en McMenú Big Mac, McPollo y Big Tasty y repostajes con porcentajes y topes crecientes. Todos los beneficios son ficticios; los descuentos en combustible no exigen volumen mínimo.

El pase muestra una línea vertical con nodos numerados y dos tarjetas por parada (gratuita y prémium). Una línea de navegación superior permite saltar a cualquiera de los diez niveles con ratón o teclado. En móvil se mantiene la comparación de ambas tarjetas sin desplazamiento horizontal. Las imágenes de menús son genéricas, no fotografías oficiales de los menús nombrados.

## Publicar en GitHub Pages

La rama `gh-pages` contiene la versión estática compilada. Para activar el sitio: GitHub → Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages` → `/ (root)` → Save.

Dirección prevista tras activarlo: https://carlosmireles.github.io/DisaBattlePass/

Para actualizar la web después de cambiar el código, ejecuta `npm ci`, `npm test` y `npm run build`, y publica el contenido de `dist/` en la rama `gh-pages` (incluido un archivo `.nojekyll`). Subir cambios a `main` por sí solo no actualiza la web. Las rutas relativas permiten servir los recursos desde la subcarpeta del repositorio. No se necesita servidor de aplicación, cuentas ni claves. Cada visitante conserva su propia demostración en el navegador.
