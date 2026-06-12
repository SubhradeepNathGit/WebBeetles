import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import LessonItem from './lesson-item/LessonItem';
import { formatToHHMMSS } from '../../../../../../util/timeFormat/timeFormat';
import { useLectureProgress } from '../../../../../../tanstack/query/fetchVideoProgressDetails';

const SectionContent = ({ section, getSpecificCourseData, userAuthData, selectedCourse, getPurchaseData }) => {
    const [isExpanded, setIsExpanded] = useState(false);

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

    return (
        <div className="bg-[#0a0a0c] rounded-lg overflow-hidden border border-[#1c1c1f]">
            <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors cursor-pointer text-white group"
            >
                <div className='flex items-center gap-3 sm:gap-4'>
                    <div className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-[#1c1c1f] flex items-center justify-center text-purple-400 transition-colors">
                        <ChevronRight className={`w-4.5 h-4.5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg">
                            {section?.title?.split(' ')?.map(t => t?.charAt(0)?.toUpperCase() + t?.slice(1)?.toLowerCase())?.join(" ") ?? 'N/A'}
                        </h3>
                        <p className="text-[11px] sm:text-xs md:text-sm text-gray-400">
                            {sectionLectures?.length ?? 0} Lesson{sectionLectures?.length > 1 ? 's' : ''}
                            {section?.type != 'document' && (<> • {totalLectureTiming}</>)}
                        </p>
                    </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                    {completedLecture?.length ?? 0}/{sectionLectures?.length} completed
                </div>
            </button>

            {isExpanded && (
                <div className="border-t border-[#1c1c1f]">
                    {sectionLectures?.map((lesson, index) => (
                        <LessonItem key={lesson.id ?? index} lesson={lesson} userAuthData={userAuthData} type={section?.type} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SectionContent;
