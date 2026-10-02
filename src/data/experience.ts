import type { Text } from "@/lib/lang";

export type Job = {
  dates: Text;
  company: string;
  role: Text;
  text: Text;
  tags: string[];
  /** Optional supporting link — a talk, paper or video backing the entry up. */
  resource?: { label: Text; url: string };
};

export const JOBS: Job[] = [
  { dates: { en: "Jun 2026 — now", es: "jun 2026 — hoy" }, company: "Streamline",
    role: { en: "AI Advocate", es: "AI Advocate" },
    text: {
      en: "Talking to users, understanding their problems and figuring out where AI actually solves them. Part of bringing AI into the product since 2026 — MCP servers and the Expert tool.",
      es: "Hablo con usuarios, entiendo sus problemas y busco dónde la IA de verdad los resuelve. Parte del equipo que lleva IA al producto desde 2026: servidores MCP y la herramienta Expert.",
    },
    tags: ["AI", "MCP", "Product", "Research"] },
  { dates: { en: "2024 — 2026", es: "2024 — 2026" }, company: "Streamline",
    role: { en: "Technical Lead, Growth", es: "Líder técnico, Growth" },
    text: {
      en: "Led the Growth team across the whole stack.",
      es: "Lideré el equipo de Growth en todo el stack.",
    },
    tags: ["TypeScript", "Next.js", "Node", "Growth"] },
  { dates: { en: "2021 — 2024", es: "2021 — 2024" }, company: "Streamline",
    role: { en: "Software Engineer, Product", es: "Ingeniero de software, Producto" },
    text: {
      en: "Full-stack engineer on the product team, shipping across the desktop app, Figma plugin, web and Lucid.",
      es: "Ingeniero full-stack en el equipo de producto, con entregas en la app de escritorio, el plugin de Figma, la web y Lucid.",
    },
    tags: ["TypeScript", "React", "Electron", "Figma"] },
  { dates: { en: "Dec 2020 — Jan 2024", es: "dic 2020 — ene 2024" }, company: "Slinqer",
    role: { en: "Co-founder", es: "Cofundador" },
    text: {
      en: "Planned and structured tech products aimed at cutting carbon emissions.",
      es: "Planeé y estructuré productos tecnológicos para reducir emisiones de carbono.",
    },
    tags: ["Product", "Climate", "Founding"] },
  { dates: { en: "Apr — Jul 2021", es: "abr — jul 2021" }, company: "Agrosty",
    role: { en: "Backend Developer", es: "Desarrollador backend" },
    text: {
      en: "Custom fleet tracking software for a company in Argentina. Built the Node APIs and sockets pushing live GPS updates, plus the Mapbox layer in React that drew truck trips.",
      es: "Software de rastreo de flotas a medida para una empresa en Argentina. Construí las APIs en Node y los sockets que enviaban el GPS en vivo, y la capa de Mapbox en React que dibujaba los viajes de los camiones.",
    },
    tags: ["Node.js", "Sockets", "Mapbox", "React"] },
  { dates: { en: "Sep — Dec 2020", es: "sep — dic 2020" }, company: "Tingo Colombia",
    role: { en: "Technical Lead / Backend", es: "Líder técnico / Backend" },
    text: {
      en: "Refactored a Node microservices backend (Seneca, custom Memcache client) and shipped new features to a React app used by 200+ students.",
      es: "Refactoricé un backend de microservicios en Node (Seneca, cliente de Memcache propio) y lancé funciones nuevas en una app React usada por más de 200 estudiantes.",
    },
    tags: ["Microservices", "Node.js", "React"] },
  { dates: { en: "Sep 2019 — Sep 2020", es: "sep 2019 — sep 2020" }, company: "Timugo",
    role: { en: "Co-founder", es: "Cofundador" },
    text: {
      en: "Serverless architecture on NestJS and DigitalOcean, React metrics dashboard, and Ionic + Flutter mobile apps shipped to the Play Store.",
      es: "Arquitectura serverless con NestJS y DigitalOcean, dashboard de métricas en React y apps móviles en Ionic y Flutter publicadas en Play Store.",
    },
    tags: ["NestJS", "Serverless", "Flutter", "Ionic"] },
  { dates: { en: "Oct 2019 — Jan 2020", es: "oct 2019 — ene 2020" }, company: "Gases de Occidente",
    role: { en: "Investigator", es: "Investigador" },
    text: {
      en: "With the Javeriana Cali Biosis team — two engineers, two biologists — testing strategies to cut CO2 in Cali's air. Third place citywide with our PM2.5 research.",
      es: "Con el equipo Biosis de la Javeriana Cali —dos ingenieros, dos biólogos— probando estrategias para reducir el CO2 en el aire de Cali. Tercer puesto en la ciudad con nuestra investigación sobre PM2.5.",
    },
    tags: ["Research", "Air quality"],
    resource: {
      label: { en: "watch the PM2.5 research", es: "ver la investigación de PM2.5" },
      url: "https://youtu.be/qsfOtHIKIMM",
    } },
  { dates: { en: "Jul 2018 — Aug 2019", es: "jul 2018 — ago 2019" }, company: "Self employed",
    role: { en: "Freelance Software Engineer", es: "Ingeniero de software freelance" },
    text: {
      en: "Web and mobile builds for clients while finishing the engineering degree in Cali.",
      es: "Proyectos web y móviles para clientes mientras terminaba la carrera de ingeniería en Cali.",
    },
    tags: ["Freelance", "Web", "Mobile"] },
];

/** Spanish labels for the non-technical tags; tech names stay as they are. */
export const TAG_ES: Record<string, string> = {
  Product: "Producto",
  Research: "Investigación",
  Climate: "Clima",
  Founding: "Fundación",
  Microservices: "Microservicios",
  "Air quality": "Calidad del aire",
  Mobile: "Móvil",
};

export const STATS: { value: string; label: Text }[] = [
  { value: "8", label: { en: "years shipping software", es: "años creando software" } },
  { value: "5", label: { en: "years at Streamline", es: "años en Streamline" } },
  { value: "2×", label: { en: "co-founder", es: "cofundador" } },
  { value: "2019", label: { en: "Linux as daily driver", es: "Linux como escritorio diario" } },
];

export const STACK = ["TypeScript", "React", "Next.js", "Node.js", "NestJS", "Electron",
  "PostgreSQL", "Git", "Fedora Linux", "VS Code", "Mapbox", "Docker"];

export const LINKS = [
  { label: "hola@andersonlaverde.com", url: "mailto:hola@andersonlaverde.com" },
  { label: "linkedin/andirsun", url: "https://www.linkedin.com/in/andirsun/" },
  { label: "twitter/andirsunn", url: "https://twitter.com/andirsunn" },
  { label: "mastodon/@andirsun", url: "https://mastodon.social/@andirsun" },
];
