export type Post = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  tag: string;
  read: string;
};

// Replace with MDX files under content/posts when the blog grows.
export const POSTS: Post[] = [
  { slug: "fedora-on-m1", date: "2026.08.14", tag: "linux", read: "6 min",
    title: "Running Fedora on a MacBook Pro M1, two years in",
    excerpt: "What works, what still doesn't, and why I keep the setup anyway." },
  { slug: "mcp-for-product-teams", date: "2026.07.03", tag: "ai", read: "9 min",
    title: "What an MCP server actually does for a product team",
    excerpt: "Notes from shipping MCP at Streamline: where it helped users and where it was just plumbing." },
  { slug: "growth-is-deleting", date: "2026.06.02", tag: "growth", read: "8 min",
    title: "Growth engineering is mostly deleting things",
    excerpt: "Lessons from leading the Growth team: the experiments that mattered were the ones that removed steps." },
  { slug: "memcache-client", date: "2026.04.21", tag: "node", read: "5 min",
    title: "A small Memcache client, and why I wrote my own",
    excerpt: "Revisiting an old Node microservices refactor and what I'd do differently today." },
  { slug: "first-oss-patch", date: "2026.02.09", tag: "open source", read: "4 min",
    title: "My first accepted open source patch",
    excerpt: "The unglamorous path from reading an issue tracker to getting a merge." },
  { slug: "typed-apis", date: "2025.11.30", tag: "typescript", read: "7 min",
    title: "Typed APIs without the ceremony",
    excerpt: "Sharing types between a Next.js frontend and a Node backend without dragging in a framework." },
];

export const TAGS = ["all", "linux", "ai", "growth", "node", "typescript", "open source"];
