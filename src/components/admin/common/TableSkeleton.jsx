import React from 'react';

const TableSkeleton = ({ columns = 5, rows = 5 }) => {
  return (
    <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-[#151515]">
              {[...Array(columns)].map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-white/5 rounded w-16 mx-auto"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[...Array(rows)].map((_, rowIndex) => (
              <tr key={rowIndex} className="text-center">
                {[...Array(columns)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-white/5 rounded w-2/3 mx-auto"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-[#151515]">
        <div className="h-4 bg-white/5 rounded w-32"></div>
        <div className="flex gap-2">
          <div className="h-7 bg-white/5 rounded w-16"></div>
          <div className="h-7 bg-white/5 rounded w-8"></div>
          <div className="h-7 bg-white/5 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
