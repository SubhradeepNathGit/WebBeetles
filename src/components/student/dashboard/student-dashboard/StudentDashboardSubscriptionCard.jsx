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
      <div className="rounded-xl bg-[#111] border border-white/8 px-6 py-5 mb-6
        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/25
            flex items-center justify-center flex-shrink-0">
            <Rocket size={18} className="text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-white">Unlock Premium Access</p>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 uppercase tracking-wide">
                Recommended
              </span>
            </div>
            <p className="text-xs text-white/40 max-w-md leading-relaxed">
              You're on the free tier. Subscribe to unlock unlimited course access, verified certificates, priority support, and live webinars.
            </p>
          </div>
        </div>
        <button
          onClick={handleGoToPricing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500
            text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
        >
          Choose a Plan
          <ArrowUpRight size={14} />
        </button>
      </div>
    );
  }

  const cfg = planConfig[currentPlan] || planConfig.STARTER;
  const PlanIcon = cfg.Icon;

  return (
    <div className={`rounded-xl ${cfg.bg} border ${cfg.border} px-6 py-5 mb-6
      flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-white/6 border border-white/10
          flex items-center justify-center flex-shrink-0">
          <Shield size={18} style={{ color: cfg.iconColor }} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <p className="text-sm font-semibold text-white flex items-center gap-1.5">
              <PlanIcon size={14} style={{ color: cfg.iconColor }} />
              Active Plan: {currentPlan}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cfg.benefits.map((b, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-white/50">
                <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0" />
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
      {currentPlan !== 'EXPERT' && (
        <button
          onClick={handleGoToPricing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/6 border border-white/12
            text-white text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
        >
          <ArrowUpRight size={14} />
          Upgrade Plan
        </button>
      )}
    </div>
  );
};

export default StudentDashboardSubscriptionCard;
