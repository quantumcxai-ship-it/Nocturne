import React, { useState, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause, SkipForward, Volume2, VolumeX, Disc } from "lucide-react";

export const AudioPlayer: React.FC = () => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    playTrack,
    togglePlay,
    seek,
    setVolume,
  } = useAudio();

  const [isVisible, setIsVisible] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;

      // Gradually show player once scrolled down past ~70% of viewport height (leaving Hero section)
      const scrolledPastHero = scrollY > innerHeight * 0.7;

      // Shift to vertical layout when close to the bottom (about to overlap footer)
      // A threshold of 240px from the bottom fits perfectly above the footer.
      const isNearBottom = (innerHeight + scrollY) >= (scrollHeight - 240);

      setIsVisible(scrolledPastHero);
      setIsVertical(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.8);
    }
  };

  // Compute inline styles for absolute layout morphing
  const playerStyle = {
    left: isVertical ? "calc(100% - 88px)" : "50%",
    transform: isVertical
      ? isVisible ? "translate(0, 0)" : "translate(0, 48px)"
      : isVisible ? "translate(-50%, 0)" : "translate(-50%, 48px)",
    bottom: isVertical ? "96px" : "24px",
    width: isVertical ? "64px" : "92%",
    maxWidth: isVertical ? "64px" : "896px",
    height: isVertical ? "280px" : isMobile ? "140px" : "80px",
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? ("auto" as const) : ("none" as const),
  };

  return (
    <div 
      style={playerStyle}
      className={`fixed z-50 shadow-[0_15px_50px_rgba(0,0,0,0.85)] border border-white/10 bg-[#0D0D0F]/90 backdrop-blur-xl flex items-center justify-between border-glow-cyan/20 player-transition overflow-hidden ${
        isVertical
          ? "flex-col py-6 px-2.5 gap-6 rounded-[32px]"
          : "flex-col md:flex-row py-4 px-6 md:px-8 gap-4 rounded-2xl md:rounded-full"
      }`}
    >
      
      {/* Left Section: Track Info & Artwork */}
      <div className={`flex items-center gap-3 w-full ${isVertical ? "flex-col justify-center text-center" : "md:w-auto text-left"}`}>
        <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center mx-auto">
          {currentTrack.cover ? (
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className={`w-11 h-11 rounded-full object-cover border border-white/10 ${isPlaying ? "animate-vinyl-spin" : ""}`}
            />
          ) : (
            <Disc className={`w-11 h-11 text-accent-cyan ${isPlaying ? "animate-vinyl-spin" : ""}`} />
          )}
          {/* Inner Spindle Pin */}
          <div className="absolute w-2 h-2 rounded-full bg-black border border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
        </div>

        <div className={`flex flex-col ${isVertical ? "hidden" : "block text-left select-none overflow-hidden max-w-[180px] md:max-w-[150px]"}`}>
          <h4 className="font-display font-bold text-sm tracking-tight text-white truncate hover-glitch">
            {currentTrack.title}
          </h4>
          <p className="font-mono text-[10px] text-muted-foreground uppercase truncate">
            {currentTrack.album}
          </p>
        </div>
      </div>

      {/* Middle Section: Controls & Progress */}
      <div className={`flex items-center gap-4 ${isVertical ? "flex-col w-full" : "flex-col sm:flex-row flex-1 w-full max-w-lg md:max-w-none px-0 md:px-4"}`}>
        {/* Playback Buttons */}
        <div className={`flex items-center gap-3 ${isVertical ? "flex-col" : "flex-row"}`}>
          <button
            onClick={togglePlay}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? "bg-accent-red text-white hover:bg-accent-red/90 border-glow-red"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" fill="currentColor" /> : <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />}
          </button>
          
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar & Timers (Hidden in Vertical Mode) */}
        <div className={`items-center gap-3 flex-1 w-full ${isVertical ? "hidden" : "flex"}`}>
          <span className="font-mono text-[10px] text-muted-foreground select-none w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 group flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSliderChange}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan outline-none transition-all group-hover:h-1.5"
              style={{
                background: `linear-gradient(to right, #00F0FF 0%, #00F0FF ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground select-none w-10 text-left">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right Section: Volume Control */}
      <div className={`items-center gap-3 ${isVertical ? "flex flex-col w-full" : "hidden sm:flex w-32 justify-end"}`}>
        <button
          onClick={toggleMute}
          className="text-muted-foreground hover:text-white transition-colors"
          title={volume === 0 ? "Unmute" : "Mute"}
        >
          {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className={`w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white outline-none ${isVertical ? "hidden" : "block"}`}
        />
      </div>

    </div>
  );
};
