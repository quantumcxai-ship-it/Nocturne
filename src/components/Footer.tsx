import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "SPOTIFY", href: "https://spotify.com" },
    { name: "BANDCAMP", href: "https://bandcamp.com" },
    { name: "SOUNDCLOUD", href: "https://soundcloud.com" },
    { name: "INSTAGRAM", href: "https://instagram.com" },
  ];

  return (
    <footer className="w-full py-14 px-6 md:px-12 bg-black border-t border-white/5 grid grid-cols-1 md:grid-cols-3 items-center gap-6 relative z-20 select-none">
      
      {/* Column 1: Copyright */}
      <span className="font-mono text-[10px] text-muted-foreground tracking-wider font-bold uppercase text-center md:text-left">
        © {currentYear} NOCTURNE RECORD LABEL. ALL RIGHTS RESERVED.
      </span>

      {/* Column 2: Centered Baibhab Bose Attribution */}
      <span className="font-mono text-[10px] text-muted-foreground tracking-wider font-bold uppercase text-center">
        Made by Baibhab Bose - QuantumCX.
      </span>

      {/* Column 3: Social Links */}
      <div className="flex items-center justify-center md:justify-end gap-6">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] text-muted-foreground hover:text-accent-cyan font-bold tracking-widest transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>

    </footer>
  );
};
