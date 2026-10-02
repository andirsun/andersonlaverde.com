import type { Text } from "@/lib/lang";

export type Post = {
  slug: string;
  date: string;
  title: Text;
  excerpt: Text;
  tag: string;
  read: string;
};

// Replace with MDX files under content/posts when the blog grows.
export const POSTS: Post[] = [
  { slug: "fedora-on-m1", date: "2026.08.14", tag: "linux", read: "6 min",
    title: { en: "Running Fedora on a MacBook Pro M1, two years in", es: "Fedora en un MacBook Pro M1, dos años después" },
    excerpt: { en: "What works, what still doesn't, and why I keep the setup anyway.", es: "Qué funciona, qué todavía no, y por qué sigo con esta configuración." } },
  { slug: "mcp-for-product-teams", date: "2026.07.03", tag: "ai", read: "9 min",
    title: { en: "What an MCP server actually does for a product team", es: "Qué hace de verdad un servidor MCP por un equipo de producto" },
    excerpt: { en: "Notes from shipping MCP at Streamline: where it helped users and where it was just plumbing.", es: "Notas de lanzar MCP en Streamline: dónde ayudó a los usuarios y dónde era solo fontanería." } },
  { slug: "growth-is-deleting", date: "2026.06.02", tag: "growth", read: "8 min",
    title: { en: "Growth engineering is mostly deleting things", es: "Growth engineering es sobre todo borrar cosas" },
    excerpt: { en: "Lessons from leading the Growth team: the experiments that mattered were the ones that removed steps.", es: "Lecciones de liderar el equipo de Growth: los experimentos que importaron fueron los que quitaban pasos." } },
  { slug: "memcache-client", date: "2026.04.21", tag: "node", read: "5 min",
    title: { en: "A small Memcache client, and why I wrote my own", es: "Un pequeño cliente de Memcache, y por qué escribí el mío" },
    excerpt: { en: "Revisiting an old Node microservices refactor and what I'd do differently today.", es: "Revisando un viejo refactor de microservicios en Node y qué haría distinto hoy." } },
  { slug: "first-oss-patch", date: "2026.02.09", tag: "open source", read: "4 min",
    title: { en: "My first accepted open source patch", es: "Mi primer parche open source aceptado" },
    excerpt: { en: "The unglamorous path from reading an issue tracker to getting a merge.", es: "El camino poco glamuroso de leer un issue tracker a conseguir un merge." } },
  { slug: "typed-apis", date: "2025.11.30", tag: "typescript", read: "7 min",
    title: { en: "Typed APIs without the ceremony", es: "APIs tipadas sin ceremonia" },
    excerpt: { en: "Sharing types between a Next.js frontend and a Node backend without dragging in a framework.", es: "Compartir tipos entre un frontend Next.js y un backend Node sin arrastrar un framework." } },
];

export const TAGS = ["all", "linux", "ai", "growth", "node", "typescript", "open source"];
export const TAG_LABEL_ES: Record<string, string> = { all: "todo", ai: "ia" };
