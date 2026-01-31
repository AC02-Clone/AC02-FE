import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authApi";
import { getAllAlerts, getAlertById, filterAlertsBySeverity } from "../services/alertApi";
import AlertModal from "./AlertModal";
import { Icon } from '@iconify/react';

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [loadingAlertDetail, setLoadingAlertDetail] = useState(false);
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('');
  const { user, logout, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        const userData = Array.isArray(profileData) ? profileData[0] : profileData;
        
        setProfile(userData);
        login(userData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        const userData = Array.isArray(user) ? user[0] : user;
        setProfile(userData);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (showAlertsMenu && alerts.length === 0) {
      fetchAlerts();
    }
  }, [showAlertsMenu]);

  const fetchAlerts = async (severity = '') => {
    setLoadingAlerts(true);
    try {
      let alertsData;
      if (severity) {
        alertsData = await filterAlertsBySeverity(severity);
      } else {
        alertsData = await getAllAlerts();
      }
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const handleSeverityFilter = (severity) => {
    setSelectedSeverityFilter(severity);
    fetchAlerts(severity);
  };

  const handleResetFilter = () => {
    setSelectedSeverityFilter('');
    fetchAlerts();
  };

  const handleAlertResolved = (resolvedAlert) => {
    // Update the alert in the list to show it as resolved
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === resolvedAlert.id ? { ...alert, resolved: true } : alert
      )
    );
    // Update the selected alert if it's the one that was resolved
    setSelectedAlert(resolvedAlert);
    // Optionally refresh the entire alerts list
    fetchAlerts(selectedSeverityFilter);
  };

  const handleAlertClick = async (alertId) => {
    setShowAlertsMenu(false);
    setShowAlertModal(true);
    setLoadingAlertDetail(true);
    
    try {
      const alertDetail = await getAlertById(alertId);
      setSelectedAlert(alertDetail);
    } catch (error) {
      console.error('Failed to fetch alert details:', error);
    } finally {
      setLoadingAlertDetail(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-400 bg-red-500/20 border-red-500',
      high: 'text-orange-400 bg-orange-500/20 border-orange-500',
      medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500',
      low: 'text-green-400 bg-green-500/20 border-green-500',
    };
    return colors[severity?.toLowerCase()] || colors.low;
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <>
    <header className="p-4 flex justify-center items-center border-b border-[#2A3A4E] relative">
            <Link to="/" className="flex items-center">
        <img src={Logo} alt="Logo" className="w-16 h-auto sm:w-20 md:w-24" />
      </Link>
      <div className="absolute flex items-center gap-3 right-4">
        {/* Alerts Bell Icon */}
        <div className="relative">
          <button 
            onClick={() => setShowAlertsMenu(!showAlertsMenu)}
            className="text-white hover:bg-[#2A3A4E] p-2 rounded-lg transition-colors relative"
          >
            <Bell size={20} />
            {alerts.length > 0 && (
              <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
            )}
          </button>

          {showAlertsMenu && (
            <div className="absolute right-0 mt-2 w-96 max-h-128 overflow-y-auto bg-[#2A3A4E] border border-[#3A4A5E] rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b border-[#3A4A5E] sticky top-0 bg-[#2A3A4E]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  {alerts.length > 0 && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                      {alerts.length}
                    </span>
                  )}
                </div>
                
                {/* Severity Filter Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleResetFilter}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      !selectedSeverityFilter 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-[#3A4A5E] text-gray-300 hover:bg-[#4A5A6E]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleSeverityFilter('low')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      selectedSeverityFilter === 'low'
                        ? 'bg-green-600 text-white font-semibold border border-green-500' 
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50'
                    }`}
                  >
                    Low
                  </button>
                  <button
                    onClick={() => handleSeverityFilter('medium')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      selectedSeverityFilter === 'medium'
                        ? 'bg-yellow-600 text-white font-semibold border border-yellow-500' 
                        : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => handleSeverityFilter('high')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      selectedSeverityFilter === 'high'
                        ? 'bg-orange-600 text-white font-semibold border border-orange-500' 
                        : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/50'
                    }`}
                  >
                    High
                  </button>
                  <button
                    onClick={() => handleSeverityFilter('critical')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      selectedSeverityFilter === 'critical'
                        ? 'bg-red-600 text-white font-semibold border border-red-500' 
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
                    }`}
                  >
                    Critical
                  </button>
                </div>
              </div>

              {loadingAlerts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-2 text-xs text-gray-400">Loading alerts...</p>
                  </div>
                </div>
              ) : alerts.length > 0 ? (
                <div className="divide-y divide-[#3A4A5E]">
                  {alerts.map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => handleAlertClick(alert.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-[#3A4A5E] transition-colors relative ${
                        alert.resolved ? 'opacity-60' : ''
                      }`}
                    >
                      {/* Resolved Badge */}
                      {alert.resolved && (
                        <div className="absolute top-2 right-2">
                          <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-400" />
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg mt-1 ${getSeverityColor(alert.severity)}`}>
                          <Icon icon={getTypeIcon(alert.type)} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between pr-6 mb-1">
                            <p className="text-sm font-semibold text-white truncate">
                              {alert.machine_id}
                            </p>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getSeverityColor(alert.severity)}`}>
                              {alert.severity?.toUpperCase()}
                            </span>
                          </div>
                          <p className="mb-1 text-xs text-gray-400">
                            {alert.type?.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-300 line-clamp-2">
                            {alert.message_preview}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-gray-500">
                              {new Date(alert.created_at).toLocaleString()}
                            </p>
                            {alert.resolved && (
                              <span className="px-2 py-0.5 text-xs font-semibold text-green-400 bg-green-500/20 rounded border border-green-500">
                                Resolved
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <Icon icon="mdi:bell-off-outline" className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-400">No alerts at this time</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="text-white hover:bg-[#2A3A4E] p-2 rounded-lg transition-colors"
          >
            <User size={20} />
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#2A3A4E] border border-[#3A4A5E] rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-[#3A4A5E]">
                <p className="text-sm font-semibold text-white">
                  {profile?.username || user?.username || 'Loading...'}
                </p>
                <p className="text-xs text-gray-400">
                  {profile?.email || user?.email || 'Loading...'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-white hover:bg-[#3A4A5E] transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Alert Detail Modal */}
    <AlertModal
      isOpen={showAlertModal}
      onClose={() => {
        setShowAlertModal(false);
        setSelectedAlert(null);
      }}
      alert={selectedAlert}
      loading={loadingAlertDetail}
      onAlertResolved={handleAlertResolved}
    />
    </>
  )
}

export default Header