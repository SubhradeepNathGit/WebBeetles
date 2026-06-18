import React from 'react'
import InstructorLessonItem from './InstructorLessonItem';
import { ChevronDown, ChevronRight, LockKeyhole, Upload } from 'lucide-react';
import { formatToHHMMSS } from '../../../../../../util/timeFormat/timeFormat';

const InstructorSpecificCourseItemsRow = ({ lectureData, selectedCourse, setUpdateData, expandedSections, setExpandedSections, section, setDeletedData, setShowVideoModal, setShowDeleteLectureModal, setUploadForm, setShowUploadModal }) => {

    let lecture = [];

    if (section?.type == 'demo') {
        lecture = lectureData?.filter(lecture => lecture?.isPreview == true);
    }
    else if (section?.type == 'video') {
        lecture = lectureData?.filter(lecture => lecture?.isPreview != true && lecture?.type == 'video');
    }
    else if (section?.type == 'document') {
        lecture = lectureData?.filter(lecture => lecture?.isPreview != true && lecture?.type == 'document');
    }

    const totalSeconds = lecture?.reduce((acc, value) => acc + Number(value?.duration || 0), 0) || 0;
    const totalLectureTiming = formatToHHMMSS(totalSeconds);

    const canExpand = section?.type === "demo" || selectedCourse?.status === "approved";

    return (
        <div className="group/section relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/80 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-zinc-700/60">
            <div className="flex items-center justify-between p-4 sm:p-5">
                <button onClick={canExpand ? () =>
                    setExpandedSections(prev => ({
                        ...prev,
                        [section.id]: !prev[section.id],
                    })) : undefined}
                    className={`flex items-center gap-4 flex-1 ${canExpand ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`} >

                    {canExpand ? (
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                            expandedSections[section.id]
                                ? 'bg-red-500/15 border-red-500/30'
                                : 'bg-zinc-900/60 border-zinc-800 group-hover/section:border-red-500/20 group-hover/section:bg-red-500/10'
                        }`}>
                            {expandedSections[section.id] ? (
                                <ChevronDown className="w-4 h-4 text-red-400" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover/section:text-red-400 transition-colors" />
                            )}
                        </div>
                    ) : (
                        <div className="w-9 h-9 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-center">
                            <LockKeyhole className="w-4 h-4 text-zinc-500" />
                        </div>
                    )}

                    <div className="text-left">
                        <h3 className="font-semibold text-base sm:text-lg text-white">
                            {section?.title?.split(" ")?.map(s => s?.charAt(0)?.toUpperCase() + s?.slice(1)?.toLowerCase())?.join(" ") ?? 'N/A'}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                            {lecture?.length} lesson{lecture?.length > 1 ? "s" : ""}
                            {section?.type !== "document" ? ` - ${totalLectureTiming}` : ""}
                        </p>
                    </div>
                </button>
            </div>

            {expandedSections[section.id] && (
                <div className="border-t border-zinc-800/60">
                    {lecture?.map(lesson => (
                        <InstructorLessonItem
                            key={lesson?.id}
                            section={section}
                            lesson={lesson}
                            setUpdateData={setUpdateData}
                            setShowDeleteLectureModal={setShowDeleteLectureModal}
                            setDeletedData={setDeletedData}
                            setShowVideoModal={setShowVideoModal}
                            setShowUploadModal={setShowUploadModal}
                            selectedCourse={selectedCourse}
                        />
                    ))}

                    {section?.type != 'demo' && (
                        <div className="p-4 border-t border-zinc-800/40">
                            <button
                                onClick={!selectedCourse?.is_completed ? () => { setUploadForm({ course_id: selectedCourse?.id, category_id: selectedCourse?.category?.id, sectionType: section?.type }); setShowUploadModal(true); setUpdateData(null); } : undefined}
                                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 border
                                    ${selectedCourse?.is_completed
                                        ? 'bg-zinc-900/30 border-zinc-800/50 text-zinc-600 cursor-not-allowed'
                                        : 'bg-red-500/8 border-red-500/20 text-red-400 cursor-pointer hover:bg-red-500/15 hover:border-red-500/35 hover:shadow-lg hover:shadow-red-950/10 active:scale-[0.98]'}`}
                            >
                                <Upload className="w-4 h-4" />
                                {section?.type == 'video' ? 'Upload / Add Video' : section?.type == 'document' ? 'Upload / Add Document' : 'Upload / Add Content'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default InstructorSpecificCourseItemsRow
