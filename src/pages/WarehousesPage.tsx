import React from 'react';
import {
  Warehouse as WarehouseIcon,
  MapPin,
  Boxes,
  Truck,
  Plus,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { Warehouse } from '../types';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface WarehousesPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const WarehousesPage: React.FC<WarehousesPageProps> = ({ onNavigate }) => {
  const { warehouses } = useIncident();

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <WarehouseIcon className="w-6 h-6 text-cyan-400" />
              <span>REGIONAL LOGISTICS HUBS & WAREHOUSES</span>
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Buffer stocks, cold-chain storage capacity, and transhipment throughput across the North Eastern Region
          </p>
        </div>

        <button
          onClick={() => onNavigate('supply')}
          className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md"
        >
          <span>View Supply Depletion Forecast</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {warehouses.map((wh) => {
          const isIsolated = wh.status === 'ISOLATED';
          const isCongested = wh.status === 'CONGESTED';

          return (
            <div
              key={wh.id}
              className={`bg-navy-850 rounded-xl p-5 border shadow-xl flex flex-col justify-between space-y-4 ${
                isIsolated
                  ? 'border-amber-600/80 ring-2 ring-amber-600/30'
                  : isCongested
                  ? 'border-orange-600/70'
                  : 'border-surface-border'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white text-base font-mono">{wh.name}</h3>
                    <div className="flex items-center space-x-1 text-xs text-cyan-400 font-mono mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{wh.city}, {wh.state}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      isIsolated
                        ? 'bg-amber-950 text-amber-300 border-amber-600 animate-pulse'
                        : isCongested
                        ? 'bg-orange-950 text-orange-300 border-orange-600'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    }`}
                  >
                    {wh.status}
                  </span>
                </div>

                {/* Capacity Bar */}
                <div className="my-3">
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>TOTAL CAPACITY UTILIZATION</span>
                    <span className="font-bold text-white">{wh.capacityPct}%</span>
                  </div>
                  <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-surface-border">
                    <div
                      className={`h-full rounded-full ${
                        wh.capacityPct > 85
                          ? 'bg-red-500'
                          : wh.capacityPct > 65
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${wh.capacityPct}%` }}
                    />
                  </div>
                </div>

                {/* Stock breakdown grid */}
                <div className="grid grid-cols-2 gap-2 bg-navy-950 p-2.5 rounded-lg border border-surface-border font-mono text-[11px] mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Medicines:</span>
                    <span className="text-cyan-400 font-bold">{wh.medicinesStockPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Food Rations:</span>
                    <span className="text-emerald-400 font-bold">{wh.foodStockPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel Reserves:</span>
                    <span
                      className={`font-bold ${
                        wh.fuelStockPct < 40 ? 'text-red-400 animate-pulse' : 'text-amber-400'
                      }`}
                    >
                      {wh.fuelStockPct}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Water Stores:</span>
                    <span className="text-blue-400 font-bold">{wh.waterStockPct}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-navy-950/60 p-2 rounded">
                  <span>Throughput:</span>
                  <span className="text-white font-bold">
                    {wh.activeMissionsIn} Convoys In / {wh.activeMissionsOut} Out
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Comm: {wh.contact}</span>
                <button
                  onClick={() => onNavigate('supply')}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Manage Stocks →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
