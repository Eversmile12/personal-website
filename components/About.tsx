import SectionWrapper from "./SectionWrapper";
import DitheredImage from "./DitheredImage";
import { SITE } from "@/lib/constants";

export default function About() {
  return (
    <SectionWrapper id="about">
      <div className="grid gap-12 md:grid-cols-[280px_1fr] md:gap-16">
        {/* Dithered profile image */}
        <div className="flex justify-center md:justify-start">
          <DitheredImage
            src="/profile.png"
            alt={`Photo of ${SITE.name}`}
            width={280}
            height={280}
            className="rounded-sm"
          />
        </div>

        {/* Bio text */}
        <div className="flex flex-col justify-center">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-text-primary">
            About
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-text-secondary">
            {SITE.bio}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
