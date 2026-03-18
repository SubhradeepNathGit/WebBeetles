import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Facebook, Twitter, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";

const SocialButton = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 rounded-full border-2 border-white/60 bg-white/10 
              backdrop-blur-sm flex items-center justify-center hover:bg-white/30 
              hover:border-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
  >
    {children}
  </a>
);

const OurExpertsSection = () => {
  const instructors = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Senior UX Designer",
      company: "Google",
      experience: "8+ Years",
      image: "/exparts/Teacher-1.png",
      social: { facebook: "#", twitter: "#", linkedin: "#" },
    },
    {
      id: 2,
      name: "Arjun Mehta",
      role: "Full Stack Web Developer",
      company: "Microsoft",
      experience: "10+ Years",
      image: "/exparts/Teacher-2.webp",
      social: { facebook: "#", twitter: "#", linkedin: "#" },
    },
    {
      id: 3,
      name: "Ananya Kapoor",
      role: "Graphic Designer",
      company: "Adobe",
      experience: "6+ Years",
      image: "/exparts/Teacher-3.png",
      social: { facebook: "#", twitter: "#", linkedin: "#" },
    },
    {
      id: 4,
      name: "Rohini Patel",
      role: "Mobile App Developer",
      company: "Amazon",
      experience: "7+ Years",
      image: "/exparts/Teacher-6.webp",
      social: { facebook: "#", twitter: "#", linkedin: "#" },
    },
    {
      id: 5,
      name: "Ishita Reddy",
      role: "UI/UX Specialist",
      company: "Meta",
      experience: "9+ Years",
      image: "/exparts/Teacher-7.webp",
      social: { facebook: "#", twitter: "#", linkedin: "#" },
    },
    // {
    //   id: 6,
    //   name: "Vikram Singh",
    //   role: "Backend Engineer",
    //   company: "Netflix",
    //   experience: "12+ Years",
    //   image:"/exparts/Teacher-1.png",
    //   social: { facebook: "#", twitter: "#", linkedin: "#" },
    // },
  ];

  return (
    <section className="bg-black py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-10 sm:mb-12 lg:mb-16 gap-6 lg:gap-8">
          {/* Left Side - Title with Badge */}
          <div className="text-left lg:max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white font-sans">
              Meet Our <br /><span className="text-purple-700">Instructors</span>
            </h2>
          </div>

          {/* Right Side - Description */}
          <div className="lg:max-w-md text-left lg:text-right lg:pt-5">
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-sans">
              Discover a variety of in-demand learning categories designed to elevate your skills and boost your career
            </p>
          </div>
        </div>

        {/* Swiper Carousel with Custom Arrows */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            loop
            autoplay={{ delay: 1500, disableOnInteraction: false }}
            pagination={{
              el: '.swiper-pagination-custom',
              clickable: true,
              dynamicBullets: true
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="pb-6 sm:pb-8 lg:pb-10"
          >
            {instructors.map((instructor) => (
              <SwiperSlide key={instructor.id}>
                <div className="relative bg-gradient-to-br from-purple-900/40 to-purple-950/60 rounded-3xl overflow-hidden backdrop-blur-sm border-2 border-purple-500/30 shadow-2xl group mx-2 sm:mx-0 hover:border-purple-400 hover:shadow-purple-500/50 transition-all duration-500">
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={instructor.image}
                      alt={`Portrait of ${instructor.name}, ${instructor.role}`}
                      className="w-full h-80 sm:h-96 object-cover object-center transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                    {/* Hover Overlay with Social Icons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <SocialButton href={instructor.social.facebook}>
                        <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                      </SocialButton>
                      <SocialButton href={instructor.social.twitter}>
                        <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                      </SocialButton>
                      <SocialButton href={instructor.social.linkedin}>
                        <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                      </SocialButton>
                    </div>
                  </div>

                  {/* Info Section - Overlayed on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 font-sans tracking-tight">
                      {instructor.name}
                    </h3>
                    <p className="text-purple-300 text-sm sm:text-base font-medium font-sans mb-2">{instructor.role}</p>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-400 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        {instructor.company}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span>{instructor.experience}</span>
                    </div>
                  </div>

                  {/* Decorative Corner Accent */}
                  <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-purple-500/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <button
            className="swiper-button-prev-custom absolute left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-100/30 hover:bg-purple-600/50 backdrop-blur-md border border-white text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={4} />
          </button>
          <button
            className="swiper-button-next-custom absolute right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-100/30 hover:bg-purple-600/50 backdrop-blur-md border border-white text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={4} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurExpertsSection;