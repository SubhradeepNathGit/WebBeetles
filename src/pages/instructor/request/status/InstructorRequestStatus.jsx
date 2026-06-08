import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Clock, CheckCircle, XCircle, AlertCircle, Send, Mail,
  FileText, Calendar, RefreshCw, Award, Home, Shield,
  ArrowRight, Loader2
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUserAuthData } from "../../../../redux/slice/authSlice/checkUserAuthSlice";
import { formatDateTimeMeridianWithoutSecond } from "../../../../util/dateFormat/dateFormat";
import { updateLastSignInAt } from "../../../../redux/slice/authSlice/authSlice";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import supabase from "../../../../util/supabase/supabase";

/* ─── Progress Steps ─── */
const TimelineStep = ({ icon: Icon, iconBg, iconColor, borderColor, title, subtitle, detail, isActive, isComplete, isLast }) => (
  <div className="relative flex gap-4">
    {/* Connector line */}
    {!isLast && (
      <div
        className="absolute left-[19px] top-[44px] w-0.5"
        style={{
          height: "calc(100% - 20px)",
          background: isComplete
            ? "linear-gradient(to bottom, rgba(34,197,94,.5), rgba(34,197,94,.3))"
            : "linear-gradient(to bottom, rgba(255,255,255,.15), rgba(255,255,255,.05))",
          transition: "background .6s ease",
        }}
      />
    )}
    {/* Icon */}
    <div className="relative flex-shrink-0">
      <div
        className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center border-2 ${borderColor}`}
        style={{ transition: "all .4s ease" }}
      >
        <Icon size={18} className={iconColor} />
      </div>
    </div>
    {/* Content */}
    <div className="flex-1 pb-6">
      <h4 className="text-white font-semibold text-sm mb-0.5">{title}</h4>
      <p className="text-white/50 text-xs mb-0.5">{subtitle}</p>
      <p className="text-white/35 text-xs leading-relaxed">{detail}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const InstructorRequestStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const userAuthData = useSelector((state) => state.checkAuth.userAuthData);
  const requestData = userAuthData || state?.instructorData;
  const user_type = "instructor";

  const [currentStatus, setCurrentStatus] = useState(requestData?.application_status || "pending");
  const [redirectCountdown, setRedirectCountdown] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const subscriptionRef = useRef(null);

  const requestDataRef = useRef(requestData);
  const currentStatusRef = useRef(currentStatus);

  useEffect(() => {
    requestDataRef.current = requestData;
  }, [requestData]);

  useEffect(() => {
    currentStatusRef.current = currentStatus;
  }, [currentStatus]);

  /* ─── Supabase real-time subscription ─── */
  useEffect(() => {
    if (!requestData?.id) return;

    const channel = supabase
      .channel(`instructor-status-${requestData.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "instructors",
          filter: `id=eq.${requestData.id}`,
        },
        (payload) => {
          const newStatus = payload.new?.application_status;
          if (newStatus && newStatus !== currentStatusRef.current) {
            setCurrentStatus(newStatus);
            dispatch(setUserAuthData({ ...requestDataRef.current, ...payload.new }));
          }
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [requestData?.id, dispatch]);

  /* ─── Auto-redirect on approval ─── */
  useEffect(() => {
    if (currentStatus !== "approved" || !requestData?.id || isRedirecting) return;

    setRedirectCountdown(5);
    setIsRedirecting(true);

    // Start countdown
    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setRedirectCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        // Navigate to dashboard
        dispatch(updateLastSignInAt({ id: requestData.id, user_type }))
          .then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              navigate(`/${user_type}/dashboard`, { replace: true });
            }
          })
          .catch(() => {
            navigate(`/${user_type}/dashboard`, { replace: true });
          });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStatus]);

  /* ─── Actions ─── */
  const userLogout = async () => {
    await dispatch(logoutUser({ user_type: "instructor", status: false }))
      .then(() => navigate("/instructor/"))
      .catch(() =>
        getSweetAlert({ title: "Logout Failed!", text: "Something went wrong.", icon: "error" })
      );
  };

  const goToDashboard = () => {
    if (!requestData?.id) return;
    dispatch(updateLastSignInAt({ id: requestData.id, user_type }))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          navigate(`/${user_type}/dashboard`);
        } else {
          getSweetAlert("Oops...", res.payload, "info");
        }
      })
      .catch(() => getSweetAlert("Oops...", "Something went wrong!", "error"));
  };

  const refreshStatus = async () => {
    if (!requestData?.id) return window.location.reload();
    const { data, error } = await supabase
      .from("instructors")
      .select("*")
      .eq("id", requestData.id)
      .single();
    if (!error && data) {
      setCurrentStatus(data.application_status);
      dispatch(setUserAuthData({ ...requestData, ...data }));
    }
  };

  /* ─── Status configs ─── */
  const statusConfig = {
    pending: {
      icon: Clock,
      gradient: "from-amber-500/20 via-orange-500/15 to-yellow-500/10",
      border: "border-amber-500/25",
      iconBg: "bg-amber-500/20",
      iconColor: "text-orange-400",
      accentColor: "#fb923c",
      title: "Application Under Review",
      description: "Our team is carefully reviewing your credentials and expertise. You'll be notified the moment a decision is made.",
    },
    approved: {
      icon: CheckCircle,
      gradient: "from-emerald-500/25 via-green-500/15 to-teal-500/10",
      border: "border-emerald-500/30",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-green-400",
      accentColor: "#4ade80",
      title: "Application Approved!",
      description: "Congratulations! You've been approved as an instructor. Welcome to the WebBeetles teaching community.",
    },
    rejected: {
      icon: XCircle,
      gradient: "from-red-500/20 via-rose-500/15 to-pink-500/10",
      border: "border-red-500/25",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      accentColor: "#f87171",
      title: "Application Not Approved",
      description: "We appreciate your interest. Unfortunately, your application wasn't approved at this time. You're welcome to reapply.",
    },
  };

  const cfg = statusConfig[currentStatus] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <>
      <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
        {/* Background ambience */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: `radial-gradient(circle, ${cfg.accentColor}, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{ background: `radial-gradient(circle, ${cfg.accentColor}, transparent 70%)` }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-5">

          {/* ─── Header ─── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Shield size={20} className="text-white/60" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Application Status</h1>
                <p className="text-white/40 text-xs">Instructor Verification</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-white/25 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              ID: {requestData?.id?.slice(0, 8)}…
            </span>
          </div>

          {/* ─── Status Hero Card ─── */}
          <div className={`relative rounded-2xl border ${cfg.border} overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient}`} />

            <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="relative mb-5">
                <div className={`w-20 h-20 rounded-full ${cfg.iconBg} flex items-center justify-center border-2 ${cfg.border}`}>
                  {currentStatus === "pending" ? (
                    <Clock size={36} className="text-orange-400" />
                  ) : currentStatus === "approved" ? (
                    <CheckCircle size={36} className="text-green-400" />
                  ) : (
                    <XCircle size={36} className="text-red-400" />
                  )}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">{cfg.title}</h2>
              <p className="text-white/50 text-sm max-w-md leading-relaxed mb-4">{cfg.description}</p>

              {/* Pending: Live indicator */}
              {currentStatus === "pending" && (
                <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400" />
                  </span>
                  <span className="text-white/60 text-xs font-medium">Listening for updates in real-time</span>
                </div>
              )}

              {/* Approved: Countdown */}
              {currentStatus === "approved" && redirectCountdown !== null && (
                <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-3 rounded-xl border border-emerald-500/20 mt-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400 font-bold text-lg">
                    {redirectCountdown}
                  </div>
                  <div className="text-left">
                    <p className="text-emerald-300 text-sm font-semibold">Redirecting to Dashboard</p>
                    <p className="text-emerald-400/50 text-xs">Your instructor portal is ready</p>
                  </div>
                  <Loader2 size={18} className="text-emerald-400 animate-spin ml-auto" />
                </div>
              )}
            </div>
          </div>

          {/* ─── Timeline Card ─── */}
          <div className="rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Calendar size={14} className="text-white/40" />
              Application Timeline
            </h3>

            <div>
              <TimelineStep
                icon={CheckCircle}
                iconBg="bg-emerald-500/20"
                iconColor="text-green-400"
                borderColor="border-emerald-500/30"
                title="Application Submitted"
                subtitle={formatDateTimeMeridianWithoutSecond(requestData?.created_at) || "N/A"}
                detail="Your application has been received and queued for review."
                isActive={false}
                isComplete={true}
                isLast={false}
              />

              <TimelineStep
                icon={currentStatus === "pending" ? RefreshCw : CheckCircle}
                iconBg={currentStatus === "pending" ? "bg-amber-500/20" : "bg-emerald-500/20"}
                iconColor={currentStatus === "pending" ? "text-orange-400" : "text-green-400"}
                borderColor={currentStatus === "pending" ? "border-amber-500/30" : "border-emerald-500/30"}
                title="Under Review"
                subtitle={currentStatus === "pending" ? "In Progress" : "Completed"}
                detail={currentStatus === "pending"
                  ? "Our team is reviewing your credentials. Expected: 5–7 business days."
                  : "Review completed successfully."
                }
                isActive={currentStatus === "pending"}
                isComplete={currentStatus !== "pending"}
                isLast={false}
              />

              <TimelineStep
                icon={
                  currentStatus === "pending" ? AlertCircle
                    : currentStatus === "approved" ? Award
                      : XCircle
                }
                iconBg={
                  currentStatus === "pending" ? "bg-white/5"
                    : currentStatus === "approved" ? "bg-emerald-500/20"
                      : "bg-red-500/20"
                }
                iconColor={
                  currentStatus === "pending" ? "text-white/30"
                    : currentStatus === "approved" ? "text-green-400"
                      : "text-red-400"
                }
                borderColor={
                  currentStatus === "pending" ? "border-white/10"
                    : currentStatus === "approved" ? "border-emerald-500/30"
                      : "border-red-500/30"
                }
                title={
                  currentStatus === "pending" ? "Decision Pending"
                    : currentStatus === "approved" ? "Application Approved"
                      : "Application Declined"
                }
                subtitle={currentStatus === "pending" ? "Awaiting decision" : "Process Complete"}
                detail={
                  currentStatus === "pending"
                    ? "You'll receive a notification once a decision is made."
                    : currentStatus === "approved"
                      ? "Welcome aboard! You can now create and manage courses."
                      : "Please review the requirements and consider reapplying."
                }
                isActive={false}
                isComplete={currentStatus !== "pending"}
                isLast={true}
              />
            </div>
          </div>

          {/* ─── Action Buttons ─── */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {currentStatus === "pending" && (
              <>
                <button
                  onClick={refreshStatus}
                  className="flex-1 group relative bg-white/[.04] hover:bg-white/[.08] text-white font-medium py-3 px-5 rounded-xl border border-white/[.08] hover:border-white/15 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                  Check Status
                </button>
                <button
                  onClick={userLogout}
                  className="flex-1 bg-white/[.04] hover:bg-white/[.08] text-white/60 hover:text-white font-medium py-3 px-5 rounded-xl border border-white/[.08] hover:border-white/15 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Home size={16} />
                  Go Home
                </button>
              </>
            )}
            {currentStatus === "approved" && (
              <button
                onClick={goToDashboard}
                className="flex-1 group bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold py-3.5 px-5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Award size={16} />
                Go to Instructor Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            {currentStatus === "rejected" && (
              <>
                <Link
                  to="/instructor/signup"
                  className="flex-1 bg-white/[.04] hover:bg-white/[.08] text-white font-medium py-3 px-5 rounded-xl border border-white/[.08] hover:border-white/15 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={16} />
                  Submit New Application
                </Link>
                <button
                  onClick={userLogout}
                  className="flex-1 bg-white/[.04] hover:bg-white/[.08] text-white/60 hover:text-white font-medium py-3 px-5 rounded-xl border border-white/[.08] hover:border-white/15 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Home size={16} />
                  Go Home
                </button>
              </>
            )}
          </div>

          {/* ─── Help Card ─── */}
          <div className="rounded-xl border border-white/[.06] bg-white/[.02] p-4 flex gap-3">
            <Mail size={16} className="text-white/30 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-white/60 font-medium text-xs mb-0.5">Need assistance?</h4>
              <p className="text-white/30 text-xs leading-relaxed">
                Contact our support team if you have questions about your application. We typically respond within 24 hours.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default InstructorRequestStatus;