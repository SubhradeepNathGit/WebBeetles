import React from "react";

const BannerSkeleton = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white overflow-hidden">
      <div className="pt-16 sm:pt-18 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 xl:px-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left order-1 lg:order-1 mt-12 -mb-10 lg:mt-0">
              <div className="h-12 sm:h-16 md:h-20 bg-white/20 rounded-lg w-3/4 mx-auto lg:mx-0 mb-4 sm:mb-6 animate-pulse"></div>
              <div className="h-12 sm:h-16 md:h-20 bg-white/20 rounded-lg w-1/2 mx-auto lg:mx-0 mb-4 sm:mb-6 animate-pulse"></div>
              <div className="h-6 sm:h-8 bg-white/10 rounded-lg w-5/6 mx-auto lg:mx-0 mb-6 sm:mb-8 animate-pulse"></div>
              
              <div className="hidden lg:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                <div className="h-12 sm:h-14 w-40 bg-white/20 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="flex-1 flex justify-center items-end relative order-2 lg:order-2 w-full mt-20 lg:mt-0">
              <div className="relative flex justify-center items-end">
                <div className="w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] bg-white/10 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="flex lg:hidden flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6">
             <div className="h-12 sm:h-14 w-full sm:w-40 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-20 md:h-28 lg:h-10 xl:h-34 bg-gradient-to-t from-black to-transparent z-0"></div>
    </section>
  );
};

export default BannerSkeleton;
