import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabaseAdmin from '../../../util/supabase/supabaseAdmin';
import { Award, ShieldCheck, AlertTriangle, Calendar, User, BookOpen, ChevronRight, Loader2 } from 'lucide-react';

const CertificateVerification = () => {
  const { purchaseItemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certData, setCertData] = useState(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch purchase item and linked course and order
        const { data: purchaseItem, error: piError } = await supabaseAdmin
          .from('purchase_items')
          .select('id, created_at, course_id, purchases(user_id)')
          .eq('id', purchaseItemId)
          .maybeSingle();

        if (piError) throw piError;
        if (!purchaseItem) {
          setError("Certificate not found.");
          return;
        }

        // 2. Fetch student details
        const studentId = purchaseItem.purchases?.user_id;
        let studentName = "Student";
        if (studentId) {
          const { data: student, error: stdError } = await supabaseAdmin
            .from('students')
            .select('name')
            .eq('id', studentId)
            .maybeSingle();
          if (!stdError && student) {
            studentName = student.name;
          }
        }

        // 3. Fetch course details & instructor
        const { data: course, error: crsError } = await supabaseAdmin
          .from('courses')
          .select('title, instructor_id')
          .eq('id', purchaseItem.course_id)
          .maybeSingle();

        let courseTitle = "Course";
        let instructorName = "Instructor";

        if (!crsError && course) {
          courseTitle = course.title;
          
          if (course.instructor_id) {
            const { data: instructor, error: instError } = await supabaseAdmin
              .from('instructors')
              .select('name')
              .eq('id', course.instructor_id)
              .maybeSingle();
            if (!instError && instructor) {
              instructorName = instructor.name;
            }
          }
        }

        setCertData({
          id: purchaseItem.id,
          studentName,
          courseTitle,
          instructorName,
          date: purchaseItem.created_at
        });

      } catch (err) {
        console.error("Certificate verification error:", err);
        setError("An error occurred while verifying the certificate.");
      } finally {
        setLoading(false);
      }
    };

    if (purchaseItemId) {
      verifyCertificate();
    }
  }, [purchaseItemId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col overflow-hidden">
        {/* Skeleton Header */}
        <div className="w-full h-16 sm:h-20 border-b border-white/5 flex items-center justify-between px-4 sm:px-8">
          <div className="w-40 sm:w-48 h-8 bg-white/5 rounded-md animate-pulse"></div>
          <div className="w-28 sm:w-32 h-8 sm:h-10 bg-white/5 rounded-full animate-pulse"></div>
        </div>
        
        {/* Skeleton Main */}
        <div className="flex-1 flex flex-col xl:flex-row w-full">
          {/* Skeleton Certificate Area */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-12">
            <div className="w-full max-w-[1300px] aspect-[1.414/1] bg-white/[0.02] border border-white/5 rounded-sm animate-pulse flex flex-col p-8 sm:p-16 justify-between">
              <div className="w-full flex justify-between">
                <div className="w-24 sm:w-32 h-6 sm:h-8 bg-white/5 rounded"></div>
                <div className="w-32 sm:w-40 h-6 sm:h-8 bg-white/5 rounded"></div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-48 sm:w-64 h-4 sm:h-6 bg-white/5 rounded"></div>
                <div className="w-64 sm:w-96 h-8 sm:h-12 bg-white/5 rounded"></div>
                <div className="w-56 sm:w-72 h-4 sm:h-6 bg-white/5 rounded"></div>
              </div>
              <div className="w-full flex justify-between items-end">
                <div className="w-24 sm:w-32 h-12 sm:h-16 bg-white/5 rounded"></div>
                <div className="w-16 sm:w-24 h-16 sm:h-24 bg-white/5 rounded-full"></div>
                <div className="w-24 sm:w-32 h-12 sm:h-16 bg-white/5 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Skeleton Sidebar */}
          <div className="w-full xl:w-[450px] p-8 flex flex-col gap-6">
            <div className="w-48 h-8 bg-white/5 rounded animate-pulse mb-2"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-20 sm:h-24 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse flex items-center px-5 gap-4">
                 <div className="w-10 h-10 bg-white/5 rounded-lg shrink-0"></div>
                 <div className="flex flex-col gap-2 w-full">
                    <div className="w-24 h-3 bg-white/5 rounded"></div>
                    <div className="w-3/4 h-5 bg-white/5 rounded"></div>
                 </div>
              </div>
            ))}
            <div className="mt-4 w-full h-14 bg-white/5 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <div className="bg-[#120a1c] border border-red-500/20 max-w-md w-full p-8 rounded-2xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            {error || "We could not find a valid certificate matching this ID. Please check the URL or contact WebBeetles support."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Go to WebBeetles
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(certData.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans overflow-x-hidden">
      {/* Sleek Premium Header */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                <img src="/logo.png" alt="WebBeetles" className="h-10 w-10 animate-[spin_4s_linear_infinite] object-contain" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-white">WebBeetles</span>
            </Link>
            
            <div className="flex items-center gap-3 rounded-full border border-emerald-400/25 bg-emerald-950/20 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10">
                <ShieldCheck className="h-4 w-4 text-emerald-300" strokeWidth={2.2} />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200 sm:text-xs">
                  Verified Credential
                </div>
                <div className="mt-0.5 hidden font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400 sm:block">
                  ID {certData.id?.toUpperCase()?.substring(0, 12)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Full-Page Certificate View */}
      <main className="flex-1 flex flex-col xl:flex-row w-full h-[calc(100vh-73px)]">
        {/* Certificate Section - Takes maximum space */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-[#050508] relative overflow-auto hide-scrollbar">
           <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
              .hide-scrollbar::-webkit-scrollbar { display: none; }
              .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
           
           {/* Ambient Glow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
           
           {/* The Certificate */}
           <div className="w-full max-w-[1300px] flex justify-center drop-shadow-2xl">
              <div
                className="relative w-full aspect-[1.414/1] min-w-[800px] bg-[#fdfdfb] text-[#0f172a] p-8 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-between text-center rounded-sm z-10 border-[16px] border-double border-amber-600/30 before:absolute before:inset-3 before:border-2 before:border-[#1e293b] before:pointer-events-none after:absolute after:inset-[16px] after:border after:border-amber-600/30 after:pointer-events-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
              >
                {/* Subtle Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                  <img src="/logo.png" alt="" className="w-96 h-96 grayscale animate-pulse" />
                </div>

                {/* Top Row: Brand & ID */}
                <div className="flex items-center justify-between pb-3 relative z-10 border-b border-gray-200/60">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="WebBeetles" className="h-8 w-8 object-contain" />
                    <span className="text-sm tracking-tight text-[#1e293b] font-sans font-bold">WebBeetles</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-sans font-semibold">
                      Verified Credential
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 mt-1">
                      ID: {certData.id?.toUpperCase()?.substring(0, 12)}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="my-auto py-6 relative z-10 flex flex-col justify-center">
                  <p className="text-xs sm:text-sm text-[#b45309] uppercase tracking-[0.35em] font-sans font-bold mb-3">
                    Certificate of Completion
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500 italic mb-1">This is to certify that</p>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f172a] py-1 mb-2 tracking-wide font-serif">
                    {certData.studentName}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 italic mb-3">has successfully completed the instructional program and demonstrated proficiency in</p>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e293b] leading-snug max-w-2xl mx-auto font-sans uppercase tracking-widest">
                    {certData.courseTitle}
                  </h3>
                  
                  {/* Course details & highlights */}
                  <p className="text-[9px] sm:text-[10px] text-gray-500 max-w-xl mx-auto mt-4 font-sans leading-relaxed">
                    This program of study covers structured course modules, practical learning activities, and guided implementations delivered through WebBeetles.
                  </p>
                  
                  {/* Badges/Info Row */}
                  <div className="flex justify-center items-center gap-6 mt-5 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-gray-500 font-sans font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span> Course Modules
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span> Practical Learning
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span> Verified Completion
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Signatures & Gold Seal */}
                <div className="flex items-end justify-between pt-4 relative z-10 mt-auto border-t border-gray-200">
                  {/* Column 1: Instructor Signature */}
                  <div className="w-40 text-center">
                    <div className="border-b border-gray-300 pb-1 mb-1 h-8 flex items-end justify-center">
                      <span className="text-2xl text-gray-800" style={{ fontFamily: "'Alex Brush', cursive" }}>
                        {certData.instructorName}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-800 font-bold uppercase tracking-[0.2em] font-sans">{certData.instructorName}</p>
                    <p className="text-[8px] text-gray-400 uppercase tracking-widest font-sans">Lead Instructor</p>
                  </div>
                  
                  {/* Column 2: Official Gold Stamp/Seal */}
                  <div className="relative flex flex-col items-center justify-center select-none w-24 h-24 mb-1">
                    {/* Ribbons behind the seal */}
                    <div className="absolute -bottom-4 flex gap-2 w-10 h-16 justify-center -z-10">
                      <div className="w-3.5 h-full bg-gradient-to-b from-[#dc2626] to-[#991b1b] origin-top rotate-12 shadow-md rounded-b-sm relative">
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#fdfdfb]" style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}></div>
                      </div>
                      <div className="w-3.5 h-full bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d] origin-top -rotate-12 shadow-md rounded-b-sm relative">
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#fdfdfb]" style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}></div>
                      </div>
                    </div>
                    {/* SVG Seal */}
                    <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg w-full h-full">
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
                      <text className="text-[4.5px] uppercase font-sans font-extrabold fill-[#fef08a]" letterSpacing="1">
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
                  <div className="w-40 text-center">
                    <div className="border-b border-gray-300 pb-1 mb-1 h-8 flex items-end justify-center">
                      <span className="text-2xl text-gray-800" style={{ fontFamily: "'Alex Brush', cursive" }}>
                        Subhradeep Nath
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-800 font-bold uppercase tracking-[0.2em] font-sans">Subhradeep Nath</p>
                    <p className="text-[8px] text-gray-400 uppercase tracking-widest font-sans">Admin, WebBeetles</p>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-end justify-between border-t border-gray-200/60 pt-3 mt-4 text-left relative z-10 text-[8px] sm:text-[9px] text-gray-500 font-sans">
                  <div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">Date of Issue: </span>
                      <span>{formattedDate}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Verification URL: </span>
                      <a href={`${window.location.origin}/certificate/${certData.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 font-medium">
                        {`${window.location.origin}/certificate/${certData.id}`}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right leading-tight">
                      <span className="font-semibold text-gray-700 block text-[9px] sm:text-[10px]">Security Stamp & QR Code</span>
                      <span className="text-[7px] sm:text-[8px] uppercase tracking-wider">Scan to verify authenticity</span>
                    </div>
                    <div className="border border-gray-200 p-1 bg-white rounded shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(`${window.location.origin}/certificate/${certData.id}`)}`}
                        alt="QR Verification"
                        className="w-8 h-8 sm:w-10 sm:h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Sidebar details */}
        <div className="w-full xl:w-[450px] bg-[#050508] p-8 overflow-y-auto">
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Credential Details</h1>
              <p className="text-sm text-gray-400 leading-relaxed">
                This credential serves as official proof of completion and proficiency in the specified WebBeetles program.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors">
                <div className="flex gap-4 items-start">
                  <div className="bg-purple-500/20 p-2.5 rounded-lg border border-purple-500/30">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Recipient</div>
                    <div className="text-base font-bold text-white">{certData.studentName}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors">
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-500/20 p-2.5 rounded-lg border border-blue-500/30">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Course Completed</div>
                    <div className="text-base font-bold text-white leading-tight">{certData.courseTitle}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors">
                <div className="flex gap-4 items-start">
                  <div className="bg-amber-500/20 p-2.5 rounded-lg border border-amber-500/30">
                    <Calendar className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Completed On</div>
                    <div className="text-base font-bold text-white">{formattedDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="w-full py-4 bg-black border border-white/20 hover:bg-white/5 text-white rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300"
            >
              Explore WebBeetles
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CertificateVerification;
