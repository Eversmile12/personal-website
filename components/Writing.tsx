import SectionWrapper from "./SectionWrapper";
import { SOCIAL } from "@/lib/constants";

export interface SubstackPost {
  title: string;
  url: string;
  date: string;
  description: string;
}

export default function Writing({ posts }: { posts: SubstackPost[] }) {
  return (
    <SectionWrapper id="writing">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-sans text-3xl font-bold tracking-tight text-text-primary">
          Writing
        </h2>
        <p className="mt-4 max-w-md text-text-secondary">
          I write about AI engineering, distributed systems, and the craft of
          building software. New essays every few weeks.
        </p>
      </div>

      {posts.length > 0 && (
        <ul className="mt-12 mx-auto max-w-2xl divide-y divide-border">
          {posts.map((post) => (
            <li key={post.url}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dither-hover group block py-6 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-sans text-lg font-medium text-text-primary group-hover:text-white">
                    {post.title}
                  </h3>
                  {post.date && (
                    <span className="shrink-0 font-mono text-xs text-text-muted">
                      {post.date}
                    </span>
                  )}
                </div>
                {post.description && (
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    {post.description}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex justify-center">
        <a
          href={SOCIAL.substack.url}
          className="dither-hover inline-flex items-center gap-3 rounded-sm border border-border bg-bg-elevated px-8 py-4 font-mono text-sm tracking-wider text-text-primary uppercase transition-colors hover:bg-surface hover:text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          {posts.length > 0 ? "Read more on Substack" : "Read on Substack"}
          <span className="text-text-muted">&rarr;</span>
        </a>
      </div>
    </SectionWrapper>
  );
}
