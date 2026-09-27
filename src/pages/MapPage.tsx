import React, { useState } from 'react';
import {
  Map as MapIcon,
  Search,
  Layers,
  Filter,
  Route,
  Truck,
  Radio,
  AlertTriangle,
  Warehouse,
  ChevronRight,
  Info,
} from 'lucide-react';
import { RegionalMap } from '../components/map/RegionalMap';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface MapPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onNavigate }) => {
  const { corridors, selectedCorridor, selectCorridor, vehicles, sensors, incidents } = useIncident();

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-navy-950">
      {/* Top Map Context Ribbon */}
      <div className="bg-navy-900 border-b border-surface-border px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <MapIcon className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              REGIONAL GIS ACCESSIBILITY INTELLIGENCE MAP
            </span>
          </div>
          <DataStatusBadge type="LIVE" />
        </div>

        {/* Quick Corridor Filter Pills */}
        <div className="hidden md:flex items-center space-x-1.5 overflow-x-auto text-xs font-mono">
          <span className="text-slate-400 text-[10px] mr-1">CORRIDORS:</span>
          {corridors.map((c) => (
            <button
              key={c.id}
              onClick={() => selectCorridor(c)}
              className={`px-2 py-0.5 rounded transition-colors text-[11px] font-bold ${
                selectedCorridor?.id === c.id
                  ? 'bg-brand-blue text-white'
                  : 'bg-navy-950 text-slate-300 hover:bg-navy-800'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Component with Full-Height GIS */}
      <div className="flex-1 relative w-full overflow-hidden">
        <RegionalMap
          heightClass="h-full"
          onNavigateToModule={onNavigate}
          showInspectorByDefault={true}
        />
      </div>
    </div>
  );
};
