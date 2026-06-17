import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import HoverPlayCard from "@/components/ui/hover-play-card";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
}

export const Videos: React.FC = () => {
  const videos: VideoItem[] = [
    {
      id: "v1",
      title: "CHARCOAL VOID - OFFICIAL MUSIC VIDEO",
      category: "MUSIC VIDEO",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
      videoUrl: "https://www.pexels.com/download/video/29913691/",
    },
    {
      id: "v2",
      title: "LIVE FROM REX CLUB, PARIS 2026",
      category: "LIVE PERFORMANCE",
      thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
      videoUrl: "https://www.pexels.com/download/video/3129671/",
    },
    {
      id: "v3",
      title: "SUBTERRANEAN SINEWAVES - VISUALIZER",
      category: "AUDIO VISUALIZER",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
      videoUrl: "https://www.pexels.com/download/video/3191572/",
    }
  ];

  return (
    <section 
      id="videos" 
      className="w-full bg-gradient-to-b from-[#0D0D0F] to-black py-28 md:py-36 px-6 md:px-12 relative z-20"
    >
      {/* Centered fine dividing line at the top boundary */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 max-w-xs h-[1px] bg-white/10" />
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Centered Header Block */}
        <motion.div 
          className="text-center flex flex-col items-center justify-center gap-4 border-b border-white/5 pb-10"
          {...fadeUp(0.1)}
        >
          <span className="font-mono text-xs tracking-[4px] uppercase text-accent-cyan font-bold block mb-2">
            AUDIOVISUAL REELS
          </span>
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tight text-white uppercase leading-none pb-3">
            VIDEOS <span className="font-serif italic font-normal text-accent-red lowercase">visualizers</span>
          </h2>
          <p className="max-w-xl font-sans text-muted-foreground text-sm leading-relaxed text-center mt-2">
            Explore music videos, modular hardware sets, and computer art visualizers synced to the tracks.
          </p>
        </motion.div>

        {/* Videos Feed (Grid of HoverPlayCards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((vid, index) => (
            <motion.div
              key={vid.id}
              className="group flex flex-col gap-4 text-left border border-white/5 p-4 rounded-2xl bg-black hover:border-accent-cyan/20 transition-all duration-300"
              {...fadeUp(0.2 + index * 0.15)}
              whileHover={{ y: -5 }}
            >
              {/* Custom HoverPlayCard for immediate hover action */}
              <HoverPlayCard
                src={vid.videoUrl}
                poster={vid.thumbnail}
                loop={true}
                className="aspect-video w-full rounded-xl border border-white/5 overflow-hidden"
              />

              {/* Title & Info */}
              <div className="px-1 flex flex-col gap-1">
                <span className="font-mono text-[10px] font-bold text-accent-cyan tracking-wider uppercase">
                  {vid.category}
                </span>
                <h3 className="font-display font-black text-sm tracking-wide text-white group-hover:text-accent-cyan transition-colors">
                  {vid.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Centered fine dividing line at the bottom boundary */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 max-w-xs h-[1px] bg-white/10" />
    </section>
  );
};
