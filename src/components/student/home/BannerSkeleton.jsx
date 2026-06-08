import React from "react";

const SkeletonBox = ({ className, delay = "0s" }) => (
  <div
    className={`relative overflow-hidden bg-white/5 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md ${className}`}
  >
    {/* Sweeping shimmer effect */}
    <div 
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
      style={{ animationDelay: delay }}
    />
  </div>
);

const BannerSkeleton = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white overflow-hidden">
      {/* Background glowing ambient orbs for a premium touch */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="pt-16 sm:pt-18 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 min-h-screen flex items-center relative z-10">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left Column (Text & Buttons) */}
            <div className="flex-1 text-center lg:text-left order-1 lg:order-1 mt-12 -mb-10 lg:mt-0 w-full flex flex-col items-center lg:items-start">
              {/* Heading Skeletons */}
              <SkeletonBox className="h-12 sm:h-16 md:h-20 rounded-2xl w-full max-w-[80%] mb-4 sm:mb-6" delay="0s" />
              <SkeletonBox className="h-12 sm:h-16 md:h-20 rounded-2xl w-full max-w-[60%] mb-4 sm:mb-6" delay="0.1s" />
              
              {/* Paragraph Skeleton */}
              <div className="w-full max-w-[90%] flex flex-col items-center lg:items-start gap-3 mb-8">
                <SkeletonBox className="h-6 sm:h-8 rounded-lg w-full" delay="0.2s" />
                <SkeletonBox className="h-6 sm:h-8 rounded-lg w-[80%]" delay="0.3s" />
              </div>
              
              {/* Button Skeleton */}
              <div className="hidden lg:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full">
                <SkeletonBox className="h-14 sm:h-16 w-48 rounded-full" delay="0.4s" />
              </div>
            </div>

            {/* Right Column (Image/Visual) */}
            <div className="flex-1 flex justify-center items-end relative order-2 lg:order-2 w-full mt-20 lg:mt-0">
              <div className="relative flex justify-center items-center">
                {/* Premium floating placeholder for the student image */}
                <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem]">
                   <SkeletonBox className="absolute inset-0 rounded-full" delay="0.5s" />
                   {/* Inner ring to give depth */}
                   <div className="absolute inset-4 rounded-full border border-white/5 bg-transparent backdrop-blur-lg"></div>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Mobile Button Skeleton */}
          <div className="flex lg:hidden flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10">
             <SkeletonBox className="h-14 w-full sm:w-48 rounded-full" delay="0.4s" />
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-20 md:h-28 lg:h-10 xl:h-34 bg-gradient-to-t from-black to-transparent z-20"></div>
    </section>
  );
};

export default BannerSkeleton;
