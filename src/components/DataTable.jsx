import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DataTable = ({ data, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-8 bg-linear-to-b from-[#1F3A5F] to-[#4D648D] rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full rounded">
          <thead>
            <tr className="bg-[#2A3A50]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-[#3A4A60]">
                Product Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-[#3A4A60]">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-[#3A4A60]">
                Air Temperature
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-[#3A4A60]">
                Process Temperature
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-[#3A4A60]">
                Rotational Speed
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-[#3A4A60]">
                Torque
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white border-r border-[#3A4A60]">
                Tool Wear
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#2A3A50] bg-white/10 hover:bg-[#1F2B3E]/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                  {row.productName}
                </td>
                <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                  {row.type}
                </td>
                <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                  {row.airTemp}
                </td>
                <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                  {row.processTemp}
                </td>
                <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                  {row.rotationalSpeed}
                </td>
                <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                  {row.torque}
                </td>
                <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                  {row.toolWear}
                </td>
                <td className="px-6 py-4 text-center">
                  <Link to={`/details`} className="text-white hover:text-blue-400 transition-colors">
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-4 rounded-2xl p-4 bg-[#1F2B3E]/30 w-fit mx-auto">
        <span className="text-white text-sm">
          Showing {startIndex + 1}-{Math.min(endIndex, data.length)}/{data.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#2A3A50] text-white rounded-lg hover:bg-[#3A4A60] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
