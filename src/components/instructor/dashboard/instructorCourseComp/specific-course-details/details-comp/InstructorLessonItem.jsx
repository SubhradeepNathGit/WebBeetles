import React from 'react'
import { Edit2, Eye, EyeIcon, FileText, Play, PlayCircle, Trash2 } from 'lucide-react';
import { formatDateDDMMYY } from '../../../../../../util/dateFormat/dateFormat';

const InstructorLessonItem = ({ section, lesson, setUpdateData, setDeletedData, setShowDeleteLectureModal, setShowVideoModal, setShowUploadModal, selectedCourse }) => {
    const iconMap = { video: PlayCircle, quiz: FileText };
    const Icon = iconMap[lesson.type] || PlayCircle;

    return (
        <div className="group flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-zinc-800/30 transition-all duration-200 border-b border-zinc-800/40 last:border-b-0">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0 group-hover:border-red-500/30 group-hover:bg-red-500/15 transition-all duration-300">
                    <Icon className="w-5 h-5 text-red-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm sm:text-base text-zinc-200 group-hover:text-white transition-colors truncate">
                        {lesson?.video_title ?? 'N/A'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-500 mt-0.5">
                        <span className="capitalize">{lesson.type ?? 'N/A'}</span>
                        {lesson.type == 'video' && (
                            <>
                                <span className="text-zinc-700">•</span>
                                <span>{lesson?.duration ?? 'N/A'}</span>
                            </>
                        )}
                        <span className="text-zinc-700">•</span>
                        <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{lesson?.views ?? 0} view{lesson?.views?.length > 1 ? 's' : ''}</span>
                        </div>
                        {lesson?.created_at && (
                            <>
                                <span className="text-zinc-700">•</span>
                                <span>Uploaded: {formatDateDDMMYY(lesson?.created_at)}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0 ml-3">
                {/* Play / View */}
                <button 
                    onClick={() => setShowVideoModal(lesson)} 
                    className="px-3.5 py-2 bg-zinc-800/80 border border-zinc-700/60 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all duration-300 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                    {lesson?.type === 'video' ? (
                        <><Play className="w-3.5 h-3.5 text-red-400" /> Play</>
                    ) : (
                        <><EyeIcon className="w-3.5 h-3.5 text-blue-400" /> View</>
                    )}
                </button>

                {/* Edit */}
                <button 
                    className={`p-2 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center justify-center
                        ${!selectedCourse?.is_completed 
                            ? 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 cursor-pointer active:scale-95' 
                            : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-600 cursor-not-allowed'}`}
                    onClick={() => { if (!selectedCourse?.is_completed) { setUpdateData(lesson); setShowUploadModal(true); } }} 
                    disabled={selectedCourse?.is_completed}
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                {section.type !== 'demo' &&
                    <button 
                        onClick={() => { if (!selectedCourse?.is_completed) { setDeletedData({ lectureId: lesson?.id, lectureName: lesson?.lecture_name, doc_type: lesson?.type, courseId: lesson?.course_id, video_title: lesson?.video_title }); setShowDeleteLectureModal(true); } }} 
                        disabled={selectedCourse?.is_completed}
                        className={`p-2 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center justify-center
                            ${!selectedCourse?.is_completed 
                                ? 'bg-red-500/8 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 cursor-pointer active:scale-95' 
                                : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-600 cursor-not-allowed'}`}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                }
            </div>
        </div>
    );
}

export default InstructorLessonItem