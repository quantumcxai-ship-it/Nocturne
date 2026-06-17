import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { fadeUp } from "@/lib/animations";

interface MerchItem {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  rating?: number;
  badge?: string;
}

export const Merch: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const items: MerchItem[] = [
    {
      id: "m1",
      name: "CHARCOAL VOID 12\" DOUBLE VINYL",
      price: "$39.00",
      category: "PHYSICAL MUSIC",
      image: "/merch_vinyl.png",
      badge: "LIMITED EDITION",
    },
    {
      id: "m2",
      name: "NOCTURNE LOGO SCREENPRINT HOODIE",
      price: "$65.00",
      category: "APPAREL",
      image: "/merch_hoodie.png",
    },
    {
      id: "m3",
      name: "EUROPE TOUR 2026 BRUTALIST TEE",
      price: "$35.00",
      category: "APPAREL",
      image: "/merch_tee.png",
      badge: "TOUR EXCLUSIVE",
    },
    {
      id: "m4",
      name: "NOCTURNE EMBROIDERED BEANIE",
      price: "$25.00",
      category: "ACCESSORIES",
      image: "/merch_beanie.png",
    }
  ];

  const handleBuy = (id: string) => {
    setBuyingId(id);
    setTimeout(() => {
      setCartCount((prev) => prev + 1);
      setBuyingId(null);
    }, 1000);
  };

  return (
    <section 
      id="merch" 
      className="w-full bg-black py-28 md:py-36 px-6 relative z-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Header Block */}
        <div className="relative flex flex-col items-center text-center gap-4 border-b border-white/5 pb-10 w-full">
          <span className="font-mono text-xs tracking-[4px] uppercase text-accent-red font-bold block mb-2">
            STOREFRONT
          </span>
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tight text-white uppercase leading-none pb-3">
            MERCH <span className="font-serif italic font-normal text-accent-cyan lowercase">goods</span>
          </h2>
          <p className="max-w-xl font-sans text-muted-foreground text-sm leading-relaxed text-center mt-2">
            High-quality screenprinted apparel, caps, and limited-run vinyl products.
          </p>

          {/* Dynamic Cart indicator floating right */}
          <div className="absolute top-0 right-0 z-30">
            <div className="relative p-3 bg-surface border border-white/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-red font-mono text-[9px] font-black text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-black animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="group flex flex-col bg-surface border border-white/5 rounded-xl overflow-hidden cursor-pointer"
              {...fadeUp(0.1 + index * 0.15)}
              whileHover={{ 
                scale: 1.03,
                borderColor: "rgba(0, 240, 255, 0.65)",
                boxShadow: "0 0 25px rgba(0, 240, 255, 0.3), 0 10px 30px rgba(0, 0, 0, 0.9)"
              }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center border-b border-white/5">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />

                {/* Badges */}
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-accent-red border border-white/10 font-mono text-[9px] font-black tracking-widest text-white px-2 py-0.5 rounded uppercase">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Meta details */}
              <div className="p-5 flex flex-col justify-between flex-1 text-left gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] font-bold text-accent-cyan uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-display font-black text-sm tracking-tight text-white group-hover:text-accent-cyan transition-colors line-clamp-2 uppercase">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="font-mono text-base font-black text-white">
                    {item.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuy(item.id);
                    }}
                    disabled={buyingId === item.id}
                    className={`flex items-center gap-1.5 px-4 py-2 border font-mono text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
                      buyingId === item.id
                        ? "border-accent-cyan bg-accent-cyan text-black"
                        : "border-white/10 bg-transparent text-white hover:bg-white hover:text-black hover:border-white"
                    }`}
                  >
                    {buyingId === item.id ? (
                      <>
                        <Check className="w-3 h-3 animate-pulse" />
                        ADDED
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3 h-3" />
                        BUY NOW
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
