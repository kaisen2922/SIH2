import React from 'react';
import {
  GitCompare,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  RefreshCw,
  BrainCircuit,
  BarChart2,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

export const ModelFeedbackPage: React.FC = () => {
  const { modelEvaluation } = useIncident();

  // Metrics from Screen 18:
  // Prediction accuracy, False alarms, Missed disruptions, Lead time, Route recommendation accuracy
  const metrics = [
    { label: 'Prediction Accuracy', value: '91.4%', target: 'Target > 88.0%', status: 'EXCEEDING', icon: Target, color: 'text-emerald-400' },
    { label: 'False Alarm Rate', value: '6.8%', target: 'Benchmark < 8.0%', status: 'OPTIMAL', icon: ShieldCheck, color: 'text-cyan-400' },
    { label: 'Missed Disruptions', value: '2.1%', target: 'Safety Limit < 3.0%', status: 'CONTROLLED', icon: AlertTriangle, color: 'text-amber-400' },
    { label: 'Average Lead Time', value: '3.4 hrs', target: 'Minimum > 2.5 hrs', status: 'ACTIONABLE', icon: Clock, color: 'text-emerald-400' },
    { label: 'Route Acceptance Rate', value: '89.2%', target: 'Operator Target > 85%', status: 'HIGH', icon: Zap, color: 'text-purple-400' },
  ];

  const feedbackPipeline = [
    { step: '01', title: 'PREDICTION', desc: 'XGBoost & ConvLSTM generate 2–4 hour disruption probabilities for NH-29 & NH-6' },
    { step: '02', title: 'ACTUAL EVENT', desc: 'Live telematics, patrol geophone triggers, and field photos capture true road state' },
    { step: '03', title: 'COMPARE', desc: 'Spatial intersection diffs compute true positives, false alarms, and onset lag' },
    { step: '04', title: 'MODEL EVALUATION', desc: 'Brier score, ROC-AUC, and Lead Time margins logged to central registry' },
    { step: '05', title: 'MODEL IMPROVEMENT', desc: 'Online gradient weight adjustments update regional slope sensitivity curves' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <GitCompare className="w-6 h-6 text-cyan-400" />
              <span>MODEL FEEDBACK & CONTINUOUS EVALUATION</span>
            </h1>
            <DataStatusBadge type="MODEL_ESTIMATE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Closed-loop validation comparing predicted vs observed road disruptions across the North Eastern Region
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-cyan-400 bg-navy-900 px-3 py-1.5 rounded-lg border border-surface-border font-bold">
            MODEL ARCH: XGBoost + ConvLSTM v2.4
          </span>
        </div>
      </div>

      {/* 5 Core Evaluation Metrics (Screen 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-navy-850 border border-surface-border rounded-xl p-4 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold truncate">
                    {m.label}
                  </span>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className={`text-2xl sm:text-3xl font-mono font-extrabold my-1 ${m.color}`}>
                  {m.value}
                </div>
                <span className="text-[10px] font-mono text-slate-500 block truncate">
                  {m.target}
                </span>
              </div>
              <span className="mt-2 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 w-fit">
                {m.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Comparison: Predicted vs Observed Disruption (Screen 18) */}
      <div className="bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              GROUND TRUTH COMPARISON: PREDICTED VS OBSERVED
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">LAST 7 DAYS INGESTION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Predicted Disruption Card */}
          <div className="bg-navy-950 p-4 rounded-xl border border-blue-900/60 space-y-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase block">
              AI PREDICTED DISRUPTION
            </span>
            <div className="text-white text-sm font-bold">
              Corridor NH-29 (MP 140–160): Landslide Probability 71%
            </div>
            <div className="space-y-1 text-slate-400 text-[11px] pt-1">
              <div>Predicted Onset Window: 18:00 – 20:00 IST</div>
              <div>Estimated Delay: +32 min freight constriction</div>
              <div>Recommended Action: Reroute to Route C (Lumding bypass)</div>
            </div>
          </div>

          {/* Observed Disruption Card */}
          <div className="bg-navy-950 p-4 rounded-xl border border-emerald-900/60 space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">
              ACTUAL OBSERVED GROUND EVENT
            </span>
            <div className="text-white text-sm font-bold">
              Single-lane boulder collapse verified at MP 148
            </div>
            <div className="space-y-1 text-slate-400 text-[11px] pt-1">
              <div>Actual Occurrence: 18:42 IST (Within predicted window)</div>
              <div>Measured Convoy Delay: +35 min (Accuracy: 91.4%)</div>
              <div>Verification: Field Officer Patrol unit camera + geophone spike</div>
            </div>
          </div>
        </div>
      </div>

      {/* Closed Loop Workflow Progression (Screen 18 exact 5-step loop) */}
      <div className="bg-navy-900 border border-surface-border rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-surface-border pb-3">
          <BrainCircuit className="w-5 h-5 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            CONTINUOUS LEARNING & RETRAINING LOOP
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {feedbackPipeline.map((p, idx) => (
            <div
              key={p.step}
              className="bg-navy-950 p-3.5 rounded-xl border border-surface-border flex flex-col justify-between space-y-2 relative group hover:border-cyan-500/50 transition-colors"
            >
              <div>
                <span className="font-mono text-[10px] text-cyan-400 font-extrabold block">
                  STEP {p.step}
                </span>
                <h4 className="font-bold text-white text-xs font-mono mt-1">{p.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{p.desc}</p>
              </div>

              {idx < feedbackPipeline.length - 1 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-cyan-400 font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
