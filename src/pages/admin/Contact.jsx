import React, { useState } from 'react';
import { useFetchContactMessages } from '../../tanstack/query/fetchContactMessages';
import { Loader2, MailOpen, User, Mail, Calendar, Inbox } from 'lucide-react';
import { formatDateDDMMYY } from '../../util/dateFormat/dateFormat';

const Contact = () => {
    const { data: messages, isLoading, error } = useFetchContactMessages();
    const [selectedMsgId, setSelectedMsgId] = useState(null);

    const selectedMsg = messages?.find(m => m.id === selectedMsgId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">
                Failed to load messages. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Contact Messages</h1>
                <p className="text-gray-400">Manage and view messages from users.</p>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
                {/* Left Pane - Message List */}
                <div className="w-1/3 bg-[#111] rounded-2xl border border-white/5 shadow-2xl flex flex-col min-w-[300px] overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-[#151515]">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <Inbox size={18} className="text-emerald-500" /> Inbox ({messages?.length || 0})
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2">
                        {messages?.length > 0 ? (
                            messages.map((msg) => (
                                <button
                                    key={msg.id}
                                    onClick={() => setSelectedMsgId(msg.id)}
                                    className={`w-full text-left p-4 rounded-xl transition-all border ${selectedMsgId === msg.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-white truncate pr-2 text-sm">{msg.name}</span>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">{formatDateDDMMYY(msg.created_at)}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 truncate mb-1">{msg.subject}</div>
                                    <div className="text-xs text-gray-500 truncate">{msg.message}</div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 text-sm py-8">No messages found.</div>
                        )}
                    </div>
                </div>

                {/* Right Pane - Message Details */}
                <div className="flex-1 bg-[#111] rounded-2xl border border-white/5 shadow-2xl flex flex-col overflow-hidden relative">
                    {selectedMsg ? (
                        <>
                            <div className="p-6 border-b border-white/5 bg-[#151515] flex-shrink-0">
                                <h2 className="text-xl font-bold text-white mb-4">{selectedMsg.subject}</h2>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold flex-shrink-0">
                                            {selectedMsg.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-200 font-medium">{selectedMsg.name}</span>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="flex items-center gap-1"><Mail size={12} /> {selectedMsg.email}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {formatDateDDMMYY(selectedMsg.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                    {selectedMsg.message}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                            <MailOpen className="w-16 h-16 text-gray-700 mb-4" />
                            <p>Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Contact