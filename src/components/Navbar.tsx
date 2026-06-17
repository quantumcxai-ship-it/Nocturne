import React, { useState, useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const { isPlaying, playTrack, currentTrack, tracks } = useAudio();
  const navLinks = [
    { name: "Music", href: "#music" },
    { name: "Tour", href: "#tour" },
    { name: "Videos", href: "#videos" },
    { name: "Merch", href: "#merch" },
    { name: "EPK", href: "#epk" },
    { name: "Contact", href: "#contact" },
  ];

  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we are at the top
      setIsAtTop(currentScrollY < 50);
      
      if (currentScrollY <= 150) {
        // Keeping it visible for the first 150px
        setIsVisible(true);
      } else {
        // Hide on scroll down, show on scroll up (only if mobile menu is closed)
        if (!isOpen) {
          if (currentScrollY > lastScrollY.current) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        }
      }
      
      lastScrollY.current = currentScrollY;

      // Scroll Spy highlighting logic
      const sections = ["home", "music", "tour", "videos", "merch", "epk", "contact"];
      
      // Bottom out check: activate contact section if scrolled to the very end
      if (window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection("contact");
        return;
      }

      const scrollPosition = currentScrollY + window.innerHeight * 0.35;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 140, damping: 14 } },
    exit: { opacity: 0, y: 10 }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between select-none pointer-events-auto transition-all duration-500 ease-in-out ${
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0 pointer-events-none"
        } ${
          isAtTop && !isOpen
            ? "p-4 sm:p-5 bg-transparent border-transparent" 
            : "p-3 bg-[#0D0D0F]/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20"
        }`}
      >
        
        {/* Left: SVG Logo + Wordmark */}
        <a href="#home" className="flex items-center gap-2.5 z-50" onClick={() => setIsOpen(false)}>
          <svg 
            width="26" 
            height="26" 
            viewBox="0 0 256 256" 
            fill="#ffffff"
            className="w-6.5 h-6.5"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic font-medium tracking-tight">
            Nocturne
          </span>
        </a>

        {/* Center navigation glass pill (hidden on mobile) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1 items-center gap-0.5 shadow-2xl">
          <a 
            href="#home" 
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeSection === "home"
                ? "bg-white text-black shadow-md"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            Home
          </a>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === link.href.substring(1)
                  ? "bg-white text-black shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right (desktop only): Listen Action button */}
        <div className="hidden md:block z-50">
          <a 
            href="#music"
            onClick={(e) => {
              e.preventDefault();
              if (!isPlaying) {
                playTrack(currentTrack || tracks[0]);
              }
              const musicSection = document.getElementById("music");
              if (musicSection) {
                musicSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
          >
            Listen Now
          </a>
        </div>

        {/* Mobile menu and indicator */}
        <div className="md:hidden z-50 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
            </span>
            <span className="font-mono text-[9px] tracking-wider text-white font-bold select-none">
              LIVE
            </span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-accent-cyan active:scale-95 transition-all p-1"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>

      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center gap-7 md:hidden pt-20"
          >
            <motion.a
              variants={itemVariants}
              href="#home"
              onClick={() => setIsOpen(false)}
              className={`font-display uppercase tracking-widest text-2xl transition-colors ${
                activeSection === "home" ? "text-accent-cyan font-bold" : "text-white/95 hover:text-accent-red"
              }`}
            >
              Home
            </motion.a>
            {navLinks.map((link) => (
              <motion.a
                variants={itemVariants}
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-display uppercase tracking-widest text-2xl transition-colors ${
                  activeSection === link.href.substring(1) ? "text-accent-cyan font-bold" : "text-white/95 hover:text-accent-red"
                }`}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
