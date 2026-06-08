import React from 'react';

const DashboardSkeleton = ({ role }) => {
  const isStudent = role === 'student';
  const isInstructor = role === 'instructor';
  
  const accentColor = isStudent 
    ? 'bg-purple-500/20' 
    : isInstructor 
    ? 'bg-gray-500/20' 
    : 'bg-emerald-500/20';
    
  const pulseColor = isStudent 
    ? 'bg-purple-500/10' 
    : isInstructor 
    ? 'bg-gray-500/10' 
    : 'bg-emerald-500/10';

  return (
    <div className="min-h-screen bg-black flex w-full fixed inset-0 z-50">
      {/* Sidebar Skeleton (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-black/50 p-4 shrink-0">
        <div className={`h-10 w-3/4 rounded-lg mb-8 animate-pulse ${accentColor}`}></div>
        
        <div className="space-y-6 mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse px-2">
              <div className={`w-6 h-6 rounded-md ${pulseColor}`}></div>
              <div className={`h-4 w-2/3 rounded-md ${pulseColor}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Skeleton */}
        <header className="h-16 border-b border-white/5 bg-black/50 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3 lg:hidden">
            <div className={`w-6 h-6 rounded-md animate-pulse ${pulseColor}`}></div>
            <div className={`h-6 w-24 rounded-md animate-pulse ${accentColor}`}></div>
          </div>
          <div className="hidden lg:block"></div> {/* Spacer */}
          
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full animate-pulse ${pulseColor}`}></div>
            <div className={`w-8 h-8 rounded-full animate-pulse ${pulseColor}`}></div>
            <div className={`w-10 h-10 rounded-full animate-pulse ${accentColor}`}></div>
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="flex-1 p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header section */}
            <div className="space-y-3 mb-8">
              <div className="h-8 w-1/4 rounded-lg animate-pulse bg-white/[0.06]"></div>
              <div className="h-4 w-1/3 rounded-md animate-pulse bg-white/[0.03]"></div>
            </div>

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-4 w-1/2 rounded animate-pulse bg-white/[0.03]"></div>
                    <div className="w-10 h-10 rounded-xl animate-pulse bg-white/[0.06]"></div>
                  </div>
                  <div className="h-8 w-3/4 rounded-lg mb-3 animate-pulse bg-white/[0.03]"></div>
                  <div className="h-3 w-1/4 rounded animate-pulse bg-white/[0.03]"></div>
                </div>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-xl p-6 min-h-[350px]">
                <div className="h-6 w-1/4 rounded-md mb-8 animate-pulse bg-white/[0.03]"></div>
                <div className="space-y-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 w-full rounded-lg animate-pulse bg-white/[0.03]"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 min-h-[350px] flex flex-col">
                <div className="h-6 w-1/3 rounded-md mb-8 animate-pulse bg-white/[0.03]"></div>
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                   <div className="w-40 h-40 rounded-full animate-pulse bg-white/[0.06]"></div>
                   <div className="w-full flex flex-col items-center gap-3">
                     <div className="h-4 w-1/2 rounded animate-pulse bg-white/[0.03]"></div>
                     <div className="h-4 w-3/4 rounded animate-pulse bg-white/[0.03]"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
