import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, MapPin, Globe } from "lucide-react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "GENERAL",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API request
    setSent(true);
    setFormData({ name: "", email: "", subject: "GENERAL", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section 
      id="contact" 
      className="w-full bg-gradient-to-b from-black via-[#0D0D0F] to-black py-28 md:py-36 px-6 relative z-20"
    >
      {/* Centered fine dividing line at the top boundary */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 max-w-xs h-[1px] bg-white/10" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center gap-4 border-b border-white/5 pb-10 w-full">
          <span className="font-mono text-xs tracking-[4px] uppercase text-accent-red font-bold block mb-2">
            GET IN TOUCH
          </span>
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tight text-white uppercase leading-none pb-3">
            CONTACT <span className="font-serif italic font-normal text-accent-cyan lowercase">channels</span>
          </h2>
          <p className="max-w-xl font-sans text-muted-foreground text-sm leading-relaxed text-center mt-2">
            Send booking requests, licensing proposals, and management inquiries directly to the Nocturne team.
          </p>
        </div>

        {/* Form and Contacts Asymmetric Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Left Column: Direct Inboxes (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider">
                DIRECT INBOXES
              </h3>
              
              <div className="flex flex-col gap-5">
                {/* Mgmt */}
                <div className="p-5 bg-surface border border-white/5 rounded-xl hover:border-accent-cyan/25 transition-all">
                  <span className="font-mono text-[9px] font-bold text-accent-cyan tracking-widest uppercase">MANAGEMENT</span>
                  <p className="font-display font-bold text-lg text-white mt-1">mgmt@nocturnerecords.com</p>
                </div>

                {/* Booking */}
                <div className="p-5 bg-surface border border-white/5 rounded-xl hover:border-accent-red/25 transition-all">
                  <span className="font-mono text-[9px] font-bold text-accent-red tracking-widest uppercase">BOOKINGS (EU/GLOBAL)</span>
                  <p className="font-display font-bold text-lg text-white mt-1">booking@nocturnerecords.com</p>
                </div>

                {/* Press */}
                <div className="p-5 bg-surface border border-white/5 rounded-xl hover:border-white/10 transition-all">
                  <span className="font-mono text-[9px] font-bold text-muted-foreground tracking-widest uppercase">PRESS & DEMOS</span>
                  <p className="font-display font-bold text-lg text-white mt-1">press@nocturnerecords.com</p>
                </div>
              </div>
            </div>

            {/* Stage Info */}
            <div className="space-y-4 pt-6 border-t border-white/5 font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-cyan" />
                <span>HQ: BERLIN, GERMANY</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent-red" />
                <span>DISTRIBUTION: GLOBAL VOID NETWORKS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form (7 Cols) */}
          <div className="lg:col-span-7 p-6 md:p-8 bg-surface border border-white/5 rounded-2xl flex flex-col gap-6">
            <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider">
              TRANSMIT MESSAGE
            </h3>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center gap-3 bg-black border border-accent-cyan/30 rounded-xl"
              >
                <CheckCircle className="w-12 h-12 text-accent-cyan animate-pulse" />
                <h4 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                  TRANSMISSION RECEIVED
                </h4>
                <p className="font-sans text-xs text-muted-foreground max-w-xs leading-relaxed">
                  We have cataloged your inquiry. Our operations unit will contact you inside 48 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                      NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-black border border-white/10 hover:border-white/20 focus:border-accent-cyan rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                      placeholder="YOUR NAME"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-black border border-white/10 hover:border-white/20 focus:border-accent-cyan rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                      placeholder="EMAIL@DOMAIN.COM"
                    />
                  </div>
                </div>

                {/* Subject Selector */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                    INQUIRY DEPT.
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-black border border-white/10 hover:border-white/20 focus:border-accent-cyan rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors uppercase font-mono font-bold"
                  >
                    <option value="GENERAL">GENERAL INQUIRY</option>
                    <option value="BOOKING">LIVE BOOKING REQUEST</option>
                    <option value="LICENSING">SYNC / AUDIO LICENSING</option>
                    <option value="DEMO">DEMO SUBMISSION</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                    MESSAGE / OUTLINE
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-black border border-white/10 hover:border-white/20 focus:border-accent-cyan rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors resize-none"
                    placeholder="ENTER YOUR CORRESPONDENCE..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full py-4 bg-accent-red hover:bg-accent-red/90 text-white font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 border-glow-red rounded-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Send className="w-3.5 h-3.5" />
                  TRANSMIT ENCRYPTED MESSAGE
                </motion.button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
