import { useEffect, useState } from "react";
import logoImg from "@/assets/logo.png";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 500); // fade out duration (500ms)
      return () => clearTimeout(removeTimer);
    }, 2000); // display splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#005c21] via-[#029b39] to-[#01d14c] px-6 py-16 transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top spacer to align components */}
      <div />

      {/* Center Logo Area */}
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-[2.2rem] border-[5px] border-white/95 p-1 bg-transparent shadow-xl">
          <img
            src={logoImg}
            alt="Peronlite Logo"
            className="h-28 w-28 rounded-[1.7rem] object-cover"
          />
        </div>
      </div>

      {/* Bottom Brand Name */}
      <div className="mb-10 flex flex-col items-center">
        <h2
          className="text-4xl font-bold tracking-[0.25em] text-white"
          style={{ fontFamily: "'Rajdhani', 'Outfit', sans-serif" }}
        >
          PERON<span className="font-medium text-white/95">LITE</span>
        </h2>
      </div>
    </div>
  );
}
