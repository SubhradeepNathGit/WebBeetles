import React from 'react';
import { Sparkles, ArrowUpRight, CheckCircle2, Crown, Zap, Star, Rocket, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const planConfig = {
  STARTER: {
    label: "Starter", Icon: Star, iconColor: "#a78bfa",
    border: "border-purple-500/20", bg: "bg-purple-500/8",
    tag: "bg-purple-500/15 border-purple-500/25 text-purple-300",
    benefits: ["All basic course lectures", "Standard digital certificate", "Up to 2 active enrollments"],
  },
  PRO: {
    label: "Pro", Icon: Zap, iconColor: "#60a5fa",
    border: "border-blue-500/20", bg: "bg-blue-500/8",
    tag: "bg-blue-500/15 border-blue-500/25 text-blue-300",
    benefits: ["Basic & intermediate courses", "Verified certificates", "Unlimited enrollments"],
  },
  EXPERT: {
    label: "Expert", Icon: Crown, iconColor: "#fbbf24",
    border: "border-amber-500/20", bg: "bg-amber-500/8",
    tag: "bg-amber-500/15 border-amber-500/25 text-amber-300",
    benefits: ["All premium courses", "Co-branded certificates", "Weekly live webinars"],
  },
};

const StudentDashboardSubscriptionCard = ({ userDetails }) => {
  const navigate = useNavigate();
  const currentPlan = userDetails?.subscription_plan;

  const handleGoToPricing = () => {
    navigate('/');
    setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  if (!currentPlan) {
    return (
      <div className="relative flex w-full max-w-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-black border border-white/[0.08] hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 group">
        {/* Card Content */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Top Row with Premium Recommended Badge */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-purple-600/20 border border-purple-500/25 flex items-center justify-center">
              <Rocket size={18} className="text-purple-400" />
            </div>
            <span className="max-w-full truncate rounded-full border border-purple-500/25 bg-purple-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
              Recommended
            </span>
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white mb-2">Unlock Premium Access</h3>
            <p className="text-xs text-white/50 leading-relaxed mb-5">
              You're on the free tier. Subscribe to unlock unlimited course access, verified certificates, priority support, and live webinars.
            </p>

            {/* List of high-value perks to make it look even more premium */}
            <div className="mb-6 space-y-2">
              {[
                "Unlimited Course Access",
                "Verified Certificates",
                "Priority Live Support",
                "Weekly Live Webinars"
              ].map((perk, idx) => (
                <div key={idx} className="flex min-w-0 items-center gap-2 text-xs text-white/40">
                  <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500/60" />
                  <span className="min-w-0">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <button
            onClick={handleGoToPricing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
          >
            <span>Choose a Plan</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  const cfg = planConfig[currentPlan] || planConfig.STARTER;
  const PlanIcon = cfg.Icon;

  return (
    <div className="relative flex w-full max-w-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-black border border-white/[0.08] hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Plan Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Shield size={18} style={{ color: cfg.iconColor }} />
          </div>
          <span className={`max-w-full truncate rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.tag}`}>
            {cfg.label} Plan
          </span>
        </div>

        {/* Plan Info */}
        <div className="flex-1">
          <h3 className="mb-3 flex min-w-0 items-center gap-2 text-base font-semibold text-white">
            <PlanIcon size={16} style={{ color: cfg.iconColor }} />
            Active Plan
          </h3>

          <div className="space-y-2.5 mb-6">
            {cfg.benefits.map((b, i) => (
              <div key={i} className="flex min-w-0 items-start gap-2.5 text-xs leading-relaxed text-white/50">
                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="min-w-0">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button for non-EXPERT */}
      {currentPlan !== 'EXPERT' && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <button
            onClick={handleGoToPricing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 cursor-pointer"
          >
            <span>Upgrade Plan</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardSubscriptionCard;
