import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, File, FileCheck, PlayCircle, X } from 'lucide-react';
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
    }, [progressData]);

    const handleLoadedMetadata = () => {
        if (videoRef.current && localWatched > 0) {
            videoRef.current.currentTime = localWatched;
        }
    };

    useEffect(() => {
        if (progressData) {
            setIsCompleted(progressData?.[0]?.completed);
        }
    }, [progressData, isPlaying]);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;

        const current = Math.floor(video.currentTime);

        if (current - lastUpdateRef.current >= 5) {
            lastUpdateRef.current = current;
            setLocalWatched(current);

            dispatch(updateWatchedSeconds({
                student_id,
                lesson_id,
                watched_seconds: current,
                total_seconds: Math.floor(video.duration),
            }));
        }
    };

    const handleVideoEnded = () => {
        const video = videoRef.current;
        if (!video) return;

        dispatch(
            updateWatchedSeconds({
                student_id,
                lesson_id,
                watched_seconds: Math.floor(video.duration),
                total_seconds: Math.floor(video.duration),
            })
        );
    };

    const handleDocumentOpen = () => {
        dispatch(
            upsertVideoProgress({
                student_id,
                course_id,
                lesson_id,
                completed: true,
                read_doc: true,
                type
            })
        );
    };

    // console.log('Lecture progress details', progressData);

    return (
        <>
            <div
                className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors border-b border-gray-800"
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

                <button className={`py-2 bg-purple-600 rounded-lg text-sm cursor-pointer ${isCompleted ? 'px-2' : 'px-4'}`}>
                    {isCompleted ? 'Review' : isDocument ? 'View' : 'Start'}
                </button>
            </div>

            {isPlaying && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="relative w-[90%] lg:w-[60%] bg-black rounded-2xl">

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsPlaying(false);
                                refetch();
                                queryClient.invalidateQueries({
                                    queryKey: ["lecture-progress"],
                                });
                            }}
                            className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 z-10 cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>


                        {!isDocument && (
                            <video ref={videoRef} src={lesson?.video_url} controls autoPlay className="w-full h-[80vh] rounded-2xl"
                                onLoadedMetadata={() => {
                                    handleLoadedMetadata();

                                    dispatch(
                                        upsertVideoProgress({
                                            student_id,
                                            course_id,
                                            lesson_id,
                                            watched_seconds: progressData?.[0]?.watched_seconds ?? 0,
                                            total_seconds: Math.floor(videoRef.current.duration),
                                            completed: false,
                                            type,
                                        })
                                    );
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
