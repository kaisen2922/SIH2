import React, { useState } from 'react';
import {
  Boxes,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Truck,
  Plus,
  Package,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface CargoPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const CargoPage: React.FC<CargoPageProps> = ({ onNavigate }) => {
  const { missions } = useIncident();

  const cargoManifest = [
    {
      id: 'CRG-8801',
      name: 'Emergency Medicines & Anti-Venom Kits',
      category: 'Medicines',
      temperatureControlled: true,
      currentTempC: 3.8,
      targetTempRange: '2°C – 8°C',
      tempStatus: 'OPTIMAL',
      weightTonnes: 4.8,
      boundMission: 'NER-2042',
      origin: 'Guwahati Apex Depot',
      destination: 'Imphal Civil Hospital',
      priority: 'CRITICAL',
    },
    {
      id: 'CRG-8802',
      name: 'Pediatric Vaccines & Blood Serum Packs',
      category: 'Cold-Chain Biologicals',
      temperatureControlled: true,
      currentTempC: 4.1,
      targetTempRange: '2°C – 8°C',
      tempStatus: 'OPTIMAL',
      weightTonnes: 2.2,
      boundMission: 'NER-2051',
      origin: 'Silchar Staging Depot',
      destination: 'Aizawl Regional Hospital',
      priority: 'CRITICAL',
    },
    {
      id: 'CRG-8803',
      name: 'Hydraulic Cutters, Winches & SDRF Heavy Drones',
      category: 'Disaster Rescue Gear',
      temperatureControlled: false,
      weightTonnes: 8.5,
      boundMission: 'NER-2060',
      origin: 'Guwahati Hub',
      destination: 'Silchar Lowland Rescue Base',
      priority: 'CRITICAL',
    },
    {
      id: 'CRG-8804',
      name: 'High-Altitude Ready Infant Nutrition',
      category: 'Food Supplies',
      temperatureControlled: false,
      weightTonnes: 3.4,
      boundMission: 'NER-1988',
      origin: 'Guwahati Hub',
      destination: 'Tawang Base Hospital',
      priority: 'HIGH',
    },
    {
      id: 'CRG-8805',
      name: 'Aviation Turbine Fuel & Generator Diesel',
      category: 'Fuel',
      temperatureControlled: false,
      weightTonnes: 12.0,
      boundMission: 'NER-2104',
      origin: 'Dimapur Railhead',
      destination: 'Kohima Emergency Gen Farm',
      priority: 'HIGH',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <Boxes className="w-6 h-6 text-cyan-400" />
              <span>CARGO INTELLIGENCE & COLD-CHAIN INTEGRITY</span>
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Temperature-controlled telemetry, hazardous cargo protocols, and consignments tracking across NER
          </p>
        </div>

        <button
          onClick={() => onNavigate('routes')}
          className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Commission Cargo Shipment</span>
        </button>
      </div>

      {/* Cold Chain Sensor Telemetry Banner */}
      <div className="bg-navy-900 border border-brand-cyan/60 rounded-xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shrink-0">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              COLD-CHAIN LIFE INTEGRITY MONITOR
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Reefer Telemetry Active for Mission #NER-2042 & #NER-2051
            </h2>
            <p className="text-xs text-slate-300">
              Real-time digital temperature logs streamed via IoT CAN-bus sensors. Both consignments safely within +2°C to +8°C window.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs text-emerald-400 bg-navy-950 px-3 py-2 rounded-lg border border-surface-border shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span>100% SPEC COMPLIANCE</span>
        </div>
      </div>

      {/* Cargo Manifest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cargoManifest.map((item) => (
          <div
            key={item.id}
            className="bg-navy-850 rounded-xl p-5 border border-surface-border shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400">{item.id}</span>
                  <h3 className="font-bold text-white text-sm mt-0.5 leading-snug">{item.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    item.priority === 'CRITICAL'
                      ? 'bg-red-950 text-red-300 border-red-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}
                >
                  {item.priority}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400 mb-2">
                Category: <strong className="text-slate-200">{item.category}</strong> • Weight: {item.weightTonnes} T
              </div>

              {item.temperatureControlled && (
                <div className="bg-navy-950 p-2.5 rounded-lg border border-cyan-900/60 font-mono text-xs space-y-1 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">CURRENT TEMPERATURE</span>
                    <span className="text-cyan-400 font-bold">{item.currentTempC}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">SPEC TARGET:</span>
                    <span className="text-slate-300">{item.targetTempRange}</span>
                  </div>
                </div>
              )}

              <div className="bg-navy-950 p-2 rounded text-xs font-mono border border-surface-border text-slate-300">
                <div>From: <strong className="text-white">{item.origin}</strong></div>
                <div>To: <strong className="text-cyan-300">{item.destination}</strong></div>
              </div>
            </div>

            <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Mission: #{item.boundMission}</span>
              <button
                onClick={() => onNavigate('missions')}
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Track Mission →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
