import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Lock } from 'lucide-react';
import LessonItem from './lesson-item/LessonItem';
import { formatToHHMMSS } from '../../../../../../util/timeFormat/timeFormat';
import { useLectureProgress } from '../../../../../../tanstack/query/fetchVideoProgressDetails';

const SectionContent = ({ section, getSpecificCourseData, userAuthData, selectedCourse, getPurchaseData }) => {
    // console.log(selectedCourse);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isOptionOpen, setIsOptionOpen] = useState(section?.type != 'exam');

    const purchaseItems = getPurchaseData?.flatMap(order => order.purchase_items.filter(item => item?.course_id == selectedCourse?.id)) || [];

    const sectionLectures = useMemo(() => {
        if (!Array.isArray(getSpecificCourseData)) return [];

        return section.type === 'demo'
            ? getSpecificCourseData.filter(v => v.isPreview === true)
            : getSpecificCourseData.filter(v => v.isPreview === false);

    }, [getSpecificCourseData, section.type]);

    const { isLoading, data: progressData, error } = useLectureProgress({ student_id: userAuthData?.id, course_id: getSpecificCourseData?.[0]?.course_id, type: section.type });

    const totalSeconds = sectionLectures?.reduce((acc, value) => acc + Number(value?.duration || 0), 0) || 0;
    const totalLectureTiming = formatToHHMMSS(totalSeconds);

    const completedLecture = progressData?.filter(lecture => lecture?.completed);

    const watchedSeconds = progressData?.reduce((acc, v) => acc + Math.min(v.watched_seconds || 0, v.total_seconds || 0), 0) || 0;

    const calculateCourseProgress = () => {
        if (!totalSeconds) return 0;

        const raw = (watchedSeconds / totalSeconds) * 100;
        if (raw >= 100) {
            if (!selectedCourse?.is_completed) return 99;
            return 100;
        }
        return Math.floor(raw);
    };

    const progressPercent = calculateCourseProgress();

    useEffect(() => {
        if (progressPercent == 100) {
            setIsOptionOpen(true);
        }
    }, [progressPercent, selectedCourse])

    // console.log('Lecture progress details', progressData);
    // console.log('Purchase course status details', purchaseItems);

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <button
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors ${!isOptionOpen ? 'cursor-not-allowed' : 'cursor'}`}>
                <div className='flex items-center gap-4'>
                    {isOptionOpen ? (
                        isExpanded ? (
                            <ChevronDown className={`w-5 h-5 text-purple-400 ${!isOptionOpen ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={() => (!isOptionOpen ? null : setIsExpanded(prev => !prev))} />
                        ) : (
                            <ChevronRight className={`w-5 h-5 text-purple-400 ${!isOptionOpen ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={() => (!isOptionOpen ? null : setIsExpanded(prev => !prev))}
                            />
                        )) : (
                        <Lock className="w-5 h-5 text-gray-400 cursor-not-allowed" />
                    )}
                    <div className="text-left">
                        <h3 className="font-semibold text-lg">
                            {section?.title?.split(' ')?.map(t => t?.charAt(0)?.toUpperCase() + t?.slice(1)?.toLowerCase())?.join(" ") ?? 'N/A'}
                        </h3>
                        {section?.type != 'exam' ? (
                            <p className="text-sm text-gray-400">
                                {sectionLectures?.length ?? 0} Lesson{sectionLectures?.length > 1 ? 's' : ''}
                                {section?.type != 'document' && (<> • {totalLectureTiming}</>)}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400">
                                {isOptionOpen ? purchaseItems?.[0]?.is_exam_completed ? 'Exam already completed' : 'You are elegiable to attend exam' : 'Course not completed yet'}
                            </p>
                        )}
                    </div>
                </div>
                {section?.type != 'exam' && (
                    <div className="text-sm text-gray-400"> {completedLecture?.length ?? 0}/{sectionLectures?.length} completed </div>
                )}
            </button>

            {isExpanded && (
                section?.type != 'exam' ?
                    <div className="border-t border-gray-800">
                        {sectionLectures?.map((lesson, index) => (
                            <LessonItem key={lesson.id ?? index} lesson={lesson} userAuthData={userAuthData} type={section?.type} />
                        ))}
                    </div>
                    :
                    <div className="border-t border-gray-800">
                        <div className='w-full flex'>
                            {!purchaseItems?.[0]?.is_exam_completed ? (
                                <button onClick={() => alert('Exam in progress')} className='w-80 rounded-xl mx-auto text-center bg-green-600 hover:bg-green-700 cursor-pointer text-white py-2 my-2'>Start Test</button>
                            ) : (
                                <p className='mx-auto text-center my-4'>You have already attend your exam.</p>
                            )}
                        </div>
                    </div>
            )}
        </div>
    );
};

export default SectionContent;
