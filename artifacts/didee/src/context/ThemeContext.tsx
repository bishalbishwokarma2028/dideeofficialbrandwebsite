import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = {
  id: string;
  name: string;
  description: string;
  accent: string;
  accentDark: string;
  bg: string;
  dots: [string, string, string];
  barColor: string;
  isLight?: boolean;
};

export const THEMES: Theme[] = [
  {
    id: "default",
    name: "Amber Gold",
    description: "Warm golden amber on a rich dark background",
    accent: "#C9A86A", accentDark: "#b8973a",
    bg: "linear-gradient(135deg, #1a1206 0%, #0f0a03 100%)",
    dots: ["#C9A86A", "#D4B97A", "#8B6914"],
    barColor: "#C9A86A",
  },
  {
    id: "black-and-white",
    name: "Black & White",
    description: "Pure monochrome — white backgrounds with bold black accents",
    accent: "#0a0a0a", accentDark: "#333333",
    bg: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
    dots: ["#0a0a0a", "#444444", "#cccccc"],
    barColor: "#0a0a0a",
    isLight: true,
  },
  {
    id: "neon-cyan",
    name: "Neon Cyan",
    description: "Electric cyan on deep dark — the default signature look",
    accent: "#00E5FF", accentDark: "#00B8D4",
    bg: "linear-gradient(135deg, #001a1f 0%, #000d10 100%)",
    dots: ["#00E5FF", "#40FFFF", "#00808A"],
    barColor: "#00E5FF",
  },
  {
    id: "purple-galaxy",
    name: "Purple Galaxy",
    description: "Vibrant violet on a deep cosmic dark",
    accent: "#BF5FFF", accentDark: "#9D4EDD",
    bg: "linear-gradient(135deg, #150820 0%, #0a0410 100%)",
    dots: ["#BF5FFF", "#D98FFF", "#7B2FBE"],
    barColor: "#BF5FFF",
  },
  {
    id: "green-matrix",
    name: "Green Matrix",
    description: "Neon green on near-black — hacker aesthetic",
    accent: "#00FF41", accentDark: "#00CC33",
    bg: "linear-gradient(135deg, #001a0a 0%, #000d05 100%)",
    dots: ["#00FF41", "#80FF90", "#006618"],
    barColor: "#00FF41",
  },
  {
    id: "crimson",
    name: "Crimson Red",
    description: "Bold red on dark — intense and powerful",
    accent: "#FF2D55", accentDark: "#CC0033",
    bg: "linear-gradient(135deg, #200008 0%, #100003 100%)",
    dots: ["#FF2D55", "#FF6680", "#991133"],
    barColor: "#FF2D55",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Deep sky blue on a dark navy — calm and professional",
    accent: "#0096FF", accentDark: "#0070CC",
    bg: "linear-gradient(135deg, #000d1a 0%, #00060f 100%)",
    dots: ["#0096FF", "#40AFFF", "#004080"],
    barColor: "#0096FF",
  },
  {
    id: "rose-pink",
    name: "Rose Pink",
    description: "Hot pink neon on dark — bold and vibrant",
    accent: "#FF007F", accentDark: "#CC0066",
    bg: "linear-gradient(135deg, #1a0010 0%, #0d0008 100%)",
    dots: ["#FF007F", "#FF60AF", "#990040"],
    barColor: "#FF007F",
  },
  {
    id: "electric-lime",
    name: "Electric Lime",
    description: "Neon yellow-green on pitch black — high contrast energy",
    accent: "#C8FF00", accentDark: "#A0CC00",
    bg: "linear-gradient(135deg, #101800 0%, #080d00 100%)",
    dots: ["#C8FF00", "#E0FF60", "#6E8C00"],
    barColor: "#C8FF00",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    description: "Vivid orange on deep dark — warm and energetic",
    accent: "#FF6B2B", accentDark: "#CC4400",
    bg: "linear-gradient(135deg, #1a0800 0%, #0f0400 100%)",
    dots: ["#FF6B2B", "#FF9060", "#993D00"],
    barColor: "#FF6B2B",
  },
  {
    id: "deep-violet",
    name: "Deep Violet",
    description: "Royal violet on near-black — mysterious and rich",
    accent: "#7B2FFF", accentDark: "#5500CC",
    bg: "linear-gradient(135deg, #0d0320 0%, #060010 100%)",
    dots: ["#7B2FFF", "#A870FF", "#3D0080"],
    barColor: "#7B2FFF",
  },
  {
    id: "arctic-teal",
    name: "Arctic Teal",
    description: "Icy teal on deep space dark — clean and futuristic",
    accent: "#00E5CC", accentDark: "#00B8A0",
    bg: "linear-gradient(135deg, #001a18 0%, #000d0b 100%)",
    dots: ["#00E5CC", "#60FFEE", "#007A6E"],
    barColor: "#00E5CC",
  },
  {
    id: "blood-moon",
    name: "Blood Moon",
    description: "Deep burgundy red — dark and dramatic",
    accent: "#FF3300", accentDark: "#CC2000",
    bg: "linear-gradient(135deg, #1a0500 0%, #0d0200 100%)",
    dots: ["#FF3300", "#FF7055", "#801A00"],
    barColor: "#FF3300",
  },
  {
    id: "solar-gold",
    name: "Solar Gold",
    description: "Bright gold on dark — regal and prestigious",
    accent: "#FFD700", accentDark: "#CCAC00",
    bg: "linear-gradient(135deg, #1a1500 0%, #0d0b00 100%)",
    dots: ["#FFD700", "#FFE860", "#806B00"],
    barColor: "#FFD700",
  },
  {
    id: "neon-mint",
    name: "Neon Mint",
    description: "Fresh mint green on dark — cool and refreshing",
    accent: "#00FF9F", accentDark: "#00CC7A",
    bg: "linear-gradient(135deg, #001a0f 0%, #000d07 100%)",
    dots: ["#00FF9F", "#60FFCA", "#007A45"],
    barColor: "#00FF9F",
  },
  {
    id: "sky-blue",
    name: "Sky Chill",
    description: "Bright sky blue — clean and modern",
    accent: "#38BEFF", accentDark: "#0096D4",
    bg: "linear-gradient(135deg, #001220 0%, #000912 100%)",
    dots: ["#38BEFF", "#80D8FF", "#006699"],
    barColor: "#38BEFF",
  },
  {
    id: "clean-white",
    name: "Clean White",
    description: "Pure white background with cyan accent — bright and minimal",
    accent: "#0096FF", accentDark: "#0070CC",
    bg: "linear-gradient(135deg, #E8F4FD 0%, #F0F8FF 100%)",
    dots: ["#0096FF", "#40B8FF", "#E0F0FF"],
    barColor: "#0096FF",
  },
  {
    id: "soft-light",
    name: "Soft Light",
    description: "Warm light gray with indigo accent — soft and professional",
    accent: "#4F46E5", accentDark: "#4338CA",
    bg: "linear-gradient(135deg, #EEF0F8 0%, #F4F5FA 100%)",
    dots: ["#4F46E5", "#8080F0", "#D0D3F5"],
    barColor: "#4F46E5",
  },
  {
    id: "copper",
    name: "Copper Age",
    description: "Warm copper — ancient meets modern",
    accent: "#D2691E", accentDark: "#A0521A",
    bg: "linear-gradient(135deg, #140900 0%, #0a0500 100%)",
    dots: ["#D2691E", "#E89060", "#7A3A10"],
    barColor: "#D2691E",
  },
  {
    id: "sakura",
    name: "Neon Sakura",
    description: "Soft neon cherry blossom on dark — delicate yet striking",
    accent: "#FF70B8", accentDark: "#E0509A",
    bg: "linear-gradient(135deg, #1a0015 0%, #0d000b 100%)",
    dots: ["#FF70B8", "#FFB0D8", "#991060"],
    barColor: "#FF70B8",
  },
  {
    id: "platinum",
    name: "Platinum Edition",
    description: "Luxury silver — premium and exclusive",
    accent: "#C0C0C0", accentDark: "#A0A0A0",
    bg: "linear-gradient(135deg, #0a0a0a 0%, #050505 100%)",
    dots: ["#C0C0C0", "#E0E0E0", "#606060"],
    barColor: "#C0C0C0",
  },
];

function buildThemeCSS(accent: string, accentDark: string, isLight?: boolean): string {
  const lightOverrides = isLight ? `
/* Black & White light mode overrides */
body { background-color: #ffffff !important; }
.bg-\\[\\#0a0a0a\\] { background-color: #ffffff !important; }
.bg-\\[\\#0d0d0d\\] { background-color: #ffffff !important; }
.bg-\\[\\#111\\] { background-color: #f5f5f5 !important; }
.bg-\\[\\#1a1a1a\\] { background-color: #f5f5f5 !important; }
.bg-\\[\\#161616\\] { background-color: #f5f5f5 !important; }
.bg-\\[\\#18181b\\] { background-color: #f5f5f5 !important; }
.text-white { color: #0a0a0a !important; }
.text-white\\/40 { color: rgba(10,10,10,0.4) !important; }
.text-white\\/45 { color: rgba(10,10,10,0.45) !important; }
.text-white\\/50 { color: rgba(10,10,10,0.5) !important; }
.text-white\\/60 { color: rgba(10,10,10,0.6) !important; }
.text-white\\/70 { color: rgba(10,10,10,0.7) !important; }
.text-white\\/80 { color: rgba(10,10,10,0.8) !important; }
.border-white\\/08 { border-color: rgba(0,0,0,0.08) !important; }
.border-white\\/10 { border-color: rgba(0,0,0,0.1) !important; }
.border-white\\/20 { border-color: rgba(0,0,0,0.2) !important; }
` : "";

  return `
.text-\\[\\#C9A86A\\] { color: ${accent} !important; }
.bg-\\[\\#C9A86A\\] { background-color: ${accent} !important; }
.border-\\[\\#C9A86A\\] { border-color: ${accent} !important; }
.fill-\\[\\#C9A86A\\] { fill: ${accent} !important; }
.stroke-\\[\\#C9A86A\\] { stroke: ${accent} !important; }
.outline-\\[\\#C9A86A\\] { outline-color: ${accent} !important; }
.hover\\:text-\\[\\#C9A86A\\]:hover { color: ${accent} !important; }
.hover\\:bg-\\[\\#C9A86A\\]:hover { background-color: ${accent} !important; }
.hover\\:border-\\[\\#C9A86A\\]:hover { border-color: ${accent} !important; }
.focus\\:border-\\[\\#C9A86A\\]:focus { border-color: ${accent} !important; }
.group:hover .group-hover\\:text-\\[\\#C9A86A\\] { color: ${accent} !important; }
.group:hover .group-hover\\:border-\\[\\#C9A86A\\] { border-color: ${accent} !important; }
.group:hover .group-hover\\:bg-\\[\\#C9A86A\\] { background-color: ${accent} !important; }
.bg-\\[\\#C9A86A\\]\\/10 { background-color: color-mix(in srgb, ${accent} 10%, transparent) !important; }
.bg-\\[\\#C9A86A\\]\\/15 { background-color: color-mix(in srgb, ${accent} 15%, transparent) !important; }
.bg-\\[\\#C9A86A\\]\\/20 { background-color: color-mix(in srgb, ${accent} 20%, transparent) !important; }
.border-\\[\\#C9A86A\\]\\/15 { border-color: color-mix(in srgb, ${accent} 15%, transparent) !important; }
.border-\\[\\#C9A86A\\]\\/20 { border-color: color-mix(in srgb, ${accent} 20%, transparent) !important; }
.border-\\[\\#C9A86A\\]\\/30 { border-color: color-mix(in srgb, ${accent} 30%, transparent) !important; }
.border-\\[\\#C9A86A\\]\\/50 { border-color: color-mix(in srgb, ${accent} 50%, transparent) !important; }
.border-\\[\\#C9A86A\\]\\/60 { border-color: color-mix(in srgb, ${accent} 60%, transparent) !important; }
.hover\\:bg-\\[\\#C9A86A\\]\\/10:hover { background-color: color-mix(in srgb, ${accent} 10%, transparent) !important; }
.hover\\:bg-\\[\\#C9A86A\\]\\/15:hover { background-color: color-mix(in srgb, ${accent} 15%, transparent) !important; }
.hover\\:border-\\[\\#C9A86A\\]\\/30:hover { border-color: color-mix(in srgb, ${accent} 30%, transparent) !important; }
.hover\\:bg-\\[\\#b8973a\\]:hover { background-color: ${accentDark} !important; }
.bg-\\[\\#b8973a\\] { background-color: ${accentDark} !important; }
${lightOverrides}`;
}

type ThemeCtx = {
  theme: Theme;
  setTheme: (id: string) => void;
};

const ThemeContext = createContext<ThemeCtx | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(() => {
    try { return localStorage.getItem("didee-theme") ?? "default"; } catch { return "default"; }
  });

  const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0];

  useEffect(() => {
    try { localStorage.setItem("didee-theme", themeId); } catch {}

    const existing = document.getElementById("didee-theme-css");
    if (existing) existing.remove();

    if (themeId !== "default") {
      const style = document.createElement("style");
      style.id = "didee-theme-css";
      style.textContent = buildThemeCSS(theme.accent, theme.accentDark, theme.isLight);
      document.head.appendChild(style);
    }
  }, [themeId, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
