import React, { useMemo } from 'react';
import { Award, BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { useLectureProgress } from '../../../../tanstack/query/fetchVideoProgressDetails';

const StudentMyCourseStats = ({ purchaseItems = [], userAuthData }) => {

    const { data: progressData = [] } = useLectureProgress({ student_id: userAuthData?.id });

    const courseProgressMap = useMemo(() => {
        const map = {};

        progressData.forEach(p => {
            if (!p.course_id) return;

            if (!map[p.course_id]) {
                map[p.course_id] = { watched: 0, total: 0 };
            }

            map[p.course_id].watched += Math.min(
                p.watched_seconds || 0,
                p.total_seconds || 0
            );

            map[p.course_id].total += p.total_seconds || 0;
        });

        return map;
    }, [progressData]);

    const stats = useMemo(() => {
        let completed = 0;
        let inProgress = 0;

        purchaseItems.forEach(course => {
            const prog = courseProgressMap[course.id];

            if (!prog || !prog.total) {
                inProgress++;
                return;
            }

            const percent = Math.floor((prog.watched / prog.total) * 100);

            if (percent >= 100) completed++;
            else inProgress++;
        });

        return {
            coursesEnrolled: purchaseItems.length,
            coursesCompleted: completed,
            coursePending: inProgress,
            certificatesEarned: purchaseItems.filter(
                c => c?.is_exam_completed
            ).length
        };
    }, [purchaseItems, courseProgressMap]);

    const statCards = [
        { icon: BookOpen, value: stats.coursesEnrolled, label: "Courses Enrolled", color: "purple", trend: "+2" },
        { icon: Award, value: stats.coursesCompleted, label: "Courses Completed", color: "green", trend: "+1" },
        { icon: Clock, value: stats.coursePending, label: "Courses In-progress", color: "blue", trend: "+5h" },
        { icon: Target, value: stats.certificatesEarned, label: "Certificates Earned", color: "orange", trend: "+1" }
    ];

    return (
        <div className="grid grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, i) => {
                const Icon = stat.icon;

                return (
                    <div key={i}
                        className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20
                        hover:bg-white/15 hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br 
                                from-${stat.color}-500/40 to-${stat.color}-600/40 
                                backdrop-blur-sm flex items-center justify-center 
                                border border-${stat.color}-400/30 shadow-lg 
                                group-hover:scale-110 transition-transform`}
                            >
                                <Icon className="text-white" size={26} />
                            </div>

                            {/* <span className="text-green-400 text-xs font-bold flex items-center gap-1
                                bg-green-500/20 px-2.5 py-1.5 rounded-lg border border-green-400/30">
                                <TrendingUp size={14} />
                                {stat.trend}
                            </span> */}
                        </div>

                        <h3 className="text-4xl font-bold text-white mb-1">
                            {stat.value}
                        </h3>
                        <p className="text-purple-100 text-sm font-medium">
                            {stat.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default StudentMyCourseStats;
