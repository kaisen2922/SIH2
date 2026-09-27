import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Navigation,
  ChevronRight,
  Package,
  Layers,
  Activity,
  MapPin,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface EmergencyPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onNavigate }) => {
  const { missions, selectMission } = useIncident();

  // Active Emergency Missions required by prompt:
  // MISSION #NER-2042: AT RISK
  // MISSION #NER-2051: ON ROUTE
  // MISSION #NER-2060: DISRUPTED
  const emergencyMissions = missions.filter((m) =>
    ['NER-2042', 'NER-2051', 'NER-2060'].includes(m.missionNo)
  );

  const priorityQueue = [
    { rank: 1, category: 'Medical supplies', desc: 'Emergency Medicines, Blood Plasma, Anti-Venom, Oxygen Cylinders', status: 'DISPATCHING' },
    { rank: 2, category: 'Rescue equipment', desc: 'Hydraulic Cutters, Winches, SDRF High-Water Drones, Power Saws', status: 'IN_TRANSIT' },
    { rank: 3, category: 'Food', desc: 'Ready-to-eat baby food, dry grain rations, water purification kits', status: 'QUEUED' },
    { rank: 4, category: 'Fuel', desc: 'Aviation turbine fuel & generator diesel for emergency base hospitals', status: 'CRITICAL_DISPATCH' },
    { rank: 5, category: 'General logistics', desc: 'Shelter tarpaulins, communication repeaters, sleeping mats', status: 'STANDBY' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight text-red-400 flex items-center space-x-2">
              <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
              <span>EMERGENCY LOGISTICS</span>
            </h1>
            <DataStatusBadge type="OFFICIAL_ALERT" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Priority routing and life-saving convoy dispatch during catastrophic regional disruptions
          </p>
        </div>

        <button
          onClick={() => onNavigate('routes')}
          className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-lg shadow-red-600/30"
        >
          <Navigation className="w-4 h-4" />
          <span>Reroute Blocked Convoys</span>
        </button>
      </div>

      {/* Top Emergency Status Banner (Screen 9 exact metrics) */}
      <div className="bg-red-950/40 border border-red-700/60 rounded-xl p-5 shadow-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-navy-950/80 p-3 rounded-lg border border-red-900/60">
          <span className="text-[10px] font-mono text-red-400 font-bold uppercase block">
            MISSION PRIORITY
          </span>
          <span className="text-lg font-mono font-extrabold text-red-300">CRITICAL</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Zero Delay Protocol</span>
        </div>

        <div className="bg-navy-950/80 p-3 rounded-lg border border-surface-border">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
            TARGET CARGO
          </span>
          <span className="text-sm font-mono font-bold text-white block truncate">Medical Supplies</span>
          <span className="text-[10px] text-cyan-400 block mt-0.5">Emergency Cold-Chain</span>
        </div>

        <div className="bg-navy-950/80 p-3 rounded-lg border border-surface-border">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
            DESTINATION
          </span>
          <span className="text-sm font-mono font-bold text-white block">Affected Region</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Imphal / Barak Basin</span>
        </div>

        <div className="bg-navy-950/80 p-3 rounded-lg border border-emerald-900/60">
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
            SAFE CORRIDORS
          </span>
          <span className="text-xl font-mono font-extrabold text-emerald-400">3 Available</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Route C, NH-27, NH-37</span>
        </div>

        <div className="bg-navy-950/80 p-3 rounded-lg border border-red-900/60">
          <span className="text-[10px] font-mono text-red-400 font-bold uppercase block">
            BLOCKED CORRIDORS
          </span>
          <span className="text-xl font-mono font-extrabold text-red-400">2 Blocked</span>
          <span className="text-[10px] text-red-300 block mt-0.5">NH-6 Sonapur, NH-29 Crest</span>
        </div>
      </div>

      {/* Priority Queue (Screen 9) */}
      <div className="bg-navy-850 border border-surface-border rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              REGIONAL EMERGENCY PRIORITY QUEUE
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Enforced by Logistics Authority</span>
        </div>

        <div className="space-y-2.5">
          {priorityQueue.map((item) => (
            <div
              key={item.rank}
              className="bg-navy-950 p-3.5 rounded-lg border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-brand-blue/30 border border-cyan-400 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs shrink-0">
                  {item.rank}
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm">{item.category}</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                </div>
              </div>

              <span
                className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded border uppercase w-fit ${
                  item.status === 'CRITICAL_DISPATCH' || item.status === 'DISPATCHING'
                    ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                    : 'bg-navy-900 text-cyan-300 border-cyan-800'
                }`}
              >
                {item.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Emergency Missions (Screen 9) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>ACTIVE EMERGENCY MISSIONS ({emergencyMissions.length})</span>
          <span>REAL-TIME STATUS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyMissions.map((mission) => {
            const isDisrupted = mission.status === 'DISRUPTED';
            const isAtRisk = mission.status === 'AT_RISK';

            return (
              <div
                key={mission.id}
                onClick={() => {
                  selectMission(mission);
                  onNavigate('routes');
                }}
                className={`bg-navy-850 rounded-xl p-5 border cursor-pointer transition-all shadow-xl hover:bg-navy-800 ${
                  isDisrupted
                    ? 'border-red-600/80 ring-2 ring-red-600/30'
                    : isAtRisk
                    ? 'border-amber-600/70'
                    : 'border-emerald-600/70'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-base font-extrabold text-white">
                      MISSION #{mission.missionNo}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      {mission.cargo}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      isDisrupted
                        ? 'bg-red-950 text-red-300 border-red-700'
                        : isAtRisk
                        ? 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}
                  >
                    {mission.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono bg-navy-950 p-2.5 rounded-lg border border-surface-border mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Route:</span>
                    <span className="text-white font-bold">{mission.origin} → {mission.destination}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-400">Assigned Vehicle:</span>
                    <span className="text-cyan-400 font-bold">{mission.vehicleName}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-400">AI ETA:</span>
                    <span className="text-amber-300 font-bold">{mission.eta} (+{mission.predictedDelayMin}m)</span>
                  </div>
                </div>

                <p className="text-[11px] text-red-300 leading-relaxed italic bg-red-950/30 p-2 rounded border border-red-900/50 mb-3">
                  "{mission.disruptionReason}"
                </p>

                <button className="w-full bg-navy-950 hover:bg-navy-900 text-cyan-300 border border-cyan-800/60 font-medium text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1">
                  <span>Manage Emergency Reroute</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
