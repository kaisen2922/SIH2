import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  Package,
  Plus,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Fuel,
  Pill,
  Apple,
  Droplet,
  Info,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface SupplyPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const SupplyPage: React.FC<SupplyPageProps> = ({ onNavigate }) => {
  const { supplyItems, prepositionSupply } = useIncident();
  const [prepositionSuccess, setPrepositionSuccess] = useState<string | null>(null);

  const handlePreposition = (id: string, name: string) => {
    prepositionSupply(id, 2);
    setPrepositionSuccess(`Successfully pre-positioned 2 emergency consignments of ${name} from Guwahati Apex Hub!`);
    setTimeout(() => setPrepositionSuccess(null), 4000);
  };

  const getSupplyIcon = (category: string) => {
    switch (category) {
      case 'MEDICINES':
        return <Pill className="w-5 h-5 text-cyan-400" />;
      case 'FOOD':
        return <Apple className="w-5 h-5 text-emerald-400" />;
      case 'FUEL':
        return <Fuel className="w-5 h-5 text-amber-400" />;
      case 'WATER':
      default:
        return <Droplet className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
              REGIONAL SUPPLY MONITOR
            </h1>
            <DataStatusBadge type="MODEL_ESTIMATE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Predictive inventory depletion tracking and anticipatory dispatch for isolated districts
          </p>
        </div>

        <button
          onClick={() => onNavigate('emergency')}
          className="bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-brand-blue/30"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Emergency Supply Protocols</span>
        </button>
      </div>

      {/* Success Notification if Pre-positioned */}
      {prepositionSuccess && (
        <div className="bg-emerald-950 border border-emerald-600 text-emerald-200 p-3 rounded-xl flex items-center space-x-2 text-xs font-mono animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{prepositionSuccess}</span>
        </div>
      )}

      {/* AI FORECAST BANNER (Exact requirement from prompt) */}
      <div className="bg-navy-900 border border-amber-600/70 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                AI EARLY WARNING FORECAST
              </span>
              <DataStatusBadge type="MODEL_ESTIMATE" />
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Fuel shortage risk detected in Imphal within approximately 18 hours.
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Current storage at Imphal depot stands at 34%. Projected mountain corridor blockages along
              NH-29 prevent standard replenishment.
            </p>
            <div className="mt-2.5 flex items-center space-x-2 text-xs font-mono text-emerald-300">
              <span className="font-bold text-slate-400">RECOMMENDED ACTION:</span>
              <span>"Pre-position 2 fuel consignments from Guwahati."</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-2">
          <button
            onClick={() => handlePreposition('sup-fuel', 'Aviation & Generator Diesel')}
            className="bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>PRE-POSITION 2 CONSIGNMENTS</span>
          </button>
        </div>
      </div>

      {/* 4 Supply Cards Grid (Medicines 72%, Food 81%, Fuel 34%, Water 67%) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {supplyItems.map((item) => {
          const isCritical = item.riskLevel === 'CRITICAL';
          const isModerate = item.riskLevel === 'MODERATE';

          return (
            <div
              key={item.id}
              className={`bg-navy-850 rounded-xl p-5 border flex flex-col justify-between shadow-xl transition-all ${
                isCritical
                  ? 'border-red-600/80 ring-2 ring-red-600/30'
                  : isModerate
                  ? 'border-amber-600/60'
                  : 'border-surface-border'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 rounded-lg bg-navy-950 border border-surface-border flex items-center justify-center">
                      {getSupplyIcon(item.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm font-mono">{item.category}</h3>
                      <span className="text-[10px] text-slate-400">{item.consumptionRatePerDay}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      isCritical
                        ? 'bg-red-950 text-red-300 border-red-700'
                        : isModerate
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}
                  >
                    {item.riskLevel}
                  </span>
                </div>

                {/* Stock Level Big Metric */}
                <div className="my-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      {item.currentStockPct}%
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Demand: <strong className="text-white">{item.demandLevel}</strong>
                    </span>
                  </div>

                  {/* Stock Bar */}
                  <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden border border-surface-border mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCritical
                          ? 'bg-red-500'
                          : isModerate
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.currentStockPct}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {item.forecastSummary}
                  </p>
                  <div className="text-[10px] font-mono text-slate-400 bg-navy-950 p-2 rounded border border-surface-border">
                    <span className="text-slate-500 block">CRITICAL REGION:</span>
                    <span className="text-white font-semibold">{item.criticalLocation}</span>
                  </div>
                </div>
              </div>

              {/* Card Action */}
              <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400">
                  {item.consignmentsInTransit} in transit
                </span>
                <button
                  onClick={() => handlePreposition(item.id, item.name)}
                  className="bg-navy-950 hover:bg-navy-800 text-slate-200 border border-surface-border px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors"
                >
                  + Dispatch Consignment
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warehouse Regional Staging Depots Link */}
      <div className="bg-navy-800 border border-surface-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <Boxes className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <span className="font-bold text-white block">
              6 Regional Logistics Hubs & Warehouses Active
            </span>
            <span className="text-slate-400">
              Guwahati Apex Hub, Imphal Forward Depot, Silchar, Dimapur, Shillong, Agartala
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('warehouses')}
          className="bg-brand-blue hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 shrink-0"
        >
          <span>View Hub Storage</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
