# Misión 0 · DISA LEVEL UP

Pantalla de onboarding aislada. Se ha añadido la encuesta y sus puntos de entrada; no se ha rediseñado el resto de la aplicación. Tailwind usa el prefijo `m0-` y desactiva Preflight para no reiniciar estilos ajenos.

## Abrir y entregar

```sh
npm ci
npm run dev
```

- Encuesta independiente: `/mision-0.html`.
- Integrada: aparece después de la introducción en la primera visita y tiene un acceso en Tu Pase DISA.
- Omitir no da XP. Se puede volver desde el acceso Misión 0.

```sh
npm run build
```

La entrega ejecutable está en `dist/`: HTML (`mision-0.html` e `index.html`), CSS Tailwind compilado, JavaScript y recursos locales en `assets/`. Publica la carpeta completa en un servidor estático. No requiere CDN, React instalado en el servidor ni servicios externos; React queda incluido en el JavaScript compilado. Los archivos fuente TSX se adaptan al proyecto React existente.

## Archivos

- `../../mision-0.html`: entrada HTML independiente (en la raíz del repositorio).
- `standalone.tsx`: carga y persiste el estado; comparte la encuesta con la aplicación.
- `MissionZero.tsx`: interfaz semántica, radios accesibles, validación, cuatro pasos, borrador, animación de éxito y retorno al pase.
- `mission0.ts`: preguntas, clasificación de perfil, guardado de borrador, recompensa idempotente y orden de misiones sugeridas.
- `tailwind.input.css` y `../../tailwind.mission0.config.cjs`: CSS aislado y configuración de Tailwind.

## Integrar el componente

```tsx
<MissionZero
  state={state}
  onDraft={(answers, step) => setState(s => saveDraft(s, answers, step))}
  onComplete={answers => setState(s => completeMission0(s, answers))}
  onContinue={() => abrirPase()}
  onSkip={() => abrirPase()}
/>
```

Persiste `state` en localStorage después de cada cambio. La implementación existente usa la clave `disa-pass-${CONFIG.id}`, por lo que la encuesta independiente y la integrada comparten saldo, XP y respuestas. El borrador incluye las respuestas y el paso actual; no concede progreso.

Al finalizar: `mission0.completed = true`, se guarda el perfil y la fecha, se añade `mission0` a `awarded` y se suman exactamente 100 XP. La función devuelve el estado sin cambios si ya se cobró o faltan respuestas válidas. No cambia el saldo DISA ni el prémium. Los XP pueden superar 900; el nivel sigue limitado a 10 y la barra visual al 100%. Los objetivos existentes nunca reducen ese progreso.

La confirmación permite continuar inmediatamente o vuelve al pase después de 3,2 segundos. `prefers-reduced-motion` desactiva la animación.

## Perfiles y recomendaciones

Las cuatro respuestas contribuyen a la puntuación: parada (2), premio (3), frecuencia (1), horario (2). En empate decide el premio elegido. Se calculan los perfiles Desayunador, Ahorrador y Social. La aplicación muestra el perfil, una misión sugerida en el acceso del pase y las misiones existentes ordenadas en Objetivos; no crea nuevas compras obligatorias ni cambia sus recompensas. Las misiones ya obtenidas se muestran después de las pendientes.

## Validación

`npm test`: 19 pruebas (12 existentes y 7 de Misión 0). Se han comprobado en Chromium: los tres perfiles, navegación por teclado, móvil a 320/390 px y escritorio, recuperación del borrador al recargar, vuelta atrás, respuestas incompletas, +100 XP una sola vez, nivel actualizado, retorno automático, recomendaciones, omisión sin puntos y movimiento reducido.
