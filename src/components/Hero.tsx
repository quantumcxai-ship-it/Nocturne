import React, { useState, useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";
import { motion } from "framer-motion";

const BG_IMAGE_1 = "https://i.postimg.cc/d1X15KSH/Base-Image.png";
const BG_IMAGE_2 = "https://i.postimg.cc/QCTMPn2M/Reveal-Image.png";
const SPOTLIGHT_R = 380;

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

const RevealLayer: React.FC<RevealLayerProps> = ({ image, cursorX, cursorY }) => {
  if (cursorX === -999) return null;

  const maskStyle: React.CSSProperties = {
    backgroundImage: `url(${image})`,
    maskImage: `radial-gradient(circle ${SPOTLIGHT_R}px at ${cursorX}px ${cursorY}px, black 0%, black 40%, rgba(0, 0, 0, 0.75) 60%, rgba(0, 0, 0, 0.4) 75%, rgba(0, 0, 0, 0.12) 88%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_R}px at ${cursorX}px ${cursorY}px, black 0%, black 40%, rgba(0, 0, 0, 0.75) 60%, rgba(0, 0, 0, 0.4) 75%, rgba(0, 0, 0, 0.12) 88%, transparent 100%)`,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
  };

  return (
    <div
      className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
      style={maskStyle}
    />
  );
};

export const Hero: React.FC = () => {
  const { tracks, playTrack } = useAudio();
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [hasHoveredFace, setHasHoveredFace] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Snap smooth reference directly to first coordinate if initialized offscreen
      if (smooth.current.x === -999) {
        smooth.current = { x: e.clientX, y: e.clientY };
      }

      // Check if cursor is hovering over the portrait face in the center of the screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
      
      // Face hover target zone (190px radius / 380px diameter)
      if (dist < 190) {
        setHasHoveredFace(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const updateSpotlight = () => {
      if (mouse.current.x !== -999) {
        smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
        smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
        setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      }
      rafRef.current = requestAnimationFrame(updateSpotlight);
    };
    rafRef.current = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseLeave = () => {
    setHasHoveredFace(false);
  };

  const handleStartListening = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
    // Scroll to music section
    const musicSection = document.getElementById("music");
    if (musicSection) {
      musicSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden h-screen bg-black"
      style={{ height: "100dvh" }}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Base Image Layer */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />

      {/* 2. Reveal Image Layer (with pure CSS spotlight mask) */}
      <RevealLayer 
        image={BG_IMAGE_2}
        cursorX={cursorPos.x}
        cursorY={cursorPos.y}
      />

      {/* Bottom Gradient Fade to next section's background (#0D0D0F) */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/60 to-transparent z-40 pointer-events-none" />

      {/* 3. Heading (Z-50, no pointer events to prevent blocking mouse) */}
      <motion.div 
        layout
        className={`absolute top-[14%] flex flex-col px-5 pointer-events-none z-50 ${
          hasHoveredFace 
            ? "left-10 md:left-14 right-auto items-start text-left" 
            : "left-0 right-0 items-center text-center"
        }`}
        animate={{ 
          opacity: 1, 
          scale: hasHoveredFace ? 0.92 : 1,
          filter: "blur(0px)"
        }}
        transition={{ 
          layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }}
      >
        <h1 className="text-white leading-[1.1] pb-3">
          <motion.span
            layout
            className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl"
            style={{ letterSpacing: "-0.05em" }}
            initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ 
              default: { duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] },
              layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            Sound of the
          </motion.span>
          <motion.span
            layout
            className="block font-normal text-5xl sm:text-7xl md:text-8xl uppercase font-display"
            style={{ letterSpacing: "-0.08em" }}
            initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ 
              default: { duration: 1.1, delay: 0.42, ease: [0.16, 1, 0.3, 1] },
              layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            charcoal void.
          </motion.span>
        </h1>
      </motion.div>

      {/* 4. Bottom-Left Paragraph (Z-50) */}
      <motion.div 
        className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-sm text-white/80 leading-relaxed font-sans">
          Every wave of synthesis records a chapter of our movement, from analog modular grids to drifting noise, layered across the void.
        </p>
      </motion.div>

      {/* 5. Bottom-Right block (Z-50, clickable buttons) */}
      <motion.div 
        className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
          Our audio-visual sets let you peel back the frequencies to trace how waves, glitch syntheses, and deep time combine to shape the space around you.
        </p>
        <button
          onClick={handleStartListening}
          className="bg-accent-red hover:bg-[#d92251] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-accent-red/30 uppercase tracking-widest font-mono text-[11px]"
        >
          Start Listening
        </button>
      </motion.div>

    </section>
  );
};
