/**
 * Datos de contacto y métricas del hero, extraídos literales de
 * design-source/Home ÚRBIT LAB v2.dc.html. Centralizados aquí porque el
 * enlace de WhatsApp y el de Instagram se repiten idénticos en 6+ puntos
 * del diseño (nav, menú móvil, hero, hacemos, aliado, contacto) — un solo
 * lugar evita que una edición futura los deje inconsistentes entre sí.
 *
 * Varios de estos valores están marcados como placeholder por el propio
 * diseñador (ver design-source/ASTRO.md, "Pendientes de contenido") — no
 * son inferencia mía. Ver /PENDIENTES.md.
 */

export const CONTACT = {
  whatsappUrl:
    "https://api.whatsapp.com/send/?phone=3114481160&text&type=phone_number&app_absent=0&utm_source=ig",
  phoneDisplay: "311 448 1160",
  phoneHref: "tel:+573114481160",
  email: "comunidad@clapedu.org",
  instagramUrl: "https://www.instagram.com/urbitlab/",
  instagramHandle: "@urbitlab",
} as const;

export interface HeroMetric {
  value: string;
  label: string;
}

export const HERO_METRICS: readonly HeroMetric[] = [
  { value: "08", label: "LÍNEAS DE SERVICIO" },
  { value: "05", label: "DISCIPLINAS INTEGRADAS" },
  { value: "06", label: "SECTORES DE IMPACTO" },
  { value: "04", label: "ESCALAS DE INTERVENCIÓN" },
];
