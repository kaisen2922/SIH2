import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  AlertTriangle,
  TrendingUp,
  Compass,
  Navigation,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Radio,
  Gauge,
  Droplets,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { Vehicle } from '../types';
import { PredictiveEtaCard } from '../components/common/PredictiveEtaCard';
import { RegionalMap } from '../components/map/RegionalMap';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface FleetPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const FleetPage: React.FC<FleetPageProps> = ({ onNavigate }) => {
  const { vehicles, selectedVehicle, selectVehicle } = useIncident();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredVehicles = vehicles.filter((v) => {
    if (filterStatus === 'ALL') return true;
    return v.status === filterStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
              FLEET INTELLIGENCE
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Active vehicle tracking, telematics diagnostics, and proactive delay forecasting across NER
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono">
          {['ALL', 'ON_ROUTE', 'AT_RISK', 'DELAYED', 'STOPPED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterStatus === st
                  ? 'bg-brand-blue text-white'
                  : 'bg-navy-900 text-slate-400 hover:bg-navy-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Predictive ETA Decomposition Card for Selected Vehicle (Screen 7) */}
      {selectedVehicle && (
        <PredictiveEtaCard vehicle={selectedVehicle} />
      )}

      {/* Main Layout: Vehicle List (Left) + Interactive Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vehicle List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>REGISTERED TRANSPORTS ({filteredVehicles.length})</span>
            <span>SORT: RISK FIRST</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredVehicles.map((veh) => {
              const isSelected = selectedVehicle?.id === veh.id;
              const statusColor =
                veh.status === 'AT_RISK'
                  ? 'text-amber-400 bg-amber-950/80 border-amber-700/60'
                  : veh.status === 'STOPPED'
                  ? 'text-red-400 bg-red-950/80 border-red-700/60'
                  : veh.status === 'DELAYED'
                  ? 'text-orange-400 bg-orange-950/80 border-orange-700/60'
                  : 'text-emerald-400 bg-emerald-950/80 border-emerald-700/60';

              return (
                <div
                  key={veh.id}
                  onClick={() => selectVehicle(veh)}
                  className={`bg-navy-850 rounded-xl p-4 border transition-all cursor-pointer shadow-md hover:bg-navy-800 ${
                    isSelected
                      ? 'border-brand-blue ring-2 ring-brand-blue/50 bg-navy-800'
                      : 'border-surface-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <h3 className="font-bold text-white text-sm">{veh.name}</h3>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{veh.regNumber} • {veh.type}</span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${statusColor}`}>
                      {veh.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-mono flex items-center space-x-2 my-2 bg-navy-950 p-2 rounded border border-surface-border">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{veh.origin}</span>
                    <span className="text-slate-500">→</span>
                    <span className="font-bold text-white">{veh.destination}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 my-2">
                    <div>
                      <span className="text-[9px] block text-slate-500">SPEED</span>
                      <span className="text-white font-bold">{veh.currentSpeedKmh} km/h</span>
                    </div>
                    <div>
                      <span className="text-[9px] block text-slate-500">AI ETA</span>
                      <span className="text-amber-300 font-bold">{veh.eta}</span>
                    </div>
                    <div>
                      <span className="text-[9px] block text-slate-500">ROUTE RISK</span>
                      <span
                        className={`font-bold ${
                          veh.routeRisk === 'CRITICAL' || veh.routeRisk === 'HIGH'
                            ? 'text-red-400'
                            : veh.routeRisk === 'MODERATE'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {veh.routeRisk}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 truncate mb-2">
                    <span className="text-slate-500">Cargo:</span> <span className="text-slate-200">{veh.cargo}</span>
                  </div>

                  <div className="bg-navy-950 p-2 rounded text-[11px] text-red-300 border border-surface-border flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="truncate">Next: {veh.nextRisk}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map & Live Telematics Details (7 cols) */}
        <div className="lg:col-span-7 bg-navy-800 border border-surface-border rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-3 bg-navy-900 border-b border-surface-border flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              FLEET GEOLOCATION & MOUNTAIN CORRIDOR TRACKING
            </span>
            <span className="text-xs font-mono text-cyan-400">
              Tracking #{selectedVehicle?.regNumber}
            </span>
          </div>

          <div className="h-[440px] w-full">
            <RegionalMap
              heightClass="h-full"
              onNavigateToModule={onNavigate}
              showInspectorByDefault={false}
            />
          </div>

          {/* Telematics Bottom Bar */}
          {selectedVehicle && (
            <div className="p-4 bg-navy-900 border-t border-surface-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">DRIVER & CONTACT</span>
                <span className="text-white font-bold">{selectedVehicle.driverName}</span>
                <span className="text-slate-400 block text-[10px]">{selectedVehicle.driverContact}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">FUEL RESERVE</span>
                <span className="text-cyan-400 font-bold">{selectedVehicle.fuelPct}% Capacity</span>
                <span className="text-slate-400 block text-[10px]">Tanker certified</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ODOMETER</span>
                <span className="text-white font-bold">{selectedVehicle.odometerKm.toLocaleString()} km</span>
                <span className="text-slate-400 block text-[10px]">Maintenance nominal</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ACTION</span>
                <button
                  onClick={() => onNavigate('field-app', { vehicleId: selectedVehicle.id })}
                  className="bg-brand-blue hover:bg-blue-600 text-white px-2.5 py-1 rounded text-[11px] font-bold mt-1 w-full"
                >
                  Driver Comm Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
