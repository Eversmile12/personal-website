import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <p className="text-center font-mono text-xs text-text-muted">
        &copy; {new Date().getFullYear()} {SITE.name}
      </p>
    </footer>
  );
}
