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
            certificatesEarned: completed
        };
    }, [purchaseItems, courseProgressMap]);

    const statCards = [
        { icon: BookOpen, value: stats.coursesEnrolled, label: "Courses Enrolled", gradient: "from-purple-500/20 to-purple-600/20", border: "border-purple-500/30" },
        { icon: Award, value: stats.coursesCompleted, label: "Courses Completed", gradient: "from-green-500/20 to-green-600/20", border: "border-green-500/30" },
        { icon: Clock, value: stats.coursePending, label: "Courses In-progress", gradient: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/30" },
        { icon: Target, value: stats.certificatesEarned, label: "Certificates Earned", gradient: "from-amber-500/20 to-amber-600/20", border: "border-amber-500/30" }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {statCards.map((stat, i) => {
                const Icon = stat.icon;

                return (
                    <div key={i}
                        className="group bg-white/5 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-xl border border-white/10
                        hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br 
                                ${stat.gradient} flex items-center justify-center 
                                border ${stat.border} shadow-lg 
                                group-hover:scale-105 transition-transform`}
                            >
                                <Icon className="text-white w-6 h-6" />
                            </div>
                        </div>

                        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                            {stat.value}
                        </h3>
                        <p className="text-purple-100/70 text-xs sm:text-sm font-medium">
                            {stat.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default StudentMyCourseStats;
