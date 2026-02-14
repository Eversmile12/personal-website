import fs from "fs";
import path from "path";
import Nav from "@/components/Nav";
import Crosshair from "@/components/Crosshair";
import ConsoleEasterEgg from "@/components/ConsoleEasterEgg";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Clients from "@/components/Clients";
import Projects from "@/components/Projects";
import Speaking from "@/components/Speaking";
import Writing, { SubstackPost } from "@/components/Writing";
import Social from "@/components/Social";
import Footer from "@/components/Footer";
import { SITE, SOCIAL, CLIENTS, TALKS } from "@/lib/constants";

const VIDEO_EXTS = new Set([".mp4", ".webm"]);
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function getHeroSources() {
  const dir = path.join(process.cwd(), "public", "hero-content");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return VIDEO_EXTS.has(ext) || IMAGE_EXTS.has(ext);
    })
    .sort()
    .map((f) => {
      const ext = path.extname(f).toLowerCase();
      return {
        type: VIDEO_EXTS.has(ext) ? ("video" as const) : ("image" as const),
        src: `/hero-content/${f}`,
      };
    });
}

export interface PinnedRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  topics: string[];
}

async function getPinnedRepos(): Promise<PinnedRepo[]> {
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: `{ user(login: "${SOCIAL.github.handle}") { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name description url stargazerCount primaryLanguage { name } repositoryTopics(first: 5) { nodes { topic { name } } } } } } } }`,
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const nodes = json.data?.user?.pinnedItems?.nodes ?? [];
    return nodes.map((r: Record<string, unknown>) => ({
      name: r.name as string,
      description: (r.description as string) || "",
      url: r.url as string,
      stars: r.stargazerCount as number,
      language: (r.primaryLanguage as Record<string, string>)?.name || "",
      topics: ((r.repositoryTopics as Record<string, Record<string, Record<string, string>>[]>)?.nodes ?? []).map(
        (t) => t.topic.name
      ),
    }));
  } catch {
    return [];
  }
}

async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const res = await fetch(`${SOCIAL.substack.url}/feed`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const posts: SubstackPost[] = [];
    const items = xml.split("<item>");
    for (let i = 1; i < items.length && posts.length < 5; i++) {
      const get = (tag: string) => {
        const m = items[i].match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`))
          || items[i].match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
        return m ? m[1].trim() : "";
      };
      const title = get("title");
      const link = get("link");
      const pubDate = get("pubDate");
      const description = get("description")
        .replace(/<[^>]*>/g, "")
        .slice(0, 200);
      if (title && link) {
        posts.push({
          title,
          url: link,
          date: pubDate ? new Date(pubDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "",
          description,
        });
      }
    }
    return posts;
  } catch {
    return [];
  }
}

export default async function Home() {
  const heroSources = getHeroSources();
  const [substackPosts, pinnedRepos] = await Promise.all([
    getSubstackPosts(),
    getPinnedRepos(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://vittoriorivabella.com/#person",
        name: SITE.name,
        url: "https://vittoriorivabella.com",
        jobTitle: "AI Coordinator",
        worksFor: {
          "@type": "Organization",
          name: "Ethereum Foundation",
          url: "https://ethereum.org",
        },
        description: SITE.bio,
        image: "https://vittoriorivabella.com/profile.png",
        email: SITE.email,
        sameAs: [
          SOCIAL.twitter.url,
          SOCIAL.linkedin.url,
          SOCIAL.github.url,
          SOCIAL.substack.url,
        ],
        knowsAbout: [
          "Artificial Intelligence",
          "AI Security",
          "Smart Contract Auditing",
          "Blockchain",
          "Web3",
          "Developer Relations",
          "Machine Learning",
          "Distributed Systems",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://vittoriorivabella.com/#website",
        url: "https://vittoriorivabella.com",
        name: `${SITE.name} — ${SITE.title}`,
        publisher: { "@id": "https://vittoriorivabella.com/#person" },
      },
      {
        "@type": "WebPage",
        "@id": "https://vittoriorivabella.com/#webpage",
        url: "https://vittoriorivabella.com",
        name: `${SITE.name} — ${SITE.title}`,
        isPartOf: { "@id": "https://vittoriorivabella.com/#website" },
        about: { "@id": "https://vittoriorivabella.com/#person" },
      },
      ...CLIENTS.map((c) => ({
        "@type": "OrganizationRole",
        member: { "@id": "https://vittoriorivabella.com/#person" },
        roleName: c.role,
        "schema:memberOf": {
          "@type": "Organization",
          name: c.name,
          url: c.url,
        },
      })),
      ...TALKS.filter((t) => t.url).map((t) => ({
        "@type": "Event",
        name: t.title,
        location: { "@type": "Place", name: t.event },
        performer: { "@id": "https://vittoriorivabella.com/#person" },
        url: t.url,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Crosshair />
      <ConsoleEasterEgg />
      <Nav />
      <main>
        <Hero sources={heroSources} />
        <About />
        <Clients />
        <Projects repos={pinnedRepos} />
        <Speaking />
        <Writing posts={substackPosts} />
        <Social />
      </main>
      <Footer />
    </>
  );
}
