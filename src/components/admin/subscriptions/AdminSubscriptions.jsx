import React, { useState, useEffect } from 'react';
import { CreditCard, Loader2, RefreshCcw, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import supabaseAdmin from '../../../util/supabase/supabaseAdmin';
import supabase from '../../../util/supabase/supabase';
import getSweetAlert from '../../../util/alert/sweetAlert';
import Swal from 'sweetalert2';
import { sendRefundEmail } from '../../../util/email/emailService';
import hotToast from '../../../util/alert/hot-toast';

const AdminSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            // Step 1: Fetch all students (using admin client to bypass RLS)
            const { data: allStudents, error: studentsError } = await supabaseAdmin
                .from('students')
                .select('*')
                .order('created_at', { ascending: false });

            if (studentsError) throw studentsError;

            // Step 2: Filter for students with an active subscription
            const subscribedStudents = (allStudents || []).filter(
                s => s.subscription_plan && ['STARTER', 'PRO', 'EXPERT'].includes(s.subscription_plan)
            );

            if (subscribedStudents.length === 0) {
                setSubscriptions([]);
                return;
            }

            // Step 3: Get subscription purchase details for these users
            const userIds = subscribedStudents.map(s => s.id);
            const { data: purchasesData } = await supabaseAdmin
                .from('purchases')
                .select('*')
                .eq('payment_status', 'paid')
                .in('user_id', userIds)
                .order('created_at', { ascending: false });

            // Build a purchase lookup: sum all subscription purchases per user
            const purchaseMap = {};
            if (purchasesData) {
                purchasesData.forEach(p => {
                    if (p.metadata && p.metadata.is_subscription) {
                        if (!purchaseMap[p.user_id]) {
                            purchaseMap[p.user_id] = { latest: p, total_amount: 0 };
                        }
                        purchaseMap[p.user_id].total_amount += Number(p.amount) || 0;
                    }
                });
            }

            // Step 4: Build the final list
            const merged = subscribedStudents.map(student => ({
                id: student.id,
                student,
                plan_name: student.subscription_plan,
                amount: purchaseMap[student.id]?.total_amount || 0,
                razorpay_order_id: purchaseMap[student.id]?.latest?.razorpay_order_id || null,
                razorpay_payment_id: purchaseMap[student.id]?.latest?.razorpay_payment_id || null,
                subscribed_at: purchaseMap[student.id]?.latest?.created_at || student.created_at,
            }));

            setSubscriptions(merged);
        } catch (err) {
            console.error(err);
            getSweetAlert('Error', 'Failed to fetch subscriptions', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const filtered = subscriptions.filter(sub => {
        const term = searchTerm.toLowerCase();
        const name = (sub.student?.name || '').toLowerCase();
        const email = (sub.student?.email || '').toLowerCase();
        const plan = (sub.plan_name || '').toLowerCase();
        return name.includes(term) || email.includes(term) || plan.includes(term);
    });

    const handleRevert = async (sub) => {
        if (!sub.razorpay_payment_id || !sub.amount) {
            getSweetAlert('Error', 'Missing payment details required for refund.', 'error');
            return;
        }

        const result = await Swal.fire({
            title: '<h2 class="text-2xl font-bold text-white">Revert Subscription?</h2>',
            html: `
                <div class="text-gray-300 space-y-4 text-left mt-2 text-sm">
                    <p>You are about to cancel the <span class="font-bold text-white px-2 py-0.5 bg-white/10 rounded-md">${sub.plan_name}</span> plan for <span class="font-bold text-white">${sub.student?.name || 'this student'}</span>.</p>
                    <div class="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400">
                        <p class="font-medium text-red-300 mb-1">⚠️ Warning: Irreversible Action</p>
                        <p>This will instantly revoke premium access and initiate a full refund. The student will be notified via email.</p>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5">
                        <span class="text-gray-400 font-medium">Refund Amount</span>
                        <span class="text-xl font-bold text-emerald-400">₹${sub.amount.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            `,
            icon: 'warning',
            iconColor: '#ef4444',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel & refund',
            cancelButtonText: 'Keep subscription',
            background: '#18181b',
            color: '#fff',
            backdrop: `rgba(0,0,0,0.8) backdrop-filter backdrop-blur-md`,
            customClass: {
                popup: 'rounded-[1.5rem] border border-white/10 shadow-2xl !p-6',
                title: '!p-0 !m-0 !text-left',
                htmlContainer: '!m-0',
                actions: '!grid !grid-cols-2 !gap-3 !w-full !mt-8',
                confirmButton: '!w-full px-2 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 !m-0 text-sm whitespace-nowrap',
                cancelButton: '!w-full px-2 py-3.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl font-bold transition-all border border-white/5 !m-0 text-sm whitespace-nowrap',
            },
            buttonsStyling: false
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                // 1. Call the Edge Function
                const { data: sessionData } = await supabase.auth.getSession();
                const token = sessionData.session?.access_token;

                if (!token) throw new Error("Admin session not found");

                const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/revert-subscription`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        student_id: sub.id
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to process refund");
                }

                // 2. Trigger Client-side Email Notification
                try {
                    await sendRefundEmail(
                        sub.student?.email,
                        sub.student?.name || 'User',
                        sub.plan_name,
                        sub.amount
                    );
                } catch (emailErr) {
                    console.error("Failed to send refund email:", emailErr);
                    // Non-blocking error, user still gets refunded
                    hotToast("Refund successful, but failed to send email notification", "warning");
                }

                getSweetAlert('Success', 'Subscription cancelled and refund initiated successfully.', 'success');
                fetchSubscriptions(); // Refresh the table
            } catch (err) {
                console.error("Revert error:", err);
                getSweetAlert('Error', err.message || 'Something went wrong while reverting the subscription.', 'error');
                setLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header — matches UserHeader / InstructorHeader pattern */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Active Subscriptions</h1>
                    <p className="text-gray-500 mt-1 text-sm">Track and monitor all premium student subscriptions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchSubscriptions}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white rounded-xl text-sm font-medium border border-white/5 transition-all"
                        title="Refresh Data"
                    >
                        <RefreshCcw size={15} /> Refresh
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search subscriptions..."
                            className="pl-9 pr-4 py-2 bg-[#1a1a1a] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                            <p className="text-gray-400 font-medium">Loading subscriptions...</p>
                        </div>
                    ) : filtered.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-[#151515]">
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Tier</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Paid</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed On</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map(sub => (
                                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {sub.student?.profile_image_url ? (
                                                    <img src={sub.student?.profile_image_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-purple-500/30" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                                                        {sub.student?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-200">{sub.student?.name || 'Unknown Student'}</div>
                                                    <div className="text-xs text-gray-500">ID: {sub.student?.id?.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {sub.student?.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide border ${
                                                sub.plan_name === 'EXPERT' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' :
                                                sub.plan_name === 'PRO' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-green-500/10 text-green-400 border-green-500/20'
                                            }`}>
                                                {sub.plan_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {sub.amount ? (
                                                <>
                                                    <div className="font-semibold text-gray-200">₹{sub.amount?.toLocaleString('en-IN')}</div>
                                                    <div className="text-xs text-green-500 font-medium">Paid</div>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-500">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                                            {sub.razorpay_order_id || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            }) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleRevert(sub)}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
                                            >
                                                Return Money
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <motion.div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-black" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                            <div className="flex items-center justify-center mb-6">
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">No Subscriptions Found</h3>
                            <p className="text-zinc-400 text-sm max-w-sm">
                                {searchTerm ? 'Try adjusting your search criteria.' : 'When students purchase premium packages, their active subscriptions will appear here.'}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSubscriptions;
