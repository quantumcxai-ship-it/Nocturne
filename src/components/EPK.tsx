import React, { useEffect, useRef } from "react";
import { Download, FileText, Image as ImageIcon, Heart, Volume2, Share2, ArrowLeft, UserPlus, Menu, LayoutGrid, Play } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const EPK: React.FC = () => {
  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);

  const downloadAssets = [
    {
      name: "HI-RES PRESS PHOTOS.ZIP",
      size: "42.5 MB",
      icon: <ImageIcon className="w-3.5 h-3.5 text-accent-cyan" />,
      link: "#",
    },
    {
      name: "ARTIST BIO & EPK.PDF",
      size: "3.2 MB",
      icon: <FileText className="w-3.5 h-3.5 text-accent-cyan" />,
      link: "#",
    },
    {
      name: "TECHNICAL RIDER & INPUT LIST.PDF",
      size: "1.8 MB",
      icon: <FileText className="w-3.5 h-3.5 text-accent-cyan" />,
      link: "#",
    }
  ];

  useEffect(() => {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const cards = [card1Ref.current, card2Ref.current, card3Ref.current];

    // 1. Entrance staggered animation on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#epk",
        start: "top 75%",
        toggleActions: "play none none none",
      }
    });

    tl.fromTo(
      cards,
      {
        y: 100,
        opacity: 0,
        rotateX: -20,
        rotateY: -10,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
        clearProps: "transform,perspective,transformStyle",
      }
    );

    // 2. 3D Mouse Parallax Tilt Animation
    const cleanups: (() => void)[] = [];

    cards.forEach((card) => {
      if (!card) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        
        // Calculate pointer coordinates inside the card container
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Normalized delta coords (-1 to 1)
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Rotation amounts (caps at 12 degrees tilt)
        const rotX = -deltaY * 12;
        const rotY = deltaX * 12;

        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          scale: 1.025,
          perspective: 1000,
          transformStyle: "preserve-3d",
          ease: "power2.out",
          duration: 0.5,
          boxShadow: `0 35px 70px rgba(0, 0, 0, 0.95), ${deltaX * -15}px ${deltaY * -15}px 30px rgba(0, 240, 255, 0.05)`,
        });
      };

      const handleMouseLeave = () => {
        // Reset translation state smoothly
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          ease: "power3.out",
          duration: 0.8,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    return () => {
      // Kill the timeline's scrolltrigger instance
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      // Run hover listener cleanups
      cleanups.forEach((cb) => cb());
    };
  }, []);

  return (
    <section 
      id="epk" 
      className="w-full bg-gradient-to-b from-black via-[#0D0D0F] to-black py-28 md:py-36 px-6 relative z-20"
    >
      {/* Centered fine dividing line at the top boundary */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 max-w-xs h-[1px] bg-white/10" />

      {/* Centered fine dividing line at the bottom boundary */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 max-w-xs h-[1px] bg-white/10" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center gap-4 border-b border-white/5 pb-10 w-full">
          <span className="font-mono text-xs tracking-[4px] uppercase text-accent-cyan font-bold block mb-2">
            PRESS MATERIAL
          </span>
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tight text-white uppercase leading-none pb-3">
            EPK <span className="font-serif italic font-normal text-accent-red lowercase">press kit</span>
          </h2>
          <p className="max-w-xl font-sans text-muted-foreground text-sm leading-relaxed text-center mt-2">
            Resources for promoters, press outlets, booking agents, and venues. Access promotional photos and technical files.
          </p>
        </div>

        {/* Mockups Grid Container (3D perspective context added) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center [perspective:1200px]">
          
          {/* SCREEN 1: Left Mockup (News Portal Feed) */}
          <div 
            ref={card1Ref}
            className="w-full max-w-[340px] min-h-[640px] bg-[#0E0D10] border-2 border-white/10 rounded-[32px] overflow-hidden flex flex-col justify-between p-4 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-glow-cyan/5 group will-change-transform"
          >
            {/* Status Bar */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono px-2 pt-1">
              <span>00:52</span>
              <div className="flex gap-1.5 items-center">
                <span>5G</span>
                <div className="w-4 h-2 border border-muted-foreground/50 rounded-sm relative flex items-center p-0.5">
                  <div className="w-full h-full bg-muted-foreground/80 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* App Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
              <span className="font-display font-black text-sm text-white tracking-widest">N_NEWS</span>
              <Menu className="w-4 h-4 text-white cursor-pointer hover:text-accent-cyan transition-colors" />
            </div>

            {/* Category Navigation Strip */}
            <div className="flex justify-between items-center py-2 text-[9px] font-mono font-bold text-muted-foreground border-b border-white/5 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
              <span className="text-white hover:text-accent-cyan cursor-pointer">SOUNDS</span>
              <span className="hover:text-accent-cyan cursor-pointer">HARDWARE</span>
              <span className="hover:text-accent-cyan cursor-pointer">TOURS</span>
              <span className="hover:text-accent-cyan cursor-pointer">PRESS</span>
              <span className="hover:text-accent-cyan cursor-pointer">GEAR</span>
            </div>

            {/* Content Feed */}
            <div className="flex-1 py-4 flex flex-col gap-3 text-left">
              {/* Tag Block */}
              <span className="bg-accent-cyan text-black px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider w-max border border-black shadow-[1px_1px_0px_#000]">
                HEADLINE
              </span>
              
              {/* Headline */}
              <h3 className="font-display font-black text-lg text-white leading-tight mt-1 hover-glitch">
                —Nocturne vows to codify Berlin 'Static Noise'
              </h3>

              {/* Main Image Block */}
              <div className="relative border-2 border-white/20 rounded-lg overflow-hidden h-[160px] mt-1 group-hover:border-accent-cyan/40 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80" 
                  alt="Nocturne Live Gear"
                  className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 bg-black border border-white/10 p-1.5 rounded-md">
                  <ImageIcon className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Excerpt */}
              <p className="font-sans text-muted-foreground text-[11px] leading-relaxed">
                Alex Mercer announces a transition to custom-built hardware for the upcoming 2026 tour, bringing analog synthesizers and modular chaos to... <span className="text-white hover:text-accent-cyan cursor-pointer font-bold">More</span>
              </p>

              {/* Interaction Details */}
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono pt-1">
                <div className="flex gap-3">
                  <Heart className="w-3.5 h-3.5 hover:text-accent-red cursor-pointer transition-colors" />
                  <Volume2 className="w-3.5 h-3.5 hover:text-accent-cyan cursor-pointer transition-colors" />
                </div>
                <span>17 hour ago</span>
              </div>
            </div>

            {/* Secondary News Row */}
            <div className="border-t border-white/5 py-3 flex gap-3 text-left items-center">
              <div className="w-10 h-10 border border-white/10 rounded-md overflow-hidden bg-black shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1553484771-047a44eee27f?w=300&q=80" 
                  alt="Glitch Synth" 
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-accent-cyan font-mono text-[8px] font-bold">GEAR</span>
                <p className="font-sans text-white text-[10px] font-bold truncate w-[190px]">
                  Custom glitch synthesizers built for live stage...
                </p>
              </div>
            </div>

            {/* Bottom Nav Bar */}
            <div className="border-t border-white/5 pt-3 pb-1 flex justify-around items-center">
              <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                <LayoutGrid className="w-4 h-4 text-accent-cyan" />
                <span className="text-[7px] font-mono font-bold text-accent-cyan uppercase">HOME</span>
              </div>
              <Play className="w-4 h-4 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
              <Volume2 className="w-4 h-4 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
              <div className="w-4 h-4 rounded-full border border-muted-foreground overflow-hidden">
                <img src="/avatar-1.png" className="w-full h-full object-cover grayscale" alt="Profile" />
              </div>
            </div>
          </div>

          {/* SCREEN 2: Middle Mockup (Promotional & Asset Download) */}
          <div 
            ref={card2Ref}
            className="w-full max-w-[340px] min-h-[640px] bg-[#0A090B] border-2 border-white/10 rounded-[32px] overflow-hidden flex flex-col justify-between p-4 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-glow-red/5 group will-change-transform"
          >
            {/* Status Bar */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono px-2 pt-1">
              <span>00:52</span>
              <div className="flex gap-1.5 items-center">
                <span>5G</span>
                <div className="w-4 h-2 border border-muted-foreground/50 rounded-sm relative flex items-center p-0.5">
                  <div className="w-full h-full bg-muted-foreground/80 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* App Logo */}
            <div className="text-center mt-3">
              <span className="font-display font-black text-xs text-[#555555] tracking-[6px] uppercase">
                NOCTURNE EPK
              </span>
            </div>

            {/* Hero CTA Area */}
            <div className="flex-1 flex flex-col justify-center gap-5 text-left py-6">
              <h3 className="font-display font-black text-3xl text-white leading-none tracking-tight">
                Latest archive<br />
                with <span className="inline-block bg-accent-red text-black border-2 border-black px-2 py-0.5 shadow-[3px_3px_0px_#000] rotate-[-2deg] font-black uppercase text-base">EPK</span> material
              </h3>
              
              <p className="font-sans text-muted-foreground text-[11px] leading-relaxed max-w-[260px]">
                Browse the best audio-visual files, live strategies, high-resolution press photos, and technical riders.
              </p>

              {/* Direct Download Button */}
              <a 
                href="#" 
                className="bg-accent-cyan text-black border-2 border-black font-display font-black text-[11px] uppercase tracking-wider px-5 py-2.5 shadow-[4px_4px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center justify-between gap-4 w-max cursor-pointer active:translate-y-[4px]"
              >
                <span>DOWNLOAD ALL ASSETS</span>
                <Download className="w-3.5 h-3.5 stroke-[3]" />
              </a>
            </div>

            {/* Rotated Newspaper Interactive Graphic */}
            <div className="relative w-full h-[220px] overflow-hidden select-none">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-15px] w-[260px] bg-[#EBE9E4] text-[#1A1A1A] p-4 border-2 border-black rotate-[-8deg] shadow-[6px_6px_0px_#000] flex flex-col gap-2 transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_#000]">
                <div className="border-b border-black pb-1.5 flex justify-between items-center">
                  <span className="font-mono text-[9px] font-black tracking-widest text-[#333]">DAILY PRESS</span>
                  <span className="font-mono text-[8px] font-bold text-[#555]">EST. 2026</span>
                </div>
                <div className="text-center my-0.5">
                  <h4 className="font-display font-black text-[22px] tracking-tighter leading-none text-black">
                    GOOD NOISE!
                  </h4>
                </div>
                <div className="border-t border-black pt-2 flex flex-col gap-2">
                  <span className="font-mono text-[7px] text-[#555] uppercase tracking-wider block font-bold border-b border-black/10 pb-0.5">
                    CLICK TO DOWNLOAD
                  </span>
                  {downloadAssets.map((asset, idx) => (
                    <a
                      key={idx}
                      href={asset.link}
                      download
                      className="flex items-center justify-between hover:underline group text-left cursor-pointer"
                    >
                      <span className="font-mono text-[9px] font-black truncate pr-3 text-black group-hover:text-accent-red transition-colors">
                        {asset.name}
                      </span>
                      <span className="font-mono text-[8px] text-[#555555] shrink-0 font-bold">
                        {asset.size}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SCREEN 3: Right Mockup (Review Detail & Key Points) */}
          <div 
            ref={card3Ref}
            className="w-full max-w-[340px] min-h-[640px] bg-[#0E0D10] border-2 border-white/10 rounded-[32px] overflow-hidden flex flex-col justify-between p-4 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-glow-cyan/5 group will-change-transform"
          >
            {/* Status Bar */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono px-2 pt-1">
              <span>00:52</span>
              <div className="flex gap-1.5 items-center">
                <span>5G</span>
                <div className="w-4 h-2 border border-muted-foreground/50 rounded-sm relative flex items-center p-0.5">
                  <div className="w-full h-full bg-muted-foreground/80 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Navigation Header */}
            <div className="flex justify-between items-center py-2 border-b border-white/5 mt-2">
              <ArrowLeft className="w-4 h-4 text-white cursor-pointer hover:text-accent-cyan transition-colors" />
              <div className="flex gap-3.5 text-white">
                <span className="font-mono text-[10px] font-bold border border-white/20 px-1 py-0.2 rounded hover:bg-white hover:text-black cursor-pointer transition-all">TT</span>
                <Volume2 className="w-4 h-4 hover:text-accent-cyan cursor-pointer transition-colors" />
                <Share2 className="w-4 h-4 hover:text-accent-cyan cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Clipping Content */}
            <div className="flex-1 py-4 flex flex-col gap-3 text-left">
              {/* Tag Block */}
              <span className="bg-accent-cyan text-black px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider w-max border border-black shadow-[1px_1px_0px_#000]">
                PRESS REVIEW
              </span>

              {/* Title */}
              <h3 className="font-display font-black text-lg text-white leading-tight mt-1 hover-glitch">
                —Mixmag review: Colossal modular walls of static noise
              </h3>

              {/* Main Image */}
              <div className="relative border-2 border-white/20 rounded-lg overflow-hidden h-[120px] mt-1 group-hover:border-accent-cyan/40 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" 
                  alt="Nocturne Live Performance"
                  className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 bg-accent-cyan border border-black p-1">
                  <ImageIcon className="w-3 h-3 text-black" />
                </div>
              </div>

              {/* Key Points */}
              <div className="space-y-1.5 mt-2">
                <span className="bg-[#FF3366] text-white px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider w-max border border-black shadow-[1px_1px_0px_#000] block">
                  KEY POINTS
                </span>
                
                <div className="border-2 border-white/10 p-3 bg-black/40 rounded-lg space-y-2.5">
                  <div className="flex gap-2 text-[10px] leading-relaxed text-muted-foreground">
                    <span className="text-accent-cyan shrink-0 font-bold">•</span>
                    <p>
                      <strong className="text-white">Resident Advisor:</strong> Nocturne designs colossal walls of modular synthesizers and deep, static void noise. An absolute tour-de-force.
                    </p>
                  </div>
                  <div className="flex gap-2 text-[10px] leading-relaxed text-muted-foreground">
                    <span className="text-accent-cyan shrink-0 font-bold">•</span>
                    <p>
                      <strong className="text-white">The Wire:</strong> Raw, hardware-driven industrial techno that drags the listener into a charcoal void of electric neon energy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Footer Card */}
            <div className="border border-white/10 rounded-xl p-3 bg-black/80 flex items-center justify-between text-left gap-3 mb-2 group-hover:border-accent-red/20 transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0">
                  <img src="/avatar-2.png" className="w-full h-full object-cover grayscale" alt="Mixmag Editor" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-[10px] text-white">LORA KOLODNY</span>
                  <span className="font-mono text-[7px] text-muted-foreground">Published Jun 17, 2026</span>
                </div>
              </div>
              
              <button className="bg-white hover:bg-neutral-200 text-black text-[9px] font-mono font-bold py-1 px-2.5 rounded border border-black transition-colors flex items-center gap-1 shrink-0">
                <UserPlus className="w-2.5 h-2.5 stroke-[2.5]" />
                <span>Follow</span>
              </button>
            </div>

            {/* Bottom text snippet */}
            <p className="font-sans text-[10px] text-muted-foreground text-left leading-relaxed pb-1 line-clamp-2">
              The audio-visual live shows from Nocturne are not just concerts—they are digital architectures mutating in real-time. Unmatched energy.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
