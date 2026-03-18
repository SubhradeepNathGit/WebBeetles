import { useState } from "react";
import { X, FileText, Download, ExternalLink, ChevronLeft, Loader2 } from "lucide-react";

const DocumentViewerModal = ({ app, onClose }) =>{

    const [iframeLoading, setIframeLoading] = useState(true);

    const docUrl = app.document;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <FileText size={18} className="text-purple-400" />
                        <div>
                            <p className="text-sm font-semibold text-white">{app.documentName || "Qualification Document"}</p>
                            <p className="text-xs text-gray-500">Submitted by {app.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {docUrl && (
                            <>
                                <a
                                    href={docUrl}
                                    download={app.documentName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg transition-colors text-xs font-medium"
                                >
                                    <Download size={13} /> Download
                                </a>
                                <a
                                    href={docUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg transition-colors text-xs font-medium"
                                >
                                    <ExternalLink size={13} /> Open in Tab
                                </a>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all ml-2 cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Viewer Body */}
                <div className="flex-1 overflow-hidden relative rounded-b-2xl bg-[#111]">
                    {docUrl ? (
                        <>
                            {iframeLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-[#111]">
                                    <Loader2 size={32} className="text-purple-500 animate-spin" />
                                    <p className="text-sm text-gray-500">Loading document…</p>
                                </div>
                            )}
                            <iframe
                                src={docUrl}
                                title={app.documentName}
                                className="w-full h-full border-0 rounded-b-2xl"
                                onLoad={() => setIframeLoading(false)}
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <FileText size={36} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-lg mb-1">{app.documentName}</p>
                                <p className="text-gray-500 text-sm max-w-sm">
                                    The document uploaded by <span className="text-gray-300">{app.name}</span> during signup will appear here once the Supabase storage bucket is connected.
                                </p>
                            </div>
                            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs px-4 py-2 rounded-lg">
                                Supabase bucket integration pending
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DocumentViewerModal;