import React, { useState } from 'react'
import { Dribbble, Edit3, ExternalLink, Facebook, Github, Globe, Instagram, Linkedin, LinkIcon, Loader2, Mail, Plus, Twitch, Twitter, X, Youtube } from 'lucide-react';
import { FaPinterest, FaDiscord, FaSlack, FaReddit } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { updateInstructor } from '../../../../redux/slice/instructorSlice';
import hotToast from '../../../../util/alert/hot-toast';

const InstructorSocialLinks = ({ instructorDetails }) => {

    const dispatch = useDispatch();

    const normalizeSocials = (socials = []) =>
        Array.isArray(socials) ? socials.filter(s => s?.platform && s?.url)
            .map(s => ({
                _id: s.platform,
                platform: s.platform,
                url: s.url
            })) : [];

    const [socialLinks, setSocialLinks] = useState(normalizeSocials(instructorDetails?.social_links));
    const [tempSocials, setTempSocials] = useState(normalizeSocials(instructorDetails?.social_links));
    const [editingSocials, setEditingSocials] = useState(false);
    const [updatingSocials, setUpdatingSocials] = useState(false);

    // console.log('Instructor social link details', instructorDetails?.social_links);

    const handleSocialsSave = async () => {
        const cleanedSocials = tempSocials.filter(s => s.platform?.trim() && s.url?.trim());

        if (cleanedSocials.length === 0) {
            hotToast("Please add at least one social link", "error");
            return;
        }

        if (cleanedSocials.length !== tempSocials.length) {
            hotToast("Platform and URL cannot be empty", "error");
            return;
        }

        setUpdatingSocials(true);

        const instructor_obj = {
            ...instructorDetails,
            social_links: cleanedSocials
        };

        dispatch(updateInstructor({ data: instructor_obj, id: instructorDetails?.id }))
            .then(res => {
                // console.log('Response from socials update', res);

                if (res.meta.requestStatus === "fulfilled") {
                    const normalized = res?.payload?.social_links.map(s => ({
                        _id: s.platform,
                        platform: s.platform,
                        url: s.url
                    }));

                    setEditingSocials(false);
                    setTempSocials(normalized);
                    setSocialLinks(normalized);
                    hotToast('Social links updated successfully', "success");
                }
                else {
                    hotToast('Something went wrong!', "error");
                }
            })
            .catch(err => {
                console.error("Error occurred in updating socials", err);
                getSweetAlert("Oops...", "Something went wrong!", "error");
            })
            .finally(() => {
                setUpdatingSocials(false);
            });
    };

    const addSocialLink = () => {
        setTempSocials([...tempSocials, { platform: "", url: "", _id: Date.now().toString() }]);
    };

    const updateSocialLink = (id, field, value) => {
        setTempSocials(tempSocials.map(s => s._id === id ? { ...s, [field]: value } : s));
    };

    const removeSocialLink = (id) => {
        setTempSocials(tempSocials.filter(s => s._id !== id));
    };

    const getSocialIcon = (platform) => {
        const p = (platform || "").toLowerCase();

        if (p.includes("linkedin")) return <Linkedin size={16} className="text-blue-600" />;
        if (p.includes("twitter") || p.includes("x.com")) return <Twitter size={16} className="text-sky-500" />;
        if (p.includes("github")) return <Github size={16} className="text-gray-800 dark:text-gray-200" />;
        if (p.includes("instagram")) return <Instagram size={16} className="text-pink-500" />;
        if (p.includes("facebook")) return <Facebook size={16} className="text-blue-500" />;
        if (p.includes("youtube")) return <Youtube size={16} className="text-red-600" />;
        if (p.includes("dribbble")) return <Dribbble size={16} className="text-pink-400" />;
        if (p.includes("twitch")) return <Twitch size={16} className="text-purple-500" />;

        if (p.includes("pinterest")) return <FaPinterest size={16} className="text-red-500" />;
        if (p.includes("discord")) return <FaDiscord size={16} className="text-indigo-500" />;
        if (p.includes("slack")) return <FaSlack size={16} className="text-purple-400" />;
        if (p.includes("reddit")) return <FaReddit size={16} className="text-orange-500" />;

        if (p.includes("mailto:") || p.includes("@")) return <Mail size={16} className="text-rose-600" />;
        if (p.includes("http") || p.includes("www")) return <Globe size={16} className="text-green-600" />;

        return <Globe size={16} />;
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-md">
                        <LinkIcon size={18} className="text-blue-400" />
                    </div>
                    Social Links
                </h2>
                {!editingSocials && (
                    <button
                        onClick={() => { setTempSocials([...socialLinks]); setEditingSocials(true); }}
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-all duration-300 font-medium cursor-pointer"
                    >
                        <Edit3 size={12} /> Edit
                    </button>
                )}
            </div>

            {!editingSocials ? (
                <div className="grid grid-cols-1 gap-3">
                    {socialLinks?.length > 0 ? socialLinks?.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3.5 bg-zinc-900/20 hover:bg-zinc-900/40 px-4 py-3 rounded-xl border border-zinc-800/50 hover:border-zinc-750 transition-all duration-300 group cursor-pointer"
                        >
                            <div className="w-9 h-9 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-850 group-hover:scale-105 group-hover:border-zinc-700 transition-all duration-300">
                                {getSocialIcon(link?.platform)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-zinc-200 font-semibold text-xs sm:text-sm capitalize leading-tight group-hover:text-white transition-colors">{link?.platform ?? 'N/A'}</p>
                                <p className="text-zinc-500 text-[10px] sm:text-xs truncate mt-0.5 group-hover:text-zinc-400 transition-colors">{link?.url ?? 'N/A'}</p>
                            </div>
                            <ExternalLink size={14} className="text-zinc-500 group-hover:text-zinc-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </a>
                    )) : <p className="text-zinc-500 text-xs sm:text-sm italic">No social links added yet.</p>}
                </div>
            ) : (
                <div className="space-y-4">
                    {tempSocials?.map(link => (
                        <div key={link._id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-zinc-900/10 p-3 rounded-xl border border-zinc-850/60">
                            <input
                                type="text"
                                value={link?.platform}
                                onChange={(e) => updateSocialLink(link._id, 'platform', e.target.value)}
                                placeholder="Platform"
                                className="w-full sm:w-1/3 bg-zinc-900/30 text-zinc-200 placeholder:text-zinc-650 rounded-lg px-3 py-2 text-xs border border-zinc-800 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                            />
                            <input
                                type="url"
                                value={link?.url}
                                onChange={(e) => updateSocialLink(link._id, 'url', e.target.value)}
                                placeholder="URL"
                                className="flex-1 w-full bg-zinc-900/30 text-zinc-200 placeholder:text-zinc-650 rounded-lg px-3 py-2 text-xs border border-zinc-800 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                            />
                            <button
                                onClick={() => removeSocialLink(link?._id)}
                                className="bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 px-3.5 py-2 rounded-lg border border-red-500/20 hover:border-red-500/40 w-full sm:w-auto flex items-center justify-center transition-colors cursor-pointer"
                                title="Remove link"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addSocialLink}
                        className="w-full bg-zinc-900/30 hover:bg-zinc-900/60 text-zinc-300 hover:text-white px-4 py-2.5 rounded-lg text-xs font-semibold border border-zinc-800 hover:border-zinc-700/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus size={14} /> Add Social Link
                    </button>
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={handleSocialsSave}
                            disabled={updatingSocials}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-950/20 active:scale-95 cursor-pointer"
                        >
                            {updatingSocials ? <><Loader2 size={12} className="inline animate-spin mr-1.5" />Saving...</> : 'Save'}
                        </button>
                        <button
                            onClick={() => setEditingSocials(false)}
                            disabled={updatingSocials}
                            className="bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InstructorSocialLinks
