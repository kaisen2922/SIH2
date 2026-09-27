import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  Radio,
  Send,
  Navigation,
  ChevronRight,
  Filter,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { AlertItem, RiskLevel } from '../types';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface AlertsPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const { alerts, broadcastAlert, canIssueAlert, currentRole } = useIncident();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // New alert form
  const [newTitle, setNewTitle] = useState('Landslide risk increasing on Corridor NH-29');
  const [newSeverity, setNewSeverity] = useState<RiskLevel>('CRITICAL');
  const [newCorridor, setNewCorridor] = useState('NH-29 (Dimapur–Kohima–Imphal)');
  const [newAction, setNewAction] = useState('Reroute all heavy cargo to Route C (Lumding bypass).');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastAlert({
      title: newTitle,
      severity: newSeverity,
      corridor: newCorridor,
      recommendedAction: newAction,
      affectedMissionsCount: 4,
      affectedMissions: ['NER-2042', 'NER-2104', 'NER-1988'],
      channels: ['push', 'sms', 'radio'],
    });
    setIsBroadcastModalOpen(false);
  };

  const getSeverityStyle = (sev: RiskLevel) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          badge: 'bg-red-950 text-red-300 border-red-600',
          border: 'border-red-700/80 ring-1 ring-red-600/40',
          glow: 'bg-red-500/10',
        };
      case 'HIGH':
        return {
          badge: 'bg-orange-950 text-orange-300 border-orange-600',
          border: 'border-orange-700/70',
          glow: 'bg-orange-500/10',
        };
      case 'MODERATE':
        return {
          badge: 'bg-amber-950 text-amber-300 border-amber-600',
          border: 'border-amber-700/60',
          glow: 'bg-amber-500/10',
        };
      case 'LOW':
      default:
        return {
          badge: 'bg-blue-950 text-blue-300 border-blue-600',
          border: 'border-blue-700/60',
          glow: 'bg-blue-500/10',
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <Bell className="w-6 h-6 text-cyan-400" />
              <span>REGIONAL ADVISORIES & ALERTS</span>
            </h1>
            <DataStatusBadge type="OFFICIAL_ALERT" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Official government disaster broadcasts and multi-channel freight hazard notifications
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {canIssueAlert ? (
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-red-600/30"
            >
              <Radio className="w-4 h-4" />
              <span>ISSUE OFFICIAL ALERT</span>
            </button>
          ) : (
            <span className="text-[11px] font-mono text-slate-500 bg-navy-900 px-3 py-1.5 rounded border border-surface-border">
              Alert authorization requires Logistics Officer role
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs (CRITICAL, HIGH, MODERATE, INFO) */}
      <div className="flex items-center space-x-2 overflow-x-auto text-xs font-mono">
        {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterSeverity(s)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterSeverity === s
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-navy-900 text-slate-400 hover:bg-navy-800'
            }`}
          >
            {s === 'LOW' ? 'INFO' : s}
          </button>
        ))}
      </div>

      {/* Alerts Grid (Screen 15 with VIEW IMPACT button) */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);

          return (
            <div
              key={alert.id}
              className={`bg-navy-850 rounded-xl p-5 border shadow-xl relative overflow-hidden transition-all ${style.border}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase ${style.badge}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {alert.corridor}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-slate-400">
                      Issued {alert.timestamp}
                    </span>
                    <span className="bg-navy-950 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-800 font-bold">
                      OFFICIAL DIRECTIVE
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-tight">
                    {alert.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-navy-950 p-2.5 rounded-lg border border-surface-border">
                    <div>
                      <span className="text-slate-500 text-[10px] block">AFFECTED MISSIONS:</span>
                      <span className="text-amber-400 font-bold">
                        {alert.affectedMissionsCount} Missions ({alert.affectedMissions.join(', ')})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">RECOMMENDED ACTION:</span>
                      <span className="text-white font-semibold">{alert.recommendedAction}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-500 pt-1">
                    <span>Issued By: <strong className="text-slate-300">{alert.issuedBy}</strong></span>
                    <span>•</span>
                    <span>Broadcast Channels: Push, SMS, VHF Radio</span>
                  </div>
                </div>

                {/* VIEW IMPACT CTA (Screen 15) */}
                <div className="shrink-0 flex sm:flex-col justify-end gap-2">
                  <button
                    onClick={() => onNavigate('routes', { corridor: alert.corridor })}
                    className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-brand-blue/30"
                  >
                    <span>VIEW IMPACT</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-surface-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-base font-mono">
                  ISSUE OFFICIAL FREIGHT ADVISORY
                </h3>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">ADVISORY TITLE</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-navy-950 border border-surface-border rounded-lg text-white p-2.5 outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">SEVERITY</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-navy-950 border border-surface-border rounded-lg text-white p-2 outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="LOW">INFO</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">TARGET CORRIDOR</label>
                  <input
                    type="text"
                    value={newCorridor}
                    onChange={(e) => setNewCorridor(e.target.value)}
                    className="w-full bg-navy-950 border border-surface-border rounded-lg text-white p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">RECOMMENDED ACTION</label>
                <textarea
                  rows={2}
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full bg-navy-950 border border-surface-border rounded-lg text-white p-2.5 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 bg-navy-950 text-slate-300 rounded-lg border border-surface-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg"
                >
                  BROADCAST ALERT NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
