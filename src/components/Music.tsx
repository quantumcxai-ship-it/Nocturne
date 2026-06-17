import React from "react";
import { useAudio } from "@/context/AudioContext";
import type { Track } from "@/context/AudioContext";
import { Play, Pause } from "lucide-react";

export const Music: React.FC = () => {
  const { tracks, currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const handlePlay = (track: Track) => {
    if (currentTrack.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  const isCurrentPlaying = (track: Track) => {
    return currentTrack.id === track.id && isPlaying;
  };

  return (
    <section 
      id="music" 
      className="w-full bg-[#0D0D0F] py-24 px-6 md:px-12 relative overflow-hidden select-none"
    >
      
      {/* 
        ========================================================================
        TURNTABLE (Visible on all viewports)
        Fits perfectly within the section height (70% height, leaving 15% negative space).
        Centered vertically and positioned half off-screen on the left margin.
        ========================================================================
      */}
      {/* White Circle Guideline Rim */}
      <div 
        className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-[82%] aspect-square rounded-full border border-white/20 pointer-events-none z-10"
      />

      {/* The Black Vinyl Disc */}
      <div 
        className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-[78%] aspect-square rounded-full flex items-center justify-center z-0 pointer-events-none"
      >
        {/* Rotating inner wrapper */}
        <div 
          className="w-full h-full rounded-full vinyl-record-player flex items-center justify-center relative transition-transform duration-500"
          style={{
            animation: "vinyl-spin 20s linear infinite",
            animationPlayState: isPlaying ? "running" : "paused"
          }}
        >
          {/* Grooves Overlay */}
          <div className="absolute inset-0 rounded-full vinyl-grooves-overlay" />

          {/* White Center Record Label sticker (28% of the vinyl disc) */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28%] h-[28%] rounded-full bg-white z-10 border border-neutral-300 shadow-[inset_0_2px_6px_rgba(0,0,0,0.25),_0_8px_20px_rgba(0,0,0,0.35)]"
          >
            
            {/* Red Audio Bar Indicator (on the left half, cut off in screen edge) */}
            <div className="absolute right-[54%] top-1/2 -translate-y-1/2 flex items-end gap-[2px] h-3 md:h-3.5">
              <div className="w-[1.5px] md:w-[2px] h-1 bg-accent-red rounded-full"></div>
              <div className="w-[1.5px] md:w-[2px] h-2 bg-accent-red rounded-full"></div>
              <div className="w-[1.5px] md:w-[2px] h-1.5 bg-accent-red rounded-full"></div>
              <div className="w-[1.5px] md:w-[2px] h-3 bg-accent-red rounded-full"></div>
            </div>

            {/* Dynamic Track Text (on the visible right half) */}
            <span className="absolute left-[54%] top-1/2 -translate-y-1/2 font-mono text-[8px] md:text-[10px] font-black tracking-[1px] text-neutral-900 uppercase whitespace-nowrap">
              {currentTrack.id.padStart(2, "0")}. {currentTrack.title}
            </span>

            {/* Spindle hole centered exactly in the middle */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#0D0D0F] border border-neutral-400 z-20 shadow-[inset_0_2.5px_4px_rgba(0,0,0,0.85)]" 
            />
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        MAIN LAYOUT
        Flex container that ensures the record spacer and the content stay side-by-side on all screen sizes.
        ========================================================================
      */}
      <div className="max-w-7xl mx-auto flex gap-4 sm:gap-8 md:gap-12 lg:gap-16 items-stretch relative z-20">
        
        {/* Left Spacer Column (Reserves space for the half-record, prevents content overlap) */}
        <div className="w-[80px] sm:w-[120px] md:w-[180px] lg:w-[320px] xl:w-[400px] flex-shrink-0 min-h-[500px] md:min-h-[550px]"></div>

        {/* Right Content Column: Header and Tracks List */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 text-left py-6 min-w-0">
          
          {/* Top navigation header (matching image) */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="hidden lg:block" /> {/* Spacer */}
            <div className="flex items-center gap-4 sm:gap-8 font-mono text-[10px] sm:text-xs tracking-wider text-white/70">
              <a href="#music" className="hover:text-accent-cyan transition-colors font-bold uppercase">ARTISTS</a>
              <a href="#music" className="hover:text-accent-cyan transition-colors font-bold uppercase">MIXTAPES</a>
              <a href="#music" className="hover:text-accent-cyan transition-colors font-bold uppercase">AWARDS</a>
            </div>
          </div>

          {/* Artist Big Headline */}
          <div className="flex flex-col gap-2 mt-2">
            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.9] text-white tracking-tighter uppercase">
              NOCTURNE
            </h2>
            <p className="font-mono text-[9px] sm:text-xs md:text-sm text-white/60 tracking-widest uppercase mt-2">
              INDUSTRIAL TECHNO, MODULAR NOISE, DARK AMBIENT, GLITCH SYNTHESIS
            </p>
          </div>

          {/* Popular Tracks Section */}
          <div className="flex flex-col gap-4 mt-6">
            <span className="font-mono text-xs tracking-[4px] uppercase text-accent-red font-bold">
              POPULAR
            </span>

            {/* Tracks List */}
            <div className="flex flex-col border-t border-white/10 divide-y divide-white/5">
              {tracks.map((track) => {
                const active = currentTrack.id === track.id;
                const playing = isCurrentPlaying(track);

                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlay(track)}
                    className={`group flex items-center justify-between py-3 px-2 cursor-pointer transition-all ${
                      active ? "bg-white/5" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    
                    {/* Left: Number, Album Art, and Title */}
                    <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                      
                      {/* Number */}
                      <span className={`font-mono text-xs sm:text-sm tracking-wider w-5 sm:w-6 flex-shrink-0 ${
                        active ? "text-accent-cyan font-bold" : "text-white/40"
                      }`}>
                        {track.id.padStart(2, "0")}
                      </span>

                      {/* Cover Art Thumbnail */}
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden bg-neutral-900 border border-white/10 flex-shrink-0 flex items-center justify-center">
                        {track.cover ? (
                          <img 
                            src={track.cover} 
                            alt={track.title} 
                            className="w-full h-full object-cover filter grayscale"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
                            <span className="text-[10px] text-white/20">LP</span>
                          </div>
                        )}
                        {/* Playing State Overlay */}
                        {active && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center border border-accent-cyan">
                              {playing ? (
                                <Pause className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-accent-cyan fill-accent-cyan" />
                              ) : (
                                <Play className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-accent-cyan fill-accent-cyan ml-0.5" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Track details */}
                      <div className="flex flex-col text-left min-w-0">
                        <span className={`font-display text-sm sm:text-base tracking-wide uppercase truncate ${
                          active ? "text-accent-cyan font-black" : "text-white group-hover:text-accent-cyan transition-colors"
                        }`}>
                          {track.title}
                        </span>
                        <span className="font-mono text-[9px] sm:text-[10px] text-white/40 uppercase mt-0.5 truncate">
                          {track.album}
                        </span>
                      </div>

                    </div>

                    {/* Right: Duration */}
                    <span className={`font-mono text-xs sm:text-sm tracking-wide flex-shrink-0 ${
                      active ? "text-accent-cyan font-bold" : "text-white/60"
                    }`}>
                      {track.duration}
                    </span>

                  </div>
                );
              })}
            </div>
          </div>

          {/* View More Link */}
          <div className="flex justify-end mt-2">
            <a 
              href="#music" 
              className="font-mono text-xs tracking-wider text-white hover:text-accent-cyan underline transition-colors uppercase font-bold"
            >
              VIEW MORE
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
