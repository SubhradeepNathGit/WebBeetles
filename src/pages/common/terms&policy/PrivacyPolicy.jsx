import React from "react";
import { Shield, Eye, Lock, UserCheck, RefreshCw, Cookie, Baby, Bell, MessageCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
    {
        icon: Eye,
        number: "01",
        title: "What We Collect — and Why",
        body: "We collect personal and non-personal information to provide and improve our learning experience.",
        list: [
            "Personal details such as name and email address",
            "Account login and profile data",
            "Payment and billing details (processed securely)",
            "Course progress and activity data",
        ],
    },
    {
        icon: UserCheck,
        number: "02",
        title: "How We Use Your Information",
        body: "Your data helps us deliver courses, provide customer support, and enhance our services.",
        list: [
            "To personalize your learning experience",
            "To send important notifications or updates",
            "To process transactions and secure user data",
            "To analyze user engagement and improve our content",
        ],
    },
    {
        icon: Lock,
        number: "03",
        title: "How We Protect Your Information",
        body: "We take your privacy seriously. All personal data is stored securely using encryption, protected servers, and regular system monitoring. Only authorized personnel can access it, and only when needed for legitimate reasons.",
        note: "Despite our best efforts, no digital platform is completely risk-free. We encourage you to keep your password strong and private.",
    },
    {
        icon: Shield,
        number: "04",
        title: "Data Security & Sharing",
        body: "We may share limited information only when necessary, such as:",
        list: [
            "With trusted service partners (payment processors or hosting providers).",
            "With legal authorities, if required by law.",
            "During business transfers (mergers or acquisitions), with proper safeguards.",
        ],
        highlight: "We never sell or rent your personal data to third parties.",
    },
    {
        icon: RefreshCw,
        number: "05",
        title: "Your Control Over Your Data",
        body: "You have full control of your personal information. You can:",
        list: [
            "Update or delete your account anytime.",
            "Request a copy of your stored data.",
            "Unsubscribe from promotional messages.",
            "Contact us to delete your information permanently.",
        ],
        contact: { label: "privacy@webbeetles.com", href: "mailto:privacy@webbeetles.com" },
    },
    {
        icon: Cookie,
        number: "06",
        title: "Cookies & Tracking",
        body: "We use cookies and similar technologies to enhance user experience, analyze traffic, and remember your preferences. You can adjust cookie settings through your browser anytime.",
    },
    {
        icon: Baby,
        number: "07",
        title: "For Young Learners",
        body: "Our platform is built for users aged 16 and above. If you are under 16, please use WebBeetles under the supervision of a parent or guardian. If we discover that a child's data has been collected accidentally, we'll delete it immediately.",
    },
    {
        icon: Bell,
        number: "08",
        title: "Updates to This Policy",
        body: "We may update this Privacy Policy periodically. The latest version will always be available on this page with an updated revision date.",
    },
    {
        icon: MessageCircle,
        number: "09",
        title: "Talk to Us",
        body: "If you have questions about this Privacy Policy, please reach out to us.",
        contact: { label: "Visit our Contact Page", href: "/contact", internal: true },
    },
];

const PrivacyPolicy = () => {
    return (
        <div className="bg-black text-gray-200 min-h-screen">

            {/* Hero */}
            <section className="relative bg-gradient-to-b from-[#6200e8] via-[#1e0052] to-black pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/20 blur-3xl rounded-full" />
                </div>
                <div className="relative max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-purple-300 border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 rounded-full mb-6">
                        <Shield className="w-3 h-3" /> Legal · Privacy
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        At WebBeetles, we care about your growth — and your privacy. This policy explains how we collect, use, protect, and respect your data while you learn on our platform.
                    </p>
                    <p className="text-gray-500 text-xs mt-6">Last updated: June 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-6">
                {sections.map(({ icon: Icon, number, title, body, list, note, highlight, contact }) => (
                    <div key={number} className="group bg-zinc-900/30 hover:bg-zinc-900/50 border border-white/[0.06] hover:border-purple-500/20 rounded-2xl p-6 sm:p-8 transition-all duration-300">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500/60 mb-1 block">{number}</span>
                                <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
                            </div>
                        </div>
                        <div className="pl-14 space-y-3">
                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{body}</p>
                            {list && (
                                <ul className="space-y-2 mt-2">
                                    {list.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                                            <ChevronRight className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {note && <p className="text-gray-500 text-sm mt-2 italic">{note}</p>}
                            {highlight && (
                                <div className="mt-4 flex items-start gap-2.5 bg-purple-500/8 border border-purple-500/20 rounded-xl px-4 py-3">
                                    <Shield className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-purple-200 text-sm font-medium">{highlight}</p>
                                </div>
                            )}
                            {contact && (
                                <div className="mt-3">
                                    {contact.internal ? (
                                        <Link to={contact.href} className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                                            {contact.label} <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <a href={contact.href} className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                                            {contact.label} <ChevronRight className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Bottom CTA */}
                <div className="text-center pt-8 border-t border-white/[0.06]">
                    <p className="text-gray-500 text-sm">
                        Also read our{" "}
                        <Link to="/terms" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Terms of Service</Link>
                        {" "}· © 2026 WebBeetles. All rights reserved.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;