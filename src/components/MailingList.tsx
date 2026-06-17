import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Mail, CheckCircle } from "lucide-react";

export const MailingList: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const hlsUrl = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true
      });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log("HLS play error:", err));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Fallback for native Safari
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => console.log("Safari play error:", err));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="relative w-full py-32 md:py-44 px-6 overflow-hidden bg-black text-center flex flex-col items-center justify-center scanlines">
      {/* Background HLS Video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none filter grayscale opacity-40 brightness-50"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
        
        {/* Mail Icon Circle */}
        <motion.div 
          className="w-12 h-12 rounded-full border border-accent-cyan flex items-center justify-center bg-black/50 border-glow-cyan"
          {...fadeUp(0.1)}
        >
          <Mail className="w-5 h-5 text-accent-cyan" />
        </motion.div>

        {/* Heading */}
        <motion.h2 
          className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tight text-white uppercase leading-none pb-3"
          {...fadeUp(0.25)}
        >
          JOIN THE <span className="font-serif italic font-normal text-accent-red lowercase">void</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p 
          className="max-w-xl text-muted-foreground font-sans text-sm md:text-base leading-relaxed"
          {...fadeUp(0.4)}
        >
          Subscribe to our mailing list for tour ticket presales, label announcements, and immediately receive a link to download the unreleased track <strong className="text-white">"DARK DECAY (LTD EDIT)"</strong>.
        </motion.p>

        {/* Form Input */}
        <motion.div 
          className="w-full max-w-lg mt-4"
          {...fadeUp(0.55)}
        >
          {subscribed ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-surface border border-accent-cyan/30 rounded-xl flex items-center justify-center gap-2.5"
            >
              <CheckCircle className="w-5 h-5 text-accent-cyan" />
              <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                ACCESS CODE SENT TO EMAIL
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL ADDRESS"
                className="flex-1 bg-black/80 border border-white/10 hover:border-white/25 focus:border-accent-cyan rounded-xl px-5 py-4 text-xs font-mono font-bold tracking-widest text-white placeholder:text-muted-foreground outline-none transition-colors border-glow-cyan/5"
              />
              <motion.button
                type="submit"
                className="px-8 py-4 bg-white hover:bg-accent-cyan text-black hover:text-black font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 border border-white hover:border-accent-cyan hover:border-glow-cyan rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                SUBSCRIBE
              </motion.button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
};
