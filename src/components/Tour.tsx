import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

interface TourItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: "TICKETS" | "SOLD OUT";
  imageSrc: string;
  href?: string;
}

export const Tour: React.FC = () => {
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<number | null>(null);

  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const pos = useRef({ x: 0, y: 0, scale: 0.8, opacity: 0, rotate: 0, skew: 0 });

  // Drag-to-scroll variables
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startClientX = useRef(0);
  const scrollLeft = useRef(0);
  const wasDragging = useRef(false);
  const targetScrollLeft = useRef(0);
  const isAnimatingScroll = useRef(false);

  const handleScrollProgress = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    const progress = container.scrollLeft / maxScroll;
    setScrollProgress(progress);

    // Sync target scroll position if we are not programmatically animating the scroll
    if (!isAnimatingScroll.current) {
      targetScrollLeft.current = container.scrollLeft;
    }
  };

  const tourItems: TourItem[] = [
    {
      id: "u1",
      title: "BERGHAIN / KANTERA",
      description: "Catch our exclusive modular noise and dark ambient set in the cathedral of techno.",
      date: "JUL 24",
      location: "BERLIN",
      status: "TICKETS",
      imageSrc: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
      href: "https://tickets.example.com",
    },
    {
      id: "u2",
      title: "FABRIC ELECTRONIC",
      description: "A high-energy industrial techno take-over with full-room immersive visual synthesis.",
      date: "AUG 08",
      location: "LONDON",
      status: "TICKETS",
      imageSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
      href: "https://tickets.example.com",
    },
    {
      id: "u3",
      title: "DEKMANTEL FESTIVAL",
      description: "Headlining the modular synthesizer live stage beneath the forest canopy.",
      date: "AUG 14",
      location: "AMSTERDAM",
      status: "SOLD OUT",
      imageSrc: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    },
    {
      id: "u4",
      title: "SONAR BY NIGHT",
      description: "A specialized midnight performance featuring real-time generative glitch imagery.",
      date: "AUG 28",
      location: "BARCELONA",
      status: "TICKETS",
      imageSrc: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80",
      href: "https://tickets.example.com",
    },
    {
      id: "u5",
      title: "OUTPUT VOID",
      description: "Closing out the summer tour in Brooklyn's most renowned underground dark warehouse.",
      date: "SEP 12",
      location: "BROOKLYN",
      status: "TICKETS",
      imageSrc: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
      href: "https://tickets.example.com",
    }
  ];

  // Mousemove handler to record coordinates relative to section
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Position of cursor relative to section
    mouse.current.targetX = e.clientX - rect.left;
    mouse.current.targetY = e.clientY - rect.top;

    // Drag scroll logic
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // multiplier for drag speed
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;

    // Check if dragging has occurred (threshold of 6px)
    if (Math.abs(e.clientX - startClientX.current) > 6) {
      wasDragging.current = true;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = e.pageX - container.offsetLeft;
    startClientX.current = e.clientX;
    scrollLeft.current = container.scrollLeft;
    wasDragging.current = false;
    container.style.cursor = "grabbing";
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    mouse.current.active = false;
    setDisplayImage(null);
    isDragging.current = false;
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
    }
  };

  const handleRowClick = (href?: string) => {
    if (href && href !== "#") {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const setHoverImage = (newImageSrc: string | null) => {
    setDisplayImage(newImageSrc);
  };

  // Setup wheel scroll listener and spring physics loop
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      if (!followerRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Check viewport size - disable follower physics on mobile screens to preserve touch usability
      if (window.innerWidth < 768) {
        followerRef.current.style.opacity = "0";
        rafId = requestAnimationFrame(tick);
        return;
      }

      const targetX = mouse.current.targetX;
      const targetY = mouse.current.targetY;

      // DX and DY spring offsets
      const dx = targetX - pos.current.x;
      const dy = targetY - pos.current.y;

      // Position update with spring interpolation
      pos.current.x += dx * 0.085;
      pos.current.y += dy * 0.085;

      // Scale & opacity updates (instant visual hover, no scale shrink break)
      const targetScale = mouse.current.active ? 1.0 : 0.4;
      const targetOpacity = mouse.current.active ? 1.0 : 0;

      pos.current.scale += (targetScale - pos.current.scale) * 0.12;
      pos.current.opacity += (targetOpacity - pos.current.opacity) * 0.12;

      // Velocity calculation based on spring movement rate
      const vx = dx * 0.085;
      const targetRotate = Math.max(-12, Math.min(12, vx * 0.35)); // clamp rotation between -12 and +12 degrees
      const targetSkew = Math.max(-8, Math.min(8, vx * 0.2));     // clamp skew between -8 and +8 degrees

      // Interpolate rotation/skew
      pos.current.rotate += (targetRotate - pos.current.rotate) * 0.1;
      pos.current.skew += (targetSkew - pos.current.skew) * 0.1;

      // Shift translations so the card centers exactly on the cursor (card is 220px wide and 280px tall)
      const cardX = pos.current.x - 110;
      const cardY = pos.current.y - 140;

      followerRef.current.style.transform = `translate3d(${cardX}px, ${cardY}px, 0) scale(${pos.current.scale}) rotate(${pos.current.rotate}deg) skewX(${pos.current.skew}deg)`;
      followerRef.current.style.opacity = `${pos.current.opacity}`;

      // Smooth scroll interpolation
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const targetScroll = targetScrollLeft.current;
        const currentScroll = scrollContainer.scrollLeft;
        const diffScroll = targetScroll - currentScroll;
        
        if (Math.abs(diffScroll) > 0.5) {
          scrollContainer.scrollLeft += diffScroll * 0.15;
          isAnimatingScroll.current = true;
        } else {
          if (isAnimatingScroll.current) {
            scrollContainer.scrollLeft = targetScroll;
            isAnimatingScroll.current = false;
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    tick();

    // Scroll listener to hide image immediately on page scroll
    const handleScroll = () => {
      mouse.current.active = false;
      setDisplayImage(null);
      if (leaveTimeoutRef.current) {
        window.clearTimeout(leaveTimeoutRef.current);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Wheel listener for horizontal dates scrolling (restricted to dates scroll container)
    const scrollContainerElement = scrollContainerRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (!scrollContainerElement) return;
      
      const maxScroll = scrollContainerElement.scrollWidth - scrollContainerElement.clientWidth;
      if (maxScroll <= 0) return;

      // Check if we can scroll horizontally in the target direction
      const canScrollDown = e.deltaY > 0 && targetScrollLeft.current < maxScroll;
      const canScrollUp = e.deltaY < 0 && targetScrollLeft.current > 0;

      if (canScrollDown || canScrollUp) {
        e.preventDefault();
        
        // Update target scroll position
        targetScrollLeft.current = Math.max(0, Math.min(maxScroll, targetScrollLeft.current + e.deltaY * 0.8));
        isAnimatingScroll.current = true;
      }
    };

    if (scrollContainerElement) {
      scrollContainerElement.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      if (scrollContainerElement) {
        scrollContainerElement.removeEventListener("wheel", handleWheel);
      }
      if (leaveTimeoutRef.current) {
        window.clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="tour" 
      className="w-full bg-[#0D0D0F] py-28 md:py-36 px-6 md:px-12 relative z-20 overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Centered fine dividing line at the top boundary */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 max-w-xs h-[1px] bg-white/10" />
      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative">
        
        {/* Title / Section Header (Centered) */}
        <motion.div 
          className="text-center mb-10 flex flex-col items-center justify-center"
          {...fadeUp(0.1)}
        >
          <span className="font-mono text-xs tracking-[4px] uppercase text-accent-red font-bold block mb-2">
            LIVE EVENTS
          </span>
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tight text-white uppercase leading-none pb-2">
            TOUR <span className="font-serif italic font-normal text-accent-cyan lowercase">dates</span>
          </h2>
        </motion.div>

        {/* Center Mockup Tour Dates Box */}
        <motion.div 
          className="max-w-4xl mx-auto w-full flex flex-col relative"
          {...fadeUp(0.2)}
        >
          {/* Mockup Top Header Bar */}
          <div className="tour-top-header flex justify-between items-center border-b border-white/20 pb-4 mb-2">
            <div className="flex items-center gap-3">
              {/* Nocturne Logo Symbol */}
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 256 256" 
                fill="#ffffff"
                className="w-5.5 h-5.5 text-white"
              >
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
              <div className="text-left font-mono text-[10px] sm:text-xs tracking-wider text-white/90 uppercase leading-tight">
                <span className="font-bold">NOCTURNE:</span>
                <span className="text-white/60 ml-1.5">WORLD TOUR 2026</span>
              </div>
            </div>
            <span className="font-mono text-[10px] sm:text-xs tracking-widest text-white/60 uppercase">
              Industrial_Void™
            </span>
          </div>

          {/* Tour List Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onScroll={handleScrollProgress}
            className="flex flex-row w-full border-t border-b border-white/20 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
          >
            {tourItems.map((item, index) => (
              <motion.div
                key={item.id}
                {...fadeUp(0.2 + index * 0.08)}
                onClick={() => {
                  if (wasDragging.current) {
                    wasDragging.current = false;
                    return;
                  }
                  handleRowClick(item.href);
                }}
                className={`snap-start flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] min-h-[380px] p-8 flex flex-col justify-between border-r border-white/20 group transition-colors duration-300 ${
                  index === 0 ? "border-l border-white/20" : ""
                } ${
                  item.status === "SOLD OUT" ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {/* Card Header: Huge Date (Restricted Hover - Hover effect only triggers here) */}
                <div 
                  className="flex flex-col items-start cursor-pointer group/date"
                  onMouseEnter={() => {
                    if (leaveTimeoutRef.current) {
                      window.clearTimeout(leaveTimeoutRef.current);
                    }
                    setHoverImage(item.imageSrc);
                    mouse.current.active = true;
                  }}
                  onMouseLeave={() => {
                    leaveTimeoutRef.current = window.setTimeout(() => {
                      mouse.current.active = false;
                      setDisplayImage(null);
                    }, 100); // 100ms debounce buffer for seamless transitions
                  }}
                >
                  <span className="font-mono text-xs tracking-[4px] uppercase text-accent-red font-bold mb-1">
                    {item.date.split(" ")[0]}
                  </span>
                  <span className="font-display font-black text-white group-hover/date:text-accent-cyan transition-colors duration-300 text-6xl sm:text-7xl md:text-8xl leading-none uppercase tracking-tighter">
                    {item.date.split(" ")[1]}
                  </span>
                </div>

                {/* Card Footer: Location and Status (Hover does not trigger image follower) */}
                <div className="flex flex-col items-start gap-2 text-left pointer-events-none mt-8">
                  <span className="font-mono text-base sm:text-lg md:text-xl tracking-widest text-white/80 group-hover:text-accent-red transition-colors duration-300 uppercase font-black">
                    {item.location}
                  </span>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  {item.status === "SOLD OUT" ? (
                    <span className="font-mono text-[10px] tracking-wider text-white/40 uppercase mt-2">
                      SOLD OUT
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] tracking-wider text-accent-cyan font-bold uppercase animate-pulse mt-2">
                      TICKETS AVAILABLE
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Progress Bar */}
          <div className="w-full h-[2px] bg-white/10 mt-6 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-red to-accent-cyan transition-all duration-100 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Mockup Bottom Footer Bar */}
          <div className="tour-bottom-footer flex justify-between items-center pt-5 mt-2 font-mono text-[10px] sm:text-xs text-white/50 tracking-wider">
            <span className="font-display font-black text-white text-sm sm:text-base tracking-widest uppercase">
              NOCTURNE
            </span>
            <span>
              Experience: <span className="text-white/85">CLOUD CHAMBER</span>
            </span>
          </div>

        </motion.div>

      </div>

      {/* Floating Follower Card with Spring Physics (Hidden on Mobile) */}
      <div
        ref={followerRef}
        className="absolute top-0 left-0 w-[220px] h-[280px] rounded-xl overflow-hidden pointer-events-none z-50 border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] bg-neutral-950"
        style={{ opacity: 0, transform: "scale(0.8)", willChange: "transform, opacity" }}
      >
        {displayImage && (
          <img
            src={displayImage}
            alt="Venue location preview"
            className="tour-follower-img w-full h-full object-cover filter grayscale contrast-125 brightness-90 transition-transform duration-300"
            style={{ willChange: "transform, opacity" }}
          />
        )}
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 pointer-events-none" />
      </div>
    </section>
  );
};
