import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle, File, FileCheck, PlayCircle, RotateCcw, X } from 'lucide-react';
import { updateWatchedSeconds, upsertVideoProgress, markVideoCompleted } from '../../../../../../../redux/slice/videoProgressSlice';
import { useDispatch } from 'react-redux';
import { formatToHHMMSS } from '../../../../../../../util/timeFormat/timeFormat';
import { useLectureProgress } from '../../../../../../../tanstack/query/fetchVideoProgressDetails';
import { useQueryClient } from '@tanstack/react-query';

const LessonItem = ({ lesson, userAuthData, type }) => {

    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const lastUpdateRef = useRef(0);
    const queryClient = useQueryClient();
    const hasInitializedRef = useRef(false);
    const isSavingRef = useRef(false);

    const student_id = userAuthData?.id;
    const course_id = lesson?.course_id;
    const lesson_id = lesson?.id;

    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [localWatched, setLocalWatched] = useState(0);

    // Always fetch progress for this lesson (not gated by isPlaying)
    const { isLoading, data: progressData, refetch, error } = useLectureProgress({ student_id, course_id, lesson_id });

    const isDocument = lesson?.type === 'document';
    const Icon = isDocument ? File : PlayCircle;

    // Sync local state from DB data
    useEffect(() => {
        if (progressData?.[0]?.watched_seconds != null) {
            setLocalWatched(progressData[0].watched_seconds);
        }
        if (progressData?.[0]?.completed) {
            setIsCompleted(true);
        }
    }, [progressData]);

    // Reset init flag when modal closes so next open re-seeks
    useEffect(() => {
        if (!isPlaying) {
            hasInitializedRef.current = false;
        }
    }, [isPlaying]);

    const invalidateAllProgress = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["lecture-progress"] });
    }, [queryClient]);

    const updateProgressCache = useCallback((updates) => {
        const payload = { student_id, course_id, lesson_id, type, watched_seconds: 0, total_seconds: 0, ...updates };

        // 1. Update THIS exact lesson's query
        queryClient.setQueryData(
            ["lecture-progress", student_id, course_id || "all", lesson_id || "all", "all"],
            [payload]
        );

        // 2. Update broad list queries (where lesson_id filter is "all")
        queryClient.setQueriesData(
            { queryKey: ["lecture-progress", student_id, course_id || "all", "all"] },
            (oldData) => {
                if (!Array.isArray(oldData)) return oldData;
                const exists = oldData.some(p => p.lesson_id === lesson_id);
                if (exists) {
                    return oldData.map(p => p.lesson_id === lesson_id ? { ...p, ...payload, completed: p.completed || payload.completed } : p);
                }
                return [...oldData, payload];
            }
        );
    }, [queryClient, student_id, course_id, lesson_id, type]);

    const updateProgressCacheDirectly = useCallback((updatedRecord) => {
        if (!updatedRecord) return;
        
        // 1. Update THIS exact lesson's query
        queryClient.setQueryData(
            ["lecture-progress", student_id, course_id || "all", updatedRecord.lesson_id || "all", "all"],
            [updatedRecord]
        );

        // 2. Update broad list queries (where lesson_id filter is "all")
        queryClient.setQueriesData(
            { queryKey: ["lecture-progress", student_id, course_id || "all", "all"] },
            (oldData) => {
                if (!Array.isArray(oldData)) return oldData;
                const exists = oldData.some(p => p.lesson_id === updatedRecord.lesson_id);
                if (exists) {
                    return oldData.map(p => p.lesson_id === updatedRecord.lesson_id ? { ...p, ...updatedRecord } : p);
                }
                return [...oldData, updatedRecord];
            }
        );
    }, [queryClient, student_id, course_id]);

    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        if (!video) return;

        // Use the DB value from progressData directly (not stale localWatched)
        const savedSeconds = progressData?.[0]?.watched_seconds || 0;
        const totalDuration = Math.floor(video.duration);
        const alreadyCompleted = progressData?.[0]?.completed || false;

        // Seek to saved position (but not if completed — start from beginning for re-watch)
        if (savedSeconds > 0 && !alreadyCompleted) {
            // Don't seek past duration minus 2s (avoid instant-end)
            video.currentTime = Math.min(savedSeconds, totalDuration - 2);
        }

        // Only init the progress row once per play session
        if (!hasInitializedRef.current) {
            hasInitializedRef.current = true;

            dispatch(
                upsertVideoProgress({
                    student_id,
                    course_id,
                    lesson_id,
                    watched_seconds: savedSeconds,
                    total_seconds: totalDuration,
                    completed: alreadyCompleted,
                    type,
                })
            ).unwrap()
                .then((data) => {
                    updateProgressCacheDirectly(data);
                })
                .catch((err) => {
                    console.error("Error initializing video progress:", err);
                });
        }
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || isSavingRef.current) return;

        const current = Math.floor(video.currentTime);
        const total = Math.floor(video.duration);

        // Save every 5 seconds of playback
        if (current - lastUpdateRef.current >= 5) {
            lastUpdateRef.current = current;
            setLocalWatched(current);

            const completed = total > 0 && current >= total - 1;

            // Optimistic Update
            updateProgressCache({ watched_seconds: current, total_seconds: total, completed });

            if (completed) {
                setIsCompleted(true);
            }

            isSavingRef.current = true;

            dispatch(updateWatchedSeconds({
                student_id,
                course_id,
                lesson_id,
                watched_seconds: current,
                total_seconds: total,
                type,
            })).unwrap()
                .then((data) => {
                    updateProgressCacheDirectly(data);
                    if (data?.completed) {
                        setIsCompleted(true);
                    }
                })
                .catch((err) => {
                    console.error("Error updating watched seconds:", err);
                })
                .finally(() => {
                    isSavingRef.current = false;
                });
        }
    };

    const handleVideoEnded = () => {
        const video = videoRef.current;
        if (!video) return;

        const total = Math.floor(video.duration);

        setIsCompleted(true);
        setLocalWatched(total);

        // Optimistic Update
        updateProgressCache({ watched_seconds: total, total_seconds: total, completed: true });

        // Use dedicated markVideoCompleted thunk — guaranteed upsert
        dispatch(
            markVideoCompleted({
                student_id,
                course_id,
                lesson_id,
                total_seconds: total,
                type,
            })
        ).unwrap()
            .then((data) => {
                updateProgressCacheDirectly(data);
                invalidateAllProgress();
            })
            .catch((err) => {
                console.error("Error marking video completed:", err);
            });
    };

    const handleDocumentOpen = () => {
        setIsCompleted(true);

        // Optimistic Update
        updateProgressCache({ completed: true, read_doc: true, total_seconds: 0, watched_seconds: 0 });

        dispatch(
            upsertVideoProgress({
                student_id,
                course_id,
                lesson_id,
                completed: true,
                read_doc: true,
                type,
                total_seconds: 0,
                watched_seconds: 0
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

        // Save final position before closing
        const video = videoRef.current;
        if (video && !isDocument) {
            const current = Math.floor(video.currentTime);
            const total = Math.floor(video.duration);
            const completed = total > 0 && current >= total - 1;

            if (completed) {
                setIsCompleted(true);
            }
            setLocalWatched(current);

            // Fire-and-forget final save
            dispatch(updateWatchedSeconds({
                student_id,
                course_id,
                lesson_id,
                watched_seconds: current,
                total_seconds: total,
                type,
            })).unwrap()
                .then(() => {
                    invalidateAllProgress();
                })
                .catch((err) => {
                    console.error("Error saving progress on close:", err);
                });
        }

        setIsPlaying(false);
        lastUpdateRef.current = 0;
    };

    return (
        <>
            <div
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors border-b border-[#1c1c1f] cursor-pointer"
                onClick={() => setIsPlaying(true)}
            >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 mr-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isCompleted 
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400 shadow-sm shadow-green-950/10' 
                            : 'bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-sm shadow-purple-950/10'
                    }`}>
                        {isCompleted
                            ? isDocument ? <FileCheck className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />
                            : <Icon className="w-4 h-4" />
                        }
                    </div>

                    <div className="min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm md:text-base truncate">{lesson?.video_title}</h4>
                        {!isDocument && <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{formatToHHMMSS(lesson?.duration)}</p>}
                    </div>
                </div>

                <button className={`py-1.5 px-3.5 rounded-lg text-xs sm:text-sm font-medium flex-shrink-0 cursor-pointer flex items-center gap-1.5 transition-all duration-300 ${
                    isCompleted 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:border-green-500/30' 
                        : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95'
                }`}>
                    {isCompleted
                        ? <><RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{isDocument ? 'Review' : 'Watch Again'}</span></>
                        : isDocument ? 'View' : (localWatched > 0 ? 'Continue' : 'Start')
                    }
                </button>
            </div>

            {isPlaying && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 z-50 transition-all duration-300">
                    <div className={`relative w-full ${isDocument ? 'max-w-6xl' : 'max-w-4xl'} bg-black border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col transform transition-all`}>
                        
                        {/* Premium Cinematic Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#08080c]">
                            <div className="flex items-center gap-3 min-w-0 pr-4">
                                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                    {isDocument ? <File className="w-4 h-4 text-purple-400" /> : <PlayCircle className="w-4 h-4 text-purple-400" />}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm sm:text-base truncate">{lesson?.video_title}</h3>
                                    {!isDocument && (
                                        <p className="text-[10px] text-white/40 mt-0.5 font-medium">
                                            Video Lesson • {formatToHHMMSS(lesson?.duration)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleClosePlayer}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-xl p-2.5 transition-all cursor-pointer flex-shrink-0 active:scale-95"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="w-full relative bg-black flex-1 flex items-center justify-center">
                            {!isDocument && (
                                <div className="aspect-video w-full relative group">
                                    <video 
                                        ref={videoRef} 
                                        src={lesson?.video_url} 
                                        controls 
                                        autoPlay 
                                        className="w-full h-full object-contain bg-black rounded-b-2xl shadow-2xl"
                                        onLoadedMetadata={handleLoadedMetadata}
                                        onTimeUpdate={handleTimeUpdate} 
                                        onEnded={handleVideoEnded} 
                                    />
                                    {/* Subtle ambient light glow behind the player */}
                                    <div className="absolute -inset-1 bg-gradient-to-t from-purple-600/5 to-transparent opacity-30 blur-xl pointer-events-none group-hover:opacity-40 transition-opacity duration-500" />
                                </div>
                            )}

                            {isDocument && (
                                <div className="w-full h-[75vh] sm:h-[80vh] bg-black overflow-hidden relative rounded-b-2xl">
                                    {/* CSS clipping hack: Make the iframe wider than the container to hide the native scrollbar off-screen */}
                                    <div className="absolute top-0 bottom-0 left-0 right-[-20px] sm:right-[-24px]">
                                        <iframe
                                            src={`${lesson?.video_url}#view=FitH`} 
                                            onLoad={handleDocumentOpen} 
                                            className="w-full h-full border-0 bg-black" 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LessonItem;
