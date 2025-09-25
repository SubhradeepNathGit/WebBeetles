import React, { useState, useEffect, useRef } from "react";

const PricingSection = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  // Trigger animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            [0, 1, 2].forEach((index) => {
              setTimeout(() => {
                setVisibleCards((prev) =>
                  prev.includes(index) ? prev : [...prev, index]
                );
              }, index * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const CheckIcon = () => (
    <svg
      className="w-5 h-5 text-green-400 mr-3 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg
      className="w-4 h-4 ml-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const plans = [
    {
      name: "STARTER",
      subtitle: "Perfect for Casual Learners",
      priceINR: 2400,
      period: "/ Month",
      savings: "Save 15%",
      features: [
        "Access to selected beginner",
        "Standard digital certificates",
        "Community support",
        "Up to 3 active courses",
        "Custom Automations",
        "Voice Assistant Integration",
      ],
    },
    {
      name: "EXPERT",
      subtitle: "For Career-Driven Professionals",
      priceINR: 5600,
      period: "/ Month",
      savings: "Save 45%",
      isExpert: true,
      features: [
        "Access to selected beginner",
        "Standard digital certificates",
        "Community support",
        "Up to 3 active courses",
        "Personalized learning paths",
        "Access to exclusive webinars",
      ],
    },
    {
      name: "PRO",
      subtitle: "For Consistent Learners",
      priceINR: 4000,
      period: "/ Month",
      savings: "Save 35%",
      features: [
        "Access to selected beginner",
        "Standard digital certificates",
        "Community support",
        "Up to 3 active courses",
        "Monthly progress reports",
        "Voice Assistant Integration",
      ],
    },
  ];

  return (
    <div
      className="min-h-screen bg-black text-white py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-3 sm:mb-4">
            Boost Your Skills
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold leading-tight">
            Expand <span className="text-purple-500">Your Mind</span>
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-6xl mx-auto">
          {/* Reorder plans for mobile: STARTER, PRO, EXPERT */}
          {[0, 2, 1].map((originalIndex, displayIndex) => {
            const plan = plans[originalIndex];
            const isHovered = hoveredCard === displayIndex;
            
            return (
            <div
              key={originalIndex}
              className={`relative h-full transition-all duration-700 max-w-md mx-auto md:max-w-none md:mx-0 ${
                visibleCards.includes(displayIndex) ? "animate-flip-in" : "opacity-0"
              }`}
              style={{
                transformStyle: "preserve-3d",
                animation: visibleCards.includes(displayIndex)
                  ? `flipIn 0.8s ease-out ${displayIndex * 0.2}s both`
                  : "none",
              }}
            >
              <div
                className={`relative rounded-2xl p-4 sm:p-6 md:p-4 lg:p-6 xl:p-8 h-full border transition-all duration-300 flex flex-col
                  ${
                    isHovered
                      ? "bg-gradient-to-b from-purple-500/30 via-purple-700/20 to-purple-900/10 border-purple-400 shadow-md shadow-purple-500/40 backdrop-blur-lg scale-105"
                      : "bg-gray-900/70 border-gray-800 hover:bg-gray-900"
                  }`}
                onMouseEnter={() => setHoveredCard(displayIndex)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Savings Badge */}
                <div className="absolute -top-3 right-4 sm:right-6 md:right-4 lg:right-6">
                  <div className="bg-purple-700 text-white px-2 sm:px-3 md:px-2 lg:px-3 xl:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {plan.savings}
                  </div>
                </div>

                {/* Plan Name */}
                <h3 className="text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base mb-6">
                  {plan.subtitle}
                </p>

                {/* Price */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
                      ₹{plan.priceINR.toLocaleString("en-IN")}
                    </span>
                    <span className="text-gray-400 ml-1 text-sm sm:text-base md:text-sm lg:text-base">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <CheckIcon />
                      <span className="text-gray-300 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center text-sm sm:text-base md:text-sm lg:text-base
                    ${
                      isHovered
                        ? "bg-gradient-to-r from-purple-500/60 to-purple-700/40 backdrop-blur-md border border-purple-300 text-white hover:from-purple-500 hover:to-purple-700/60"
                        : "bg-purple-500 text-white hover:bg-purple-700"
                    }`}
                >
                  Choose Package
                  <ArrowIcon />
                </button>
              </div>
            </div>
          );})}
        </div>
      </div>

      {/* Flip Animation */}
      <style jsx>{`
        @keyframes flipIn {
          0% {
            transform: perspective(400px) rotateY(-90deg);
            opacity: 0;
          }
          40% {
            transform: perspective(400px) rotateY(-10deg);
          }
          70% {
            transform: perspective(400px) rotateY(10deg);
          }
          100% {
            transform: perspective(400px) rotateY(0deg);
            opacity: 1;
          }
        }
        .animate-flip-in {
          animation: flipIn 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default PricingSection;
