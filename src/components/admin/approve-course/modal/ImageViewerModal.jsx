import { X, ChevronLeft, Image, Download } from "lucide-react";

const ImageViewerModal = ({ imageUrl, title, onClose, setImageTitle }) => {
    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => { onClose(null); setImageTitle(null); }}
        >
            <div
                className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { onClose(null); setImageTitle(null); }}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <Image size={18} className="text-purple-400" />

                        <p className="text-sm font-semibold text-white">
                            {title || "Image Preview"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={imageUrl}
                            download target="_blank"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs"
                        >
                            <Download size={13} /> Download
                        </a>

                        <button
                            onClick={() => { onClose(null); setImageTitle(null); }}
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Image Body */}
                <div className="flex items-center justify-center p-6 bg-black">
                    <img
                        src={imageUrl}
                        alt="preview"
                        className="max-h-[70vh] object-contain rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageViewerModal;