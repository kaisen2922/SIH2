import React, { useState } from 'react';
import {
  PackageCheck,
  AlertTriangle,
  XCircle,
  Truck,
  ShieldAlert,
  Boxes,
  Navigation,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  ExternalLink,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  FileCheck2,
  RefreshCw,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { RegionalMap } from '../components/map/RegionalMap';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';
import { KpiFilterType } from '../types';

interface DashboardPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const {
    missions,
    selectedMission,
    corridors,
    vehicles,
    incidents,
    supplyItems,
    alerts,
    roadSegments,
    kpiFilter,
    setKpiFilter,
    rerouteAlert,
    approveReroute,
    routeApprovalStatus,
  } = useIncident();

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Top Metrics from prompt:
  // ACTIVE MISSIONS: 42, AT RISK: 7, DISRUPTED: 2, ACTIVE VEHICLES: 86, ROAD INCIDENTS: 14, SUPPLY WARNINGS: 5
  const topMetrics: Array<{
    label: string;
    filterType: KpiFilterType;
    value: number;
    sublabel: string;
    icon: any;
    color: string;
    borderColor: string;
    actionTab: string;
  }> = [
    {
      label: 'ACTIVE MISSIONS',
      filterType: 'ACTIVE_MISSIONS',
      value: 42,
      sublabel: 'Trans-NER Corridors',
      icon: PackageCheck,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-800/60',
      actionTab: 'missions',
    },
    {
      label: 'AT RISK',
      filterType: 'AT_RISK',
      value: 7,
      sublabel: 'Landslide / Flood Exposure',
      icon: AlertTriangle,
      color: 'text-amber-400',
      borderColor: 'border-amber-800/60',
      actionTab: 'missions',
    },
    {
      label: 'DISRUPTED',
      filterType: 'DISRUPTED',
      value: 2,
      sublabel: 'Rerouting Active',
      icon: XCircle,
      color: 'text-red-400',
      borderColor: 'border-red-800/60',
      actionTab: 'emergency',
    },
    {
      label: 'ACTIVE VEHICLES',
      filterType: 'ACTIVE_VEHICLES',
      value: 86,
      sublabel: 'Live Telematics',
      icon: Truck,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-800/60',
      actionTab: 'fleet',
    },
    {
      label: 'ROAD INCIDENTS',
      filterType: 'ROAD_INCIDENTS',
      value: 14,
      sublabel: 'Verified by Field/AI',
      icon: ShieldAlert,
      color: 'text-orange-400',
      borderColor: 'border-orange-800/60',
      actionTab: 'reports',
    },
    {
      label: 'SUPPLY WARNINGS',
      filterType: 'SUPPLY_WARNINGS',
      value: 5,
      sublabel: 'Fuel & Medicine Reserves',
      icon: Boxes,
      color: 'text-purple-400',
      borderColor: 'border-purple-800/60',
      actionTab: 'supply',
    },
  ];

  const handleKpiClick = (filterType: KpiFilterType) => {
    if (kpiFilter === filterType) {
      setKpiFilter('ALL');
    } else {
      setKpiFilter(filterType);
    }
  };

  const handleExecuteReroute = () => {
    approveReroute();
    setActionNotice('Reroute approved! Dispatched updated Route B coordinates to Vehicle #V-401.');
    setTimeout(() => setActionNotice(null), 4000);
    onNavigate('routes');
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-navy-950 min-h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
              Regional Logistics Command Center
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time accessibility intelligence, multi-modal disruption forecasting, and mission management
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigate('routes')}
            className="bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-brand-blue/30"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Plan Logistics Mission</span>
          </button>
          <button
            onClick={() => onNavigate('map')}
            className="bg-navy-900 hover:bg-navy-850 text-cyan-300 border border-cyan-800/60 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
          >
            <span>Full GIS Map</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 6 Metrics Grid - Interactive Toggles (Section 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {topMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const isSelected = kpiFilter === metric.filterType;
          return (
            <div
              key={idx}
              onClick={() => handleKpiClick(metric.filterType)}
              className={`rounded-xl p-3.5 flex flex-col justify-between cursor-pointer transition-all shadow-md group relative overflow-hidden ${
                isSelected
                  ? 'bg-navy-750 border-2 border-brand-cyan ring-2 ring-brand-cyan/40 scale-[1.02]'
                  : `bg-navy-800 border ${metric.borderColor} hover:bg-navy-750`
              }`}
              title={`Click to filter map and focus by ${metric.label}`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-brand-cyan text-navy-950 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-bl uppercase">
                  FILTER ON
                </div>
              )}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider truncate pr-2">
                  {metric.label}
                </span>
                <Icon className={`w-4 h-4 ${metric.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="my-1">
                <span className={`text-2xl sm:text-3xl font-mono font-extrabold ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="truncate">{metric.sublabel}</span>
                <span className="text-cyan-400 text-[9px] font-bold group-hover:underline">FILTER</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Active Notification Banner */}
      {kpiFilter !== 'ALL' && (
        <div className="bg-brand-blue/20 border border-brand-cyan/70 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-bold">OPERATIONAL FILTER ACTIVE:</span>
            <span className="text-brand-cyan font-bold uppercase">{kpiFilter.replace('_', ' ')}</span>
            <span className="text-slate-300 hidden sm:inline">• Highlighting affected assets, corridors, and telematics on the map</span>
          </div>
          <button
            onClick={() => setKpiFilter('ALL')}
            className="bg-navy-900 hover:bg-navy-850 text-cyan-300 border border-cyan-700/80 px-2.5 py-1 rounded text-[11px] font-bold transition-colors"
          >
            Clear Filter (Show All)
          </button>
        </div>
      )}

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-mono flex items-center space-x-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Command Workspace: Interactive Map (Left 7 cols) + Commander 4-Question Intelligence Cockpit (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Large Interactive Regional GIS Map (7 cols) */}
        <div className="lg:col-span-7 bg-navy-800 border border-surface-border rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="px-4 py-2.5 bg-navy-900 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                INTERACTIVE REGIONAL CORRIDOR MAP (NER)
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span>8 States Connected</span>
              <span>•</span>
              <button
                onClick={() => onNavigate('map')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5"
              >
                <span>Expand GIS</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="h-[580px] w-full">
            <RegionalMap
              heightClass="h-full"
              onNavigateToModule={onNavigate}
              onSelectCorridor={(c) => onNavigate('map', { corridor: c.code })}
            />
          </div>
        </div>

        {/* Right Panel: COMMANDER OPERATIONAL INTELLIGENCE (5 cols) (Section 21) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="bg-navy-800 border-2 border-surface-border rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-orange-400" />
                <div>
                  <h3 className="font-mono font-extrabold text-sm text-white uppercase tracking-wider">
                    COMMANDER OPERATIONAL OVERVIEW
                  </h3>
                  <p className="text-[10px] text-slate-400">Real-time answers to the 4 critical command questions</p>
                </div>
              </div>
              <DataStatusBadge type="OFFICIAL_ALERT" />
            </div>

            {/* Question 1: WHERE IS THE PROBLEM? */}
            <div className="bg-navy-950 p-3 rounded-lg border border-surface-border space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-600 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  WHERE IS THE PROBLEM?
                </span>
              </div>
              <div className="pl-7 text-xs font-mono space-y-0.5">
                <div className="text-white font-bold">
                  NH-29 Dimapur–Kohima–Imphal Arterial Corridor
                </div>
                <div className="text-slate-300 text-[11px]">
                  Segment: <span className="text-cyan-300 font-bold">NH29-S1042</span> (Pagla Pahar, Nagaland Border MP 42.5)
                </div>
                <div className="text-slate-400 text-[10px]">
                  Coordinates: 25.7512° N, 93.8541° E • Elevation: 890m MSL
                </div>
              </div>
            </div>

            {/* Question 2: WHY IS IT A PROBLEM? */}
            <div className="bg-navy-950 p-3 rounded-lg border border-surface-border space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-600 text-amber-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                  WHY IS IT A PROBLEM?
                </span>
              </div>
              <div className="pl-7 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-navy-900/80 p-2 rounded border border-surface-border">
                  <span className="text-slate-400 text-[10px] block">LANDSLIDE RISK</span>
                  <span className="text-red-400 font-extrabold text-sm">74% (Severe)</span>
                </div>
                <div className="bg-navy-900/80 p-2 rounded border border-surface-border">
                  <span className="text-slate-400 text-[10px] block">PRECIPITATION</span>
                  <span className="text-cyan-400 font-bold text-sm">52 mm/h Radar</span>
                </div>
                <div className="bg-navy-900/80 p-2 rounded border border-surface-border">
                  <span className="text-slate-400 text-[10px] block">SLOPE SATURATION</span>
                  <span className="text-amber-300 font-bold text-sm">88% Volumetric</span>
                </div>
                <div className="bg-navy-900/80 p-2 rounded border border-surface-border">
                  <span className="text-slate-400 text-[10px] block">ROAD PASSABILITY</span>
                  <span className="text-orange-400 font-bold text-sm">Single-lane crawl</span>
                </div>
              </div>
            </div>

            {/* Question 3: WHAT IS AFFECTED? */}
            <div className="bg-navy-950 p-3 rounded-lg border border-surface-border space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-600 text-purple-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
                  WHAT IS AFFECTED?
                </span>
              </div>
              <div className="pl-7 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-slate-300 text-[11px] bg-navy-900/70 p-1.5 rounded">
                  <span>Critical Missions In-Flight:</span>
                  <span className="text-red-400 font-bold">3 (#NER-2042 Vaccines, #2104, #1988)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 text-[11px] bg-navy-900/70 p-1.5 rounded">
                  <span>Stranded / Approaching Fleet:</span>
                  <span className="text-amber-300 font-bold">12 Commercial Vehicles</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 text-[11px] bg-navy-900/70 p-1.5 rounded">
                  <span>Downstream Hospitals / Warehouses:</span>
                  <span className="text-white font-bold">Kohima Civil Hospital (-3.2h delay)</span>
                </div>
              </div>
            </div>

            {/* Question 4: WHAT SHOULD I DO? (Single-Click Execution Buttons) */}
            <div className="bg-navy-950 p-3 rounded-lg border-2 border-brand-cyan/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    WHAT SHOULD I DO? (SINGLE-CLICK ACTIONS)
                  </span>
                </div>
                <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700">
                  AI READY
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {/* Action 1: Re-Route Mission #2042 */}
                <button
                  onClick={handleExecuteReroute}
                  className="bg-brand-blue hover:bg-blue-600 text-white font-bold p-2.5 rounded-lg flex items-center justify-between shadow-md shadow-brand-blue/30 transition-all text-left group"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-cyan-300 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-[11px] font-bold">RE-ROUTE #2042</span>
                      <span className="block text-[9px] text-cyan-200">Via Route C (Clear)</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-200" />
                </button>

                {/* Action 2: Dispatch Inspection Team */}
                <button
                  onClick={() => onNavigate('field-teams')}
                  className="bg-navy-900 hover:bg-navy-850 text-amber-300 border border-amber-700/70 font-bold p-2.5 rounded-lg flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="block text-[11px]">DISPATCH FIELD TEAM</span>
                      <span className="block text-[9px] text-slate-400">BRO Excavator Unit</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Action 3: Broadcast Public Warning */}
                <button
                  onClick={() => onNavigate('alerts')}
                  className="bg-navy-900 hover:bg-navy-850 text-red-300 border border-red-700/70 font-bold p-2.5 rounded-lg flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <span className="block text-[11px]">BROADCAST WARNING</span>
                      <span className="block text-[9px] text-slate-400">Public SMS & App Mesh</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Action 4: Stage Emergency Relief */}
                <button
                  onClick={() => onNavigate('emergency')}
                  className="bg-navy-900 hover:bg-navy-850 text-purple-300 border border-purple-700/70 font-bold p-2.5 rounded-lg flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Boxes className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <span className="block text-[11px]">STAGE RELIEF DEPOT</span>
                      <span className="block text-[9px] text-slate-400">Dimapur Buffer Hub</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Mission Focus Bar */}
          <div className="bg-navy-850 border border-surface-border rounded-xl p-3.5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2.5">
              <Truck className="w-4 h-4 text-brand-cyan" />
              <div>
                <span className="text-slate-400 text-[10px]">FOCUSED MISSION:</span>
                <span className="text-white font-bold ml-1.5">#{selectedMission.missionNo} ({selectedMission.cargo})</span>
                <span className="text-slate-400 ml-2">ETA: <strong className="text-amber-300">{selectedMission.eta}</strong></span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('routes')}
              className="text-cyan-400 hover:text-cyan-300 underline text-[11px]"
            >
              Route Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
