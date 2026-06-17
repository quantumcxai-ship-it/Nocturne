import { AudioProvider } from "@/context/AudioContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Music } from "@/components/Music";
import { Tour } from "@/components/Tour";
import { Videos } from "@/components/Videos";
import { Merch } from "@/components/Merch";
import { EPK } from "@/components/EPK";
import { MailingList } from "@/components/MailingList";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";

function App() {
  return (
    <AudioProvider>
      <div className="w-full min-h-screen bg-black text-[#EAEAEA] relative overflow-x-hidden selection:bg-accent-red selection:text-white">
        
        {/* Global Grain Film Overlay */}
        <div className="grain-overlay" />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Sections */}
        <Hero />
        <Music />
        <Tour />
        <Videos />
        <Merch />
        <EPK />
        <MailingList />
        <Contact />
        <Footer />

        {/* Persistent Custom Audio Player */}
        <AudioPlayer />
        
      </div>
    </AudioProvider>
  );
}

export default App;
