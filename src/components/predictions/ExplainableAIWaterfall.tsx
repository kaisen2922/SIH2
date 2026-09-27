import React from 'react';
import {
  BrainCircuit,
  CloudRain,
  Mountain,
  History,
  Layers,
  Droplets,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface FactorItem {
  factor: string;
  contributionPct: number;
  description: string;
}

interface ExplainableAIWaterfallProps {
  corridorCode?: string;
  factors?: FactorItem[];
}

export const ExplainableAIWaterfall: React.FC<ExplainableAIWaterfallProps> = ({
  corridorCode = 'NH-29',
  factors = [
    {
      factor: 'Heavy rainfall',
      contributionPct: 28,
      description: 'Convective rainfall band producing 48 mm/h localized burst along watershed',
    },
    {
      factor: 'Steep terrain',
      contributionPct: 22,
      description: 'Slope gradient exceeds 34° between MP 142 and MP 168',
    },
    {
      factor: 'Historical landslide frequency',
      contributionPct: 19,
      description: '14 debris flow occurrences recorded at this specific pass in past 5 seasons',
    },
    {
      factor: 'Soil saturation',
      contributionPct: 17,
      description: 'In-situ sensor telemetry records 87% moisture saturation threshold',
    },
    {
      factor: 'Road condition',
      contributionPct: 14,
      description: 'Sub-base shearing and unpaved drainage shoulder along inner hillside',
    },
  ],
}) => {
  const getFactorIcon = (factorName: string) => {
    const lower = factorName.toLowerCase();
    if (lower.includes('rain')) return <CloudRain className="w-4 h-4 text-cyan-400" />;
    if (lower.includes('terrain') || lower.includes('slope'))
      return <Mountain className="w-4 h-4 text-amber-400" />;
    if (lower.includes('history') || lower.includes('landslide'))
      return <History className="w-4 h-4 text-orange-400" />;
    if (lower.includes('soil') || lower.includes('saturation'))
      return <Droplets className="w-4 h-4 text-blue-400" />;
    return <Layers className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="bg-navy-800 border border-surface-border rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              MULTI-MODAL DATA FUSION
            </span>
            <DataStatusBadge type="MODEL_ESTIMATE" />
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            WHY IS THIS CORRIDOR AT RISK?
          </h3>
          <p className="text-xs text-slate-400">
            Attribution of disruption risk across meteorological, geological, and infrastructure telemetry
          </p>
        </div>
        <div className="bg-navy-950 px-3 py-1.5 rounded-lg border border-surface-border text-right shrink-0">
          <span className="text-[10px] text-slate-400 font-mono block">FOCUSED PASS</span>
          <span className="text-xs font-mono font-bold text-white">{corridorCode} Crest</span>
        </div>
      </div>

      {/* Factor Breakdown Bars */}
      <div className="space-y-4">
        {factors.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {getFactorIcon(item.factor)}
                <span className="font-semibold text-slate-200">{item.factor}</span>
              </div>
              <span className="font-mono font-bold text-cyan-400">+{item.contributionPct}%</span>
            </div>

            {/* Contribution Bar */}
            <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-surface-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan transition-all duration-700"
                style={{ width: `${item.contributionPct * 3}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Equation Footer */}
      <div className="mt-5 pt-3 border-t border-surface-border/70 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 bg-navy-950/60 p-2.5 rounded-lg">
        <span className="text-slate-300 font-medium">Risk Formula:</span>
        <div className="flex flex-wrap items-center gap-1.5 text-cyan-300 font-bold">
          <span>Heavy rainfall</span>
          <span className="text-slate-500">+</span>
          <span>Steep terrain</span>
          <span className="text-slate-500">+</span>
          <span>Landslide frequency</span>
          <span className="text-slate-500">+</span>
          <span>Road condition</span>
          <span className="text-slate-500">+</span>
          <span>Soil saturation</span>
        </div>
      </div>
    </div>
  );
};
