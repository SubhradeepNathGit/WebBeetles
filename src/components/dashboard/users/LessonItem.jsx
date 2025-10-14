import { CheckCircle, FileText, Lock, PlayCircle, X } from 'lucide-react';
import React, { useState } from 'react'

const LessonItem = ({ lesson }) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const iconMap = { video: PlayCircle, quiz: FileText, assignment: FileText };
    const Icon = PlayCircle;

    return (
        <>
            {/* LESSON ROW */}
            <div
                className={`flex items-center justify-between p-4 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0 ${!lesson.isPreview ? "opacity-50" : "cursor-pointer"
                    }`}
                onClick={() => {
                    if (lesson.isPreview) setIsPlaying(true);
                }}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${lesson.completed
                            ? "bg-green-500" : !lesson.isPreview ? "bg-gray-700" : "bg-purple-600"}`} >
                        {lesson.completed ? (
                            <CheckCircle className="w-4 h-4" />
                        ) : lesson.locked ? (
                            <Lock className="w-4 h-4" />
                        ) : (
                            <Icon className="w-4 h-4" />
                        )}
                    </div>

                    <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>{lesson.duration}</span>
                        </div>
                    </div>
                </div>

                {lesson.isPreview && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsPlaying(true);
                        }}
                        className={`px-4 py-2 ${lesson.completed
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-purple-600 hover:bg-purple-700"
                            } rounded-lg text-sm font-medium transition-colors`}
                    >
                        {lesson.completed ? "Review" : "Start"}
                    </button>
                )}
            </div>

            {/* VIDEO */}
            {isPlaying && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative w-[90%] md:w-[70%] lg:w-[60%] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                        {/* Close button */}
                        <button
                            onClick={() => setIsPlaying(false)}
                            className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 z-10 transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* LOCAL VIDEO PLAYER */}
                        <video
                            className="w-full h-full rounded-2xl"
                            src={`http://localhost:3005${lesson.videoUrl}`}
                            controls
                            autoPlay
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </>
    );
}

export default LessonItem