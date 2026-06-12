import React, { useState } from 'react';
import { Award, Share2, Copy, Check, Download, X, Linkedin, ExternalLink } from 'lucide-react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import toastifyAlert from '../../../../../util/alert/toastify';

const CertificateModal = ({ purchaseItemId, courseTitle, studentName, instructorName, date, onClose }) => {
  const [copied, setCopied] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const shareUrl = `${window.location.origin}/certificate/${purchaseItemId}`;
  const shareText = `I am excited to share that I have completed the course "${courseTitle}" on WebBeetles! Check out my verified certificate of completion here:`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toastifyAlert.success("Verification link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=600');
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=600');
  };

  const shareWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-[#060609] z-50 flex flex-col w-screen h-screen overflow-hidden print:static print:h-auto print:w-auto print:overflow-visible">
      {/* Printable Area Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0;
            padding: 0;
          }
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 209mm !important;
            max-width: none !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            background: #fdfdfb !important;
            z-index: 99999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0f] no-print">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span className="font-semibold text-white">Course Certificate</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Workspace: Left Side Preview, Right Side Share */}
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-[#060609]">
        {/* Left Side: Certificate Preview Area */}
        <div className="flex-grow flex items-center justify-center p-4 sm:p-8 overflow-auto bg-[#09090d]">
          <div className="w-full h-full flex items-center justify-center max-w-4xl max-h-[80vh]">
            <div
              id="printable-certificate"
              className="relative w-full aspect-[1.414/1] bg-[#fdfdfb] text-[#0f172a] p-4 sm:p-6 md:p-8 flex flex-col justify-between text-center shadow-2xl rounded-sm overflow-hidden z-10 border-[12px] border-double border-amber-600/30 before:absolute before:inset-2 before:border-2 before:border-[#1e293b] before:pointer-events-none after:absolute after:inset-[12px] after:border after:border-amber-600/30 after:pointer-events-none"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              {/* Subtle Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                <img src="/logo.png" alt="" className="w-72 h-72 sm:w-96 sm:h-96 grayscale animate-pulse" />
              </div>

              {/* Top Row: Brand & ID */}
              <div className="flex items-center justify-between pb-2 relative z-10 border-b border-gray-200/60">
                <div className="flex items-center gap-1.5">
                  <img src="/logo.png" alt="WebBeetles" className="h-6 w-6 object-contain" />
                  <span className="text-xs tracking-tight text-[#1e293b] font-sans font-bold">WebBeetles</span>
                </div>
                <div className="text-right">
                  <div className="text-[7px] text-gray-400 uppercase tracking-[0.2em] font-sans font-semibold">
                    Verified Credential
                  </div>
                  <div className="text-[8px] font-mono text-gray-500 mt-0.5">
                    ID: {purchaseItemId?.toUpperCase()?.substring(0, 12)}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="my-auto py-2 sm:py-4 relative z-10 flex flex-col justify-center">
                <p className="text-[10px] sm:text-xs text-[#b45309] uppercase tracking-[0.3em] font-sans font-bold mb-2">
                  Certificate of Completion
                </p>
                <p className="text-[9px] sm:text-[10px] text-gray-500 italic mb-0.5">This is to certify that</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f172a] py-0.5 mb-1.5 tracking-wide font-serif">
                  {studentName}
                </h2>
                <p className="text-[9px] sm:text-[10px] text-gray-500 italic mb-1.5">has successfully completed the instructional program and demonstrated proficiency in</p>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1e293b] leading-snug max-w-xl mx-auto font-sans uppercase tracking-wide">
                  {courseTitle}
                </h3>
                
                {/* Course details & highlights */}
                <p className="text-[8px] sm:text-[9px] text-gray-500 max-w-md mx-auto mt-2 font-sans leading-relaxed">
                  This rigorous program of study covers core design principles, software engineering methodologies, practical hands-on implementations, and cumulative performance assessments supervised by WebBeetles Board of Education.
                </p>
                
                {/* Badges/Info Row */}
                <div className="flex justify-center items-center gap-4 mt-3 text-[7px] sm:text-[8px] uppercase tracking-wider text-gray-500 font-sans font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-amber-500"></span> 40 Hours Coursework
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-amber-500"></span> Graded Assessments
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-amber-500"></span> Hands-on Projects
                  </span>
                </div>
              </div>

              {/* Bottom Row: Signatures & Gold Seal */}
              <div className="flex items-end justify-between pt-2 relative z-10 mt-auto border-t border-gray-150">
                {/* Column 1: Instructor Signature */}
                <div className="w-32 text-center">
                  <div className="border-b border-gray-300 pb-0.5 mb-0.5 h-6 flex items-end justify-center">
                    <span className="text-lg sm:text-xl text-gray-800" style={{ fontFamily: "'Alex Brush', cursive" }}>
                      {instructorName}
                    </span>
                  </div>
                  <p className="text-[8px] text-gray-800 font-bold uppercase tracking-wider font-sans">{instructorName}</p>
                  <p className="text-[7px] text-gray-400 uppercase tracking-widest font-sans">Lead Instructor</p>
                </div>
                
                {/* Column 2: Official Gold Stamp/Seal */}
                <div className="relative flex flex-col items-center justify-center select-none w-16 h-16 sm:w-20 sm:h-20 mb-0.5">
                  {/* Ribbons behind the seal */}
                  <div className="absolute -bottom-3 flex gap-1.5 w-8 h-12 justify-center -z-10">
                    <div className="w-2.5 h-full bg-gradient-to-b from-[#dc2626] to-[#991b1b] origin-top rotate-12 shadow-sm rounded-b-sm relative">
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#fdfdfb]" style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}></div>
                    </div>
                    <div className="w-2.5 h-full bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d] origin-top -rotate-12 shadow-sm rounded-b-sm relative">
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#fdfdfb]" style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}></div>
                    </div>
                  </div>
                  {/* SVG Seal */}
                  <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-md w-full h-full">
                    <defs>
                      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde047" />
                        <stop offset="50%" stopColor="#ca8a04" />
                        <stop offset="100%" stopColor="#854d0e" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="46" fill="url(#gold-grad)" stroke="#a16207" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="41" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#854d0e" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="32" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />
                    
                    <path id="seal-text-path" d="M 50,50 m -24,0 a 24,24 0 1,1 48,0 a 24,24 0 1,1 -48,0" fill="none" />
                    <text className="text-[4.5px] font-sans font-extrabold fill-[#fef08a]" letterSpacing="1">
                      <textPath href="#seal-text-path" startOffset="5%">
                        WebBeetles • Official Seal •
                      </textPath>
                    </text>
                    <g transform="translate(50,50)">
                        <image href="/logo.png" x="-18" y="-18" width="36" height="36" filter="brightness(0) invert(1)" />
                    </g>
                  </svg>
                </div>
                
                {/* Column 3: Admin Signature */}
                <div className="w-32 text-center">
                  <div className="border-b border-gray-300 pb-0.5 mb-0.5 h-6 flex items-end justify-center">
                    <span className="text-lg sm:text-xl text-gray-800" style={{ fontFamily: "'Alex Brush', cursive" }}>
                      Subhradeep Nath
                    </span>
                  </div>
                  <p className="text-[8px] text-gray-800 font-bold uppercase tracking-wider font-sans">Subhradeep Nath</p>
                  <p className="text-[7px] text-gray-400 uppercase tracking-widest font-sans">Admin, WebBeetles</p>
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex items-end justify-between border-t border-gray-200/60 pt-2 mt-3 text-left relative z-10 text-[7px] sm:text-[8px] text-gray-500 font-sans">
                <div>
                  <div className="mb-0.5">
                    <span className="font-semibold text-gray-700">Date of Issue: </span>
                    <span>{formattedDate}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Verification URL: </span>
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                      {shareUrl}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right leading-tight">
                    <span className="font-semibold text-gray-700 block">Security Stamp & QR Code</span>
                    <span className="text-[6px]">Scan to verify authenticity</span>
                  </div>
                  <div className="border border-gray-200 p-0.5 bg-white rounded shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(shareUrl)}`}
                      alt="QR Verification"
                      className="w-6 h-6 sm:w-7 h-7"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sharing & Info Sidebar */}
        <div className="w-full lg:w-[380px] bg-[#0c0c12] border-t lg:border-t-0 lg:border-l border-white/5 p-6 flex flex-col justify-between overflow-y-auto no-print">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Congratulations!</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              You've completed all course modules and document views. Your official certificate is generated and can be verified publicly.
            </p>

            {/* Verification Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="text-xs text-gray-400 mb-1">Certificate ID</div>
              <div className="text-sm font-mono text-white mb-3 break-all">{purchaseItemId}</div>
              <div className="text-xs text-gray-400 mb-1">Status</div>
              <div className="text-sm text-green-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Official & Verified
              </div>
            </div>

            {/* Share Actions */}
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-purple-400" />
              Share Certificate
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={shareLinkedIn}
                className="flex items-center justify-center gap-2 py-2.5 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
              <button
                onClick={shareTwitter}
                className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <FaXTwitter className="w-4 h-4 text-white" />
                Twitter / X
              </button>
              <button
                onClick={shareWhatsapp}
                className="flex items-center justify-center gap-2 py-2.5 bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#25d366] border border-[#25d366]/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors col-span-2"
              >
                <FaWhatsapp className="w-4.5 h-4.5" />
                WhatsApp
              </button>
            </div>
          </div>

          {/* Print & Link Actions */}
          <div className="space-y-3 pt-6 border-t border-white/5">
            <button
              onClick={copyToClipboard}
              className="w-full py-3 bg-[#16161f] hover:bg-[#20202d] text-white border border-white/10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
              {copied ? "Link Copied!" : "Copy Verification Link"}
            </button>
            <button
              onClick={handlePrint}
              className="w-full py-3 bg-[#0d0d10] text-[#eaeaea] border border-[#2e2e35] hover:bg-[#15151a] hover:border-[#42424c] hover:text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
