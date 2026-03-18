import React from 'react'
import InstructorLessonItem from './InstructorLessonItem';
import { ChevronDown, ChevronRight, FileBadge, LockKeyhole, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hotToast from '../../../../../../util/alert/hot-toast';
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

    const canExpand = section?.type === "demo" || (section?.type !== "exam" && selectedCourse?.status === "approved") || (section?.type === "exam" && selectedCourse?.is_completed);
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="flex items-center justify-between p-4 bg-gray-800">
                <button onClick={canExpand ? () =>
                    setExpandedSections(prev => ({
                        ...prev,
                        [section.id]: !prev[section.id],
                    })) : undefined}
                    className={`flex items-center gap-4 flex-1 ${canExpand ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`} >
                    {canExpand ? (
                        expandedSections[section.id] ? (
                            <ChevronDown className="w-5 h-5 text-purple-400" />) : (
                            <ChevronRight className="w-5 h-5 text-purple-400" />)) : (
                        <LockKeyhole className="w-5 h-5 text-white" />
                    )}

                    <div className="text-left">
                        <h3 className="font-semibold text-lg">{section?.title?.split(" ")?.map(s => s?.charAt(0)?.toUpperCase() + s?.slice(1)?.toLowerCase())?.join(" ") ?? 'N/A'}</h3>
                        {section?.type !== "exam" ?
                            <p className="text-sm text-gray-400">
                                {lecture?.length} lesson{lecture?.length > 1 ? "s" : ""}
                                {section?.type !== "document" ? ` • ${totalLectureTiming}` : ""}
                            </p> : <p className="text-sm text-gray-400">
                                {selectedCourse?.is_exam_scheduled ? 'Already scheduled' : 'Not scheduled yet'}
                            </p>}
                    </div>
                </button>

                {/* <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div> */}
            </div>
            {expandedSections[section.id] && (
                <div>
                    {lecture?.map(lesson => <InstructorLessonItem key={lesson?.id} section={section} lesson={lesson} setUpdateData={setUpdateData} setShowDeleteLectureModal={setShowDeleteLectureModal} setDeletedData={setDeletedData} setShowVideoModal={setShowVideoModal} setShowUploadModal={setShowUploadModal} selectedCourse={selectedCourse} />)}

                    {section?.type != 'demo' && section?.type != 'exam' && (
                        <div className="p-4 border-t border-gray-800">
                            <button onClick={!selectedCourse?.is_completed ? () => { setUploadForm({ course_id: selectedCourse?.id, category_id: selectedCourse?.category?.id, sectionType: section?.type }); setShowUploadModal(true); setUpdateData(null); } : undefined} className={`w-full py-3 bg-purple-600/20 border border-purple-600/50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-purple-400 ${selectedCourse?.is_completed ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-purple-600/30'}`}>
                                <Upload className="w-5 h-5" />
                                {section?.type == 'video' ? 'Upload / Add Video' : section?.type == 'document' ? 'Upload / Add Document' : 'Upload / Add Content'}
                            </button>
                        </div>
                    )}
                    {section?.type == 'exam' && (
                        <div className="p-4 border-t border-gray-800">
                            <button onClick={!selectedCourse?.is_exam_scheduled ? () => navigate('/instructor/dashboard/question-set') : hotToast(`Question paper already set!`, "warning")} className={`w-full py-3 bg-green-600/20 border border-green-600/50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-green-400 ${selectedCourse?.is_exam_scheduled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-green-600/30'}`}>
                                <FileBadge className="w-5 h-5" />
                                Set Question Paper
                            </button>
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}

export default InstructorSpecificCourseItemsRow