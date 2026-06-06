import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";

const LOGO_PATH = "/logo.jpg";

export function LogoPageTransition() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const prevLocation = useRef(location);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      prevLocation.current = location;
      return;
    }
    if (prevLocation.current === location) return;
    prevLocation.current = location;

    // Skip logo animation for admin pages — they need instant navigation
    if (location.startsWith("/admin")) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), 900);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [location]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="logo-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {/* 3D spinning logo container */}
          <motion.div
            initial={{ rotateY: -90, opacity: 0, scale: 0.7 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 90, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              perspective: "600px",
              transformStyle: "preserve-3d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Logo image with 3D spin */}
            <motion.div
              animate={{ rotateZ: [0, 8, -8, 0] }}
              transition={{ duration: 0.55, ease: "easeInOut", delay: 0.05 }}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(201,168,106,0.6)",
                boxShadow: "0 0 40px rgba(201,168,106,0.25)",
                flexShrink: 0,
              }}
            >
              <img
                src={LOGO_PATH}
                alt="DIDEE"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.3 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                fontWeight: 600,
                letterSpacing: "0.35em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              DIDEE
            </motion.div>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
              style={{
                height: 1,
                width: 60,
                background: "linear-gradient(90deg, transparent, #C9A86A, transparent)",
                transformOrigin: "center",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
