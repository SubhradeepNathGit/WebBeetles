import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, CheckCircle, XCircle, AlertCircle, Send, Mail,
  FileText, Calendar, RefreshCw, Loader2, Award
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { instructorRequestStatus } from "../../../redux/slice/instructorSlice";

const RequestStatusPage = ({ userData }) => {
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(),
    dispatch = useDispatch(),
    { isInstructorPending, getInstructorData, isInstructorError } = useSelector(react => react.specificInstructor);

  useEffect(() => {
    dispatch(instructorRequestStatus())
      .then((res) => {
        // console.log('Instructor request status:', res);
      })
      .catch((err) => {
        getSweetAlert("Oops...", "Something went wrong!", "error");
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  const fetchRequestStatus = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setRequestData({
      status: "pending",
      submittedAt: "October 5, 2025",
      requestId: "REQ-2025-10842",
      applicantName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      experience: "5 years",
      expertise: "Web Development, React, Node.js",
      message: "I have extensive experience in teaching web development and would love to share my knowledge with students on this platform.",
      expectedResponseTime: "2-3 business days"
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchRequestStatus();
  }, []);

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "orange",
      bgGradient: "from-orange-500/20 to-yellow-500/20",
      borderColor: "border-orange-400/30",
      iconBg: "bg-orange-500/30",
      iconColor: "text-orange-400",
      title: "Request Under Review",
      description: "Your instructor application is being reviewed by our admin team. We'll notify you once a decision is made.",
      animation: "animate-pulse"
    },
    approved: {
      icon: CheckCircle,
      color: "green",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-400/30",
      iconBg: "bg-green-500/30",
      iconColor: "text-green-400",
      title: "Request Approved! 🎉",
      description: "Congratulations! Your instructor application has been approved. You can now start creating and managing courses.",
      animation: "animate-bounce"
    },
    rejected: {
      icon: XCircle,
      color: "red",
      bgGradient: "from-red-500/20 to-pink-500/20",
      borderColor: "border-red-400/30",
      iconBg: "bg-red-500/30",
      iconColor: "text-red-400",
      title: "Request Not Approved",
      description: "Unfortunately, your instructor application was not approved at this time. You can reapply after reviewing our requirements.",
      animation: ""
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-20 h-20 text-purple-400/50 animate-spin" />
        </div>
      </div>
    );
  }

  const status = statusConfig[requestData.status];

  return (
    <div className="min-h-screen bg-black p-3 sm:p-4">
      <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4">

        <div className="bg-gradient-to-r from-purple-600/30 to-black backdrop-blur-xl rounded-2xl shadow-2xl border  p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-purple-200 bg-white/20 px-2.5 py-1 rounded-full">INSTRUCTOR APPLICATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Request Status</h1>
          <p className="text-purple-100 text-xs sm:text-sm">Track your instructor application progress</p>
        </div>

        <div className={`bg-gradient-to-br ${status.bgGradient} backdrop-blur-xl rounded-2xl shadow-2xl border ${status.borderColor} p-4 sm:p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${status.iconBg} flex items-center justify-center mb-3 shadow-2xl border-4 ${status.borderColor} ${status.animation}`}>
              <status.icon className={`${status.iconColor}`} size={36} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{status.title}</h2>
            <p className="text-purple-100 text-xs sm:text-sm max-w-2xl mb-3">{status.description}</p>

            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-sm">
              <FileText size={14} className="text-purple-300" />
              <span className="text-white text-xs font-semibold">Request ID: {requestData.requestId}</span>
            </div>

            {requestData.status === "pending" && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className="text-orange-300 text-xs font-medium">Processing...</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="text-blue-400" size={20} />
            Application Timeline
          </h3>

          <div className="space-y-0 relative">
            <div className="relative flex gap-3">
              <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-0.5 bg-gradient-to-b from-green-400/50 to-orange-400/50"></div>

              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-green-500/30 border-2 border-green-400 flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-400" />
                </div>
              </div>

              <div className="flex-1 pb-4">
                <h4 className="text-white font-bold text-xs sm:text-sm mb-0.5">Application Submitted</h4>
                <p className="text-purple-200 text-xs mb-1">{requestData.submittedAt}</p>
                <p className="text-purple-300 text-xs">Your application has been successfully submitted and received.</p>
              </div>
            </div>

            <div className="relative flex gap-3">
              {(requestData.status === "approved" || requestData.status === "rejected") && (
                <div className={`absolute left-[15px] top-8 h-[calc(100%-16px)] w-0.5 ${requestData.status === "approved"
                  ? "bg-gradient-to-b from-green-400/50 to-green-400/50"
                  : "bg-gradient-to-b from-orange-400/50 to-red-400/50"
                  }`}></div>
              )}

              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full ${requestData.status === "pending" ? "bg-orange-500/30 border-2 border-orange-400 animate-pulse" : "bg-green-500/30 border-2 border-green-400"} flex items-center justify-center`}>
                  {requestData.status === "pending" ? <RefreshCw size={16} className="text-orange-400 animate-spin" /> : <CheckCircle size={16} className="text-green-400" />}
                </div>
              </div>

              <div className="flex-1 pb-4">
                <h4 className="text-white font-bold text-xs sm:text-sm mb-0.5">Under Review</h4>
                <p className="text-purple-200 text-xs mb-1">{requestData.status === "pending" ? "In Progress" : "Completed"}</p>
                <p className="text-purple-300 text-xs">{requestData.status === "pending" ? `Our team is reviewing your application. Expected response: ${requestData.expectedResponseTime}` : "Review completed successfully."}</p>
              </div>
            </div>

            <div className="relative flex gap-3">
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full ${requestData.status === "pending" ? "bg-white/10 border-2 border-white/30" : requestData.status === "approved" ? "bg-green-500/30 border-2 border-green-400" : "bg-red-500/30 border-2 border-red-400"} flex items-center justify-center`}>
                  {requestData.status === "pending" ? <AlertCircle size={16} className="text-white/50" /> : requestData.status === "approved" ? <Award size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-white font-bold text-xs sm:text-sm mb-0.5">{requestData.status === "pending" ? "Decision Pending" : requestData.status === "approved" ? "Application Approved" : "Application Declined"}</h4>
                <p className="text-purple-200 text-xs mb-1">{requestData.status === "pending" ? "Awaiting admin decision" : "Process Complete"}</p>
                <p className="text-purple-300 text-xs">{requestData.status === "pending" ? "You'll receive an email notification once a decision is made." : requestData.status === "approved" ? "You can now access the instructor dashboard and start creating courses!" : "Please review the requirements and consider reapplying in the future."}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {requestData.status === "pending" && (
            <button className="flex-1 bg-purple-700  hover:from-purple-400  text-white font-semibold py-2.5 px-4 rounded-xl border border-blue-400/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm" onClick={fetchRequestStatus}>
              <RefreshCw size={16} />
              Refresh Status
            </button>
          )}
          {requestData.status === "approved" && (
            <button className="flex-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 hover:from-green-500/40 hover:to-emerald-500/40 text-white font-semibold py-2.5 px-4 rounded-xl border border-green-400/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm">
              <Award size={16} />
              Go to Instructor Dashboard
            </button>
          )}
          {requestData.status === "rejected" && (
            <button className="flex-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 text-white font-semibold py-2.5 px-4 rounded-xl border border-purple-400/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm">
              <Send size={16} />
              Submit New Application
            </button>
          )}
          <button
            onClick={() => navigate("/contact")}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-4 rounded-xl border border-white/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <Mail size={16} />
            Contact Support
          </button>
        </div>

        <div className="bg-blue-500/10 backdrop-blur-xl rounded-xl border border-blue-400/30 p-3 sm:p-4">
          <div className="flex gap-2.5">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <h4 className="text-white font-semibold text-xs sm:text-sm mb-0.5">Need Help?</h4>
              <p className="text-blue-200 text-xs">If you have any questions about your application status or the instructor program, feel free to contact our support team. We typically respond within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestStatusPage;