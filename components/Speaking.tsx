import SectionWrapper from "./SectionWrapper";
import { TALKS } from "@/lib/constants";

export default function Speaking() {
  return (
    <SectionWrapper id="speaking">
      <h2 className="font-sans text-3xl font-bold tracking-tight text-text-primary">
        Speaking
      </h2>

      <div className="mt-10 space-y-0 divide-y divide-border">
        {TALKS.map((talk) => (
          <div key={talk.title} className="group py-6 first:pt-0 last:pb-0">
            {talk.url ? (
              <a
                href={talk.url}
                className="block transition-colors hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TalkContent talk={talk} />
              </a>
            ) : (
              <TalkContent talk={talk} />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function TalkContent({ talk }: { talk: (typeof TALKS)[number] }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-mono text-xs tracking-wider text-text-muted uppercase">
          {talk.event}
        </p>
        <h3 className="mt-1 font-sans text-base font-medium text-text-primary group-hover:text-white">
          {talk.title}
        </h3>
      </div>
      {talk.url && (
        <span className="shrink-0 text-text-muted transition-colors group-hover:text-white">
          &rarr;
        </span>
      )}
    </div>
  );
}
