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

`src/model.ts` centraliza temporada, fecha final, precio, niveles, beneficios y reglas. El progreso de temporada es independiente del saldo DISA. La temporada usa fecha final de ejemplo 31/03/2027. La fecha simulada permite probar días distintos y vencimientos.

Estado local: clave `disa-pass-v1` en localStorage. Reiniciar elimina los avances de la demostración. Los QR se generan localmente y codifican exclusivamente códigos de demostración. No se utilizan imágenes ni fuentes externas.

Los accesos a servicios, Ofertas, Mapa y Hogar muestran contexto; el prototipo desarrolla solamente el pase. No incluye tarifas ni promociones oficiales.

## Validación

Seis pruebas automatizadas de reglas: niveles y objetivos, deduplicación, prémium, saldo insuficiente, bloqueo de premios, canje, caducidad, serialización y reinicio. La prueba de serialización no sustituye una prueba de persistencia en un navegador real.

Validación adicional realizada en Chromium a 390 px y 1440 px: objetivo y subida de nivel, activación y saldo, reclamación y canje, persistencia tras recargar, reinicio y saldo insuficiente. Sin errores de JavaScript ni desbordamiento horizontal móvil.
