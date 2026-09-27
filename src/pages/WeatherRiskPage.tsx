import React from 'react';
import {
  CloudRain,
  Wind,
  Compass,
  Droplets,
  AlertTriangle,
  Sun,
  Eye,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface WeatherRiskPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const WeatherRiskPage: React.FC<WeatherRiskPageProps> = ({ onNavigate }) => {
  const { corridors } = useIncident();

  const weatherHotspots = [
    {
      region: 'Kohima - Senapati Pass (Nagaland/Manipur)',
      corridor: 'NH-29',
      rainfall: '48 mm/h',
      trend: 'Intensifying convective cell',
      landslideRisk: '71% (High)',
      wind: '34 km/h SW',
      temp: '18°C',
      soilSaturation: '87%',
      visibility: '250m',
      status: 'HIGH_ALERT',
    },
    {
      region: 'Sonapur Tunnel & Jowai Plateau (Meghalaya)',
      corridor: 'NH-6',
      rainfall: '62 mm/h',
      trend: 'Torrential mountain downpour',
      landslideRisk: '88% (Severe)',
      wind: '42 km/h S',
      temp: '16°C',
      soilSaturation: '94%',
      visibility: '100m',
      status: 'CRITICAL',
    },
    {
      region: 'Teesta River Gorge (Sikkim)',
      corridor: 'NH-10',
      rainfall: '38 mm/h',
      trend: 'Steady monsoon cloud deck',
      landslideRisk: '76% (High)',
      wind: '22 km/h NE',
      temp: '14°C',
      soilSaturation: '84%',
      visibility: '400m',
      status: 'WARNING',
    },
    {
      region: 'Brahmaputra Valley (Guwahati - Nagaon)',
      corridor: 'NH-27',
      rainfall: '8 mm/h',
      trend: 'Light scattered showers',
      landslideRisk: '12% (Low)',
      wind: '12 km/h E',
      temp: '28°C',
      soilSaturation: '48%',
      visibility: '3,000m',
      status: 'NORMAL',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <CloudRain className="w-6 h-6 text-cyan-400" />
              <span>WEATHER & DISASTER RISK RADAR</span>
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            IMD Doppler radar telemetry, convective precipitation tracking, and geotechnical slope saturation
          </p>
        </div>

        <button
          onClick={() => onNavigate('disruptions')}
          className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-brand-blue/30"
        >
          <span>AI Disruption Forecast</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Regional Weather Front Summary */}
      <div className="bg-navy-900 border border-brand-cyan/60 rounded-xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              REGIONAL MONSOON RADAR CELL WATCH
            </span>
            <span className="bg-red-950 text-red-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-red-700 animate-pulse">
              CONVECTIVE SURGE ACTIVE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            High-Intensity Rain Front Moving East-Southeast Across Southern Assam & Nagaland
          </h2>
          <p className="text-xs text-slate-300">
            Precipitation rate of 48–65 mm/h detected along NH-29 and NH-6 watersheds. Slope saturation thresholds exceeded.
          </p>
        </div>

        <div className="bg-navy-950 p-3.5 rounded-xl border border-surface-border font-mono text-xs text-right shrink-0">
          <span className="text-slate-400 text-[10px] block">RADAR REFRESH</span>
          <span className="text-cyan-400 font-bold text-sm">IMD Guwahati S-Band</span>
          <span className="text-slate-500 text-[10px] block">Sweep Interval: 10 mins</span>
        </div>
      </div>

      {/* Weather Hotspots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weatherHotspots.map((spot, idx) => (
          <div
            key={idx}
            className="bg-navy-850 rounded-xl p-5 border border-surface-border shadow-xl space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{spot.corridor}</span>
                <h3 className="font-bold text-white text-base mt-0.5">{spot.region}</h3>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  spot.status === 'CRITICAL'
                    ? 'bg-red-950 text-red-300 border-red-700'
                    : spot.status === 'HIGH_ALERT'
                    ? 'bg-orange-950 text-orange-300 border-orange-700 animate-pulse'
                    : spot.status === 'WARNING'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}
              >
                {spot.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-navy-950 p-2.5 rounded-lg border border-surface-border font-mono text-[11px] text-center">
              <div>
                <span className="text-slate-500 text-[10px] block">RAIN RATE</span>
                <span className="text-cyan-400 font-bold">{spot.rainfall}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">SOIL MOISTURE</span>
                <span className="text-orange-400 font-bold">{spot.soilSaturation}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">VISIBILITY</span>
                <span className="text-white font-bold">{spot.visibility}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">WIND SPEED</span>
                <span className="text-slate-300 font-bold">{spot.wind}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-slate-400">{spot.trend}</span>
              <span className="text-amber-400 font-bold">{spot.landslideRisk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
