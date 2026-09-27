import React, { useState } from 'react';
import { Database, X, ShieldCheck, CheckCircle2, Clock, Layers, FileText } from 'lucide-react';
import { DataStatusBadge } from './DataStatusBadge';

interface ProvenanceEntry {
  layer: string;
  source: string;
  provider: string;
  lastUpdated: string;
  resolution: string;
  processing: string;
  modelVersion: string;
  status: 'LIVE' | 'STATIC' | 'HISTORICAL' | 'DEMO / SIMULATION';
}

const DEFAULT_PROVENANCE_ENTRIES: ProvenanceEntry[] = [
  {
    layer: 'Precipitation Nowcast & High-Res Radar',
    source: 'Doppler Weather Radar (Guwahati & Agartala S-Band)',
    provider: 'India Meteorological Department (IMD) / MOSDAC',
    lastUpdated: '12 sec ago (Continuous Feed)',
    resolution: '500m radial grid / 10-min sweeps',
    processing: 'Reflectivity (Z-R) kinematic rain rate extrapolation',
    modelVersion: 'IMD-HighRes-v3.2',
    status: 'LIVE',
  },
  {
    layer: 'Mountain Topography & Slope Stability',
    source: 'Cartosat-3 / ALOS PALSAR High-Resolution DEM',
    provider: 'ISRO National Remote Sensing Centre (NRSC) / Bhuvan',
    lastUpdated: 'Static Hydro-geomorphology Baseline 2026',
    resolution: '12.5m terrain raster DEM',
    processing: 'Slope aspect, curvature & landslide susceptibility mapping',
    modelVersion: 'Bhuvan-NER-Slope-v2.1',
    status: 'STATIC',
  },
  {
    layer: 'Historical Landslide & Debris Flow Registry',
    source: 'Geological Survey of India (GSI) North-East Landslide Compendium (2015–2026)',
    provider: 'GSI North Eastern Region & State Disaster Management Authorities',
    lastUpdated: 'Monsoon 2026 Pre-Season Review',
    resolution: 'Corridor Marker-Post GIS Precision (10m)',
    processing: 'Empirical rainfall threshold analysis & historical recurrence weights',
    modelVersion: 'GSI-HistLandslide-v4',
    status: 'HISTORICAL',
  },
  {
    layer: 'Roadbed Geophone & Soil Saturation Telemetry',
    source: 'IoT Slope Inclinometers, Geophones & Ultrasonic Stream Gauges',
    provider: 'NER Disaster Sensor Mesh (ESP32/LoRa)',
    lastUpdated: '1 min ago (Simulated telemetry)',
    resolution: 'Spot sensor nodes along NH-29 & NH-6 passes',
    processing: 'Multi-sensor threshold fusion & anomaly detection',
    modelVersion: 'NERFLOW-IoT-v1.4',
    status: 'DEMO / SIMULATION',
  },
  {
    layer: 'Commercial Fleet Telematics & GPS Speeds',
    source: 'AIS-140 Certified On-board Freight Telematics Gateway',
    provider: 'MoRTH National Logistics Portal & Fleet Operators',
    lastUpdated: '5 sec ago (Continuous)',
    resolution: 'Vehicle GPS point locations & CAN-bus speeds',
    processing: 'Kalman speed filtering & predictive corridor delay estimation',
    modelVersion: 'FleetTrack-v2026.1',
    status: 'LIVE',
  },
];

export const DataProvenanceModal: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen || internalOpen;

  if (!open) return null;

  const handleClose = () => {
    if (onClose) onClose();
    else setInternalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-surface-border rounded-xl max-w-4xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-surface-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white font-mono">
                  Data Lineage & Algorithmic Provenance
                </h3>
                <DataStatusBadge type="LIVE" />
              </div>
              <p className="text-xs text-slate-400">
                Transparent verification of all spatial, weather, sensor, and model telemetry powering NERFLOW AI
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Methodology Overview Banner */}
        <div className="bg-navy-950 p-4 rounded-lg border border-surface-border flex items-start space-x-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-200 uppercase font-mono tracking-wider">
              TRUST & VERIFIABILITY GUARANTEE
            </span>
            <p className="text-slate-400 leading-relaxed">
              NERFLOW AI enforces strict separation between real-time authoritative feeds (IMD, GPS, NHIDCL)
              and simulated research/prototype layers. Any simulated or demo data is explicitly flagged with
              transparent badges to prevent misleading operational decisions.
            </p>
          </div>
        </div>

        {/* Provenance Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>REGISTERED DATA PIPELINES ({DEFAULT_PROVENANCE_ENTRIES.length})</span>
            <span>SYSTEM CONTEXT: NORTH EASTERN REGION (NER)</span>
          </div>

          <div className="border border-surface-border rounded-lg overflow-hidden divide-y divide-surface-border bg-navy-950/50">
            {DEFAULT_PROVENANCE_ENTRIES.map((entry, idx) => (
              <div key={idx} className="p-3.5 space-y-2 hover:bg-navy-850/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-bold text-white text-xs">{entry.layer}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase w-fit ${
                      entry.status === 'LIVE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70'
                        : entry.status === 'STATIC'
                        ? 'bg-blue-950 text-blue-300 border border-blue-600/70'
                        : entry.status === 'HISTORICAL'
                        ? 'bg-slate-900 text-slate-300 border border-slate-700'
                        : 'bg-amber-950 text-amber-300 border border-amber-600/70'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">SOURCE & SENSOR</span>
                    <span className="text-slate-200">{entry.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">OFFICIAL PROVIDER</span>
                    <span className="text-slate-200">{entry.provider}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">RESOLUTION / INTERVAL</span>
                    <span className="text-slate-200">{entry.resolution}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MODEL / PROCESSING</span>
                    <span className="text-cyan-400">{entry.processing}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-750 text-slate-200 text-xs font-medium rounded-lg border border-surface-border transition-colors"
          >
            Close Provenance Audit
          </button>
        </div>
      </div>
    </div>
  );
};
