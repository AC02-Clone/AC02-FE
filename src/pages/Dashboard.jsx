import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FloatingChat from "../components/FloatingChat";
import SearchMachines from "../components/SearchMachines";
import CustomSelect from "../components/CustomSelect";
import {
  getAllMachines,
  searchMachines,
  filterMachinesByType,
  filterMachinesByRisk,
  filterMachinesBySeverity,
  getMachineStatistics,
} from "../services/machineApi";
import { Icon } from "@iconify/react";

const Dashboard = () => {
  // Predictions
  const [predictions, setPredictions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const typeOptions = [
    { value: "L", label: "Low" },
    { value: "M", label: "Medium" },
    { value: "H", label: "High" },
  ];

  const riskOptions = [
    { value: "healthy", label: "Healthy" },
    { value: "failure", label: "Failure" },
  ];

  const severityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  useEffect(() => {
    loadStatistics();
  }, []);

  useEffect(() => {
    if (!isSearching && !isFiltering) {
      loadMachinesAndPredict();
    }
  }, [currentPage, isSearching, isFiltering]);

  // Load filtered data when filter changes
  useEffect(() => {
    if (isSearching && searchTerm.trim()) {
      handleSearch(currentPage);
    }
  }, [searchTerm, currentPage, isSearching]);

  useEffect(() => {
    if (isFiltering && selectedType) {
      handleFilter(currentPage);
    }
  }, [selectedType, currentPage, isFiltering]);

  useEffect(() => {
    if (isFiltering && selectedRisk) {
      handleRiskFilter(currentPage);
    }
  }, [selectedRisk, currentPage, isFiltering]);

  useEffect(() => {
    if (isFiltering && selectedSeverity) {
      handleSeverityFilter(currentPage);
    }
  }, [selectedSeverity, currentPage, isFiltering]);

  // Search effect
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setIsFiltering(false);
      setCurrentPage(1);
    } else if (!selectedType && !selectedRisk && !selectedSeverity) {
      setIsSearching(false);
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Filter effect
  useEffect(() => {
    if (selectedType) {
      setIsFiltering(true);
      setIsSearching(false);
      setSelectedRisk("");
      setSelectedSeverity("");
      setCurrentPage(1);
    } else if (!searchTerm.trim() && !selectedRisk && !selectedSeverity) {
      setIsFiltering(false);
      setCurrentPage(1);
    }
  }, [selectedType]);

  // Filter by risk effect
  useEffect(() => {
    if (selectedRisk) {
      setIsFiltering(true);
      setIsSearching(false);
      setSelectedType("");
      setSelectedSeverity("");
      setCurrentPage(1);
    } else if (!searchTerm.trim() && !selectedType && !selectedSeverity) {
      setIsFiltering(false);
      setCurrentPage(1);
    }
  }, [selectedRisk]);

  // Filter severity
  useEffect(() => {
    if (selectedSeverity) {
      setIsFiltering(true);
      setIsSearching(false);
      setSelectedType("");
      setSelectedRisk("");
      setCurrentPage(1);
    } else if (!searchTerm.trim() && !selectedType && !selectedRisk) {
      setIsFiltering(false);
      setCurrentPage(1);
    }
  }, [selectedSeverity]);

  const loadStatistics = async () => {
    setLoadingSummary(true);
    try {
      const stats = await getMachineStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error("Error loading summary:", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadMachinesAndPredict = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllMachines(currentPage, itemsPerPage);
      setMachines(response.machines);
      setPredictions(response.machines); // Langsung set predictions dengan data machines
      setPaginationInfo(response.pagination);
    } catch (err) {
      console.error("Error loading machines:", err);
      setError(`Failed to load machines: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = async (page = 1) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const results = await searchMachines(searchTerm, page, itemsPerPage);
      setMachines(results.machines);
      setPredictions(results.machines);
      setPaginationInfo(results.pagination);
    } catch (err) {
      console.error("Search error:", err);
      setError(`Failed to search machines: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter handler
  const handleFilter = async (page = 1) => {
    if (!selectedType) return;

    setLoading(true);
    setError(null);

    try {
      const results = await filterMachinesByType(
        selectedType,
        page,
        itemsPerPage
      );
      setMachines(results.machines);
      setPredictions(results.machines);
      setPaginationInfo(results.pagination);
    } catch (err) {
      console.error("Filter error:", err);
      setError(`Failed to filter machines: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter by risk handler
  const handleRiskFilter = async (page = 1) => {
    if (!selectedRisk) return;

    setLoading(true);
    setError(null);

    try {
      const results = await filterMachinesByRisk(
        selectedRisk,
        page,
        itemsPerPage
      );
      setMachines(results.machines);
      setPredictions(results.machines);
      setPaginationInfo(results.pagination);
    } catch (err) {
      console.error("Filter by risk error:", err);
      setError(`Failed to filter machines by risk: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter by severity handler
  const handleSeverityFilter = async (page = 1) => {
    if (!selectedSeverity) return;

    setLoading(true);
    setError(null);

    try {
      const results = await filterMachinesBySeverity(
        selectedSeverity,
        page,
        itemsPerPage
      );
      setMachines(results.machines);
      setPredictions(results.machines);
      setPaginationInfo(results.pagination);
    } catch (err) {
      console.error("Filter by severity error:", err);
      setError(`Failed to filter machines by severity: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setSelectedRisk("");
    setSelectedSeverity("");
    setIsSearching(false);
    setIsFiltering(false);
    setCurrentPage(1);
  };

  // Tables
  const currentData = predictions;

  const handlePrevPage = () => {
    if (paginationInfo && paginationInfo.has_prev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (paginationInfo && paginationInfo.has_next) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-[#0f1c2e] min-h-screen">
      <div className="">
        <Header />
        <div className="bg-[#1F2B3E]/50 w-full py-2 px-8 border border-[#2A3A4E] rounded-b-lg">
          <h2 className="font-semibold text-white">Dashboard</h2>
        </div>
        <div className="max-w-6xl px-6 py-8 mx-auto">
          <div className="flex flex-col items-stretch gap-6 lg:flex-row">
            {/* Left Card */}
            {/* <div className="lg:w-1/3">
              <div className="bg-[#172334] rounded-2xl p-6 shadow-xl h-full">
                <h3 className="text-lg font-semibold text-white">Maintenance History (3 months)</h3>

                <div className="relative mt-8">
                  <div className="absolute h-px left-4 right-4 bottom-2 bg-white/30"></div>

                  <div className="relative flex items-end justify-between gap-6 pt-2">
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-16 rounded-t-full bg-[#D6E9FF]" style={{ height: '120px' }}></div>
                      <div className="h-2"></div>
                    </div>

                    <div className="flex flex-col items-center flex-1">
                      <div className="w-16 rounded-t-full bg-[#5B7095]" style={{ height: '150px' }}></div>
                      <div className="h-2"></div>
                    </div>

                    <div className="flex flex-col items-center flex-1">
                      <div className="w-16 rounded-t-full bg-[#C6D4FF]" style={{ height: '90px' }}></div>
                      <div className="h-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="lg:w-1/3">
              <div className="bg-[#172334] rounded-2xl p-6 shadow-xl h-full">
                <h3 className="text-lg font-semibold text-white">
                  Machine Status
                </h3>

                {loadingSummary ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block w-12 h-12 border-b-4 border-blue-600 rounded-full animate-spin"></div>
                      <p className="mt-4 text-sm text-gray-400">Loading...</p>
                    </div>
                  </div>
                ) : statistics ? (
                  <>
                    <div className="flex flex-row gap-4 mt-4">
                      <div
                        className={`p-4 rounded-lg border text-center text-red-300 border-red-200 w-full`}
                      >
                        <p className="text-sm font-medium opacity-75">
                          Failure
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {statistics.prediction_summary?.status?.FAILURE || 0}
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-lg border text-center text-green-300 border-green-400 w-full`}
                      >
                        <p className="text-sm font-medium opacity-75">
                          Healthy
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {statistics.prediction_summary?.status?.HEALTHY || 0}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-gray-400">No data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Card*/}
            <div className="lg:flex-1">
              <div className="bg-[#172334] rounded-2xl p-8 shadow-xl h-full flex flex-col justify-between">
                {loadingSummary ? (
                  <div className="flex items-center justify-center flex-1">
                    <div className="text-center">
                      <div className="inline-block w-12 h-12 border-b-4 border-blue-600 rounded-full animate-spin"></div>
                      <p className="mt-4 text-sm text-gray-400">
                        Loading summary...
                      </p>
                    </div>
                  </div>
                ) : statistics ? (
                  <>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="text-center border-r border-white/20">
                          <div className="mb-2 font-medium text-white">Low</div>
                          <div className="text-5xl lg:text-7xl leading-none font-extrabold text-[#7fffd4]">
                            {statistics.prediction_summary?.severity?.LOW || 0}
                          </div>
                        </div>

                        <div className="text-center border-r border-white/20">
                          <div className="mb-2 font-medium text-white">
                            Medium
                          </div>
                          <div className="text-5xl lg:text-7xl leading-none font-extrabold text-[#fff88c]">
                            {statistics.prediction_summary?.severity?.MEDIUM ||
                              0}
                          </div>
                        </div>

                        <div className="text-center border-r border-white/20">
                          <div className="mb-2 font-medium text-white">
                            High
                          </div>
                          <div className="text-5xl lg:text-7xl leading-none font-extrabold text-[#ffb2b5]">
                            {statistics.prediction_summary?.severity?.HIGH || 0}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="mb-2 font-medium text-white">
                            Critical
                          </div>
                          <div className="text-5xl lg:text-7xl leading-none font-extrabold text-[#ff646a]">
                            {statistics.prediction_summary?.severity
                              ?.CRITICAL || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <div className="font-semibold text-white">
                        Total: {statistics.total_records_processed || 0} Units
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-gray-400">No data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Charts Section */}
          {statistics && (
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Machine Type Distribution */}
                <div className="bg-[#172334] rounded-2xl p-6 shadow-xl">
                  <h3 className="mb-6 text-lg font-semibold text-white">Machine Type Distribution</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Type L (Low)</span>
                        <span className="text-sm font-bold text-white">{statistics.type_l_count_unique || 0}</span>
                      </div>
                      <div className="w-full h-4 overflow-hidden bg-gray-700 rounded-full">
                        <div 
                          className="h-full transition-all duration-500 bg-blue-500 rounded-full"
                          style={{ width: `${(statistics.type_l_count_unique / statistics.total_unique_machines * 100) || 0}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {((statistics.type_l_count_unique / statistics.total_unique_machines * 100) || 0).toFixed(1)}%
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Type M (Medium)</span>
                        <span className="text-sm font-bold text-white">{statistics.type_m_count_unique || 0}</span>
                      </div>
                      <div className="w-full h-4 overflow-hidden bg-gray-700 rounded-full">
                        <div 
                          className="h-full transition-all duration-500 bg-yellow-500 rounded-full"
                          style={{ width: `${(statistics.type_m_count_unique / statistics.total_unique_machines * 100) || 0}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {((statistics.type_m_count_unique / statistics.total_unique_machines * 100) || 0).toFixed(1)}%
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Type H (High)</span>
                        <span className="text-sm font-bold text-white">{statistics.type_h_count_unique || 0}</span>
                      </div>
                      <div className="w-full h-4 overflow-hidden bg-gray-700 rounded-full">
                        <div 
                          className="h-full transition-all duration-500 bg-purple-500 rounded-full"
                          style={{ width: `${(statistics.type_h_count_unique / statistics.total_unique_machines * 100) || 0}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {((statistics.type_h_count_unique / statistics.total_unique_machines * 100) || 0).toFixed(1)}%
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Total Machines</span>
                        <span className="text-xl font-bold text-blue-400">{statistics.total_unique_machines || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Sensor Readings */}
                <div className="bg-[#172334] rounded-2xl p-6 shadow-xl">
                  <h3 className="mb-6 text-lg font-semibold text-white">Average Sensor Readings</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#1F3A5F] rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Air Temperature</p>
                          <p className="text-2xl font-bold text-white">{parseFloat(statistics.avg_air_temp || 0).toFixed(2)} K</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-500/20">
                          <Icon icon="mdi:thermometer" className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#1F3A5F] rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Process Temperature</p>
                          <p className="text-2xl font-bold text-white">{parseFloat(statistics.avg_process_temp || 0).toFixed(2)} K</p>
                        </div>
                        <div className="p-3 rounded-full bg-orange-500/20">
                          <Icon icon="mdi:thermometer-high" className="w-6 h-6 text-orange-400" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#1F3A5F] rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Rotational Speed</p>
                          <p className="text-2xl font-bold text-white">{parseFloat(statistics.avg_rotational_speed || 0).toFixed(2)} RPM</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-500/20">
                          <Icon icon="mdi:rotate-3d-variant" className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1F3A5F] rounded-lg">
                        <p className="text-xs text-gray-400">Avg Torque</p>
                        <p className="text-xl font-bold text-white">{parseFloat(statistics.avg_torque || 0).toFixed(2)} Nm</p>
                      </div>
                      <div className="p-4 bg-[#1F3A5F] rounded-lg">
                        <p className="text-xs text-gray-400">Avg Tool Wear</p>
                        <p className="text-xl font-bold text-white">{parseFloat(statistics.avg_tool_wear || 0).toFixed(2)} min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="mt-8">
            <div className="p-8 bg-linear-to-b from-[#1F3A5F] to-[#4D648D] rounded-2xl shadow-xl overflow-hidden">
              {/* Search and Filter Section */}
              <div className="my-8">
                <div className="flex flex-col gap-4 p-6 bg-[#172334] rounded-2xl shadow-xl sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <SearchMachines
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      placeholder="Search machine..."
                      id="search-machines"
                      icon={
                        <Icon icon="iconamoon:search" width="24" height="24" />
                      }
                    />

                    <CustomSelect
                      options={typeOptions}
                      intialValue="Filter by Type"
                      width="w-48"
                      onChange={setSelectedType}
                      value={selectedType}
                    />

                    <CustomSelect
                      options={riskOptions}
                      intialValue="Filter by Risk"
                      width="w-48"
                      onChange={setSelectedRisk}
                      value={selectedRisk}
                    />

                    <CustomSelect
                      options={severityOptions}
                      intialValue="Filter by Severity"
                      width="w-48"
                      onChange={setSelectedSeverity}
                      value={selectedSeverity}
                    />
                  </div>

                  {(isSearching || isFiltering) && (
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="inline-block w-16 h-16 border-b-4 border-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg text-gray-200">
                      Loading Data...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="mb-4 text-xl text-red-500">⚠️ Error</div>
                    <p className="mb-2 text-gray-200">{error}</p>
                    <button
                      onClick={() => {
                        loadStatistics();
                        loadMachinesAndPredict();
                      }}
                      className="px-6 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                          <th className="px-6 py-4 text-sm font-semibold text-center text-white">
                            Condition
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((row) => (
                          <tr
                            key={row.id || row.machine_id}
                            className="border-b border-[#2A3A50] bg-white/10 hover:bg-[#1F2B3E]/50 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/details/${row.machine_id}`);
                            }}
                          >
                            <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                              {row.machine_id}
                            </td>
                            <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                              {row.type}
                            </td>
                            <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                              {row.air_temperature} K
                            </td>
                            <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                              {row.process_temperature} K
                            </td>
                            <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                              {row.rotational_speed} RPM
                            </td>
                            <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                              {row.torque} Nm
                            </td>
                            <td className="px-6 py-4 text-sm text-white border-r border-[#2A3A50]">
                              {row.tool_wear} min
                            </td>
                            {/* <td className="px-6 py-4 text-center">
                          <Link to={`/details`} className="text-white transition-colors hover:text-blue-400">
                          <button className="text-white transition-colors hover:text-blue-400">
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
                        </td> */}

                            <td className="px-6 py-4 text-center">
                              <span
                                className="inline-flex items-center ml-2"
                                title="status"
                              >
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="8"
                                    fill={
                                      row.condition?.status === "HEALTHY"
                                        ? "#52c41a"
                                        : "#ff4d4f"
                                    }
                                  />
                                </svg>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination and Results Info */}
                  <div className="flex flex-col items-center gap-4 mt-4 rounded-2xl p-4 bg-[#1F2B3E]/30 w-fit mx-auto">
                    {paginationInfo ? (
                      <>
                        <span className="text-sm text-white">
                          Page {paginationInfo.current_page} of{" "}
                          {paginationInfo.total_pages}
                          <span className="ml-2 text-gray-400">
                            ({paginationInfo.total_records} total records)
                          </span>
                          {isSearching && ` - searching for "${searchTerm}"`}
                          {isFiltering &&
                            selectedType &&
                            ` - type: ${
                              typeOptions.find(
                                (opt) => opt.value === selectedType
                              )?.label
                            }`}
                          {isFiltering &&
                            selectedRisk &&
                            ` - risk: ${
                              riskOptions.find(
                                (opt) => opt.value === selectedRisk
                              )?.label
                            }`}
                          {isFiltering &&
                            selectedSeverity &&
                            ` - severity: ${
                              severityOptions.find(
                                (opt) => opt.value === selectedSeverity
                              )?.label
                            }`}
                        </span>
                        <div className="flex items-center gap-2">
                          {/* Previous Button */}
                          <button
                            onClick={handlePrevPage}
                            disabled={!paginationInfo.has_prev}
                            className="px-4 py-2 text-gray-800 transition-colors bg-white rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ←
                          </button>

                          {/* Page Numbers */}
                          <div className="flex gap-1">
                            {(() => {
                              const totalPages = paginationInfo.total_pages;
                              const currentPage = paginationInfo.current_page;
                              const pages = [];

                              // Logic untuk menampilkan page numbers
                              const getPageNumbers = () => {
                                const delta = 2; // Jumlah halaman yang ditampilkan di kiri dan kanan current page
                                const range = [];
                                const rangeWithDots = [];
                                let l;

                                for (let i = 1; i <= totalPages; i++) {
                                  if (
                                    i === 1 ||
                                    i === totalPages ||
                                    (i >= currentPage - delta &&
                                      i <= currentPage + delta)
                                  ) {
                                    range.push(i);
                                  }
                                }

                                range.forEach((i) => {
                                  if (l) {
                                    if (i - l === 2) {
                                      rangeWithDots.push(l + 1);
                                    } else if (i - l !== 1) {
                                      rangeWithDots.push("...");
                                    }
                                  }
                                  rangeWithDots.push(i);
                                  l = i;
                                });

                                return rangeWithDots;
                              };

                              return getPageNumbers().map((page, index) => {
                                if (page === "...") {
                                  return (
                                    <span
                                      key={`dots-${index}`}
                                      className="px-3 py-2 text-white"
                                    >
                                      ...
                                    </span>
                                  );
                                }

                                return (
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                      currentPage === page
                                        ? "bg-blue-600 text-white font-bold"
                                        : "bg-[#2A3A50] text-white hover:bg-[#3A4A60]"
                                    }`}
                                  >
                                    {page}
                                  </button>
                                );
                              });
                            })()}
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={handleNextPage}
                            disabled={!paginationInfo.has_next}
                            className="px-4 py-2 bg-[#2A3A50] text-white rounded-lg hover:bg-[#3A4A60] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            →
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
};

export default Dashboard;
