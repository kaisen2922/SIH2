import React from 'react';
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  CloudRain,
  Car,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Vehicle } from '../../types';
import { DataStatusBadge } from './DataStatusBadge';

interface PredictiveEtaCardProps {
  vehicle: Vehicle;
}

export const PredictiveEtaCard: React.FC<PredictiveEtaCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-navy-800 border border-surface-border rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              DYNAMIC TRANSIT PROJECTION
            </span>
            <DataStatusBadge type="MODEL_ESTIMATE" />
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            PREDICTIVE ETA & DELAY DECOMPOSITION
          </h3>
          <p className="text-xs text-slate-400">
            AI predicts future delay rather than simply calculating current GPS speed
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 block">VEHICLE</span>
          <span className="font-mono font-bold text-white text-xs">{vehicle.name}</span>
        </div>
      </div>

      {/* Primary Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Baseline / Normal GPS ETA */}
        <div className="bg-navy-950 p-3.5 rounded-lg border border-surface-border flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            CURRENT BASELINE ETA (GPS)
          </span>
          <div className="text-2xl font-mono font-extrabold text-slate-200 mt-1">
            {vehicle.baselineEta}
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Standard clear-weather speed</span>
        </div>

        {/* AI Predicted ETA */}
        <div className="bg-navy-950 p-3.5 rounded-lg border border-amber-800/60 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
            AI PREDICTED ETA
          </span>
          <div className="text-2xl font-mono font-extrabold text-amber-300 mt-1">
            {vehicle.eta}
          </div>
          <span className="text-[10px] text-amber-400/80 mt-1">Risk & weather weighted</span>
        </div>

        {/* Delay Difference */}
        <div className="bg-navy-950 p-3.5 rounded-lg border border-red-800/60 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-red-400 font-bold uppercase">
            ANTICIPATED DELAY
          </span>
          <div className="text-2xl font-mono font-extrabold text-red-400 mt-1">
            +{vehicle.delayMinutes} min
          </div>
          <span className="text-[10px] text-red-300/80 mt-1">Predicted bottleneck buffer</span>
        </div>
      </div>

      {/* WHY Section */}
      <div className="bg-navy-950/80 border border-surface-border rounded-lg p-3.5">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-300 mb-2.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>WHY DOES NERFLOW PREDICT THIS DELAY?</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-navy-900 p-2.5 rounded border border-surface-border flex items-start space-x-2">
            <CloudRain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Heavy Rainfall (+14 min)</span>
              <p className="text-[11px] text-slate-400 leading-tight">
                Visibility drops below 300m and wet road friction lowers convoy speed by 18 km/h.
              </p>
            </div>
          </div>

          <div className="bg-navy-900 p-2.5 rounded border border-surface-border flex items-start space-x-2">
            <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Traffic Backlog (+11 min)</span>
              <p className="text-[11px] text-slate-400 leading-tight">
                Slow single-lane freight queuing through narrow mountain passes ahead of Kohima.
              </p>
            </div>
          </div>

          <div className="bg-navy-900 p-2.5 rounded border border-surface-border flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Road Risk Margin (+7 min)</span>
              <p className="text-[11px] text-slate-400 leading-tight">
                Mandatory checkpoint safety hold to verify slope geophone telemetry stability.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-surface-border flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Formula: Delay = Rain slowdown + Convoy bottleneck + Slope safety hold</span>
          <span className="text-cyan-400 font-bold">Total: +{vehicle.delayMinutes} min Delay</span>
        </div>
      </div>
    </div>
  );
};
