import { parseMediumFeed, type Post } from "@/lib/medium";

export type { Post };

export const MEDIUM_URL = "https://andirsun.medium.com/";
export const FEED_URL = "https://medium.com/feed/@andirsun";

/** New Medium posts show up within an hour, no deploy needed. */
const REVALIDATE_SECONDS = 3600;

/** Snapshot of the feed, used only when Medium is unreachable so /blog never ships empty. */
export const FALLBACK_POSTS: Post[] = [
  {
    id: "a5c1e4f39bb7",
    title: "Renuncie a mi sueño como programador",
    url: "https://andirsun.medium.com/renuncie-a-mi-sue%C3%B1o-como-programador-a5c1e4f39bb7",
    published: "2021-08-04T17:29:57.000Z",
    excerpt: "¿Qué haré ahora que deseché el que hasta ahora era mi plan de vida?",
  },
  {
    id: "9cc025c33045",
    title: "Un tapabocas en Murillo: La razón por la que ahora haré tecnología para salvar al mundo.",
    url: "https://andirsun.medium.com/un-tapabocas-en-murillo-la-raz%C3%B3n-por-la-que-ahora-har%C3%A9-tecnolog%C3%ADa-para-salvar-al-mundo-9cc025c33045",
    published: "2021-03-14T18:21:54.000Z",
    excerpt:
      "Aquí, sentado en una mesa con mi laptop en 74% de batería restante y con mi album lleno de fotos y bonitos recuerdos, me gustaría compartirles uno de esos…",
  },
  {
    id: "7c0204aad83",
    title: "Entiende Blockchain en 1000 palabras",
    url: "https://andirsun.medium.com/entiende-blockchain-en-1000-palabras-7c0204aad83",
    published: "2020-08-12T23:48:46.000Z",
    excerpt: "La historia de Bitcoin Y Blockchain explicada como nunca antes y lo mejor de todo, es para Dummies.",
  },
];

export async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch(FEED_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (andersonlaverde.com)" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return FALLBACK_POSTS;
    const posts = parseMediumFeed(await response.text());
    return posts.length > 0 ? posts : FALLBACK_POSTS;
  } catch {
    return FALLBACK_POSTS;
  }
}
