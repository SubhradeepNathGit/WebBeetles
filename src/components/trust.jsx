import React from "react";

const LogoCarousel = () => {
  const logos = [
    { id: 1, src: "/images/trust1.png", alt: "Logo 1" },
    { id: 2, src: "/images/trust2.png", alt: "Logo 2" },
    { id: 3, src: "/images/trust3.png", alt: "Logo 3" },
    { id: 4, src: "/images/trust4.png", alt: "Logo 4" },
    { id: 5, src: "/images/trust5.png", alt: "Logo 5" },
    { id: 6, src: "/images/trust6.png", alt: "Logo 6" },
  ];

  // Create multiple duplicates for seamless infinite scroll
  const infiniteLogos = [...logos, ...logos, ...logos];

  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Heading */}
       <div className="text-center mb-8 sm:mb-12">
  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
    <span className="text-white">We are </span>
    <span className="text-purple-700">Trusted </span>
    <span className="text-white">by</span>
  </h2>
</div>


        {/* Carousel Container */}
        <div className="relative h-16 sm:h-20 overflow-hidden">
          <div 
            className="flex items-center animate-scroll"
            style={{
              width: `${infiniteLogos.length * 200}px`, // Approximate width calculation
            }}
          >
            {infiniteLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${Math.floor(index / logos.length)}-${index}`}
                className="flex-shrink-0 px-4 sm:px-8 flex items-center justify-center"
                style={{ width: '200px' }} // Fixed width for consistent spacing
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-10 sm:h-10 md:h-12 lg:h-14 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${logos.length * 200}px);
          }
        }

        .animate-scroll {
          animation: scroll 12s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default LogoCarousel;