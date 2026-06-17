import React, { useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";

export const AudioVisualizer: React.FC = () => {
  const { isPlaying, analyserNode } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const simulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle Resize
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Set actual resolution based on device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
        
        // Match CSS size
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Render loop
    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear with dark transparent black for motion blur trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Create neon gradients
      const gradientCyan = ctx.createLinearGradient(0, 0, width, 0);
      gradientCyan.addColorStop(0, "#00F0FF");
      gradientCyan.addColorStop(0.5, "#FF3366");
      gradientCyan.addColorStop(1, "#00F0FF");

      // Draw Grid lines in the background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (isPlaying && analyserNode) {
        // REAL AUDIO RENDERING
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0, 240, 255, 0.5)";

        // Draw multiple overlapping paths for chromatic aberration look
        // 1. Cyan offset path
        ctx.strokeStyle = "rgba(0, 240, 255, 0.85)";
        ctx.beginPath();
        let sliceWidth = width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2 - 3; // slight y offset
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();

        // 2. Red offset path
        ctx.shadowColor = "rgba(255, 51, 102, 0.5)";
        ctx.strokeStyle = "rgba(255, 51, 102, 0.85)";
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2 + 3; // opposite y offset
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x + 2, y); // slight x offset
          x += sliceWidth;
        }
        ctx.stroke();

        // 3. Center gradient path
        ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
        ctx.strokeStyle = gradientCyan;
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();

      } else {
        // SIMULATED SINE WAVE (IDLE STATE)
        simulatedTimeRef.current += 0.035;
        const time = simulatedTimeRef.current;

        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;

        // Wave 1: Slow cyan wave
        ctx.strokeStyle = "rgba(0, 240, 255, 0.45)";
        ctx.shadowColor = "rgba(0, 240, 255, 0.3)";
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.007 + time) * 35 + Math.cos(x * 0.003 + time * 0.5) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Wave 2: Faster red wave
        ctx.strokeStyle = "rgba(255, 51, 102, 0.45)";
        ctx.shadowColor = "rgba(255, 51, 102, 0.3)";
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.012 - time * 1.2) * 25 + Math.cos(x * 0.005 - time * 0.8) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Wave 3: Fine center soft white wave
        ctx.strokeStyle = "rgba(234, 234, 234, 0.3)";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.004 + time * 0.3) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Reset shadow for performance
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, analyserNode]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
