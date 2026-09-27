import React, { useState } from 'react';
import {
  BrainCircuit,
  CloudRain,
  Mountain,
  AlertTriangle,
  Car,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  Info,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { ExplainableAIWaterfall } from '../components/predictions/ExplainableAIWaterfall';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface PredictionsPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const PredictionsPage: React.FC<PredictionsPageProps> = ({ onNavigate }) => {
  const {
    corridors,
    selectedCorridor,
    selectCorridor,
    disruptionPrediction,
  } = useIncident();

  const [activeCorridorCode, setActiveCorridorCode] = useState(selectedCorridor.code);

  const currentCorridor = corridors.find((c) => c.code === activeCorridorCode) || selectedCorridor;

  // Prediction Cards required by prompt:
  // RAINFALL DISRUPTION: 82% HIGH
  // LANDSLIDE RISK: 71% HIGH
  // ROAD DISRUPTION: 64% MODERATE-HIGH
  // TRAFFIC DISRUPTION: 38% MODERATE
  const predictionCards = [
    {
      title: 'RAINFALL DISRUPTION',
      probability: disruptionPrediction.rainfallDisruptionPct,
      level: 'HIGH',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40 border-cyan-800/60',
      barColor: 'from-blue-600 to-cyan-400',
      icon: CloudRain,
      note: 'Based on IMD Doppler Radar 48 mm/h cell tracking',
    },
    {
      title: 'LANDSLIDE RISK',
      probability: disruptionPrediction.landslideRiskPct,
      level: 'HIGH',
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/40 border-orange-800/60',
      barColor: 'from-amber-500 to-orange-500',
      icon: Mountain,
      note: 'Soil saturation (87%) + steep terrain slope >34°',
    },
    {
      title: 'ROAD DISRUPTION',
      probability: disruptionPrediction.roadDisruptionPct,
      level: 'MODERATE-HIGH',
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-800/60',
      barColor: 'from-amber-600 to-yellow-400',
      icon: AlertTriangle,
      note: 'Sub-base shearing & unpaved shoulder risk',
    },
    {
      title: 'TRAFFIC DISRUPTION',
      probability: disruptionPrediction.trafficDisruptionPct,
      level: 'MODERATE',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-800/60',
      barColor: 'from-teal-600 to-emerald-400',
      icon: Car,
      note: 'Mountain freight queue & single-lane pinch point',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
              AI DISRUPTION CENTER
            </h1>
            <DataStatusBadge type="MODEL_ESTIMATE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Predicting transportation disruptions before they affect logistics.
          </p>
        </div>

        {/* Corridor Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">CORRIDOR:</span>
          <select
            value={activeCorridorCode}
            onChange={(e) => {
              setActiveCorridorCode(e.target.value);
              const found = corridors.find((c) => c.code === e.target.value);
              if (found) selectCorridor(found);
            }}
            className="bg-navy-900 border border-surface-border rounded-lg text-xs font-mono font-bold text-white px-3 py-1.5 outline-none focus:border-brand-blue"
          >
            {corridors.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code} — {c.name.split('(')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Disruption Window Banner */}
      <div className="bg-navy-900 border border-brand-blue/50 rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                PREDICTED DISRUPTION WINDOW
              </span>
              <DataStatusBadge type="MODEL_ESTIMATE" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-0.5">
              2–4 HOURS
            </div>
            <p className="text-xs text-slate-300">
              Proactive dispatch window before mountain corridor conditions reach impassable threshold.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => onNavigate('routes', { corridor: currentCorridor.code })}
            className="bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-brand-blue/30"
          >
            <span>ROUTE COMPARISON & REROUTE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Prediction Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {predictionCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`border rounded-xl p-4 shadow-lg flex flex-col justify-between ${card.bgColor}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 tracking-wider">
                    {card.title}
                  </span>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div className="flex items-baseline space-x-2 my-2">
                  <span className={`text-3xl sm:text-4xl font-mono font-extrabold ${card.color}`}>
                    {card.probability}%
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-200 uppercase">
                    {card.level}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-surface-border my-2">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${card.barColor}`}
                    style={{ width: `${card.probability}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-2 pt-2 border-t border-surface-border/50">
                {card.note}
              </p>
            </div>
          );
        })}
      </div>

      {/* Why is this corridor at risk? Explainable AI Waterfall Section */}
      <ExplainableAIWaterfall
        corridorCode={currentCorridor.code}
        factors={disruptionPrediction.primaryFactors}
      />

      {/* Simulation / Honest Data Disclaimer Notice */}
      <div className="bg-navy-900/60 border border-surface-border rounded-lg p-3 flex items-start space-x-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Prototype Integrity Notice:</strong> Predicted disruption probabilities
          and impact windows are generated via the integrated XGBoost/ConvLSTM multi-hazard fusion simulation
          model. Actual real-world deployment requires coupling with connected IoT sensors and IMD radar telemetry.
        </p>
      </div>
    </div>
  );
};
