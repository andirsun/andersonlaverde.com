export type Job = {
  dates: string;
  company: string;
  role: string;
  text: string;
  tags: string[];
  /** Optional supporting link — a talk, paper or video backing the entry up. */
  resource?: { label: string; url: string };
};

export const JOBS: Job[] = [
  { dates: "Jun 2026 — now", company: "Streamline", role: "AI Advocate",
    text: "Talking to users, understanding their problems and figuring out where AI actually solves them. Part of bringing AI into the product since 2026 — MCP servers and the Expert tool.",
    tags: ["AI", "MCP", "Product", "Research"] },
  { dates: "2024 — 2026", company: "Streamline", role: "Technical Lead, Growth",
    text: "Led the Growth team across the whole stack after joining in 2021 as a full-stack engineer on the product team, shipping across the desktop app, Figma plugin, web and Lucid.",
    tags: ["TypeScript", "Next.js", "Node", "Growth"] },
  { dates: "Dec 2020 — Jan 2024", company: "Slinqer", role: "Co-founder",
    text: "Planned and structured tech products aimed at cutting carbon emissions.",
    tags: ["Product", "Climate", "Founding"] },
  { dates: "Apr — Jul 2021", company: "Agrosty", role: "Backend Developer",
    text: "Custom fleet tracking software for a company in Argentina. Built the Node APIs and sockets pushing live GPS updates, plus the Mapbox layer in React that drew truck trips.",
    tags: ["Node.js", "Sockets", "Mapbox", "React"] },
  { dates: "Sep — Dec 2020", company: "Tingo Colombia", role: "Technical Lead / Backend",
    text: "Refactored a Node microservices backend (Seneca, custom Memcache client) and shipped new features to a React app used by 200+ students.",
    tags: ["Microservices", "Node.js", "React"] },
  { dates: "Sep 2019 — Sep 2020", company: "Timugo", role: "Co-founder",
    text: "Serverless architecture on NestJS and DigitalOcean, React metrics dashboard, and Ionic + Flutter mobile apps shipped to the Play Store.",
    tags: ["NestJS", "Serverless", "Flutter", "Ionic"] },
  { dates: "Oct 2019 — Jan 2020", company: "Gases de Occidente", role: "Investigator",
    text: "With the Javeriana Cali Biosis team — two engineers, two biologists — testing strategies to cut CO2 in Cali's air. Third place citywide with our PM2.5 research.",
    tags: ["Research", "Air quality"],
    resource: {
      label: "watch the PM2.5 research",
      url: "https://youtu.be/qsfOtHIKIMM",
    } },
  { dates: "Jul 2018 — Aug 2019", company: "Self employed", role: "Freelance Software Engineer",
    text: "Web and mobile builds for clients while finishing the engineering degree in Cali.",
    tags: ["Freelance", "Web", "Mobile"] },
];

export const STATS = [
  { value: "8", label: "years shipping software" },
  { value: "5", label: "years at Streamline" },
  { value: "2×", label: "co-founder" },
  { value: "2019", label: "Linux as daily driver" },
];

export const STACK = ["TypeScript", "React", "Next.js", "Node.js", "NestJS", "Electron",
  "PostgreSQL", "Git", "Fedora Linux", "VS Code", "Mapbox", "Docker"];

export const LINKS = [
  { label: "hola@andersonlaverde.com", url: "mailto:hola@andersonlaverde.com" },
  { label: "linkedin/andirsun", url: "https://www.linkedin.com/in/andirsun/" },
  { label: "twitter/andirsunn", url: "https://twitter.com/andirsunn" },
  { label: "mastodon/@andirsun", url: "https://mastodon.social/@andirsun" },
];
