import React, { useState } from 'react';
import {
  PackageCheck,
  Truck,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Navigation,
  ChevronRight,
  Filter,
  Layers,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { LogisticsMission, MissionStatus } from '../types';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface MissionsPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const MissionsPage: React.FC<MissionsPageProps> = ({ onNavigate }) => {
  const { missions, selectedMission, selectMission, canCreateMission } = useIncident();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredMissions = missions.filter((m) => {
    if (statusFilter === 'ALL') return true;
    return m.status === statusFilter;
  });

  const getStatusBadge = (status: MissionStatus) => {
    switch (status) {
      case 'AT_RISK':
        return (
          <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2.5 py-0.5 rounded font-mono text-xs font-bold uppercase animate-pulse">
            AT RISK
          </span>
        );
      case 'DISRUPTED':
        return (
          <span className="bg-red-950 text-red-300 border border-red-600 px-2.5 py-0.5 rounded font-mono text-xs font-bold uppercase">
            DISRUPTED
          </span>
        );
      case 'ON_ROUTE':
        return (
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-2.5 py-0.5 rounded font-mono text-xs font-bold uppercase">
            ON ROUTE
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="bg-blue-950 text-blue-300 border border-blue-600 px-2.5 py-0.5 rounded font-mono text-xs font-bold uppercase">
            DELIVERED
          </span>
        );
      case 'PLANNED':
      default:
        return (
          <span className="bg-slate-900 text-slate-400 border border-slate-700 px-2.5 py-0.5 rounded font-mono text-xs font-bold uppercase">
            PLANNED
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <PackageCheck className="w-6 h-6 text-cyan-400" />
              <span>REGIONAL LOGISTICS MISSIONS</span>
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            The central operational object: mission planning, risk tracking, and corridor execution across NER
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('routes')}
            className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-brand-blue/30"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW MISSION</span>
          </button>
        </div>
      </div>

      {/* Primary Mission Showcase Spotlight (MISSION #NER-2042) */}
      <div className="bg-navy-900 border border-amber-600/70 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                PRIMARY LOGISTICS MISSION
              </span>
              <span className="bg-red-950 text-red-300 border border-red-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                PRIORITY: {selectedMission.priority}
              </span>
              <DataStatusBadge type="MODEL_ESTIMATE" />
            </div>

            <div className="flex items-baseline space-x-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                MISSION #{selectedMission.missionNo}
              </h2>
              {getStatusBadge(selectedMission.status)}
            </div>

            <p className="text-sm font-semibold text-slate-200">
              Cargo: <span className="text-white">{selectedMission.cargo}</span> • Assigned to{' '}
              <strong className="text-cyan-400">{selectedMission.vehicleName}</strong>
            </p>

            <div className="flex items-center space-x-3 text-xs font-mono text-slate-300 bg-navy-950 p-2.5 rounded-lg border border-surface-border">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Origin: <strong className="text-white">{selectedMission.origin}</strong></span>
              <span className="text-slate-500">→</span>
              <span>Destination: <strong className="text-cyan-300">{selectedMission.destination}</strong></span>
              <span className="text-slate-500">|</span>
              <span>Corridor: <strong className="text-amber-300">{selectedMission.activeCorridor}</strong></span>
            </div>
          </div>

          {/* Metrics side */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs w-full sm:w-auto">
              <div className="bg-navy-950 p-3 rounded-lg border border-surface-border">
                <span className="text-[10px] text-slate-400 uppercase block">AI PREDICTED ETA</span>
                <span className="text-lg font-bold text-amber-300">{selectedMission.eta}</span>
                <span className="text-[9px] text-red-400 block font-bold">
                  +{selectedMission.predictedDelayMin}m delay
                </span>
              </div>

              <div className="bg-navy-950 p-3 rounded-lg border border-surface-border">
                <span className="text-[10px] text-slate-400 uppercase block">ROUTE RISK</span>
                <span className="text-lg font-bold text-amber-400">{selectedMission.routeRisk}</span>
                <span className="text-[9px] text-slate-400 block">71% Landslide Prob</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('routes')}
              className="w-full sm:w-auto bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-1.5"
            >
              <span>INSPECT & REROUTE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reason Banner */}
        <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-slate-300 font-mono">
          <span className="text-amber-400 font-semibold truncate mr-2">
            Disruption Warning: {selectedMission.disruptionReason}
          </span>
          <span className="text-slate-400 shrink-0">Dispatch ID: {selectedMission.id}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto text-xs font-mono">
        {['ALL', 'AT_RISK', 'ON_ROUTE', 'DISRUPTED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              statusFilter === s
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-navy-900 text-slate-400 hover:bg-navy-800'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMissions.map((mission) => {
          const isSelected = selectedMission.id === mission.id;

          return (
            <div
              key={mission.id}
              onClick={() => selectMission(mission)}
              className={`bg-navy-850 rounded-xl p-5 border cursor-pointer transition-all shadow-xl hover:bg-navy-800 flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-cyan ring-2 ring-brand-cyan/40 bg-navy-800'
                  : 'border-surface-border'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-extrabold">
                      #{mission.missionNo}
                    </span>
                    <h3 className="font-bold text-white text-base leading-tight mt-0.5">
                      {mission.cargo}
                    </h3>
                  </div>
                  {getStatusBadge(mission.status)}
                </div>

                <div className="bg-navy-950 p-2.5 rounded-lg border border-surface-border space-y-1.5 text-xs font-mono my-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Route:</span>
                    <span className="text-white font-bold">{mission.origin} → {mission.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Transport:</span>
                    <span className="text-cyan-300 font-bold">{mission.vehicleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Predicted ETA:</span>
                    <span className="text-amber-300 font-bold">{mission.eta} (+{mission.predictedDelayMin}m)</span>
                  </div>
                </div>

                {mission.disruptionReason && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic mb-2">
                    "{mission.disruptionReason}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">
                  Priority: <strong className="text-white">{mission.priority}</strong>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectMission(mission);
                    onNavigate('routes');
                  }}
                  className="bg-navy-950 hover:bg-navy-900 text-cyan-300 border border-cyan-800/60 px-3 py-1 rounded text-xs font-mono transition-colors"
                >
                  View Route Impact →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
