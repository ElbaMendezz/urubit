## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

# Migración ÚRBIT LAB — home a Astro

Este proyecto está migrando el diseño de `design-source/Home ÚRBIT LAB v2.dc.html`
(un canvas de Claude Design, no HTML escrito a mano) a Astro idiomático. Este
documento es la **única fuente de verdad** del proceso a partir de ahora.
`design-source/ASTRO.md` son las notas originales del diseñador — se conservan
como contexto histórico, pero ante cualquier discrepancia con este archivo, gana
este archivo. Dudas de contenido pendientes de confirmar con el cliente:
`/PENDIENTES.md`.

## Criterio de éxito

**La fidelidad es del render, no del código.** El resultado debe ser visualmente
indistinguible del original: mismos colores, tipografías, tamaños, espaciados,
radios, orden de secciones y copy literal. El código debe ser Astro idiomático,
pero si en algún punto fidelidad visual y "código limpio" chocan, gana la
fidelidad visual y se documenta como deuda técnica en este archivo — no se
resuelve por cuenta propia.

Prohibido: cambiar textos/colores/tamaños/espaciados "para mejorarlos", añadir
animaciones o efectos que no estén en el original, inventar contenido o
placeholders, añadir dependencias sin permiso, reordenar o simplificar secciones.

## `design-source/` no es HTML estático — es un canvas de Claude Design

El archivo de entrada usa el runtime `support.js` (React vía CDN, bindings
`{{ }}`, atributos `style-hover="..."`, wrapper `<x-dc>`). Se investigó a fondo
antes de migrar nada:

- **Fuente de verdad del diseño:** los `style="..."` inline y `style-hover="..."`
  de cada nodo, más el `<style>` embebido en el `<helmet>`. Confirmado por grep
  de todo `support.js`: el runtime **no aporta layout de producción** —
  `BASE_CSS` es exclusivamente chrome de editor (placeholders de streaming,
  overlay de errores, reglas de impresión), `FULL_PAGE_CSS` solo pone
  `height:100%` para llenar el iframe del canvas, y `ATOMIC_CSS` nunca se
  inyecta porque el HTML no tiene `data-dc-atomics`. `box-sizing: border-box`
  viene del propio `<style>` del diseño, no del runtime.
- **`style-hover="..."` = `:hover` real.** El runtime lo compila a una regla CSS
  de verdad vía `insertRule` (confirmado en `support.js`, función
  `createPseudoSheet`). Se porta 1:1 a `:hover` en el `<style>` scoped de Astro.
- **El HTML original no renderiza standalone sin red** (carga React/ReactDOM/Babel
  desde `unpkg.com`). Relevante para la fase de verificación — ver más abajo.

## Responsive: dos breakpoints, sin `!important`

El original define exactamente dos breakpoints en su `<style>` embebido:
**Escritorio ≥1025px · Tablet 641–1024px (verificado a 834px) · Móvil ≤640px
(verificado a 390px)** — anchos confirmados contra `design-source/Vista
Responsive.dc.html`, que carga el mismo v2 en iframes a 1440/834/390px.

En el original, las 51 declaraciones de las media queries (`[data-r~="..."]`)
usan `!important` porque tienen que ganarle a la especificidad de un
`style="..."` inline en el mismo nodo (grep: 51 declaraciones, 51 `!important`,
sin excepción — es un parche de especificidad, no una decisión de diseño). En
Astro, como no hay inline styles, los valores base van como reglas de clase
normales en el `<style>` scoped de cada componente y las reglas de `@media` van
después en el mismo archivo: mismo cascade, sin necesidad de `!important` en
ningún punto. Mismo resultado visual, sin el hack.

## Estructura aprobada

```
src/
  layouts/
    BaseLayout.astro        <- <head> mínimo, meta viewport, Google Fonts (link
                                preconnect + stylesheet), title, y el wrapper
                                de página (#top, antes `<div id="top">` en el
                                original — el resto de divs sin estilo que lo
                                rodeaban eran ruido del canvas, se colapsaron).
                                El botón "volver arriba" NO vive aquí: es 100%
                                comportamiento de scroll, se construye completo
                                en la fase de JS junto con scroll-effects.ts.
                                <head> completo (favicon, OG, Twitter, JSON-LD)
                                es una fase propia al final.
  components/
    sections/
      Nav.astro              <- líneas 92-118 del original (nav sticky + menú móvil)
      Hero.astro              <- líneas 120-151 (incluye el grid de 4 stats)
      Lab.astro                <- líneas 152-166 (#c-lab, grid de reels)
      Servicios.astro          <- líneas 169-191 (#c-hacemos, grid de 8 tarjetas)
      Diferencia.astro         <- líneas 193-213 (#c-dif)
      Metodologia.astro        <- líneas 215-229 (#c-metodo, 4 fases)
      Acompanamiento.astro     <- líneas 231-250 (#c-aliado)
      Contacto.astro           <- líneas 253-270 (#c-contacto + footer)
    ui/
      Cta.astro                <- botón píldora reutilizado (nav/hero/hacemos/aliado/contacto)
      StatCard.astro           <- las 4 tarjetas de stats del hero
      ServiceCard.astro        <- las 8 tarjetas de servicios
      ReelCard.astro           <- las 4 tarjetas de reel
      PhaseCard.astro          <- las 4 fases de metodología
    icons/
      IconGrid, IconDisciplinas, IconSectores, IconEscalas       <- íconos de stats
      IconDiagnostico, IconDiseno, IconGestion, IconImpacto      <- íconos de fase
      IconCheck, IconArrowUp
  data/
    site.ts                  <- CONTACT (whatsapp/tel/email/instagram), HERO_METRICS
  scripts/
    nav.ts                    <- toggle menú móvil + estado burger
    scroll-effects.ts         <- back-to-top, hero intro, contadores, scroll-reveal,
                                  texto cinético, fase activa, parallax dif/contacto
                                  (fase propia, al final — ver "JS" abajo)
  styles/
    global.css                <- reset, variables :root, tipografía base
  assets/                      <- las 17 imágenes de v2.dc.html (copiadas de
                                  design-source/assets/, ya en kebab-case). NO
                                  incluye logo-dark.png ni mark-light.png (sin
                                  uso en v2 — quedan solo en design-source/).
public/                        <- favicon.ico/.png, apple-touch-icon.png
                                  (derivados de mark-dark.png, Fase 11). Sin
                                  og:image/Twitter Card/JSON-LD — ver PENDIENTES.md
design-source/                 <- copia de trabajo del diseño, sin uploads/
```

Los `id` de sección (`#top`, `#c-lab`, `#c-hacemos`, `#c-dif`, `#c-metodo`,
`#c-aliado`, `#c-contacto`) son anclas del nav — no se renombran.

## Reglas técnicas

- Solo Astro, cero React/Vue/Svelte. Sin Tailwind (el original no lo usa).
- Componentes `.astro` con estilos **scoped**, cero `style="..."` inline en el
  markup. Verificación obligatoria antes de cerrar cada fase de sección:
  `grep -rn 'style="' src/ | wc -l` debe dar `0`.
- Tope de 200–300 líneas por componente; si se pasa, se subdivide. Deuda técnica
  aceptada: `Servicios.astro` cierra en 306 líneas (el `row-head` responsive de
  esa sección es el más complejo del sitio — reordena con `display:contents` en
  tablet). 6 líneas sobre el tope, no se subdividió para esto.
- Colores/tipografías extraídos a variables CSS en `:root` (`src/styles/global.css`)
  con los valores exactos del diseño (grep de todo `#hex` y `rgba()` del
  original, 21 hex + 2 tonos que solo aparecen dentro de `rgba()`). Espaciados y
  radios **no** se tokenizan de forma genérica — son bespoke por sección/elemento
  en el original (34px de una tarjeta, 200px de otra, clamp() por título) y
  forzarlos a una escala compartida violaría "los valores son los del diseño, no
  una escala más ordenada". Única excepción: `--radius-full: 999px`, que se
  repite idéntico en decenas de píldoras/badges/CTAs — ese sí es un token real.
- Imágenes locales con `astro:assets`. Los dos `<img>` reales del original
  (`mark-dark.png` en el nav, `logo-light.png` en el footer) usan `<Image />`
  con width/height reales y alt descriptivo en español. **Decisión final**
  (instrucción directa en las Fases 4-7, reemplaza la propuesta pendiente que
  había aquí): los 3 fondos grandes (`hero-render`, `dif-collage`,
  `contacto-collage`) y los 12 PNG de tarjetas (8 `svc-*`, 4 `reel-*`) usan
  todos el mismo patrón — `<Image loading="lazy|eager" />` posicionada absoluta
  + un `<div>` de velo/gradiente encima — en vez de `background-image`. Esto
  obligó a rehacer el parallax de Diferencia: en vez de mover
  `background-position`, la `<Image>` tiene un margen extra de 46px arriba/abajo
  (`top:-46px; height:calc(100% + 92px)`) y el scroll mueve un `transform:
  translateY()` dentro de ese margen — verificado que no deja huecos en los
  bordes en ningún punto del rango (±45px, con 1px de margen de sobra).
- `logo-dark.png` y `mark-light.png` no se importan (sin uso en v2.dc.html,
  quedan solo en `design-source/assets/`).
- Iconos SVG inline como componentes `.astro`, sin librerías de iconos.
- JS vanilla en `src/scripts/`, `<script>` normal cargado desde el componente
  que lo usa. **Las secciones se construyeron primero en su estado final visible**
  (sin `opacity:0`/`transform` inicial de las animaciones de scroll); el JS de
  scroll/reveal/parallax se hizo en una fase propia al final (`scroll-effects.ts`
  + botón "volver arriba" en `BaseLayout.astro`), no repartido fase a fase.
  **Estado final: 8 de las 9 features originales implementadas.** Se descartó el
  texto cinético (palabra por palabra) por costo de mantenimiento y porque
  degradaba la accesibilidad del `<h2>` al partirlo en ~20 `<span>`; se reemplazó
  por `initTitleReveal()`, un revelado a nivel de bloque (`clip-path` +
  `transform` en el título, `letter-spacing`+`opacity` en el eyebrow) que
  reproduce el mismo movimiento/velocidad sin tocar el DOM del texto — aplica a
  Lab, Servicios y Metodología, las 3 únicas secciones que lo tenían en el
  original. El resto (back-to-top, intro del hero, contadores, scroll-reveal
  genérico, foco de fase activa, parallax+reveal en Diferencia/Acompañamiento/
  Contacto) está portado 1:1, incluyendo dos comportamientos no obvios del
  original que se replicaron literales en vez de "corregirlos": el CTA de
  Contacto nunca se anima (su selector original — `a[href="#c-contacto"]` — no
  coincide con el botón real, que apunta a WhatsApp) y el color de texto de las
  tarjetas de Metodología se normaliza a `inherit` cuando el JS corre, así que
  las descripciones pierden su color distintivo por tarjeta una vez la tarjeta
  se activa (documentado a fondo en el historial de la Fase 11).
- Añadido intencional (no estaba en el original, no altera el render): `@media
  (prefers-reduced-motion: reduce)` envolviendo toda animación; `:focus-visible`
  en enlaces/botones/CTA; `aria-expanded`/`aria-controls`/`aria-label` y manejo
  de teclado (Escape, focus trap) en el menú móvil. Todo lo demás fuera de esta
  lista sigue prohibido inventarlo.
- HTML semántico (header/nav/main/section/footer, jerarquía h1–h6) siempre que
  no altere el render.
- Placeholders de contenido (métricas del hero, teléfono, correo) van a
  `src/data/site.ts` como constantes tipadas, no hardcodeados en el markup —
  ver también el WhatsApp/Instagram URL, centralizados ahí por repetirse
  idénticos en 6+ puntos del diseño.

## Verificación por fase

Antes de cerrar cada fase de sección:

```
grep -rn 'style="' src/ | wc -l   # debe ser 0
npm run build                      # debe pasar sin warnings
```

## Verificación final (reemplaza la del prompt original) — no ejecutada como diff automatizado

El plan era: Playwright, animaciones **congeladas en ambos lados**, inyectando CSS
que fuerce el estado final y anule transiciones tanto en el original como en el
build; esperar `document.fonts.ready`; hacer scroll al final y de vuelta arriba
para disparar todos los reveals antes de congelar; capturar y comparar **por
sección** (`#top`, `#c-lab`, `#c-hacemos`, `#c-dif`, `#c-metodo`, `#c-aliado`,
`#c-contacto`), no full-page; reportar % de píxeles distintos por sección. Anchos:
**1440 / 834 / 390px** (los mismos que usa `design-source/Vista Responsive.dc.html`).
El original no renderiza headless sin red (depende de React/ReactDOM/Babel vía
`unpkg.com`), así que la idea era congelar capturas de referencia una vez, con red
disponible, y usarlas como ground truth sin depender de `unpkg.com` en cada corrida.

**Este diff automatizado no se implementó.** En su lugar, cada fase de sección se
verificó manualmente contra el original en Chrome real: captura visual + estado
computado (`getComputedStyle`, `getBoundingClientRect`) en los 3 anchos, disparando
a mano los triggers de scroll/hover/foco relevantes a cada sección. Es el método
que encontró y confirmó cada bug real de esta migración (la especificidad de
`.nav-cta`, el esquema de color invertido del CTA del Hero, el `flex-basis` sin
resetear en Servicios, el gap de animación en los títulos). Si se quiere el diff
automatizado con métrica de % de píxeles como entregable aparte, sigue pendiente
— ver `PENDIENTES.md`.

## Commits

Un commit convencional por fase aprobada, sin menciones a colaboración con IA.
