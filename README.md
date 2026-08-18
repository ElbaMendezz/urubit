# Úrbit Lab — sitio home

Migración a Astro del home de Úrbit Lab, a partir del diseño en
`design-source/Home ÚRBIT LAB v2.dc.html`. Fidelidad de render con el diseño
original; código Astro idiomático. El proceso completo de la migración —
despiece, convenciones, decisiones y deuda técnica documentada — está en
[`CLAUDE.md`](./CLAUDE.md). Dudas de contenido pendientes de confirmar con el
cliente están en [`PENDIENTES.md`](./PENDIENTES.md).

## Estructura del proyecto

```text
/
├── design-source/          copia de trabajo del diseño original (sin uploads/)
├── public/                 favicon y assets sin procesar
├── src/
│   ├── assets/              imágenes procesadas por astro:assets
│   ├── components/
│   │   ├── sections/         una sección del home por archivo (Nav, Hero, Lab...)
│   │   ├── ui/                piezas reutilizadas (Cta, StatCard, ServiceCard...)
│   │   └── icons/              SVG inline como componentes
│   ├── data/                 constantes tipadas (contacto, métricas del hero)
│   ├── layouts/               BaseLayout.astro (<head>, fuentes, wrapper de página)
│   ├── pages/                 index.astro
│   ├── scripts/                JS vanilla (menú móvil, efectos de scroll)
│   └── styles/                 global.css (reset, paleta, tipografía base)
└── package.json
```

## Comandos

Todos se ejecutan desde la raíz del proyecto:

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Levanta el servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera el sitio de producción en `./dist/` |
| `npm run preview` | Sirve el build de producción localmente, antes de desplegar |

Para producción, primero construye y luego sirve el resultado:

```sh
npm run build && npm run preview
```

## Verificación

Antes de dar por cerrada cualquier fase de este proyecto:

```sh
grep -rn 'style="' src/ | wc -l   # debe dar 0 — cero inline styles
npm run build                      # debe compilar sin warnings
```
