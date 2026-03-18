import React from 'react'
import { Edit2, Eye, EyeIcon, FileText, Play, PlayCircle, Trash2 } from 'lucide-react';
import { formatDateDDMMYY } from '../../../../../../util/dateFormat/dateFormat';

const InstructorLessonItem = ({ section,lesson, setUpdateData, setDeletedData, setShowDeleteLectureModal, setShowVideoModal, setShowUploadModal, selectedCourse }) => {
    const iconMap = { video: PlayCircle, quiz: FileText };
    const Icon = iconMap[lesson.type] || PlayCircle;

    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium">{lesson?.video_title ?? 'N/A'}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="capitalize">{lesson.type ?? 'N/A'}</span>
                        {lesson.type == 'video' && (
                            <>
                                <span>•</span>
                                <span>{lesson?.duration ?? 'N/A'}</span>
                            </>
                        )}
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{lesson?.views ?? 0} view{lesson?.views?.length > 1 ? 's' : ''}</span>
                        </div>
                        {lesson?.created_at && (
                            <>
                                <span>•</span>
                                <span>Uploaded: {formatDateDDMMYY(lesson?.created_at)}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setShowVideoModal(lesson)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
                    {lesson?.type === 'video' ? (
                        <> <Play className="w-4 h-4" /> Play </>) : (<><EyeIcon className="w-4 h-4" /> View</>
                    )}
                </button>
                <button className={`px-4 py-2 ${!selectedCourse?.is_completed ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer' : 'bg-purple-400 cursor-not-allowed'} rounded-lg text-sm font-medium transition-colors`}
                    onClick={() => { if (!selectedCourse?.is_completed) { setUpdateData(lesson); setShowUploadModal(true); } }} disabled={selectedCourse?.is_completed}>
                    <Edit2 className="w-4 h-4" />
                </button>
                {section.type !== 'demo' &&
                    <button onClick={() => { if (!selectedCourse?.is_completed) { setDeletedData({ lectureId: lesson?.id, lectureName: lesson?.lecture_name, doc_type: lesson?.type, courseId: lesson?.course_id, video_title: lesson?.video_title }); setShowDeleteLectureModal(true); } }} disabled={selectedCourse?.is_completed}
                        className={`px-4 py-2 ${!selectedCourse?.is_completed ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-red-400 cursor-not-allowed'} rounded-lg text-sm font-medium transition-colors`}>
                        <Trash2 className="w-4 h-4" />
                    </button>}
            </div>
        </div>
    );
}

export default InstructorLessonItem