import React, { useState } from 'react';
import {
  Route as RouteIcon,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Truck,
  Mountain,
  Navigation,
  ChevronRight,
  Layers,
  Activity,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { RoadCorridor } from '../types';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface RoadNetworkPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const RoadNetworkPage: React.FC<RoadNetworkPageProps> = ({ onNavigate }) => {
  const { corridors, selectCorridor, selectedCorridor } = useIncident();
  const [filterState, setFilterState] = useState<string>('ALL');

  const filteredCorridors = corridors.filter((c) => {
    if (filterState === 'ALL') return true;
    return c.states.includes(filterState);
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <RouteIcon className="w-6 h-6 text-cyan-400" />
              <span>REGIONAL ROAD NETWORK & CORRIDORS</span>
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            National highway arterials, mountain passes, bridges, and accessibility status across all 8 NER states
          </p>
        </div>

        {/* State Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono">
          {['ALL', 'Assam', 'Nagaland', 'Manipur', 'Meghalaya', 'Tripura', 'Sikkim', 'Arunachal Pradesh'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterState(st)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterState === st
                  ? 'bg-brand-blue text-white'
                  : 'bg-navy-900 text-slate-400 hover:bg-navy-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Corridors List & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCorridors.map((corridor) => {
          const isHighRisk = corridor.status === 'HIGH_RISK';
          const isBlocked = corridor.status === 'BLOCKED';
          const isNormal = corridor.status === 'NORMAL';

          return (
            <div
              key={corridor.id}
              onClick={() => {
                selectCorridor(corridor);
                onNavigate('map', { corridor: corridor.code });
              }}
              className={`bg-navy-850 rounded-xl p-5 border cursor-pointer transition-all shadow-xl hover:bg-navy-800 flex flex-col justify-between ${
                isBlocked
                  ? 'border-red-600/80 ring-2 ring-red-600/30'
                  : isHighRisk
                  ? 'border-orange-600/70'
                  : isNormal
                  ? 'border-surface-border'
                  : 'border-amber-600/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-base font-extrabold text-white">
                      {corridor.code}
                    </span>
                    <h3 className="font-bold text-white text-sm line-clamp-1 mt-0.5">
                      {corridor.name}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      isBlocked
                        ? 'bg-red-950 text-red-300 border-red-700'
                        : isHighRisk
                        ? 'bg-orange-950 text-orange-300 border-orange-700'
                        : isNormal
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-amber-950 text-amber-300 border-amber-700'
                    }`}
                  >
                    {corridor.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-cyan-400 mb-2">
                  States: {corridor.states.join(', ')} • {corridor.lengthKm} km
                </div>

                <div className="bg-navy-950 p-2.5 rounded-lg border border-surface-border grid grid-cols-2 gap-2 text-xs font-mono my-3">
                  <div>
                    <span className="text-slate-500 text-[10px] block">TRAFFIC</span>
                    <span className="text-white font-bold">{corridor.traffic}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">WEATHER</span>
                    <span className="text-cyan-400 font-bold">{corridor.rainfallMmH} mm/h</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">LANDSLIDE RISK</span>
                    <span
                      className={`font-bold ${
                        corridor.landslideProbabilityPct > 60
                          ? 'text-red-400'
                          : corridor.landslideProbabilityPct > 30
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {corridor.landslideProbabilityPct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">BRIDGES AT RISK</span>
                    <span className="text-amber-400 font-bold">{corridor.bridgesAtRisk}</span>
                  </div>
                </div>

                <div className="bg-navy-950 p-2 rounded text-[11px] text-slate-300 border border-surface-border">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    RECOMMENDED DISPATCH PROTOCOL:
                  </span>
                  <p className="mt-0.5 text-slate-300">{corridor.recommendedAction}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  {corridor.affectedMissions} Missions In Transit
                </span>
                <span className="text-cyan-400 flex items-center space-x-1">
                  <span>View On GIS</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
