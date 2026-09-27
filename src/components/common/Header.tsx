import React, { useState } from 'react';
import {
  Activity,
  Bell,
  UserCheck,
  Globe,
  MapPin,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Wifi,
  WifiOff,
  Navigation,
  Truck,
  ShieldAlert,
  Smartphone,
  Users,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useIncident } from '../../context/IncidentContext';
import { DataStatusBadge } from './DataStatusBadge';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onNavigate,
}) => {
  const {
    selectedMission,
    simulationState,
    currentStep,
    currentStepIndex,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    notifications,
    markNotificationRead,
    clearNotifications,
    offlineStatus,
    toggleOfflineMode,
    triggerManualSync,
  } = useIncident();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleSimulation = () => {
    if (simulationState === 'RUNNING') {
      pauseSimulation();
    } else if (simulationState === 'PAUSED') {
      resumeSimulation();
    } else {
      startSimulation();
    }
  };

  const handleNotificationClick = (targetTab: string, notifId: string) => {
    markNotificationRead(notifId);
    setIsNotifDropdownOpen(false);
    onNavigate(targetTab);
  };

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    logistics_officer: { label: 'Disaster / Logistics Officer', desc: 'Command & Dispatch Authority' },
    transport_officer: { label: 'Municipal / Transport Officer', desc: 'Roads & Corridor Control' },
    fleet_operator: { label: 'Fleet Operator', desc: 'Vehicle Telematics & Convoys' },
    field_officer: { label: 'Field Officer', desc: 'On-ground Assessment & Verification' },
    driver: { label: 'Vehicle Driver / Crew', desc: 'Assigned Mission & Navigation' },
    citizen: { label: 'Citizen / Public Safety View', desc: 'Road Disruptions & Community Reports' },
    admin: { label: 'System Administrator', desc: 'Full System & Sensor Config' },
    viewer: { label: 'Read-only Viewer', desc: 'Observer & Public Safety View' },
  };

  return (
    <header className="bg-navy-900 border-b border-surface-border text-slate-100 sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-blue via-brand-cyan to-teal-500 flex items-center justify-center shadow-lg shadow-brand-blue/30 group-hover:scale-105 transition-transform">
              <Navigation className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white font-mono">
                  NERFLOW<span className="text-brand-cyan ml-0.5">AI</span>
                </span>
                <span className="bg-navy-950 text-[10px] text-cyan-400 border border-cyan-800/60 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  NER LOGISTICS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                AI-Powered Smart Logistics & Accessibility Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Mission & Simulation Status Cockpit */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Active Mission Pill */}
          <button
            onClick={() => onNavigate('missions')}
            className="flex items-center space-x-2 bg-navy-950 hover:bg-navy-850 px-3 py-1.5 rounded-md border border-surface-border text-xs text-slate-300 transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="text-slate-400 font-mono">ACTIVE:</span>
            <span className="font-mono font-bold text-white">#{selectedMission.missionNo}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">{selectedMission.origin} → {selectedMission.destination}</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                selectedMission.status === 'AT_RISK'
                  ? 'bg-amber-950 text-amber-300 border border-amber-600/60 animate-pulse'
                  : selectedMission.status === 'DISRUPTED'
                  ? 'bg-red-950 text-red-300 border border-red-600/60'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
              }`}
            >
              {selectedMission.status.replace('_', ' ')}
            </span>
          </button>

          {/* Simulation Quick Controls */}
          <div className="flex items-center space-x-1.5 bg-navy-950 px-2.5 py-1 rounded-md border border-surface-border text-xs">
            <DataStatusBadge type="DEMO_MODE" />
            <span className="text-slate-500">|</span>
            <button
              onClick={handleToggleSimulation}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                simulationState === 'RUNNING'
                  ? 'bg-amber-500 text-navy-950 hover:bg-amber-400 animate-pulse'
                  : 'bg-brand-blue text-white hover:bg-blue-600'
              }`}
              title="Run or pause the end-to-end 11-step scenario"
            >
              {simulationState === 'RUNNING' ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>{simulationState === 'PAUSED' ? 'RESUME' : 'RUN DEMO'}</span>
                </>
              )}
            </button>
            <button
              onClick={resetSimulation}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-navy-850"
              title="Reset simulation to initial state"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono text-cyan-400 font-bold ml-1">
              {currentStep.timeCode}
            </span>
          </div>

          {/* Offline Mode Switcher */}
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition-colors ${
              offlineStatus.isOffline
                ? 'bg-red-950/80 text-red-300 border-red-700 animate-pulse'
                : 'bg-navy-950 text-slate-300 border-surface-border hover:bg-navy-850'
            }`}
            title="Toggle simulated remote disconnect mode"
          >
            {offlineStatus.isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-red-400" />
                <span className="font-bold">OFFLINE ({offlineStatus.pendingCount})</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>ONLINE</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Driver App Quick Access, Role Selector, Notifications */}
        <div className="flex items-center space-x-3">
          {/* Quick link to Driver/Field mobile view */}
          <button
            onClick={() => onNavigate('field-app')}
            className="hidden sm:flex items-center space-x-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/50 text-cyan-300 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Driver / Field App</span>
          </button>

          {/* Quick link to Citizen/Public safety view */}
          <button
            onClick={() => onNavigate('citizen-app')}
            className="hidden md:flex items-center space-x-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Citizen App</span>
          </button>

          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center space-x-2 bg-navy-950 hover:bg-navy-850 border border-surface-border text-xs px-2.5 py-1.5 rounded-md text-slate-200 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-cyan" />
              <div className="text-left hidden md:block">
                <div className="text-[10px] text-slate-400 font-mono uppercase leading-none">ROLE</div>
                <div className="font-semibold text-white leading-tight">
                  {roleLabels[currentRole]?.label.split(' ')[0]}...
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-navy-900 border border-surface-border rounded-lg shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono font-bold text-slate-400 border-b border-surface-border">
                  SWITCH OPERATIONAL ROLE
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex flex-col hover:bg-navy-800 transition-colors ${
                      currentRole === r ? 'bg-navy-800/80 text-brand-cyan font-bold border-l-2 border-brand-cyan' : 'text-slate-300'
                    }`}
                  >
                    <span>{roleLabels[r].label}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{roleLabels[r].desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2 text-slate-300 hover:text-white bg-navy-950 hover:bg-navy-850 border border-surface-border rounded-md transition-colors"
              title="View Alerts & Operational Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] font-mono font-bold rounded-full flex items-center justify-center text-white ring-2 ring-navy-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-navy-900 border border-surface-border rounded-lg shadow-2xl z-50 overflow-hidden text-xs">
                <div className="flex items-center justify-between px-3 py-2 border-b border-surface-border bg-navy-950">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                      LOGISTICS NOTIFICATIONS
                    </span>
                    <span className="text-[10px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded font-mono font-bold">
                      {unreadCount} NEW
                    </span>
                  </div>
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-slate-400 hover:text-white underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-surface-border">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      No notifications pending.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.targetTab, n.id)}
                        className={`p-3 cursor-pointer hover:bg-navy-800 transition-colors ${
                          !n.read ? 'bg-navy-850/70 border-l-2 border-brand-cyan' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white truncate pr-2">{n.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed mb-1.5">{n.message}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                          <span>GO TO {n.targetTab.toUpperCase()}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              n.priority === 'CRITICAL'
                                ? 'bg-red-950 text-red-300'
                                : n.priority === 'HIGH'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-blue-950 text-blue-300'
                            }`}
                          >
                            {n.priority}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
