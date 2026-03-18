import { useState } from "react";
import { X, ChevronLeft, Video, ExternalLink } from "lucide-react";

const VideoPlayerModal = ({ videoUrl, title, onClose, setVideoTitle }) => {
    const [loading, setLoading] = useState(true);

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => { onClose(null); setVideoTitle(null); }}
        >
            <div
                className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { onClose(null); setVideoTitle(null); }}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <Video size={18} className="text-purple-400" />

                        <p className="text-sm font-semibold text-white">
                            {title || "Video Preview"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-xs"
                        >
                            <ExternalLink size={13} /> Open in Tab
                        </a>

                        <button
                            onClick={() => { onClose(null); setVideoTitle(null); }}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Video Body */}
                <div className="flex-1 flex items-center justify-center bg-black">
                    {loading && (
                        <p className="text-gray-400 text-sm absolute">Loading video...</p>
                    )}

                    <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-contain"
                        onLoadedData={() => setLoading(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerModal;