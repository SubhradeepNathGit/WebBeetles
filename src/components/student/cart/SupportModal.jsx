import React from 'react'
import { X, Phone, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SupportModal = ({setShowSupportModal}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Contact Support</h3>
                    <button
                        onClick={() => setShowSupportModal(false)}
                        className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer text-white/60 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Call Us</p>
                                <p className="text-sm text-white/50">Mon-Sat, 9 AM - 7 PM</p>
                            </div>
                        </div>
                        <a href="tel:+911800000000" className="text-purple-400 font-bold text-lg hover:text-purple-300 transition-colors">
                            +91 1800-000-000
                        </a>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Email Us</p>
                                <p className="text-sm text-white/50">24/7 Support</p>
                            </div>
                        </div>
                        <a href="mailto:support@webbeetles.com" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                            support@webbeetles.com
                        </a>
                    </div>

                    <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-purple-300" />
                            </div>
                            <div>
                                <p className="font-semibold">Live Chat</p>
                                <p className="text-sm text-white/60">Instant responses</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/60">
                            Use the chat icon in the bottom-right corner to start a conversation with our support team.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default SupportModal