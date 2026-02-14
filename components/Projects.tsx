import SectionWrapper from "./SectionWrapper";
import { PROJECTS } from "@/lib/constants";
import type { PinnedRepo } from "@/app/page";

export default function Projects({ repos }: { repos: PinnedRepo[] }) {
  const projects =
    repos.length > 0
      ? repos.map((r) => ({
          title: r.name,
          description: r.description,
          tags: r.language ? [r.language, ...r.topics] : r.topics,
          url: r.url,
          stars: r.stars,
        }))
      : PROJECTS.map((p) => ({ ...p, stars: 0 }));

  return (
    <SectionWrapper id="projects">
      <h2 className="font-sans text-3xl font-bold tracking-tight text-text-primary">
        Projects
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.url}
            className="dither-hover group block rounded-sm border border-border bg-bg-elevated p-6 transition-colors hover:bg-surface"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-sans text-lg font-semibold text-text-primary transition-colors group-hover:text-white">
                {project.title}
                <span className="ml-2 inline-block text-text-muted transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </h3>
              {project.stars > 0 && (
                <span className="shrink-0 font-mono text-xs text-text-muted">
                  &#9733; {project.stars}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {project.description}
            </p>
            {project.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm border border-border px-2 py-0.5 font-mono text-xs text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}
