import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Boxes,
  Truck,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface AnalyticsPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  // 6 Core Regional Analytics Metrics from Screen 19:
  // 1. Mission success rate
  // 2. Average delay
  // 3. Disruption frequency
  // 4. Route risk
  // 5. Supply shortage alerts
  // 6. Incident resolution time
  const keyMetrics = [
    { label: 'Mission Success Rate', value: '94.8%', sub: '+2.1% since AI Rerouting', color: 'text-emerald-400', icon: ShieldCheck },
    { label: 'Average Delay', value: '28 min', sub: 'Down from 114 min', color: 'text-cyan-400', icon: Clock },
    { label: 'Disruption Frequency', value: '4.2 / wk', sub: 'Peak Monsoon Corridor Rate', color: 'text-amber-400', icon: AlertTriangle },
    { label: 'Route Risk Exposure', value: '22%', sub: 'Using Route C bypass', color: 'text-emerald-400', icon: TrendingUp },
    { label: 'Supply Shortage Alerts', value: '3 Active', sub: 'Pre-positioned buffer intact', color: 'text-purple-400', icon: Boxes },
    { label: 'Incident Resolution Time', value: '42 min', sub: 'Average BRO & PWD clearance', color: 'text-blue-400', icon: Truck },
  ];

  const corridorDelayData = [
    { corridor: 'NH-29', baselineDelay: 95, aiOptimizedDelay: 32 },
    { corridor: 'NH-6', baselineDelay: 180, aiOptimizedDelay: 45 },
    { corridor: 'NH-27', baselineDelay: 25, aiOptimizedDelay: 10 },
    { corridor: 'NH-37', baselineDelay: 35, aiOptimizedDelay: 15 },
    { corridor: 'NH-8', baselineDelay: 60, aiOptimizedDelay: 20 },
    { corridor: 'NH-10', baselineDelay: 120, aiOptimizedDelay: 40 },
  ];

  const missionSuccessTrend = [
    { week: 'W1 Aug', rate: 84 },
    { week: 'W2 Aug', rate: 86 },
    { week: 'W3 Aug', rate: 89 },
    { week: 'W4 Aug', rate: 91 },
    { week: 'W1 Sep', rate: 93 },
    { week: 'W2 Sep', rate: 94.8 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              <span>REGIONAL LOGISTICS ANALYTICS</span>
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Operational KPIs, delay reduction metrics, and corridor performance statistics across NER
          </p>
        </div>
      </div>

      {/* 6 Top Metric Cards (Screen 19) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {keyMetrics.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-navy-850 border border-surface-border rounded-xl p-3.5 flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold truncate">
                    {kpi.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                </div>
                <div className={`text-2xl font-mono font-extrabold my-1 ${kpi.color}`}>
                  {kpi.value}
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 truncate">
                {kpi.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Useful Analytics Charts (Screen 19: Delay Comparison + Success Rate) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delay Reduction Chart */}
        <div className="bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              CORRIDOR DELAY REDUCTION (BASELINE VS AI OPTIMIZED)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">MINUTES SAVED</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={corridorDelayData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="corridor" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-navy-950 border border-surface-border p-2.5 rounded-lg text-xs font-mono">
                          <p className="text-white font-bold">{payload[0].payload.corridor}</p>
                          <p className="text-red-400">Baseline Without NERFLOW: {payload[0].value} min</p>
                          <p className="text-cyan-400 font-bold">With NERFLOW Optimization: {payload[1].value} min</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="baselineDelay" fill="#475569" name="Baseline Delay" radius={[4, 4, 0, 0]} />
                <Bar dataKey="aiOptimizedDelay" fill="#06B6D4" name="NERFLOW AI" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-6 text-[11px] font-mono text-slate-400 pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-slate-600" />
              <span>Baseline Without AI</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500" />
              <span className="text-white font-bold">With NERFLOW Dynamic Rerouting</span>
            </div>
          </div>
        </div>

        {/* Mission Success Trend Line */}
        <div className="bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              MISSION SUCCESS & SAFE DELIVERY TREND (MONSOON PEAK)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">94.8% RECENT PEAK</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={missionSuccessTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[80, 100]} stroke="#64748b" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-navy-950 border border-surface-border p-2 rounded text-xs font-mono">
                          <p className="text-white font-bold">{payload[0].payload.week}</p>
                          <p className="text-emerald-400 font-bold">Safe Arrival Rate: {payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{ fill: '#22C55E', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] font-mono text-slate-400 text-center pt-1">
            Zero essential medical cargo lost to date across all prioritized mountain corridors
          </div>
        </div>
      </div>
    </div>
  );
};
