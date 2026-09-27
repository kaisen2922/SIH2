import React from 'react';
import {
  ShieldAlert,
  Clock,
  Truck,
  MapPin,
  Navigation,
  ChevronRight,
  AlertTriangle,
  Activity,
  Layers,
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { DataStatusBadge } from './DataStatusBadge';

interface GlobalIncidentBarProps {
  onNavigate?: (tab: string) => void;
}

export const GlobalIncidentBar: React.FC<GlobalIncidentBarProps> = ({ onNavigate }) => {
  const {
    selectedMission,
    selectedVehicle,
    selectedCorridor,
    selectedRoute,
    simulationState,
    currentStep,
  } = useIncident();

  return (
    <div className="bg-navy-900 border-b border-surface-border text-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
      {/* Left: Mission Identity & Severity Badge */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-mono font-extrabold text-white text-xs tracking-tight">
            MISSION #{selectedMission.missionNo}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-slate-300 font-mono text-[11px] bg-navy-950 px-2 py-0.5 rounded border border-surface-border">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span className="font-bold text-white">{selectedMission.origin}</span>
          <span className="text-slate-500">→</span>
          <span className="font-bold text-cyan-300">{selectedMission.destination}</span>
        </div>

        <span
          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            selectedMission.status === 'AT_RISK'
              ? 'bg-amber-950/90 text-amber-300 border border-amber-600/70 animate-pulse'
              : selectedMission.status === 'DISRUPTED'
              ? 'bg-red-950/90 text-red-300 border border-red-600/70'
              : 'bg-emerald-950/90 text-emerald-300 border border-emerald-600/70'
          }`}
        >
          {selectedMission.status.replace('_', ' ')}
        </span>

        <span className="hidden md:inline-flex bg-navy-950 text-slate-300 border border-surface-border px-2 py-0.5 rounded text-[11px] font-mono">
          <span className="text-slate-400 mr-1">CARGO:</span>
          <span className="text-white font-medium">{selectedMission.cargo}</span>
        </span>
      </div>

      {/* Middle: Disruption Telemetry & Predictive ETA */}
      <div className="hidden lg:flex items-center space-x-5 text-slate-300 font-mono text-[11px]">
        <div className="flex items-center space-x-1.5 bg-navy-950 px-2 py-0.5 rounded border border-surface-border">
          <Truck className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-400">VEHICLE:</span>
          <span className="font-bold text-white">{selectedVehicle.name}</span>
          <span className="text-slate-500">({selectedVehicle.currentSpeedKmh} km/h)</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-navy-950 px-2 py-0.5 rounded border border-surface-border">
          <Clock className="w-3 h-3 text-amber-400" />
          <span className="text-slate-400">AI ETA:</span>
          <span className="font-bold text-amber-300">{selectedMission.eta}</span>
          <span className="text-red-400 text-[10px] font-bold">
            (+{selectedMission.predictedDelayMin}m delay)
          </span>
        </div>

        <div className="flex items-center space-x-1.5 bg-navy-950 px-2 py-0.5 rounded border border-surface-border">
          <AlertTriangle className="w-3 h-3 text-orange-400" />
          <span className="text-slate-400">CORRIDOR:</span>
          <span className="font-bold text-white">{selectedCorridor.code}</span>
          <span className="text-orange-400">({selectedCorridor.landslideProbabilityPct}% Landslide Risk)</span>
        </div>
      </div>

      {/* Right: Quick Action CTAs */}
      <div className="flex items-center space-x-2">
        <DataStatusBadge type="MODEL_ESTIMATE" />

        <button
          onClick={() => onNavigate?.('routes')}
          className="flex items-center space-x-1 bg-brand-blue hover:bg-blue-600 text-white font-medium text-xs px-2.5 py-1 rounded transition-colors shadow-sm"
        >
          <Navigation className="w-3 h-3" />
          <span>VIEW IMPACT & REROUTE</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
