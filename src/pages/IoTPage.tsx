import React, { useState } from 'react';
import {
  Radio,
  Activity,
  Battery,
  BatteryCharging,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  CloudRain,
  Mountain,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { SensorNode } from '../types';
import { RegionalMap } from '../components/map/RegionalMap';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface IoTPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const IoTPage: React.FC<IoTPageProps> = ({ onNavigate }) => {
  const { sensors } = useIncident();
  const [selectedSensor, setSelectedSensor] = useState<SensorNode>(sensors[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredSensors = sensors.filter((s) => {
    if (filterType === 'ALL') return true;
    return s.type === filterType;
  });

  const getStatusBadge = (status: SensorNode['status']) => {
    switch (status) {
      case 'ONLINE':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">ONLINE</span>;
      case 'WARNING':
        return <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase animate-pulse">EARLY WARNING</span>;
      case 'DEGRADED':
        return <span className="bg-orange-950 text-orange-300 border border-orange-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">DEGRADED</span>;
      case 'LOW_BATTERY':
        return <span className="bg-red-950 text-red-300 border border-red-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">LOW BATTERY</span>;
      case 'OFFLINE':
      default:
        return <span className="bg-slate-900 text-slate-400 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">OFFLINE</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <Radio className="w-6 h-6 text-cyan-400" />
              <span>REGIONAL SENSOR NETWORK</span>
            </h1>
            <DataStatusBadge type="SIMULATION" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Distributed mountain telemetry mesh monitoring rainfall, soil moisture, river crests, and seismic vibration
          </p>
        </div>

        {/* Filter Types */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono">
          {['ALL', 'rainfall', 'soil_moisture', 'water_level', 'vibration', 'multi_hazard'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterType === t
                  ? 'bg-brand-blue text-white'
                  : 'bg-navy-900 text-slate-400 hover:bg-navy-800'
              }`}
            >
              {t.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Example Sensor Spotlight (Screen 12 exact spec: NER-SENSOR-042) */}
      <div className="bg-navy-900 border border-brand-cyan/60 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-base font-extrabold text-white">
                SPOTLIGHT: NER-SENSOR-042
              </span>
              <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase animate-pulse">
                STATUS: EARLY WARNING
              </span>
              <span className="bg-navy-950 text-slate-400 border border-surface-border px-2 py-0.5 rounded font-mono text-[10px]">
                SIMULATED SENSOR
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Kohima Crest Telemetric Station • Corridor NH-29 • Altitude 1,440m MSL
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-navy-950 p-3 rounded-lg border border-surface-border">
              <span className="text-slate-400 text-[10px] block">RAINFALL</span>
              <span className="text-cyan-400 font-bold text-base">48 mm/h</span>
            </div>
            <div className="bg-navy-950 p-3 rounded-lg border border-surface-border">
              <span className="text-slate-400 text-[10px] block">WATER LEVEL</span>
              <span className="text-amber-400 font-bold text-base">+0.82 m</span>
            </div>
            <div className="bg-navy-950 p-3 rounded-lg border border-surface-border">
              <span className="text-slate-400 text-[10px] block">SOIL MOISTURE</span>
              <span className="text-orange-400 font-bold text-base">87%</span>
            </div>
            <div className="bg-navy-950 p-3 rounded-lg border border-surface-border">
              <span className="text-slate-400 text-[10px] block">VIBRATION</span>
              <span className="text-red-400 font-bold text-base">Elevated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Sensor List (Left) + Spatial GIS View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sensor List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>REGISTERED SENSOR NODES ({filteredSensors.length})</span>
            <span>HARDWARE: ESP32 + LORA</span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredSensors.map((sens) => {
              const isSelected = selectedSensor.id === sens.id;

              return (
                <div
                  key={sens.id}
                  onClick={() => setSelectedSensor(sens)}
                  className={`bg-navy-850 rounded-xl p-4 border cursor-pointer transition-all shadow-md hover:bg-navy-800 ${
                    isSelected
                      ? 'border-brand-cyan ring-2 ring-brand-cyan/40 bg-navy-800'
                      : 'border-surface-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Radio className="w-4 h-4 text-cyan-400" />
                        <h3 className="font-bold text-white text-sm font-mono">{sens.code}</h3>
                      </div>
                      <span className="text-xs text-slate-300 block">{sens.name}</span>
                    </div>
                    {getStatusBadge(sens.status)}
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 mb-2">
                    Location: <strong className="text-slate-200">{sens.corridor}</strong> ({sens.state})
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[10px] bg-navy-950 p-2 rounded border border-surface-border">
                    <div>
                      <span className="text-slate-500 block">RAIN</span>
                      <span className="text-cyan-400 font-bold">{sens.rainfallMmH} mm/h</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SOIL</span>
                      <span className="text-amber-400 font-bold">{sens.soilMoisturePct}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">WATER Δ</span>
                      <span className="text-white font-bold">+{sens.waterLevelDeltaM}m</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">BATTERY</span>
                      <span className="text-emerald-400 font-bold">{sens.batteryPct}%</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Telemetry: {sens.lastUpdated}</span>
                    <span className="text-amber-400 font-bold">SIMULATED SENSOR</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spatial Map (7 cols) */}
        <div className="lg:col-span-7 bg-navy-800 border border-surface-border rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-3 bg-navy-900 border-b border-surface-border flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              REGIONAL SENSOR PLACEMENT & WATERSHED COVERAGE
            </span>
            <span className="text-xs font-mono text-cyan-400">
              Active Focus: {selectedSensor.code}
            </span>
          </div>

          <div className="h-[460px] w-full">
            <RegionalMap
              heightClass="h-full"
              onNavigateToModule={onNavigate}
              showInspectorByDefault={false}
            />
          </div>

          <div className="p-3 bg-navy-900 border-t border-surface-border text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Mesh Topology: LoRaWAN 865 MHz + 4G Fallback</span>
            <span className="text-emerald-400">OTA Firmware v1.4 Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};
