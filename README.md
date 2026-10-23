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

1. Omite o lee la introducción. Inicio → Ver mi pase → Objetivos. Verás cuatro misiones; la primera ya está obtenida en los datos iniciales.
2. Abre **Modo demostración**. El estado inicial contiene un repostaje de 20 €. Simula otro de 30 €: completa los dos repostajes semanales, pero no el objetivo de más de 30 €. Pulsa **Obtener progreso** para sumar 260 puntos.
3. Simula un repostaje de 35 € y un lavado. Obtén los 240 y 160 puntos correspondientes: alcanzarás el nivel 10 (900 puntos). Cada objetivo concede progreso una sola vez.
4. Descubrir prémium → Activar por 500 puntos → Confirmar: el saldo pasa de 750 a 250, sin perder progreso. En el nivel 5 puedes reclamar el pack de lavado completo y snack de hasta 3 €.
5. Abre el cupón → Simular canje → Confirmar. El pack completo pasa a Utilizado y no se puede repetir.
6. Recarga el navegador: se conservan saldo, progreso, prémium, tickets y premios. Reinicia desde Modo demostración para volver al nivel 3 y 750 puntos.
7. Para el caso de saldo insuficiente, selecciona ese botón después de reiniciar. Para probar los siete días, avanza al día siguiente entre tickets. Dos tickets separados por siete días completos no forman la pareja semanal; dos dentro de siete días consecutivos sí.

## Configuración

`src/model.ts` centraliza temporada, fecha final, precio, niveles, beneficios y reglas. El progreso de temporada es independiente del saldo DISA. La temporada de colaboración ficticia DISA × McDonald’s dura dos meses: del 01/10/2026 al 30/11/2026 (fin exclusivo: 01/12/2026 UTC). Contiene 8 premios McDonald’s (40 %) y 12 DISA (60 %). Cada premio declara marca, foto, lugar y condiciones. Fuera de temporada se bloquean activación, reclamación y obtención de progreso. La fecha simulada permite probar días distintos y vencimientos.

Estado local: clave `disa-pass-${CONFIG.id}` en localStorage. Reiniciar elimina los avances de la demostración. Los QR se generan localmente y codifican exclusivamente códigos de demostración. No se utilizan imágenes ni fuentes externas.

Los accesos a servicios, Ofertas, Mapa y Hogar muestran contexto; el prototipo desarrolla solamente el pase. No incluye tarifas ni promociones oficiales.

## Validación

Doce pruebas automatizadas de reglas: niveles y objetivos, deduplicación, prémium, saldo insuficiente, bloqueo de premios, canje, caducidad, serialización y reinicio. La prueba de serialización no sustituye una prueba de persistencia en un navegador real.

Validación adicional realizada en Chromium a 390 px y 1440 px: objetivo y subida de nivel, activación y saldo, reclamación y canje, persistencia tras recargar, reinicio y saldo insuficiente. Sin errores de JavaScript ni desbordamiento horizontal móvil.

Las fotos ilustrativas de recompensas han sido generadas para el prototipo y se sirven desde `public/rewards/rewards.png`, sin peticiones externas. No representan productos oficiales. La nueva temporada usa una clave local propia: conserva los datos de la demostración anterior sin aplicarlos a los nuevos premios.

## Recompensas y línea de niveles

El catálogo explícito `rewardLevels` define dos itinerarios distintos. Cada premio tiene marca, imagen, beneficio, condiciones y límites. Todos los beneficios y colaboraciones son ficticios.

| Nivel | Pase gratuito | Pase prémium |
| --- | --- | --- |
| 1 | Papas fritas pequeñas gratis | Big Mac gratis |
| 2 | 5% en repostaje, máximo 3 € | Peluche DISA gratis |
| 3 | Big Mac gratis | 10% en repostaje, máximo 6 € |
| 4 | Lavado básico gratis | 15% McDonald’s, pedido mínimo 10 €, máximo 6 € |
| 5 | 15% McDonald’s, pedido mínimo 10 €, máximo 4 € | Lavado completo + snack de hasta 3 € |
| 6 | 25% en snacks, máximo 4 € | Peluche DISA + café + snack de hasta 3 € |
| 7 | 7% en repostaje, máximo 5 € | McMenú Big Mac completo gratis |
| 8 | 3 € de descuento en recarga mínima de 10 € | 15% en repostaje, máximo 10 € |
| 9 | 20% McDonald’s, pedido mínimo 15 €, máximo 6 € | Lavado completo + 10% en repostaje, máximo 8 € |
| 10 | 12% en repostaje, máximo 10 € | Dos McMenús Big Mac completos gratis |

Los packs se reclaman y utilizan una sola vez, en un único cupón de demostración. Los nuevos cupones conservan una copia del premio para que sus condiciones no cambien al modificar después el catálogo.

Las misiones son: primera compra (60), dos repostajes dentro de siete días consecutivos (260), lavado (160) y un repostaje de más de 30 € (240). Los importes se guardan en céntimos; 30 € exactos no cumplen. Se deduplican identificadores de tickets y se conserva el estado completado de la misión semanal. Los datos iniciales ya incluyen la primera misión obtenida y un repostaje. Las tres restantes permiten llegar desde 240 hasta 900 puntos.

Al actualizar desde el estado anterior se conservan saldo, prémium, progreso y cupones. Las antiguas misiones de tienda/vending/recarga se sustituyen por las nuevas, sin convertir operaciones antiguas en repostajes. El logo DISA LEVEL UP está en `src/assets/disa-level-up-original.jpeg` y aparece en Inicio y en la cabecera del pase.

El pase sigue una línea horizontal con diez niveles numerados: recompensas prémium arriba y gratuitas abajo, con etiquetas laterales fijas. El azul DISA, el amarillo del prémium y las tarjetas con grandes imágenes siguen la referencia visual. En móvil se desliza únicamente el tablero, sin desbordar la página. Las flechas, la navegación por niveles y el teclado permiten explorar todas las recompensas. Las imágenes de menús son genéricas, no fotografías oficiales de los menús nombrados.

## Publicar en GitHub Pages

El flujo `.github/workflows/pages.yml` compila y publica el código de `main` mediante las acciones oficiales de Pages. Ejecuta las pruebas, genera `dist/` y despliega un único artefacto; el estado se consulta en la pestaña Actions.

Configuración de una sola vez: GitHub → Settings → Pages → Build and deployment → Source → **GitHub Actions**. Si existe una restricción de ramas en el entorno `github-pages`, debe permitir `main`.

Después de activar ese origen, abre Actions → Publicar DISA LEVEL UP en Pages → Run workflow → main para publicar la versión actual. Los siguientes cambios en `main` lanzarán el flujo automáticamente. La web conserva la dirección https://carlosmireles.github.io/DisaBattlePass/ .

La rama `gh-pages` conserva la última publicación manual como alternativa, pero el flujo de Actions publica directamente su artefacto y no necesita actualizar esa rama. No requiere secretos personalizados ni tokens añadidos. El archivo público `version.json` identifica el commit de cada despliegue de Actions y permite distinguir una publicación anterior de una nueva.

La presentación horizontal se ha comprobado en Chromium a 320, 390, 768 y 1440 px, incluyendo navegación por niveles, controles de avance, detalles y los recorridos de canje y persistencia.

El logo se importa como recurso de Vite: la compilación genera una URL con huella de contenido para evitar reutilizar versiones anteriores en caché. Se utiliza el JPEG original extraído del ZIP del usuario, sin modificar sus bytes. El encuadre se ajusta únicamente con CSS para reducir los márgenes blancos, sin recrear el logo.

## Misión 0: encuesta inicial

Encuesta opcional de cuatro preguntas con perfiles Desayunador, Ahorrador y Social, borrador persistente y recompensa única de +100 XP. Se abre tras la introducción; también tiene un acceso en el pase. La pantalla independiente se sirve en `/mision-0.html`. Los nuevos estilos están aislados con Tailwind prefijado y sin Preflight. Consulta [código e integración](src/onboarding/README.md).
