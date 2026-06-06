import { useTheme, THEMES } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

function ThemeCard({ themeData, isActive, onApply }: {
  themeData: typeof THEMES[0];
  isActive: boolean;
  onApply: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onApply}
      className="relative cursor-pointer overflow-hidden"
      style={{
        borderRadius: 12,
        border: isActive
          ? `2px solid ${themeData.accent}`
          : "2px solid rgba(255,255,255,0.08)",
        boxShadow: isActive
          ? `0 0 24px ${themeData.accent}40, 0 0 8px ${themeData.accent}20`
          : "0 4px 24px rgba(0,0,0,0.4)",
        background: "#111",
        transition: "box-shadow 0.3s, border-color 0.3s",
      }}
    >
      {isActive && (
        <div
          className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
          style={{ background: themeData.accent, color: "#000", borderRadius: 4 }}
        >
          <Check className="w-2.5 h-2.5" />
          Active
        </div>
      )}

      {/* Preview area */}
      <div
        className="relative h-[140px] overflow-hidden flex items-center justify-center"
        style={{ background: themeData.bg }}
      >
        <div
          className="absolute rounded-full blur-2xl opacity-30"
          style={{ background: themeData.dots[0], width: 80, height: 80, top: "20%", left: "30%" }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{ background: themeData.dots[1], width: 60, height: 60, top: "30%", left: "55%" }}
        />

        <div className="flex items-center gap-4 relative z-10">
          <div
            className="rounded-full shadow-lg"
            style={{ width: 48, height: 48, background: themeData.dots[0], boxShadow: `0 0 20px ${themeData.dots[0]}80` }}
          />
          <div
            className="rounded-full"
            style={{ width: 34, height: 34, background: themeData.dots[1], boxShadow: `0 0 14px ${themeData.dots[1]}60` }}
          />
          <div
            className="rounded-full"
            style={{ width: 22, height: 22, background: themeData.dots[2], boxShadow: `0 0 10px ${themeData.dots[2]}60` }}
          />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${themeData.barColor} 30%, ${themeData.barColor} 70%, transparent 100%)`,
            boxShadow: `0 0 12px ${themeData.barColor}`,
          }}
        />
      </div>

      {/* Info */}
      <div className="px-4 py-3.5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[13px] font-bold text-white">{themeData.name}</p>
          <div
            className="w-4 h-4 rounded-full border border-white/20"
            style={{ background: themeData.accent, boxShadow: `0 0 8px ${themeData.accent}80` }}
          />
        </div>
        <p className="text-[11px] text-white/45 leading-relaxed mb-2.5">{themeData.description}</p>
        <p
          className="text-[11px] font-semibold"
          style={{ color: isActive ? themeData.accent : "rgba(255,255,255,0.35)" }}
        >
          {isActive ? "✓ Currently active" : "Click to apply →"}
        </p>
      </div>
    </motion.div>
  );
}

export default function AdminThemes() {
  const { theme: activeTheme, setTheme } = useTheme();

  return (
    <div className="p-8 min-h-screen" style={{ background: "#0d0d0d" }}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white">Site Themes</h1>
        <p className="text-white/40 text-sm mt-1">
          Choose an accent color theme for the entire DIDEE storefront. Changes apply instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEMES.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <ThemeCard
              themeData={t}
              isActive={activeTheme.id === t.id}
              onApply={() => setTheme(t.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
