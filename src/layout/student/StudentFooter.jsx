import { Globe, MapPin, Phone, ExternalLink, Shield, FileText, Lock, BadgeCheck, Wifi } from "lucide-react";
import { FaLinkedin, FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";

const StudentFooter = () => {
  return (
    <footer className="bg-black text-white border-t border-white/5">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-14 pb-10">

        {/* Top: Brand + tagline */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="WebBeetles" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold tracking-tight text-white">WebBeetles</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's premier online learning platform connecting ambitious learners with world-class instructors and industry-ready skills.
            </p>

            {/* Social icons row */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: FaFacebook, color: "hover:text-blue-500", label: "Facebook", href: "https://facebook.com" },
                { icon: FaXTwitter, color: "hover:text-white", label: "Twitter", href: "https://twitter.com" },
                { icon: FaInstagram, color: "hover:text-pink-500", label: "Instagram", href: "https://instagram.com" },
                { icon: FaLinkedin, color: "hover:text-blue-400", label: "LinkedIn", href: "https://linkedin.com" },
              ].map(({ icon: Icon, color, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${color} transition-all duration-200 hover:border-white/20 hover:bg-white/10`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Security Trust Badges */}
            <div className="flex flex-wrap gap-2 mt-6">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[10px] text-gray-400 font-medium">
                <Lock className="w-3 h-3 text-emerald-400" />
                SSL Secured
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[10px] text-gray-400 font-medium">
                <BadgeCheck className="w-3 h-3 text-blue-400" />
                Verified Platform
              </div>
             
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12 w-full md:w-auto">

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", to: "/" },
                  { label: "Courses", to: "/course" },
                  { label: "About", to: "/about" },
                  { label: "Contact", to: "/contact" },
                  { label: "Privacy Policy", to: "/privacy" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Features</h4>
              <ul className="space-y-3">
                {[
                  { label: "Online Courses", to: "/course" },
                  { label: "Interactive Lessons", to: "/course" },
                  { label: "Expert Instructors", to: "/about" },
                  { label: "Certification", to: "/course" },
                  { label: "Live Sessions", to: "/course" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Resources</h4>
              <ul className="space-y-3">
                {[
                  { label: "Terms of Service", to: "/terms" },
                  { label: "Privacy Policy", to: "/privacy" },
                  { label: "Help Center (FAQ)", to: "/contact" },
                  { label: "Learning Guides", to: "/course" },
                  { label: "Community Forum", to: "/contact" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li>
                  <a href="https://www.webbeetles.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-2.5 text-gray-400 hover:text-white transition-colors duration-200">
                    <Globe className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm whitespace-nowrap">www.webbeetles.com</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-2.5 text-gray-400">
                    <MapPin className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">Ecospace, Newtown,<br />Kolkata 700007</span>
                  </div>
                </li>
                <li>
                  <a href="tel:+919098909890" className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors duration-200">
                    <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">+91-9098909890</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.07]" />

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">

          {/* Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-gray-500 text-xs sm:text-sm">
              Copyright © 2026{" "}
              <span className="text-gray-300 font-medium">WebBeetles</span>
              {" "}— All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
              <Wifi className="w-3 h-3 text-emerald-500" />
              Platform uptime monitored 24/7 &nbsp;•&nbsp;
              <Lock className="w-3 h-3 text-emerald-500" />
              256-bit SSL encrypted
            </p>
          </div>

          {/* Legal + designer credit */}
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link to="/terms" className="hover:text-white transition-colors duration-200 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-white transition-colors duration-200 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Privacy Policy
              </Link>
            </div>
            {/* Brand credit */}
            <p className="text-gray-600 text-xs flex items-center gap-1">
              Designed &amp; Engineered by{" "}
              <a
                href="https://subhradeepnathportfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 inline-flex items-center gap-0.5 ml-1"
              >
                Subhradeep Nath <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;