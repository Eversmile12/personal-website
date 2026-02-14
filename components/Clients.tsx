import SectionWrapper from "./SectionWrapper";
import { CLIENTS } from "@/lib/constants";

export default function Clients() {
  const employers = CLIENTS.filter((c) => c.type === "employer");
  const clients = CLIENTS.filter((c) => c.type === "client");

  return (
    <SectionWrapper id="clients">
      <h2 className="font-sans text-3xl font-bold tracking-tight text-text-primary">
        Clients &amp; Employers
      </h2>

      <div className="mt-10 grid gap-12 sm:grid-cols-2">
        {employers.length > 0 && (
          <div>
            <h3 className="font-mono text-xs tracking-wider text-text-muted uppercase">
              Employers
            </h3>
            <ul className="mt-4 space-y-0 divide-y divide-border">
              {employers.map((item) => (
                <ClientItem key={item.name} item={item} />
              ))}
            </ul>
          </div>
        )}

        {clients.length > 0 && (
          <div>
            <h3 className="font-mono text-xs tracking-wider text-text-muted uppercase">
              Clients
            </h3>
            <ul className="mt-4 space-y-0 divide-y divide-border">
              {clients.map((item) => (
                <ClientItem key={item.name} item={item} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

function ClientItem({ item }: { item: (typeof CLIENTS)[number] }) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <p className="font-sans text-base font-medium text-text-primary">
        {item.name}
      </p>
      {item.url && (
        <a
          href={item.url}
          className="mt-0.5 inline-block font-mono text-xs text-text-muted transition-colors hover:text-text-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.url.replace(/^https?:\/\//, "")}
        </a>
      )}
      {item.role && (
        <p className="mt-0.5 text-sm text-text-secondary">{item.role}</p>
      )}
      {item.period && (
        <p className="mt-0.5 font-mono text-xs text-text-muted">
          {item.period}
        </p>
      )}
    </li>
  );
}
