import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface Track {
  id: string;
  title: string;
  album: string;
  duration: string;
  url: string;
  cover: string;
}

interface AudioContextType {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  progress: number; // 0 to 100
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  seek: (percent: number) => void;
  setVolume: (vol: number) => void;
  analyserNode: AnalyserNode | null;
}

const tracksData: Track[] = [
  {
    id: "1",
    title: "NEON VOID",
    album: "Charcoal Void EP",
    duration: "1:18",
    url: "/audio/rave_digger.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
  },
  {
    id: "2",
    title: "SIGNAL RED",
    album: "Charcoal Void EP",
    duration: "1:00",
    url: "/audio/80s_vibe.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
  },
  {
    id: "3",
    title: "CYAN GLOW",
    album: "Subterranean",
    duration: "0:40",
    url: "/audio/viper.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
  },
  {
    id: "4",
    title: "DARK DECAY",
    album: "Subterranean",
    duration: "1:54",
    url: "/audio/outfoxing.mp3",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80",
  }
];

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracksData[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    // Instantiate Audio Element
    const audio = new Audio();
    if (currentTrack.url.startsWith("http://") || currentTrack.url.startsWith("https://")) {
      audio.crossOrigin = "anonymous";
    }
    audioRef.current = audio;

    // Load first track but don't autoplay
    audio.src = currentTrack.url;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      // Loop or go to next track
      const currentIndex = tracksData.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % tracksData.length;
      playTrack(tracksData[nextIndex]);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Set up Web Audio API nodes lazily on play
  const setupWebAudio = () => {
    if (!audioRef.current) return;
    if (audioContextRef.current) return; // already setup

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      sourceNodeRef.current = source;
      setAnalyserNode(analyser);
    } catch (e) {
      console.warn("Web Audio API is not fully supported or blocked:", e);
    }
  };

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;

    setupWebAudio();

    // If audio context is suspended (browser autoplay policy), resume it
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    if (currentTrack.id !== track.id) {
      setCurrentTrack(track);
      if (track.url.startsWith("http://") || track.url.startsWith("https://")) {
        audioRef.current.crossOrigin = "anonymous";
      } else {
        audioRef.current.removeAttribute("crossorigin");
      }
      audioRef.current.src = track.url;
    }

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Playback failed:", err);
      });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    setupWebAudio();

    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Playback failed:", err);
        });
    }
  };

  const seek = (percent: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const time = (percent / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    setProgress(percent);
  };

  const setVolume = (vol: number) => {
    const safeVol = Math.max(0, Math.min(1, vol));
    setVolumeState(safeVol);
    if (audioRef.current) {
      audioRef.current.volume = safeVol;
    }
  };

  // Sync volume if track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [currentTrack, volume]);

  return (
    <AudioContext.Provider
      value={{
        tracks: tracksData,
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
        analyserNode,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
