import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loadRazorpay } from "../../../util/razorpay/razorpayLoader";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { checkLoggedInUser } from "../../../redux/slice/authSlice/checkUserAuthSlice";
import { Loader2 } from "lucide-react";
import supabase from "../../../util/supabase/supabase";

const PricingSection = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const sectionRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isUserAuth, userAuthData } = useSelector((state) => state.checkAuth);

  // Trigger animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            [0, 1, 2].forEach((index) => {
              setTimeout(() => {
                setVisibleCards((prev) =>
                  prev.includes(index) ? prev : [...prev, index]
                );
              }, index * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const CheckIcon = () => (
    <svg
      className="w-5 h-5 text-green-400 mr-3 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg
      className="w-4 h-4 ml-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const plans = [
    {
      name: "STARTER",
      subtitle: "Perfect for Casual Learners",
      priceINR: 2400,
      period: "/ Month",
      savings: "Save 15%",
      level: 1,
      features: [
        "Access to all basic course lectures",
        "Digital certificate of completion",
        "Up to 15% discount on all courses",
        "Peer community support forums",
        "Instant 24/7 dedicated support",
      ],
    },
    {
      name: "EXPERT",
      subtitle: "For Career-Driven Professionals",
      priceINR: 5600,
      period: "/ Month",
      savings: "Save 45%",
      isExpert: true,
      level: 3,
      features: [
        "Unlimited access to all courses",
        "Verified certificate of completion",
        "Up to 45% discount on all courses",
        "Instant 24/7 dedicated support",
        "Access to exclusive live webinars",
      ],
    },
    {
      name: "PRO",
      subtitle: "For Consistent Learners",
      priceINR: 4000,
      period: "/ Month",
      savings: "Save 35%",
      level: 2,
      features: [
        "Unlimited Access to all courses",
        "Verified certificate of completion",
        "Up to 35% discount on all courses",
        "Priority instructor Q&A assistance",
        "1-on-1 monthly progress review",
      ],
    },
  ];

  const handleChoosePackage = async (plan) => {
    // 1. Authenticate user
    if (!isUserAuth || !userAuthData || userAuthData.role !== 'student') {
      getSweetAlert("Authentication Required", "Please sign in as a student to subscribe to a package.", "warning");
      navigate("/signin");
      return;
    }

    const currentPlanName = userAuthData.subscription_plan;
    const currentPlan = plans.find(p => p.name === currentPlanName);
    const currentLevel = currentPlan ? currentPlan.level : 0;

    // 2. Check upgrade logic
    if (currentPlanName === plan.name) {
      getSweetAlert("Plan Already Active", `You already have the ${plan.name} plan active. You cannot purchase the same plan again.`, "info");
      return;
    }

    if (currentLevel > plan.level) {
      getSweetAlert("Downgrade Restricted", `You are currently subscribed to the higher ${currentPlanName} plan. Downgrades are not permitted.`, "warning");
      return;
    }

    // 3. Initiate payment
    setLoadingPlan(plan.name);
    try {
      // Always force-refresh the session so the JWT is never stale
      let token = null;

      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      token = refreshData?.session?.access_token;

      // Fallback: cached session (may still be valid)
      if (!token && !refreshError) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
      }

      // No valid token at all — redirect to sign in
      if (!token) {
        getSweetAlert("Session Expired", "Your session has expired. Please sign in again.", "warning");
        navigate("/signin");
        setLoadingPlan(null);
        return;
      }

      await loadRazorpay();

      let amountToPay = plan.priceINR;
      if (currentLevel > 0 && currentLevel < plan.level) {
        amountToPay = plan.priceINR - currentPlan.priceINR;
      }

      const res = await fetch(import.meta.env.VITE_CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          total: amountToPay,
          planName: plan.name,
          isSubscription: true,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Create order error:", res.status, errText);
        throw new Error("Failed to initiate order");
      }

      const orderData = await res.json();
      
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "WebBeetles",
        description: `${plan.name} Subscription Plan`,
        theme: { color: "#7C3AED" },
        handler: async (response) => {
          try {
            // Get fresh token for verification call too
            const { data: { session: verifySession } } = await supabase.auth.getSession();
            const verifyToken = verifySession?.access_token || token;

            const verifyRes = await fetch(import.meta.env.VITE_VERIFY_PAYMENT_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${verifyToken}`,
                apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              },
              body: JSON.stringify({
                ...response,
                purchaseId: orderData.purchaseId,
              }),
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed");

            // Refresh user session & data
            await dispatch(checkLoggedInUser());

            getSweetAlert("Success!", `Successfully subscribed to the ${plan.name} plan!`, "success");
            navigate("/student/dashboard");
          } catch (err) {
            getSweetAlert("Error", "Something went wrong during payment verification.", "error");
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
          }
        }
      });

      rzp.on("payment.failed", () => {
        getSweetAlert("Payment Failed", "The transaction could not be completed. Please try again.", "error");
        setLoadingPlan(null);
      });

      rzp.open();
    } catch (error) {
      console.error("Subscription payment error:", error);
      getSweetAlert("Oops!", "Could not initiate payment. Please try again later.", "error");
      setLoadingPlan(null);
    }
  };

  return (
    <div
      id="pricing"
      className="min-h-screen bg-black text-white py-12 sm:py-16 lg:py-24"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-3 sm:mb-4">
            Boost Your Skills
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold leading-tight">
            Expand <span className="text-purple-500">Your Mind</span>
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Reorder plans for mobile: STARTER, PRO, EXPERT */}
          {[0, 2, 1].map((originalIndex, displayIndex) => {
            const plan = plans[originalIndex];
            const isHovered = hoveredCard === displayIndex;
            const isPlanLoading = loadingPlan === plan.name;
            
            const currentPlanName = userAuthData?.subscription_plan;
            const currentPlanData = plans.find(p => p.name === currentPlanName);
            const currentPlanLevel = currentPlanData?.level || 0;
            const currentPlanPrice = currentPlanData?.priceINR || 0;
            
            const isCurrentPlan = currentPlanName === plan.name;
            const isDowngrade = currentPlanLevel > plan.level;
            const isUpgrade = currentPlanLevel > 0 && currentPlanLevel < plan.level;
            
            const isDisabled = isPlanLoading || isCurrentPlan || isDowngrade;
            const displayPrice = isUpgrade ? (plan.priceINR - currentPlanPrice) : plan.priceINR;
            
            let buttonText = "Choose Package";
            if (isPlanLoading) buttonText = "Processing...";
            else if (isCurrentPlan) buttonText = "Current Plan";
            else if (isDowngrade) buttonText = "Unavailable";
            else if (isUpgrade) buttonText = "Upgrade Package";

            return (
            <div
              key={originalIndex}
              className={`relative h-full transition-all duration-700 max-w-sm mx-auto md:max-w-none md:mx-0 ${
                visibleCards.includes(displayIndex) ? "animate-flip-in" : "opacity-0"
              }`}
              style={{
                transformStyle: "preserve-3d",
                animation: visibleCards.includes(displayIndex)
                  ? `flipIn 0.8s ease-out ${displayIndex * 0.2}s both`
                  : "none",
              }}
            >
              <div
                className={`relative rounded-2xl p-6 md:p-5 lg:p-6 xl:p-8 min-h-[520px] h-full border transition-all duration-300 flex flex-col
                  ${
                    isHovered && !isDisabled
                      ? "bg-gradient-to-b from-purple-500/30 via-purple-700/20 to-purple-900/10 border-purple-400 shadow-md shadow-purple-500/40 backdrop-blur-lg scale-105"
                      : "bg-gray-900/70 border-gray-800 hover:bg-gray-900"
                  }`}
                onMouseEnter={() => setHoveredCard(displayIndex)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Savings Badge */}
                <div className="absolute -top-3 right-4 sm:right-6">
                  <div className="bg-purple-600/40 text-white px-3 py-1 rounded-full sm:text-xs font-semibold tracking-wider uppercase shadow-md shadow-purple-900/20">
                    {plan.savings}
                  </div>
                </div>

                {/* Plan Name */}
                <h3 className="text-base sm:text-lg lg:text-2xl font-bold mb-2  mt-5 tracking-wide text-white/90">{plan.name}</h3>
                <p className="text-gray-400 text-xs sm:text-[13px] mb-5">
                  {plan.subtitle}
                </p>

                {/* Price */}
                <div className="mb-6 sm:mb-7 flex flex-col items-start">
                  {isUpgrade && (
                    <span className="text-gray-500 line-through text-sm sm:text-base font-semibold mb-1 decoration-red-500/50">
                      ₹{plan.priceINR.toLocaleString("en-IN")}
                    </span>
                  )}
                  <div className="flex items-baseline">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                      ₹{displayPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-gray-400 ml-1.5 text-xs sm:text-sm font-medium">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-6 mt-2 sm:mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <CheckIcon />
                      <span className="text-gray-300 text-xs sm:text-[13px] lg:text-md whitespace-nowrap overflow-hidden text-ellipsis">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => !isDisabled && handleChoosePackage(plan)}
                  disabled={isDisabled}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center text-xs sm:text-sm lg:text-md shadow-lg
                    ${
                      isDisabled
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                        : isHovered
                          ? "bg-gradient-to-r from-purple-500/60 to-purple-700/40 backdrop-blur-md border border-purple-300 text-white hover:from-purple-500 hover:to-purple-700/60 cursor-pointer"
                          : "bg-purple-500 text-white hover:bg-purple-700 cursor-pointer"
                    }`}
                >
                  {isPlanLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                  {buttonText}
                  {!isDisabled && <ArrowIcon />}
                </button>
              </div>
            </div>
          );})}
        </div>
      </div>

      {/* Flip Animation */}
      <style>{`
        @keyframes flipIn {
          0% {
            transform: perspective(400px) rotateY(-90deg);
            opacity: 0;
          }
          40% {
            transform: perspective(400px) rotateY(-10deg);
          }
          70% {
            transform: perspective(400px) rotateY(10deg);
          }
          100% {
            transform: perspective(400px) rotateY(0deg);
            opacity: 1;
          }
        }
        .animate-flip-in {
          animation: flipIn 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default PricingSection;