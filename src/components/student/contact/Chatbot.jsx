import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, X, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';
import AIBotAnimation from '../../../assets/AI bot.json';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am the WebBeetles Assistant. I am here to help you navigate our premium online learning platform, answer any questions about our courses, or assist you with any issues. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("Gemini API key is missing. Please configure VITE_GEMINI_API_KEY in your .env file.");
            }

            const prompt = `You are the official AI Assistant for "WebBeetles", a premium online learning platform.
            Your goal is to provide exceptional, market-ready customer support. 
            Tone: Professional, highly empathetic, knowledgeable, and concise.
            Context: WebBeetles offers high-quality courses, expert instructors, and industry-recognized certifications. 
            Instructions:
            - If a user has a technical issue, guide them politely or offer to escalate.
            - If they ask about courses, enthusiastically explain that we offer a wide variety of premium courses.
            - Do not invent false information or links. If you don't know something, tell them to use the Contact Us page.
            - Keep responses relatively brief and easy to read.

            Conversation History:
            ${messages.slice(-5).map(m => `${m.role === 'assistant' ? 'AI' : 'User'}: ${m.content}`).join('\n')}
            User: ${userMessage.content}
            AI:`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMsg = errorData?.error?.message || `API Error: ${response.status} ${response.statusText}`;
                throw new Error(errorMsg);
            }

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";

            setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage = error.message.includes("Failed to fetch") 
                ? "API Error: Please check your Gemini API key or internet connection. If you just added the key to .env, restart your dev server."
                : `Error: ${error.message}`;
            setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Backdrop Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-purple-950/20 backdrop-blur-2xl border-l border-white/[0.05] flex flex-col z-[70] transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header */}
                <div className="relative p-6 flex justify-between items-center text-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-white">WebBeetles AI</span>
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 uppercase tracking-wider mt-0.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all duration-300">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-5 py-2 space-y-6 z-10 scrollbar-hide">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                                {msg.role !== 'user' && (
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 mb-1 border border-white/[0.05]">
                                        <Bot size={12} className="text-white" />
                                    </div>
                                )}
                                <div className={`p-4 text-[15px] leading-relaxed transition-all duration-300 ${
                                    msg.role === 'user' 
                                    ? 'bg-purple-600/90 backdrop-blur-md text-white rounded-3xl rounded-br-sm' 
                                    : 'bg-white/[0.05] backdrop-blur-md text-gray-200 rounded-3xl rounded-bl-sm border border-white/[0.05]'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[85%] flex-row items-end">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 mb-1 border border-white/[0.05]">
                                    <Bot size={12} className="text-white" />
                                </div>
                                <div className="p-4 rounded-3xl rounded-bl-sm bg-white/[0.05] backdrop-blur-md border border-white/[0.05] text-gray-400 flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Floating Pill */}
                <div className="p-5 pb-8 z-10 mt-auto">
                    <div className="relative flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-full p-2 focus-within:bg-white/[0.06] focus-within:border-purple-500/30 transition-all duration-300">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Message AI..."
                            className="w-full bg-transparent text-[15px] text-white placeholder-gray-500/80 pl-4 py-2 outline-none resize-none min-h-[40px] max-h-[120px] scrollbar-hide"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="w-10 h-10 rounded-full bg-purple-600/90 backdrop-blur-md text-white flex items-center justify-center flex-shrink-0 hover:bg-purple-500 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-purple-600/90 mr-0.5"
                        >
                            <Send size={16} className={input.trim() ? "translate-x-[1px] -translate-y-[1px]" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 flex items-center justify-center transition-all duration-300 hover:scale-110 z-[55] animate-bounce-slow drop-shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:drop-shadow-[0_0_25px_rgba(147,51,234,0.6)] cursor-pointer"
                    aria-label="Open AI Assistant"
                >
                    <Lottie animationData={AIBotAnimation} loop={true} className="w-32 h-32" />
                </button>
            )}
        </>
    );
};

export default Chatbot;
