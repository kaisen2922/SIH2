import React from 'react';
import { RouteOption } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { Mountain, ShieldCheck, AlertTriangle } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface ElevationProfileChartProps {
  route: RouteOption;
}

export const ElevationProfileChart: React.FC<ElevationProfileChartProps> = ({ route }) => {
  const data = route.elevationProfile.map((p) => ({
    dist: `${p.distanceKm} km`,
    elev: p.elevationM,
    risk: p.risk,
  }));

  const maxElevation = Math.max(...route.elevationProfile.map((p) => p.elevationM), 1200);

  return (
    <div className="bg-navy-800 border border-surface-border rounded-xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-2.5">
        <div className="flex items-center space-x-2">
          <Mountain className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            MOUNTAIN PASS ELEVATION PROFILE & HAZARD TOPOGRAPHY
          </h4>
        </div>
        <div className="flex items-center space-x-2">
          <DataStatusBadge type="MODEL_ESTIMATE" />
          <span className="text-xs font-mono font-bold text-cyan-300">{route.corridor}</span>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorElev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="dist" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis
              stroke="#64748b"
              domain={[0, Math.ceil((maxElevation * 1.15) / 200) * 200]}
              tickFormatter={(v) => `${v}m`}
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="bg-navy-950 border border-surface-border p-2.5 rounded-lg shadow-xl text-xs font-mono">
                      <p className="text-slate-300">Distance from Origin: {p.dist}</p>
                      <p className="text-cyan-400 font-bold">Elevation: {p.elev}m MSL</p>
                      <p
                        className={`font-bold mt-1 ${
                          p.risk === 'HIGH' || p.risk === 'CRITICAL'
                            ? 'text-red-400'
                            : p.risk === 'MODERATE'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        Sector Hazard Level: {p.risk}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={1000}
              stroke="#f97316"
              strokeDasharray="3 3"
              label={{
                value: 'High-Altitude Pass (>1000m)',
                fill: '#f97316',
                fontSize: 10,
                position: 'top',
              }}
            />
            <Area type="monotone" dataKey="elev" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorElev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-300 font-mono bg-navy-950 p-2.5 rounded-lg border border-surface-border gap-2">
        <span className="flex items-center space-x-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Steep slope & landslide zones concentrated along high passes (&gt;800m MSL)</span>
        </span>
        <span className="text-emerald-400 font-bold flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Bypass Gradient: {route.recommended ? 'Resilient Profile' : 'High Slope Exposure'}</span>
        </span>
      </div>
    </div>
  );
};
