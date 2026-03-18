import React, { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';

const StatsVideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    instructors: 0,
    jobs: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateStats();
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateStats = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = {
      courses: 50,
      students: 10000,
      instructors: 80,
      jobs: 200
    };

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        courses: Math.floor(targets.courses * progress),
        students: Math.floor(targets.students * progress),
        instructors: Math.floor(targets.instructors * progress),
        jobs: Math.floor(targets.jobs * progress)
      });

      if (currentStep >= steps) {
        setStats(targets);
        clearInterval(interval);
      }
    }, stepDuration);
  };

  const formatNumber = (num) => {
    if (num >= 10000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Blur / background effects */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 md:h-48 bg-gradient-to-b from-black via-black/50 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 md:h-48 bg-gradient-to-t from-black via-black/50 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute top-1/2 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-15"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-800 rounded-full filter blur-3xl opacity-10"></div>

      <div className="relative z-10">
        {/* Stats */}
        <div ref={sectionRef} className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-purple-400/90 mb-2 sm:mb-3">
                  {stats.courses}+
                </div>
                <div className="text-gray-300 text-sm sm:text-base md:text-lg">Amazing Course</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3">
                  {formatNumber(stats.students)}+
                </div>
                <div className="text-gray-300 text-sm sm:text-base md:text-lg">Student</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3">
                  {stats.instructors}+
                </div>
                <div className="text-gray-300 text-sm sm:text-base md:text-lg">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3">
                  {stats.jobs}+
                </div>
                <div className="text-gray-300 text-sm sm:text-base md:text-lg">Jobs Connections</div>
              </div>
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative pt-[56.25%] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {!isPlaying ? (
                <div
                  className="absolute top-0 left-0 w-full h-full cursor-pointer overflow-hidden group"
                  onClick={() => setIsPlaying(true)}
                >
                  <img
                    src="/about/thumbnail.jpg"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover transition-transform duration-500 scale-110 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative pointer-events-auto">
                      {/* Outer Ping Effect */}
                      <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping opacity-70"></div>

                      
                      <div className="relative bg-white/20 backdrop-blur-lg border border-white rounded-full p-4 sm:p-6 md:p-8 shadow-2xl transition-all duration-300 hover:scale-110 hover:border-gray-300 active:scale-90">
                        <Play className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                    }}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 sm:p-2 z-10 transition-all duration-200"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <div className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/2sOSiNQoVgc?autoplay=1"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsVideoSection;