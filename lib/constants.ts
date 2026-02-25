export const SITE = {
  name: "Vittorio Rivabella",
  title: "Engineer / AI Researcher / Speaker",
  bio: `I work on AI security and developer tooling at the Ethereum Foundation. Before that, I led product at Cyfrin and developer relations at Alchemy, helping make Web3 more secure and accessible. I got into tech through robotics, CGI, and game engines, and I still care most about building things that make complex technology feel simple. When I'm not writing code, I'm sharing ideas on stage or in writing.`,
  email: "hello@vittoriorivabella.com",
} as const;

export const SOCIAL = {
  twitter: {
    label: "Twitter",
    url: "https://twitter.com/vittostack",
    handle: "@vittostack",
  },
  linkedin: {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/vittorio-rivabella/",
    handle: "vittorio-rivabella",
  },
  substack: {
    label: "Substack",
    url: "https://vittostack.substack.com",
    handle: "vittostack",
  },
  github: {
    label: "GitHub",
    url: "https://github.com/Eversmile12",
    handle: "Eversmile12",
  },
} as const;

export interface Client {
  name: string;
  role: string;
  period: string;
  url: string;
  type: "employer" | "client";
}

export const CLIENTS: Client[] = [
  {
    name: "Ethereum Foundation",
    role: "AI Coordinator",
    period: "",
    url: "https://ethereum.org",
    type: "employer",
  },
  {
    name: "Cyfrin",
    role: "Head of Product",
    period: "",
    url: "https://cyfrin.io",
    type: "employer",
  },
  {
    name: "Alchemy",
    role: "Lead Developer Relations",
    period: "",
    url: "https://alchemy.com",
    type: "employer",
  },
];

export interface Project {
  title: string;
  description: string;
  tags: string[];
  url: string;
}

export const PROJECTS: Project[] = [
  {
    title: "Neural Mesh",
    description:
      "Distributed inference engine for running large language models across heterogeneous hardware clusters with automatic model partitioning.",
    tags: ["Rust", "CUDA", "Distributed Systems"],
    url: "#",
  },
  {
    title: "Dither.js",
    description:
      "Real-time image dithering library using WebGL shaders. Supports Bayer, Floyd-Steinberg, and custom threshold matrices.",
    tags: ["WebGL", "TypeScript", "Computer Graphics"],
    url: "#",
  },
  {
    title: "Semantic Cache",
    description:
      "Embedding-based caching layer for LLM applications. Reduces API costs by 40% through semantic similarity matching of queries.",
    tags: ["Python", "Vector DB", "LLM"],
    url: "#",
  },
  {
    title: "Waveform",
    description:
      "Open-source audio analysis toolkit for ML pipelines. Spectrogram generation, feature extraction, and real-time streaming.",
    tags: ["Python", "Audio ML", "Open Source"],
    url: "#",
  },
];

export interface Talk {
  event: string;
  title: string;
  url?: string;
}

export const TALKS: Talk[] = [
  {
    event: "Stable Summit - Cannes",
    title: "Breaking and Defending AI: The State of Security in the Age of Agents",
  },
  {
    event: "SmartCon - Barcelona",
    title: "From Developer to Auditor: Building a Career in Smart Contract Security",
    url: "https://www.youtube.com/watch?v=v7hj-fxO-d8",
  },
  {
    event: "ETHDenver - Denver",
    title: "Bridging the Gap: Developer Relations and the Future of Web3 Adoption",
    url: "https://www.youtube.com/watch?v=Zg1Bb6S98IA",
  },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Speaking", href: "#speaking" },
  { label: "Writing", href: "#writing" },
] as const;
