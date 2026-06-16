import React from "react";
import { FileText, UserCheck, Shield, Lock, CreditCard, BookOpen, Link2, AlertTriangle, Ban, RefreshCw, Globe, MessageCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
    {
        icon: FileText,
        number: "01",
        title: "Acceptance of Terms",
        body: "By accessing or using WebBeetles, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, you may not use the Platform.",
    },
    {
        icon: UserCheck,
        number: "02",
        title: "Use of Our Services",
        body: "You agree to use our services only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the platform.",
        list: [
            "Do not attempt to hack, reverse engineer, or disrupt our site.",
            "Do not upload or share offensive or illegal content.",
            "Use your real name and accurate information when registering.",
        ],
    },
    {
        icon: Shield,
        number: "03",
        title: "Eligibility",
        body: "To use our services, you must:",
        list: [
            "Be at least 16 years old or have parental/guardian consent.",
            "Provide accurate and complete registration information.",
            "Agree to comply with all applicable laws and regulations.",
        ],
    },
    {
        icon: Lock,
        number: "04",
        title: "Account Responsibilities",
        body: "When you create an account on WebBeetles, you agree to provide accurate, current, and complete information and to keep your login credentials secure and confidential.",
        note: "You are responsible for all activities under your account. Notify us immediately if you suspect unauthorized access.",
    },
    {
        icon: BookOpen,
        number: "05",
        title: "Acceptable Use of Platform",
        body: "You agree to use our Platform only for lawful educational purposes. You must not:",
        list: [
            "Copy, modify, or distribute course materials without permission.",
            "Use the Platform to post harmful, misleading, or illegal content.",
            "Attempt to hack, disrupt, or gain unauthorized access to our systems.",
        ],
    },
    {
        icon: CreditCard,
        number: "06",
        title: "Payments & Refunds",
        body: "Payments for courses or services must be completed before access is granted. Refunds, if applicable, are subject to our refund policy.",
        note: "All transactions are processed securely via trusted payment gateways.",
    },
    {
        icon: BookOpen,
        number: "07",
        title: "Intellectual Property",
        body: "All content on WebBeetles — including courses, videos, text, graphics, and branding — is owned by or licensed to us.",
        highlight: "Violations of copyright or intellectual property rights may result in account suspension or legal action.",
    },
    {
        icon: Link2,
        number: "08",
        title: "Third-Party Links",
        body: "WebBeetles may contain links to third-party websites or resources. We are not responsible for the content, accuracy, or practices of such websites and do not endorse them.",
    },
    {
        icon: AlertTriangle,
        number: "09",
        title: "Limitation of Liability",
        body: "We are not responsible for any direct, indirect, or incidental damages resulting from your use of our platform. Our total liability shall not exceed the amount paid by you for the relevant course.",
    },
    {
        icon: Ban,
        number: "10",
        title: "Termination",
        body: "WebBeetles reserves the right to suspend or terminate your account if you violate these Terms or misuse our services. Upon termination, your right to access our Platform will immediately cease.",
    },
    {
        icon: RefreshCw,
        number: "11",
        title: "Modifications to Terms",
        body: "We may update or modify these Terms at any time. The latest version will always be available on our website, and continued use of the Platform after changes indicates your acceptance.",
    },
    {
        icon: Globe,
        number: "12",
        title: "Governing Law",
        body: "These Terms shall be governed by and interpreted in accordance with the laws of India, without regard to its conflict of law principles.",
    },
    {
        icon: MessageCircle,
        number: "13",
        title: "Contact Information",
        body: "If you have questions or concerns about these terms, please contact us.",
        contact: { label: "support@webbeetles.com", href: "mailto:support@webbeetles.com" },
    },
];

const TermsOfService = () => {
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
                        <FileText className="w-3 h-3" /> Legal · Terms
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        Welcome to WebBeetles — a professional learning platform. By accessing our services, you agree to comply with and be bound by these Terms. Please read them carefully.
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
                                    <a href={contact.href} className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                                        {contact.label} <ChevronRight className="w-4 h-4" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Bottom CTA */}
                <div className="text-center pt-8 border-t border-white/[0.06]">
                    <p className="text-gray-500 text-sm">
                        Also read our{" "}
                        <Link to="/privacy" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Privacy Policy</Link>
                        {" "}· © 2026 WebBeetles. All rights reserved.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default TermsOfService;