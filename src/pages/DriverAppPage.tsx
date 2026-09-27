import React, { useState } from 'react';
import {
  Smartphone,
  Navigation,
  AlertTriangle,
  CloudRain,
  Mountain,
  Clock,
  Phone,
  Camera,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Wifi,
  WifiOff,
  Compass,
  FileCheck2,
  HardDrive,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface DriverAppPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const DriverAppPage: React.FC<DriverAppPageProps> = ({ onNavigate }) => {
  const {
    selectedMission,
    selectedRoute,
    routes,
    submitIncidentReport,
    offlineStatus,
    approvedRouteId,
    routeApprovalStatus,
    rerouteAlert,
    approveReroute,
    dispatchedToDriverAt,
  } = useIncident();

  const [activeModal, setActiveModal] = useState<'NONE' | 'REPORT' | 'EMERGENCY'>('NONE');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeAccepted, setRouteAccepted] = useState(false);

  // Active route being followed by driver
  const activeRoute = routes.find((r) => r.id === (approvedRouteId || selectedMission.activeRouteId || 'route-c')) || routes[2];
  const isReroutePending = rerouteAlert && rerouteAlert.detected;

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    submitIncidentReport({
      title: 'Driver Real-time Obstacle Report',
      description: reportDesc || 'Observed rockfall debris on pavement.',
      severity: 'HIGH',
      location: 'NH Corridor MP 148',
    });
    setReportSent(true);
    setTimeout(() => {
      setReportSent(false);
      setActiveModal('NONE');
      setReportDesc('');
    }, 2000);
  };

  const handleAcceptUpdatedRoute = () => {
    if (rerouteAlert) {
      approveReroute();
    }
    setRouteAccepted(true);
    setTimeout(() => setRouteAccepted(false), 3000);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 bg-navy-950 min-h-screen text-slate-100 flex flex-col justify-between font-sans">
      {/* Mobile Top Header (Section 14) */}
      <div className="bg-navy-900 border border-surface-border rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white font-mono">
              NERFLOW FIELD
            </h1>
            <span className="text-[10px] text-cyan-400 font-mono font-bold block leading-none">
              DRIVER / CONVOY CONSOLE
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-[10px]">
          <DataStatusBadge type="SIMULATION" />
          {offlineStatus.isOffline ? (
            <span className="bg-red-950 text-red-300 border border-red-700 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
              <WifiOff className="w-3 h-3 text-red-400" />
              <span>OFFLINE</span>
            </span>
          ) : (
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>ONLINE</span>
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Reroute Alert for Driver (Section 14 & 15) */}
      {isReroutePending ? (
        <div className="bg-gradient-to-r from-amber-950 via-red-950 to-navy-900 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl space-y-2.5 animate-pulse">
          <div className="flex items-center justify-between">
            <span className="bg-amber-500 text-navy-950 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              ROUTE UPDATED BY DISASTER OPS
            </span>
            <span className="text-amber-300 text-xs font-mono font-bold">ATTENTION</span>
          </div>
          <h3 className="font-bold text-white text-sm">
            Corridor Diversion: Divert via Route B (Southern Corridor)
          </h3>
          <p className="text-xs text-amber-200 leading-snug">
            Previous route encountered severe landslide risk (76%). Command desk authorized Route B bypass via Silchar.
          </p>
          <button
            onClick={handleAcceptUpdatedRoute}
            className="w-full bg-amber-500 hover:bg-amber-400 text-navy-950 font-mono font-extrabold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 active:scale-98 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>[ ACCEPT UPDATED ROUTE ]</span>
          </button>
        </div>
      ) : routeAccepted ? (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 p-3 rounded-xl text-center text-xs font-mono">
          ✓ Route confirmed! New waypoints loaded into onboard guidance.
        </div>
      ) : null}

      {/* Main Assigned Mission Card (Section 14) */}
      <div className="bg-navy-850 border border-surface-border rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Mission Identity */}
        <div className="flex items-start justify-between border-b border-surface-border pb-3">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              ASSIGNED MISSION
            </span>
            <div className="text-2xl font-mono font-extrabold text-white mt-0.5">
              #{selectedMission.missionNo || 'NER-2042'}
            </div>
            <span className="text-xs text-cyan-300 font-semibold block mt-0.5">
              {selectedMission.cargo || 'Emergency Medicines'}
            </span>
          </div>

          <div className="text-right">
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-2.5 py-1 rounded font-mono text-xs font-bold uppercase block">
              {routeApprovalStatus === 'APPROVED' ? 'DISPATCHED' : 'ON ROUTE'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
              Ref: {dispatchedToDriverAt || '18:30 IST'}
            </span>
          </div>
        </div>

        {/* Route Origin -> Destination */}
        <div className="bg-navy-950 p-3 rounded-xl border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">ORIGIN</span>
            <span className="text-sm font-mono font-bold text-white">{selectedMission.origin || 'Guwahati'}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <div className="text-right">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">DESTINATION</span>
            <span className="text-sm font-mono font-bold text-cyan-400">{selectedMission.destination || 'Imphal'}</span>
          </div>
        </div>

        {/* Big ETA Display (Section 14: ETA 8h 42m) */}
        <div className="bg-navy-950 p-4 rounded-xl border border-surface-border text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
            ESTIMATED ARRIVAL TIME (AI-PREDICTED)
          </span>
          <div className="text-4xl font-mono font-extrabold text-amber-300 tracking-tight">
            {activeRoute.eta || '8h 42m'}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Approved Route: <strong className="text-white">{activeRoute.name.split('—')[0]}</strong> • Disruption Exposure: <strong className="text-emerald-400">{activeRoute.riskScorePct}%</strong>
          </span>
        </div>

        {/* Navigation Action Toggle (Section 14) */}
        <button
          onClick={() => setIsNavigating(!isNavigating)}
          className={`w-full py-3.5 rounded-xl font-mono font-bold text-sm flex items-center justify-center space-x-2 shadow-xl transition-all active:scale-98 ${
            isNavigating
              ? 'bg-amber-500 hover:bg-amber-400 text-navy-950'
              : 'bg-brand-blue hover:bg-blue-600 text-white shadow-brand-blue/40'
          }`}
        >
          {isNavigating ? (
            <>
              <Pause className="w-5 h-5" />
              <span>NAVIGATION ACTIVE (PAUSE)</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>[ START NAVIGATION ]</span>
            </>
          )}
        </button>

        {/* Live Hazard Ahead Alert during navigation (Section 14 exact specs) */}
        {isNavigating && (
          <div className="bg-red-950/70 border border-red-600 rounded-xl p-3.5 space-y-2 animate-pulse">
            <div className="flex items-center space-x-2 text-red-300 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>HAZARD AHEAD</span>
            </div>
            <div className="text-xs text-white">
              <strong>Landslide risk active 2.4 km ahead</strong>
            </div>
            <div className="text-[11px] text-slate-300 font-mono bg-navy-950/80 p-2 rounded-lg border border-red-900">
              Suggested action: <strong className="text-cyan-300">Continue 1.2 km, then follow alternate corridor.</strong>
            </div>
          </div>
        )}
      </div>

      {/* Very Large Mobile Touch Controls (Section 14) */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {/* ACCEPT ROUTE */}
        <button
          onClick={handleAcceptUpdatedRoute}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white p-4 rounded-2xl font-mono font-extrabold text-xs flex flex-col items-center justify-center space-y-1.5 shadow-lg shadow-emerald-600/30 transition-all"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>[ ACCEPT ROUTE ]</span>
        </button>

        {/* REPORT INCIDENT */}
        <button
          onClick={() => setActiveModal('REPORT')}
          className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-navy-950 p-4 rounded-2xl font-mono font-extrabold text-xs flex flex-col items-center justify-center space-y-1.5 shadow-lg shadow-amber-600/30 transition-all"
        >
          <Camera className="w-6 h-6" />
          <span>[ REPORT INCIDENT ]</span>
        </button>

        {/* EMERGENCY SOS */}
        <button
          onClick={() => setActiveModal('EMERGENCY')}
          className="col-span-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white p-4 rounded-2xl font-mono font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-600/40 transition-all"
        >
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <span>[ EMERGENCY SOS (112) ]</span>
        </button>
      </div>

      {/* Driver Report Modal */}
      {activeModal === 'REPORT' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-navy-900 border border-surface-border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
              <span className="font-mono text-xs font-bold text-white uppercase">
                DRIVER ROAD HAZARD REPORT
              </span>
              <button
                onClick={() => setActiveModal('NONE')}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ CLOSE
              </button>
            </div>

            {reportSent ? (
              <div className="bg-emerald-950 border border-emerald-600 text-emerald-200 p-3 rounded-xl text-center text-xs font-mono">
                Report transmitted to Disaster Command Desk!
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">
                    WHAT OBSTACLE DO YOU SEE?
                  </label>
                  <textarea
                    rows={3}
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder="E.g., Rockfall debris blocking right lane, heavy water runoff..."
                    className="w-full bg-navy-950 border border-surface-border rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold font-mono text-xs py-3 rounded-xl shadow-md"
                >
                  TRANSMIT TO COMMAND DESK
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Emergency SOS Modal */}
      {activeModal === 'EMERGENCY' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-red-950 border border-red-600 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-center">
            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto animate-pulse" />
            <h3 className="font-bold text-white text-base font-mono">EMERGENCY RESCUE LINK</h3>
            <p className="text-xs text-red-200">
              Direct connection to North East Disaster Police, BRO Mountain Rescue & Medical Evacuation.
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="tel:112"
                className="w-full block bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs py-3.5 rounded-xl shadow-lg"
              >
                CALL RESCUE & POLICE (112)
              </a>
              <button
                onClick={() => setActiveModal('NONE')}
                className="w-full bg-navy-900 text-slate-300 text-xs py-2.5 rounded-xl border border-surface-border font-mono"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return to Command Center Link */}
      <div className="text-center pt-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-[11px] text-slate-400 hover:text-white underline font-mono"
        >
          ← Return to Regional Command Center
        </button>
      </div>
    </div>
  );
};
