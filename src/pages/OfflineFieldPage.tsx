import React, { useState } from 'react';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  Send,
  Camera,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface OfflineFieldPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const OfflineFieldPage: React.FC<OfflineFieldPageProps> = ({ onNavigate }) => {
  const {
    offlineStatus,
    toggleOfflineMode,
    triggerManualSync,
    selectedMission,
    selectedRoute,
    submitIncidentReport,
  } = useIncident();

  // Local state for offline incident submission
  const [offlineTitle, setOfflineTitle] = useState('Rockfall blocking road shoulder');
  const [offlineLocation, setOfflineLocation] = useState('NH-29 Pass (Offline GPS: 25.52° N, 94.08° E)');
  const [offlineDescription, setOfflineDescription] = useState('Large rocks collapsed onto lane. Vehicle passing slow.');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleSubmitOfflineReport = (e: React.FormEvent) => {
    e.preventDefault();
    submitIncidentReport({
      title: offlineTitle,
      location: offlineLocation,
      description: offlineDescription,
      severity: 'HIGH',
      incidentType: 'ROAD_OBSTRUCTION',
    });
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 3000);
  };

  const emergencyContacts = [
    { role: 'NER Disaster Logistics Control (Guwahati)', number: '+91 361-2237001' },
    { role: 'Border Roads Task Force (BRO Kohima)', number: '+91 3862-224190' },
    { role: 'Manipur Emergency Operation Desk', number: '1070 / 112' },
    { role: 'Regional Highway Police Patrol', number: '1033' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Offline Mode Banner (Screen 13) */}
      <div
        className={`rounded-xl p-5 border shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          offlineStatus.isOffline
            ? 'bg-amber-950/40 border-amber-600/80 ring-2 ring-amber-600/30'
            : 'bg-navy-900 border-surface-border'
        }`}
      >
        <div className="flex items-start space-x-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              offlineStatus.isOffline
                ? 'bg-amber-900/60 text-amber-300 border border-amber-600'
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-600'
            }`}
          >
            {offlineStatus.isOffline ? (
              <WifiOff className="w-6 h-6 animate-pulse" />
            ) : (
              <Wifi className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
                {offlineStatus.isOffline ? 'OFFLINE MODE ACTIVE' : 'REMOTE CONNECTIVITY STANDBY'}
              </h1>
              <span
                className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  offlineStatus.isOffline
                    ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}
              >
                {offlineStatus.isOffline ? 'CONNECTION UNAVAILABLE' : 'ONLINE SYNCHRONIZED'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {offlineStatus.isOffline
                ? 'Remote mountain sector detected. Local storage active; reports queued for automatic batch upload upon reconnection.'
                : 'Full telematics link active. You can simulate remote loss of cellular connectivity using the toggle below.'}
            </p>
          </div>
        </div>

        {/* Mode & Sync Actions */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={toggleOfflineMode}
            className={`text-xs font-mono font-bold px-4 py-2.5 rounded-lg border transition-all ${
              offlineStatus.isOffline
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-lg'
                : 'bg-amber-600 hover:bg-amber-500 text-navy-950 border-amber-500 shadow-lg'
            }`}
          >
            {offlineStatus.isOffline ? 'RESTORE ONLINE' : 'SIMULATE DISCONNECT'}
          </button>

          {offlineStatus.pendingCount > 0 && (
            <button
              onClick={triggerManualSync}
              disabled={offlineStatus.syncState === 'SYNCING'}
              className="bg-brand-blue hover:bg-blue-600 text-white text-xs font-mono font-bold px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 shadow-lg"
            >
              <RefreshCw
                className={`w-4 h-4 ${offlineStatus.syncState === 'SYNCING' ? 'animate-spin' : ''}`}
              />
              <span>
                {offlineStatus.syncState === 'SYNCING'
                  ? 'SYNCING...'
                  : `SYNC QUEUE (${offlineStatus.pendingCount})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Sync Status Banner */}
      {offlineStatus.syncState === 'SYNCED' && (
        <div className="bg-emerald-950 border border-emerald-600 text-emerald-200 p-3.5 rounded-xl text-xs font-mono flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>UPLOADED: All queued field reports successfully synchronized with Central Command Server!</span>
        </div>
      )}

      {/* Offline Essential Kit: 3 Columns (Screen 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assigned Mission & Cached Route (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-navy-800 border border-surface-border rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                ASSIGNED MISSION
              </span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                CACHED OFFLINE
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-sm">
                MISSION #{selectedMission.missionNo}
              </h3>
              <p className="text-xs text-cyan-400 font-mono">
                Cargo: {selectedMission.cargo}
              </p>
              <div className="text-xs text-slate-300 font-mono bg-navy-950 p-2 rounded border border-surface-border">
                <span>{selectedMission.origin}</span>
                <span className="text-slate-500 mx-2">→</span>
                <span className="text-white font-bold">{selectedMission.destination}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-navy-950 p-2 rounded border border-surface-border">
              <div>
                <span className="text-slate-500 text-[10px] block">LAST KNOWN RISK</span>
                <span className="text-amber-400 font-bold">{selectedMission.routeRisk}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">LAST KNOWN ETA</span>
                <span className="text-white font-bold">{selectedMission.eta}</span>
              </div>
            </div>
          </div>

          {/* Last Known Route */}
          <div className="bg-navy-800 border border-surface-border rounded-xl p-4 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                LAST KNOWN SAFE ROUTE
              </span>
              <span className="text-[10px] font-mono text-emerald-400">STORED IN ROM</span>
            </div>
            <p className="text-xs text-white font-semibold">{selectedRoute.name}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              "{selectedRoute.recommendationReason}"
            </p>
            <div className="text-[11px] font-mono text-slate-300 bg-navy-950 p-2 rounded">
              Distance: {selectedRoute.distanceKm} km • Corridor: {selectedRoute.corridor}
            </div>
          </div>
        </div>

        {/* Center Column: Offline Incident Report Submission (4 cols) */}
        <div className="lg:col-span-4 bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  REPORT INCIDENT (OFFLINE)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-700">
                PENDING SYNC
              </span>
            </div>

            {reportSuccess && (
              <div className="mb-3 bg-cyan-950 border border-cyan-600 text-cyan-200 p-2.5 rounded text-xs font-mono flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Saved locally to IndexedDB! Queued for auto-upload.</span>
              </div>
            )}

            <form onSubmit={handleSubmitOfflineReport} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  OBSERVED HAZARD
                </label>
                <input
                  type="text"
                  value={offlineTitle}
                  onChange={(e) => setOfflineTitle(e.target.value)}
                  className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs text-white px-3 py-2 outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  LOCATION (CACHED SATELLITE FIX)
                </label>
                <input
                  type="text"
                  value={offlineLocation}
                  onChange={(e) => setOfflineLocation(e.target.value)}
                  className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs text-slate-300 px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  DETAILS
                </label>
                <textarea
                  rows={3}
                  value={offlineDescription}
                  onChange={(e) => setOfflineDescription(e.target.value)}
                  className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs text-white p-2.5 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-navy-950 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-amber-600/30"
              >
                <HardDrive className="w-4 h-4" />
                <span>SAVE INCIDENT TO LOCAL STORAGE</span>
              </button>
            </form>
          </div>

          <div className="pt-3 border-t border-surface-border mt-3 text-[10px] text-slate-500 font-mono">
            Status: <span className="text-amber-400 font-bold">PENDING SYNC</span> (Syncs automatically when network reappears)
          </div>
        </div>

        {/* Right Column: Emergency Contacts & Cached Map Tile status (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-navy-800 border border-surface-border rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 border-b border-surface-border pb-2.5">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                EMERGENCY CONTACTS (OFFLINE DIRECT)
              </span>
            </div>

            <div className="space-y-2">
              {emergencyContacts.map((c, i) => (
                <div
                  key={i}
                  className="bg-navy-950 p-2.5 rounded-lg border border-surface-border flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="text-white font-medium block text-[11px]">{c.role}</span>
                    <span className="text-emerald-400 font-mono font-bold">{c.number}</span>
                  </div>
                  <a
                    href={`tel:${c.number}`}
                    className="p-1.5 bg-emerald-950 text-emerald-400 rounded hover:bg-emerald-900 border border-emerald-700/60"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Cached Vector Tiles Card */}
          <div className="bg-navy-800 border border-surface-border rounded-xl p-4 shadow-xl space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                CACHED VECTOR GIS TILES
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-300">
              Offline Map Pack: <strong>NER Corridor Mesh (v2.4)</strong>
            </p>
            <div className="bg-navy-950 p-2 rounded text-[10px] font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Cache Size:</span>
                <span className="text-white">48.2 MB</span>
              </div>
              <div className="flex justify-between">
                <span>Coverage:</span>
                <span className="text-cyan-400">Guwahati-Dimapur-Imphal-Silchar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
