import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { resolveAlert } from '../services/alertApi';

const AlertModal = ({ isOpen, onClose, alert, loading, onAlertResolved }) => {
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState(null);

  if (!isOpen) return null;

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-400 bg-red-500/20 border-red-500',
      high: 'text-orange-400 bg-orange-500/20 border-orange-500',
      medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500',
      low: 'text-green-400 bg-green-500/20 border-green-500',
    };
    return colors[severity?.toLowerCase()] || colors.low;
  };

  const getStatusColor = (status) => {
    const colors = {
      CRITICAL: 'bg-red-500/20 text-red-400 border-red-500',
      WARNING: 'bg-orange-500/20 text-orange-400 border-orange-500',
      NORMAL: 'bg-green-500/20 text-green-400 border-green-500',
    };
    return colors[status] || colors.NORMAL;
  };

  const getTypeIcon = (type) => {
    const icons = {
      ML_FAILURE_PREDICTED: 'mdi:alert-circle',
      ML_POWER_ANOMALY: 'mdi:flash-alert',
      ML_TOOL_WEAR_WARNING: 'mdi:tools',
      ML_TEMPERATURE_ANOMALY: 'mdi:thermometer-alert',
    };
    return icons[type] || 'mdi:alert';
  };

  const handleResolveAlert = async () => {
    if (!alert || alert.resolved) return;

    setResolving(true);
    setResolveError(null);

    try {
      const resolvedAlert = await resolveAlert(alert.id);
      
      // Call callback to refresh alerts list
      if (onAlertResolved) {
        onAlertResolved(resolvedAlert);
      }
      
      // Close modal after successful resolve
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error resolving alert:', error);
      setResolveError(error.message || 'Failed to resolve alert');
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#172334] rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#1F2B3E] border-b border-[#2A3A4E] px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Alert Details</h2>
            <div className="flex items-center gap-3">
              {/* Resolve Button */}
              {alert && !alert.resolved && (
                <button
                  onClick={handleResolveAlert}
                  disabled={resolving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resolving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      Resolving...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:check-circle" className="w-5 h-5" />
                      Mark as Resolved
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-white/10 hover:text-white"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Resolved Status Banner */}
          {alert && alert.resolved && (
            <div className="flex items-center gap-2 px-4 py-2 mt-3 border border-green-500 rounded-lg bg-green-500/20">
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-400">Alert Resolved</p>
                <p className="text-xs text-gray-300">
                  Resolved on {new Date(alert.resolved_at).toLocaleString()}
                  {alert.resolved_by && ` by User ID: ${alert.resolved_by}`}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {resolveError && (
            <div className="flex items-center gap-2 px-4 py-2 mt-3 border border-red-500 rounded-lg bg-red-500/20">
              <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-400">{resolveError}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-b-4 border-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-gray-400">Loading alert details...</p>
              </div>
            </div>
          ) : alert ? (
            <div className="space-y-6">
              {/* Alert Header Info */}
              <div className="bg-[#1F3A5F] rounded-xl p-6 border border-[#2A3A4E]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      <Icon icon={getTypeIcon(alert.type)} className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{alert.machine_id}</h3>
                      <p className="text-sm text-gray-400">Alert ID: #{alert.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity?.toUpperCase()}
                    </span>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-600">
                  <p className="text-sm font-medium text-gray-300">Alert Type</p>
                  <p className="mt-1 text-white">{alert.type?.replace(/_/g, ' ')}</p>
                </div>
              </div>

              {/* ML Prediction */}
              {alert.data?.ml_prediction && (
                <div className="bg-[#1F3A5F] rounded-xl p-6 border border-[#2A3A4E]">
                  <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <Icon icon="mdi:brain" className="w-6 h-6 text-purple-400" />
                    ML Prediction
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-400">Prediction</p>
                      <p className={`text-xl font-bold ${alert.data.ml_prediction.prediction === 'FAILURE' ? 'text-red-400' : 'text-green-400'}`}>
                        {alert.data.ml_prediction.prediction}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Confidence</p>
                      <p className="text-xl font-bold text-white">
                        {(alert.data.ml_prediction.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Overall Health</p>
                    <p className="mt-1 text-white">{alert.data.ml_prediction.overall_health}</p>
                  </div>
                </div>
              )}

              {/* Diagnostics */}
              {alert.data?.diagnostics && (
                <div className="bg-[#1F3A5F] rounded-xl p-6 border border-[#2A3A4E]">
                  <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <Icon icon="mdi:stethoscope" className="w-6 h-6 text-blue-400" />
                    Diagnostics
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Primary Cause</p>
                      <p className="mt-1 text-lg font-semibold text-white">{alert.data.diagnostics.primary_cause}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Severity</p>
                      <span className={`inline-block px-3 py-1 mt-1 text-sm font-semibold rounded-full border ${getSeverityColor(alert.data.diagnostics.severity)}`}>
                        {alert.data.diagnostics.severity}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Sensor Alert</p>
                      <p className="mt-1 text-white">{alert.data.diagnostics.sensor_alert}</p>
                    </div>
                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-500/10">
                      <p className="text-sm font-medium text-yellow-400">Recommended Action</p>
                      <p className="mt-1 text-white">{alert.data.diagnostics.recommended_action}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Anomalies */}
              {alert.data?.anomalies && alert.data.anomalies.length > 0 && (
                <div className="bg-[#1F3A5F] rounded-xl p-6 border border-[#2A3A4E]">
                  <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <Icon icon="mdi:alert-circle-outline" className="w-6 h-6 text-orange-400" />
                    Detected Anomalies
                  </h4>
                  <div className="space-y-3">
                    {alert.data.anomalies.map((anomaly, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${getStatusColor(anomaly.status)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold text-white">{anomaly.parameter}</p>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getStatusColor(anomaly.status)}`}>
                                {anomaly.status}
                              </span>
                            </div>
                            <p className="mb-2 text-sm text-gray-300">{anomaly.explanation}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Current: </span>
                                <span className="font-semibold text-white">{anomaly.value}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Normal Range: </span>
                                <span className="font-semibold text-white">{anomaly.normal_range}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Machine Data */}
              {alert.data?.machine_data && (
                <div className="bg-[#1F3A5F] rounded-xl p-6 border border-[#2A3A4E]">
                  <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                    <Icon icon="mdi:engine" className="w-6 h-6 text-cyan-400" />
                    Machine Data
                  </h4>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="mt-1 text-lg font-semibold text-white">{alert.data.machine_data.type}</p>
                    </div>
                    {alert.data.machine_data.sensor_values && (
                      <>
                        <div>
                          <p className="text-sm text-gray-400">Air Temperature</p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {alert.data.machine_data.sensor_values.air_temperature} K
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Process Temperature</p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {alert.data.machine_data.sensor_values.process_temperature} K
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Rotational Speed</p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {alert.data.machine_data.sensor_values.rotational_speed} RPM
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Torque</p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {alert.data.machine_data.sensor_values.torque} Nm
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Tool Wear</p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {alert.data.machine_data.sensor_values.tool_wear} min
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Full Message */}
              <div className="bg-[#1F3A5F] rounded-xl p-6 border border-[#2A3A4E]">
                <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                  <Icon icon="mdi:message-text" className="w-6 h-6 text-gray-400" />
                  Full Message
                </h4>
                <pre className="p-4 overflow-x-auto text-sm text-gray-300 whitespace-pre-wrap rounded-lg bg-black/30">
                  {alert.message}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400">No alert data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
