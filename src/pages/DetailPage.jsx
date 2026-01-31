import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Bell, User } from "lucide-react";
import Header from "../components/Header";
import { getMachineById } from "../services/machineApi";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machineData, setMachineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        setLoading(true);
        const data = await getMachineById(id);
        setMachineData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch machine data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMachineData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1c2e]">
        <Header />
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-xl text-white">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !machineData) {
    return (
      <div className="min-h-screen bg-[#0f1c2e]">
        <Header />
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <p className="mb-4 text-xl text-gray-400">{error || "No data found"}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { condition, calculated_features } = machineData;
  const isHealthy = condition?.status === 'HEALTHY';
  const severity = condition?.severity || 'UNKNOWN';

  const temperature_diff = calculated_features?.Temperature_Diff || 0;
  const power_w = calculated_features?.Power_W || 0;

  const severityColors = {
    LOW: 'text-green-600 bg-green-100',
    MEDIUM: 'text-yellow-600 bg-yellow-100',
    HIGH: 'text-orange-600 bg-orange-100',
    CRITICAL: 'text-red-600 bg-red-100',
    UNKNOWN: 'text-gray-600 bg-gray-100'
  };

  return (
    <div className="bg-[#0f1c2e] min-h-screen">
      <Header />

      {/* Title Bar */}
      <div className="bg-[#1F2B3E]/50 w-full py-3 px-4 sm:px-6 md:px-8 border-b border-[#2A3A4E]">
        <h2 className="text-sm font-semibold text-white sm:text-base">DETAILS - {machineData.machine_id}</h2>
      </div>

      {/* Main Content */}
      <div className="px-3 py-4 mx-auto max-w-7xl sm:px-4 md:px-6 sm:py-6 md:py-8">
        {/* Top Section - Machine Info and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Left Card - Machine Info */}
          <div className="bg-[#172334] rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col items-center">
              {/* Machine Icon/Image */}
              <div className="bg-[#29384e] rounded-xl p-8 mb-6">
                <Icon icon="ix:machine-a-filled" width="150" height="150" className="text-[#ACC2EF]" />
              </div>

              {/* Machine ID and Name */}
              <div className="w-full space-y-3">
                <div className="bg-linear-to-b from-[#1F3A5F] to-[#4D648D] rounded-lg p-3 text-center">
                  <p className="text-sm text-white"><span className="font-semibold">Product Name:</span> {machineData.machine_id}</p>
                </div>
                <div className="bg-linear-to-b from-[#1F3A5F] to-[#4D648D] rounded-lg p-3 text-center">
                  <p className="text-sm text-white"><span className="font-semibold">Status:</span> {machineData.condition?.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Details Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {/* Air Temperature */}
            <div className="bg-[#172334] rounded-xl p-4 shadow-lg">
              <p className="mb-2 text-xs text-gray-400 sm:text-sm">Air Temperature</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white sm:text-2xl">{machineData.air_temperature}/ <span className="text-red-400">305</span></p>
                <p className="text-lg font-semibold text-gray-300 sm:text-xl">K</p>
              </div>
            </div>

            {/* Tool Wear */}
            <div className="bg-[#172334] rounded-xl p-4 shadow-lg">
              <p className="mb-2 text-xs text-gray-400 sm:text-sm">Tool Wear</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white sm:text-2xl">{machineData.tool_wear}/ <span className="text-red-400">300</span></p>
                <p className="text-lg font-semibold text-gray-300 sm:text-xl">Minutes</p>
              </div>
            </div>

            {/* Process Temperature */}
            <div className="bg-[#172334] rounded-xl p-4 shadow-lg">
              <p className="mb-2 text-xs text-gray-400 sm:text-sm">Process Temperature</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white sm:text-2xl">{machineData.process_temperature}/ <span className="text-red-400">315</span></p>
                <p className="text-lg font-semibold text-gray-300 sm:text-xl">K</p>
              </div>
            </div>

            {/* Temperature Diff */}
            <div className="bg-[#172334] rounded-xl p-4 shadow-lg">
              <p className="mb-2 text-xs text-gray-400 sm:text-sm">Temperature Diff</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white sm:text-2xl">{temperature_diff.toFixed(2)}</p>
              </div>
            </div>

            {/* Rotational Speed */}
            <div className="bg-[#172334] rounded-xl p-4 shadow-lg">
              <p className="mb-2 text-xs text-gray-400 sm:text-sm">Rotational Speed</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white sm:text-2xl">{machineData.rotational_speed}/ <span className="text-red-400">3000</span></p>
                <p className="text-lg font-semibold text-gray-300 sm:text-xl">RPM</p>
              </div>
            </div>

            {/* Power W */}
            <div className="bg-[#172334] rounded-xl p-4 shadow-lg">
              <p className="mb-2 text-xs text-gray-400 sm:text-sm">Power W</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white sm:text-2xl">{power_w.toFixed(2)}</p>
              </div>
            </div>

            {/* Torque */}
            <div className="bg-[#172334] rounded-xl p-4 shadow-lg">
              <p className="mb-2 text-xs text-gray-400 sm:text-sm">Torque</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white sm:text-2xl">{machineData.torque}/ <span className="text-red-400">100</span></p>
                <p className="text-lg font-semibold text-gray-300 sm:text-xl">Nm</p>
              </div>
            </div>

            {/* Product Type */}
            <div className="bg-[#172334] rounded-xl p-4 shadow-lg">
              <p className="mb-2 text-xs text-gray-400 sm:text-sm">Product Type</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white sm:text-2xl">{machineData.type}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Anomalies Section */}
        {condition?.anomalies && condition.anomalies.length > 0 && (
          <div className="my-6 bg-[#172334] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Detected Anomalies</h3>
              <span className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
                {condition.anomalies.length} {condition.anomalies.length === 1 ? 'Issue' : 'Issues'}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {condition.anomalies.map((anomaly, index) => {
                const statusConfig = {
                  CRITICAL: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', icon: '🔴' },
                  HIGH: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', icon: '🟠' },
                  MEDIUM: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', icon: '🟡' },
                  LOW: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', icon: '🟢' }
                };
                const config = statusConfig[anomaly.status] || statusConfig.LOW;
                
                return (
                  <div 
                    key={index} 
                    className={`${config.bg} ${config.border} border-2 rounded-xl p-5 hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-bold text-white">{anomaly.parameter}</h4>
                      <span className="text-2xl">{config.icon}</span>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="p-3 rounded-lg bg-black/30">
                        <p className="mb-1 text-xs text-gray-400">Current Value</p>
                        <p className="text-base font-bold text-white">{anomaly.value}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-black/30">
                        <p className="mb-1 text-xs text-gray-400">Normal Range</p>
                        <p className="text-base font-semibold text-gray-300">{anomaly.normal_range}</p>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                        <span className="text-xs font-medium text-gray-400">Status:</span>
                        <span className={`${config.text} text-sm font-bold px-3 py-1 rounded-full ${config.bg}`}>
                          {anomaly.status}
                        </span>
                      </div>
                      
                      <div className="p-3 mt-3 border-t border-gray-600">
                        <p className="mb-1 text-xs font-semibold text-gray-400">Analysis:</p>
                        <p className="text-xs leading-relaxed text-gray-300">{anomaly.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Section - Anomaly Detection */}
        <div className="bg-linear-to-b from-[#1F3A5F] to-[#4D648D] rounded-2xl p-6 shadow-xl">
          <h3 className="mb-6 text-lg font-semibold text-white">Prediction</h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
            {/* Risk Level Card */}
            <div className="bg-[#5a748a] rounded-xl p-6 flex flex-col items-center justify-center">
              <div className={`${severityColors[severity]} rounded-lg px-8 py-12 w-full flex items-center justify-center`}>
                <p className={`text-4xl sm:text-5xl font-bold`}>{severity}</p>
              </div>
            </div>

            {/* Prediction Analysis Card */}
            <div className="bg-[#6B8094] rounded-xl p-6">
              <h4 className="mb-4 font-semibold text-center text-white">Prediction Analysis</h4>
              <div className="bg-[#5a748a] rounded-lg p-4 min-h-[150px]">
                <p className="text-sm text-white">
                  {condition?.overall_health || 'No analysis available'}
                </p>
              </div>
            </div>

            {/* Diagnostics Card */}
            {condition?.diagnostics && (
              <div className="bg-[#6B8094] rounded-xl p-6">
                <h4 className="mb-4 font-semibold text-center text-white">Diagnostics</h4>
                <div className="bg-[#5a748a] rounded-lg p-4 min-h-[150px] space-y-2">
                  <p className="text-sm text-white">
                    <span className="font-semibold">Primary Cause:</span> {condition.diagnostics.primary_cause}
                  </p>
                  {condition.diagnostics.sensor_alert && (
                    <p className="text-sm text-white">
                      <span className="font-semibold">Alert:</span> {condition.diagnostics.sensor_alert}
                    </p>
                  )}
                  {condition.diagnostics.recommended_action && (
                    <p className="text-sm text-white">
                      <span className="font-semibold">Action:</span> {condition.diagnostics.recommended_action}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed p-4 transition-colors bg-white rounded-full shadow-2xl bottom-6 right-6 hover:bg-gray-100">
        <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>
    </div>
  );
};

export default DetailPage;
