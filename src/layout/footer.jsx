
import { Globe, MapPin, Phone } from "lucide-react";

import { FaFacebook, FaXTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa6";


const Footer = () => {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">

          {/* Quick Links */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 lg:mb-6 text-white">Quick Links:</h3>
            <ul className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  About
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 lg:mb-6 text-white">Features</h3>
            <ul className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Online Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Interactive Lessons
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Expert Instructors
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Certification
                </a>
              </li>

            </ul>
          </div>

          {/* Resource */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 lg:mb-6 text-white">Resource</h3>
            <ul className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Help Center (FAQ)
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Learning Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base block py-1">
                  Community Forum
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 lg:mb-6 text-white">
              Social Media
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors duration-300 py-1"
                >
                  <FaFacebook className="w-5 h-5 text-blue-600" />
                  <span className="text-sm sm:text-base">Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors duration-300 py-1"
                >
                  <FaXTwitter className="w-5 h-5 text-white" />
                  <span className="text-sm sm:text-base">Twitter (X)</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors duration-300 py-1"
                >
                  <FaInstagram className="w-5 h-5 text-pink-500" />
                  <span className="text-sm sm:text-base">Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors duration-300 py-1"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <span className="text-sm sm:text-base">WhatsApp</span>
                </a>
              </li>

            </ul>
          </div>


          {/* Contact Us */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 lg:mb-6 text-white">Contact Us</h3>
            <ul className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <li>
                <a href="#" className="flex items-start gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors duration-300 py-1 group">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mt-0.5 flex-shrink-0 group-hover:text-purple-400" />
                  <span className="leading-tight text-sm sm:text-base break-all">www.webbeetles.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 sm:gap-3 text-gray-400 py-1">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="leading-tight text-sm sm:text-base">Ecospace, Newtown, Kolkata 700007</span>
                </div>
              </li>
              <li>
                <a href="tel:0761-8523-398" className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors duration-300 py-1 group">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0 group-hover:text-purple-400" />
                  <span className="text-sm sm:text-base">+91-9098909890</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1">
              Copyright © 2025 WebBeetles
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm order-1 sm:order-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;