import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, File, FileCheck, PlayCircle, RotateCcw, X } from 'lucide-react';
import { updateWatchedSeconds, upsertVideoProgress } from '../../../../../../../redux/slice/videoProgressSlice';
import { useDispatch } from 'react-redux';
import { formatToHHMMSS } from '../../../../../../../util/timeFormat/timeFormat';
import { useLectureProgress } from '../../../../../../../tanstack/query/fetchVideoProgressDetails';
import { useQueryClient } from '@tanstack/react-query';

const LessonItem = ({ lesson, userAuthData, type }) => {

    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const lastUpdateRef = useRef(0);
    const queryClient = useQueryClient();

    const student_id = userAuthData?.id;
    const course_id = lesson?.course_id;
    const lesson_id = lesson?.id;

    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [localWatched, setLocalWatched] = useState(lesson?.watched_seconds || 0);

    const { isLoading, data: progressData, refetch, error } = useLectureProgress({ student_id, course_id, lesson_id, isPlaying });

    const isDocument = lesson?.type === 'document';
    const Icon = isDocument ? File : PlayCircle;

    useEffect(() => {
        if (progressData?.[0]?.watched_seconds != null) {
            setLocalWatched(progressData[0].watched_seconds);
        }
        if (progressData?.[0]?.completed) {
            setIsCompleted(true);
        }
    }, [progressData]);

    const handleLoadedMetadata = () => {
        if (videoRef.current && localWatched > 0) {
            videoRef.current.currentTime = localWatched;
        }
    };

    const invalidateAllProgress = () => {
        queryClient.invalidateQueries({ queryKey: ["lecture-progress"] });
    };

    const updateProgressCache = (updates) => {
        queryClient.setQueriesData({ queryKey: ["lecture-progress"] }, (oldData) => {
            if (!oldData || !Array.isArray(oldData)) {
                return [{ student_id, course_id, lesson_id, type, watched_seconds: 0, total_seconds: 0, ...updates }];
            }
            
            const exists = oldData.some(p => p.lesson_id === lesson_id);
            if (exists) {
                return oldData.map(p => {
                    if (p.lesson_id === lesson_id) {
                        return { ...p, ...updates, completed: p.completed || updates.completed };
                    }
                    return p;
                });
            }
            return [...oldData, { student_id, course_id, lesson_id, type, watched_seconds: 0, total_seconds: 0, ...updates }];
        });
    };

    const updateProgressCacheDirectly = (updatedRecord) => {
        if (!updatedRecord) return;
        queryClient.setQueriesData({ queryKey: ["lecture-progress"] }, (oldData) => {
            if (!oldData || !Array.isArray(oldData)) {
                return [updatedRecord];
            }
            
            const exists = oldData.some(p => p.lesson_id === updatedRecord.lesson_id);
            if (exists) {
                return oldData.map(p => {
                    if (p.lesson_id === updatedRecord.lesson_id) {
                        return { ...p, ...updatedRecord };
                    }
                    return p;
                });
            }
            return [...oldData, updatedRecord];
        });
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;

        const current = Math.floor(video.currentTime);

        if (current - lastUpdateRef.current >= 5) {
            lastUpdateRef.current = current;
            setLocalWatched(current);

            const total = Math.floor(video.duration);
            const completed = current >= total;

            // 1. Optimistic Update
            updateProgressCache({ watched_seconds: current, total_seconds: total, completed });

            if (completed) {
                setIsCompleted(true);
            }

            // 2. Dispatch with unwrap and direct cache/invalidate updates
            dispatch(updateWatchedSeconds({
                student_id,
                lesson_id,
                watched_seconds: current,
                total_seconds: total,
            })).unwrap()
            .then((data) => {
                updateProgressCacheDirectly(data);
                invalidateAllProgress();
            })
            .catch((err) => {
                console.error("Error updating watched seconds:", err);
            });
        }
    };

    const handleVideoEnded = () => {
        const video = videoRef.current;
        if (!video) return;

        const total = Math.floor(video.duration);

        setIsCompleted(true);

        // 1. Optimistic Update
        updateProgressCache({ watched_seconds: total, total_seconds: total, completed: true });

        // 2. Dispatch with unwrap and direct cache/invalidate updates
        dispatch(
            updateWatchedSeconds({
                student_id,
                lesson_id,
                watched_seconds: total,
                total_seconds: total,
            })
        ).unwrap()
        .then((data) => {
            updateProgressCacheDirectly(data);
            invalidateAllProgress();
        })
        .catch((err) => {
            console.error("Error ending video:", err);
        });
    };

    const handleDocumentOpen = () => {
        setIsCompleted(true);

        // 1. Optimistic Update
        updateProgressCache({ completed: true, read_doc: true });

        // 2. Dispatch with unwrap and direct cache/invalidate updates
        dispatch(
            upsertVideoProgress({
                student_id,
                course_id,
                lesson_id,
                completed: true,
                read_doc: true,
                type
            })
        ).unwrap()
        .then((data) => {
            updateProgressCacheDirectly(data);
            invalidateAllProgress();
        })
        .catch((err) => {
            console.error("Error opening document:", err);
        });
    };

    const handleClosePlayer = (e) => {
        e.stopPropagation();
        setIsPlaying(false);
        lastUpdateRef.current = 0;
        invalidateAllProgress();
    };

    return (
        <>
            <div
                className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors border-b border-gray-800 cursor-pointer"
                onClick={() => setIsPlaying(true)}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-purple-600'}`}>
                        {isCompleted
                            ? isDocument ? <FileCheck className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />
                            : <Icon className="w-4 h-4" />
                        }
                    </div>

                    <div>
                        <h4 className="font-medium">{lesson?.video_title}</h4>
                        {!isDocument && <p className="text-sm text-gray-400">{formatToHHMMSS(lesson?.duration)}</p>}
                    </div>
                </div>

                <button className={`py-2 rounded-lg text-sm cursor-pointer flex items-center gap-1.5 ${isCompleted ? 'px-3 bg-green-600/20 text-green-400 border border-green-500/30' : 'px-4 bg-purple-600'}`}>
                    {isCompleted
                        ? <><RotateCcw className="w-3.5 h-3.5" /> {isDocument ? 'Review' : 'Watch Again'}</>
                        : isDocument ? 'View' : 'Start'
                    }
                </button>
            </div>

            {isPlaying && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="relative w-[90%] lg:w-[60%] bg-black rounded-2xl">

                        <button
                            onClick={handleClosePlayer}
                            className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 z-10 cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>


                        {!isDocument && (
                            <video ref={videoRef} src={lesson?.video_url} controls autoPlay className="w-full h-[80vh] rounded-2xl"
                                onLoadedMetadata={() => {
                                    handleLoadedMetadata();

                                    const alreadyCompleted = progressData?.[0]?.completed || isCompleted;

                                    dispatch(
                                        upsertVideoProgress({
                                            student_id,
                                            course_id,
                                            lesson_id,
                                            watched_seconds: progressData?.[0]?.watched_seconds ?? 0,
                                            total_seconds: Math.floor(videoRef.current.duration),
                                            completed: alreadyCompleted || false,
                                            type,
                                        })
                                    ).unwrap()
                                    .then((data) => {
                                        updateProgressCacheDirectly(data);
                                        invalidateAllProgress();
                                    })
                                    .catch((err) => {
                                        console.error("Error initializing video progress:", err);
                                    });
                                }}
                                onTimeUpdate={handleTimeUpdate} onEnded={handleVideoEnded} />
                        )}

                        {isDocument && (
                            <iframe
                                src={lesson?.video_url} onLoad={handleDocumentOpen} className="w-full h-[80vh] rounded-2xl" />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default LessonItem;

