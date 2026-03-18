import React, { useState } from 'react'
import { Check, Play, ListVideo, X, Eye, Image } from "lucide-react";
import { formatToHHMMSS } from '../../../../util/timeFormat/timeFormat';
import { useCourseVideos } from '../../../../tanstack/query/fetchLectureVideo';
import { formatDateDDMMYY } from '../../../../util/dateFormat/dateFormat';

const PreviewModal = ({ preview, setPreview, setVideoModal, setImageModal, setVideoTitle, setImageTitle, setCourseId, setChangeStatus, setOpenMarkModal }) => {

    const showDescriptionCount = 250;
    const [showDesc, setShowDesc] = useState(showDescriptionCount);
    const [showMore, setShowMore] = useState(true);

    const { isLoading, data: lectureData, error } = useCourseVideos({ courseId: preview?.id });
    const totalSeconds = lectureData?.reduce((acc, value) => acc + Number(value?.duration || 0), 0) || 0;
    const totalLectureTiming = formatToHHMMSS(totalSeconds);

    const demoVideo = lectureData?.find(video => video?.isPreview);
    // console.log(demoVideo);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreview(null)}>
            <div className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h3 className="text-xl font-bold text-white">{preview?.title ?? 'N/A'}</h3>
                        <p className="text-sm text-gray-400 mt-1">{preview.instructor?.name ?? 'N/A'} · {preview?.category?.name ?? 'N/A'}</p>
                    </div>
                    <button onClick={() => setPreview(null)} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Duration", value: totalLectureTiming },
                            { label: "Modules", value: lectureData?.length ?? 0 },
                            { label: "Applied on", value: formatDateDDMMYY(preview?.created_at) },
                            { label: "Price", value: preview?.price?.toLocaleString() ?? 'N/A' },
                        ].map((s, i) => (
                            <div key={i} className="bg-[#1a1a1a] rounded-xl p-3 border border-white/5 text-center">
                                <div className="text-lg font-bold text-white">{s.value}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Feature</p>
                        <div className="flex flex-wrap gap-x-2 gap-y-2">
                            {preview?.feature?.map((feat, index) => (
                                <span key={index} className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-md font-medium">{feat}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Course Overview</p>
                        <p className="text-sm text-gray-300 leading-relaxed">{preview?.description?.length > showDesc ? preview?.description?.slice(0, showDesc) + '...' : preview?.description ?? 'N/A'}
                            <span className='text-blue-600 ml-2 cursor-pointer' onClick={() => { setShowDesc(showMore ? preview?.description : showDescriptionCount); setShowMore(!showMore) }}>{showMore ? 'Show more' : 'Show less'}</span>
                        </p>
                    </div>
                    {/* thumbnail preview card */}
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Image size={28} className="text-red-500/60 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-white">{`${preview?.title?.length > 35 ? preview?.title?.slice(0, 33) + '...' : preview?.title} — Thumbnail Image`}</p>
                                <p className="text-xs text-gray-500 mt-0.5">User image as a thumbnail for the course.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setImageModal(preview?.thumbnail);
                                setImageTitle(preview?.title + ' - Thumbnail Image')
                            }}
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-semibold shadow-lg shadow-red-500/20 cursor-pointer"
                        >
                            <Eye size={13} /> View Thumbnail
                        </button>
                    </div>

                    {/* Lecture preview card */}
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <ListVideo size={28} className="text-purple-500/60 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-white">{`${(demoVideo?.video_title || (preview?.title?.length > 35 ? preview?.title?.slice(0, 33) + '...' : preview?.title))} — Demo Video`}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Demo video on the specific course.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setVideoTitle(demoVideo?.video_title);
                                setVideoModal(demoVideo?.video_url);
                            }}
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs font-semibold shadow-lg shadow-purple-500/20 cursor-pointer"
                        >
                            <Play size={13} /> Play Demo Video
                        </button>
                    </div>
                </div>
                <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-[#0d0d0d] rounded-b-2xl">
                    <button onClick={() => setPreview(null)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-sm font-medium transition-colors cursor-pointer">Close</button>
                    <button onClick={() => { setOpenMarkModal(true); setChangeStatus("rejected"); setCourseId(preview?.id); setPreview(null); }} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-semibold transition-colors cursor-pointer"><X size={16} /> Reject Course</button>
                    <button onClick={() => { setOpenMarkModal(true); setChangeStatus("approved"); setCourseId(preview?.id); setPreview(null); }} className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-purple-500/20 cursor-pointer"><Check size={16} /> Publish Course</button>
                </div>
            </div>
        </div>
    )
}

export default PreviewModal