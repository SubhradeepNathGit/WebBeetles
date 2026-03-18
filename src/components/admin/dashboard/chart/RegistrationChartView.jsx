import React from "react";
import RegistrationChart from "../../charts/RegistrationChart";

const RegistrationChartView = () => {
  const year = new Date().getFullYear();

  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 lg:col-span-3 shadow-xl">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-white">
          Student vs Instructor Registrations
        </h2>
        <span className="text-xs text-gray-500">{year}</span>
      </div>

      <p className="text-2xl font-bold text-white mb-6">
        Monthly Growth <span className="text-sm font-normal text-purple-400 ml-1">registrations</span>
      </p>

      <div className="h-56">
        <RegistrationChart />
      </div>
    </div>
  );
};

export default RegistrationChartView;