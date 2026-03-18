import React from 'react';
import { FileText, TrendingUp, Users, Award } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <div className="bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold">
            Easy{" "}
            <span className="bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
              Courses
            </span>{" "}
            to Smarter Learning
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Lines - Hidden on mobile */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 z-0">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center">
                <div className="w-16 h-16"></div>
                <div className="flex-1 h-0.5 bg-gray-700"></div>
                <div className="w-16 h-16"></div>
                <div className="flex-1 h-0.5 bg-gray-700"></div>
                <div className="w-16 h-16"></div>
                <div className="flex-1 h-0.5 bg-gray-700"></div>
                <div className="w-16 h-16"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
            {/* Step 1 */}
            <div className="group cursor-pointer">
              <div className="relative mb-6 lg:mb-8">
                <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center relative group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-purple-700 group-hover:border-purple-600 group-hover:scale-110 transition-all duration-300">
                  <FileText className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 group-hover:border-purple-600 transition-colors">
                    <span className="text-gray-400 group-hover:text-white font-bold text-sm transition-colors">
                      01
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-purple-600 transition-colors">
                  Sign Up for Free
                </h3>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed max-w-xs mx-auto">
                  Create your account in seconds
                  <br />
                  no hidden fees or setup
                  <br />
                  required.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group cursor-pointer">
              <div className="relative mb-6 lg:mb-8">
                <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center relative group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-purple-700 group-hover:border-purple-600 group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 group-hover:border-purple-600 transition-colors">
                    <span className="text-gray-400 group-hover:text-white font-bold text-sm transition-colors">
                      02
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-purple-600 transition-colors">
                  Pick Your Course
                </h3>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed max-w-xs mx-auto">
                  Browse top-quality courses in
                  <br />
                  various categories tailored to
                  <br />
                  your goals.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group cursor-pointer">
              <div className="relative mb-6 lg:mb-8">
                <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center relative group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-purple-700 group-hover:border-purple-600 group-hover:scale-110 transition-all duration-300">
                  <Users className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 group-hover:border-purple-600 transition-colors">
                    <span className="text-gray-400 group-hover:text-white font-bold text-sm transition-colors">
                      03
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-purple-600 transition-colors">
                  Learn at Your Own Pace
                </h3>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed max-w-xs mx-auto">
                  Access lessons anytime, anywhere. Enjoy
                  <br />
                  flexible learning with videos, quizzes,
                  <br />
                  and assignments.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group cursor-pointer">
              <div className="relative mb-6 lg:mb-8">
                <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center relative group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-purple-700 group-hover:border-purple-600 group-hover:scale-110 transition-all duration-300">
                  <Award className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 group-hover:border-purple-600 transition-colors">
                    <span className="text-gray-400 group-hover:text-white font-bold text-sm transition-colors">
                      04
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-purple-600 transition-colors">
                  Earn Your Certificate
                </h3>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed max-w-xs mx-auto">
                  Complete the course and receive an
                  <br />
                  official digital certificate to boost your
                  <br />
                  resume and career.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
