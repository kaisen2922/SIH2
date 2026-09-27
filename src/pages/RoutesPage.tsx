import React, { useState } from 'react';
import {
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Truck,
  Layers,
  ChevronRight,
  Info,
  Calendar,
  Compass,
  FileCheck2,
  RefreshCw,
  AlertOctagon,
  Sparkles,
  Smartphone,
  Eye,
  Radio,
  Sliders,
  Check,
  XCircle,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { ElevationProfileChart } from '../components/routes/ElevationProfileChart';
import { DataStatusBadge } from '../components/common/DataStatusBadge';
import { RegionalMap } from '../components/map/RegionalMap';
import { MissionType, RoadSegment } from '../types';

interface RoutesPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({ onNavigate }) => {
  const {
    routes,
    selectedRoute,
    selectRoute,
    selectedMission,
    selectMission,
    missions,
    vehicles,
    selectedVehicle,
    selectVehicle,
    roadSegments,
    activeMissionType,
    setActiveMissionType,
    dynamicRouteResults,
    recommendedRouteResult,
    routeApprovalStatus,
    approvedRouteId,
    approveRoute,
    rejectRoute,
    dispatchedToDriverAt,
    rerouteAlert,
    approveReroute,
    triggerLandslideSpike,
    runEndToEndDemo,
    currentRole,
    canApproveRoute,
  } = useIncident();

  // Form State initialized to mission specs
  const [cargoType, setCargoType] = useState(selectedMission.cargo || 'Emergency Medicines');
  const [origin, setOrigin] = useState(selectedMission.origin || 'Guwahati');
  const [destination, setDestination] = useState(selectedMission.destination || 'Imphal');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [officerNotes, setOfficerNotes] = useState('');
  const [isSuccessBannerVisible, setIsSuccessBannerVisible] = useState(false);

  // Active Mission Types options (Section 6)
  const missionTypes: MissionType[] = [
    'Emergency Medicine',
    'Food Supply',
    'Fuel Supply',
    'Relief Materials',
    'Normal Cargo',
    'Personnel Transport',
  ];

  const handleApprove = (routeId: string) => {
    approveRoute(routeId, officerNotes || 'Route approved via multi-criteria dispatch optimization');
    setIsSuccessBannerVisible(true);
    setTimeout(() => setIsSuccessBannerVisible(false), 5000);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoute) {
      rejectRoute(selectedRoute.id, rejectReason || 'Officer requested alternate mountain avoidance');
      setIsRejectModalOpen(false);
      setRejectReason('');
    }
  };

  // Find currently active route result
  const currentResult = dynamicRouteResults.find((d) => d.routeId === selectedRoute?.id) || dynamicRouteResults[0];
  const recommendedResult = recommendedRouteResult || dynamicRouteResults.find((d) => d.status === 'RECOMMENDED') || dynamicRouteResults[2];

  // Selected route segments
  const selectedSegments = selectedRoute?.segmentIds
    ? roadSegments.filter((s) => selectedRoute.segmentIds?.includes(s.segment_id))
    : roadSegments.filter((s) => s.segment_id.startsWith('NH27') || s.segment_id.startsWith('NH54'));

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
              DYNAMIC ROUTE INTELLIGENCE & DISPATCH
            </h1>
            <DataStatusBadge type="MODEL_ESTIMATE" />
            <span className="bg-brand-blue/20 text-brand-cyan border border-brand-blue/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
              RISK-AWARE ROUTING
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Segment-level hazard scoring, vehicle clearance constraints, and human-in-the-loop authorization
          </p>
        </div>

        {/* Demo & Quick Access Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runEndToEndDemo}
            className="bg-brand-blue hover:bg-blue-600 text-white font-mono font-bold text-xs px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1.5 shadow-md shadow-brand-blue/30"
            title="Run 10-step full operational simulation"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>[ RUN DEMO ]</span>
          </button>

          <button
            onClick={triggerLandslideSpike}
            className="bg-amber-600 hover:bg-amber-500 text-navy-950 font-mono font-bold text-xs px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 shadow-md shadow-amber-600/30"
            title="Demonstrate dynamic reroute trigger: Route C landslide spikes 18% -> 76%"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>TRIGGER HAZARD SPIKE</span>
          </button>

          <button
            onClick={() => onNavigate('field-app')}
            className="bg-navy-900 hover:bg-navy-850 text-cyan-300 border border-cyan-800/60 font-mono text-xs font-semibold px-3 py-2 rounded-lg transition-all flex items-center space-x-1"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Driver App</span>
          </button>

          <button
            onClick={() => onNavigate('citizen-app')}
            className="bg-navy-900 hover:bg-navy-850 text-amber-300 border border-amber-800/60 font-mono text-xs font-semibold px-3 py-2 rounded-lg transition-all flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Citizen Safety</span>
          </button>
        </div>
      </div>

      {/* Dynamic Reroute Alert Banner (Section 15 & 31) */}
      {rerouteAlert && rerouteAlert.detected && (
        <div className="bg-gradient-to-r from-red-950/90 via-amber-950/90 to-navy-900 border-2 border-red-600 rounded-xl p-4 shadow-2xl animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-extrabold uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                    ROUTE CHANGE DETECTED
                  </span>
                  <span className="text-red-300 font-mono text-xs font-bold">
                    Risk Spiked: {rerouteAlert.oldRiskPct}% → {rerouteAlert.newRiskPct}%
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base mt-1">
                  Active Hazard on {rerouteAlert.previousRouteName}: {rerouteAlert.reason}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  AI routing engine recalculated network cost. <strong>{rerouteAlert.newRouteName}</strong> is now recommended as the safest alternative corridor.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={approveReroute}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-lg shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>REVIEW & APPROVE REROUTE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Authorization Toast */}
      {isSuccessBannerVisible && (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 p-3.5 rounded-xl flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>ROUTE APPROVED BY OFFICER — TELEMATICS PACKET TRANSMITTED TO DRIVER CONSOLE</span>
          </div>
          <button
            onClick={() => onNavigate('field-app')}
            className="text-xs text-white underline font-mono hover:text-emerald-300"
          >
            Inspect Driver App View →
          </button>
        </div>
      )}

      {/* Mission Dispatch Configuration (Section 6 & 7) */}
      <div className="bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-brand-cyan" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              MISSION-AWARE ROUTING CONFIGURATION
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-slate-400">ASSIGNED:</span>
            <span className="text-xs font-mono font-bold text-white">#{selectedMission.missionNo}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Mission Type (Section 6) */}
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
              MISSION TYPE (ROUTING PRIORITY)
            </label>
            <select
              value={activeMissionType}
              onChange={(e) => setActiveMissionType(e.target.value as MissionType)}
              className="w-full bg-navy-950 border border-cyan-800/80 rounded-lg text-xs font-bold text-cyan-300 px-3 py-2 outline-none focus:border-brand-blue"
            >
              {missionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Assignment & Constraints (Section 7) */}
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
              VEHICLE & SPECIFICATIONS
            </label>
            <select
              value={selectedVehicle?.id || 'veh-07'}
              onChange={(e) => {
                const found = vehicles.find((v) => v.id === e.target.value);
                if (found) selectVehicle(found);
              }}
              className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs font-medium text-white px-3 py-2 outline-none focus:border-brand-blue"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.type})
                </option>
              ))}
            </select>
          </div>

          {/* Origin */}
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
              DISPATCH ORIGIN
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs font-medium text-white px-3 py-2 outline-none focus:border-brand-blue"
            >
              <option value="Guwahati">Guwahati (Apex Regional Hub)</option>
              <option value="Silchar">Silchar (Barak Valley Depot)</option>
              <option value="Dimapur">Dimapur Railhead Staging</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
              FINAL DESTINATION
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs font-medium text-white px-3 py-2 outline-none focus:border-brand-blue"
            >
              <option value="Imphal">Imphal Regional Civil Hospital</option>
              <option value="Kohima">Kohima District Supply Store</option>
              <option value="Aizawl">Aizawl Emergency Center</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
              DELIVERY PRIORITY
            </label>
            <div className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs font-mono font-bold text-amber-300 px-3 py-2 flex items-center justify-between">
              <span>{selectedMission.priority}</span>
              <span className="text-[10px] text-slate-400 font-normal">Cold-Chain Req</span>
            </div>
          </div>
        </div>

        {/* Priority Explanation Badge */}
        <div className="bg-navy-950/70 p-2.5 rounded-lg border border-surface-border flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-300">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              Priority Profile for <strong>{activeMissionType}</strong>: Safety Weight: 40% • Disruption Weight: 25% • ETA Weight: 20%
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase">Multi-Criteria Active</span>
        </div>
      </div>

      {/* Embedded Regional Map (Section 3) */}
      <div className="bg-navy-900 border border-surface-border rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-brand-cyan" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              REGIONAL CORRIDOR GIS MAP & ROUTE ALTERNATIVES
            </h2>
            <DataStatusBadge type="MODEL_ESTIMATE" />
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
            <span>Click road segments to inspect risk values or mark blockages</span>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="rounded-lg overflow-hidden border border-surface-border shadow-inner">
          <RegionalMap
            heightClass="h-[440px]"
            showInspectorByDefault={false}
            highlightRouteId={selectedRoute?.id}
            showRouteAlternatives={true}
            onNavigateToModule={onNavigate}
          />
        </div>
      </div>

      {/* 3 Route Options Comparison Panel (Section 8) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              CALCULATED ROUTE ALTERNATIVES ({dynamicRouteResults.length} AVAILABLE)
            </h2>
            <DataStatusBadge type="MODEL_ESTIMATE" />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Evaluated for vehicle: <strong className="text-white">{selectedVehicle?.type || 'Heavy Truck'}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dynamicRouteResults.map((result) => {
            const isSelected = selectedRoute?.id === result.routeId;
            const isRecommended = result.status === 'RECOMMENDED' || result.routeId === recommendedResult?.routeId;
            const isAvoid = result.status === 'AVOID';
            const isNotSuitable = result.status === 'NOT_SUITABLE';

            return (
              <div
                key={result.routeId}
                onClick={() => {
                  const r = routes.find((rt) => rt.id === result.routeId);
                  if (r) selectRoute(r);
                }}
                className={`relative rounded-xl p-5 border flex flex-col justify-between cursor-pointer transition-all shadow-xl ${
                  isSelected
                    ? 'bg-navy-900 border-brand-cyan ring-2 ring-brand-cyan/40 scale-[1.01]'
                    : isRecommended
                    ? 'bg-navy-900/90 border-emerald-500/80'
                    : isAvoid
                    ? 'bg-navy-800/80 border-red-800/60'
                    : 'bg-navy-800/80 border-surface-border'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-sm font-extrabold text-white">
                      {result.routeId === 'route-a' && 'ROUTE A'}
                      {result.routeId === 'route-b' && 'ROUTE B'}
                      {result.routeId === 'route-c' && 'ROUTE C'}
                    </span>

                    {isRecommended ? (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>RECOMMENDED</span>
                      </span>
                    ) : isNotSuitable ? (
                      <span className="bg-red-950 text-red-300 border border-red-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        NOT SUITABLE
                      </span>
                    ) : isAvoid ? (
                      <span className="bg-red-950 text-red-300 border border-red-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        AVOID (HIGH RISK)
                      </span>
                    ) : (
                      <span className="bg-amber-950 text-amber-300 border border-amber-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        ALTERNATIVE
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-xs mb-1 leading-snug">
                    {result.name}
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-mono block mb-3">
                    {result.corridor}
                  </span>

                  {/* 5 Core Metrics (Section 8: ETA, RISK, DISRUPTION, DELAY, DISTANCE) */}
                  <div className="grid grid-cols-3 gap-2 bg-navy-950 p-2.5 rounded-lg border border-surface-border text-center font-mono mb-3">
                    <div>
                      <span className="text-slate-400 text-[9px] block">ETA</span>
                      <span className="font-bold text-white text-xs">{result.eta}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">RISK</span>
                      <span
                        className={`font-bold text-xs ${
                          result.riskScorePct >= 70
                            ? 'text-red-400'
                            : result.riskScorePct >= 35
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {result.riskScorePct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">DISRUPTION</span>
                      <span className="font-bold text-cyan-400 text-xs">{result.disruptionExposurePct}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">DELAY</span>
                      <span className="font-bold text-slate-300 text-xs">+{result.delayMinutes}m</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">DISTANCE</span>
                      <span className="font-bold text-slate-300 text-xs">{result.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">NETWORK COST</span>
                      <span className="font-bold text-slate-400 text-xs">{result.cost}</span>
                    </div>
                  </div>

                  {/* Suitability Warning if any */}
                  {result.unsuitableReason && (
                    <div className="bg-red-950/60 border border-red-700/80 p-2 rounded-lg text-red-200 text-xs font-mono mb-3 flex items-start space-x-1.5">
                      <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span>{result.unsuitableReason}</span>
                    </div>
                  )}

                  {/* Primary Reasons Preview */}
                  <div className="space-y-1 mb-4">
                    {result.explanation.primaryReasons.slice(0, 2).map((reason, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-slate-300 text-[11px]">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span className="leading-tight">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const r = routes.find((rt) => rt.id === result.routeId);
                    if (r) selectRoute(r);
                  }}
                  className={`w-full py-2 rounded-lg font-mono font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 ${
                    isSelected
                      ? 'bg-brand-blue text-white shadow-md'
                      : isRecommended
                      ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                      : 'bg-navy-950 hover:bg-navy-850 text-slate-300 border border-surface-border'
                  }`}
                >
                  <span>{isSelected ? 'CURRENTLY SELECTED' : isRecommended ? 'SELECT RECOMMENDED' : 'COMPARE ROUTE'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* "WHY THIS ROUTE?" Transparent Explanation (Section 9 - MANDATORY) */}
      <div className="bg-navy-900 border border-surface-border rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              WHY THIS ROUTE? — TRANSPARENT MULTI-CRITERIA RATIONALE
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-700 font-bold">
            ANALYZING: {currentResult.name.split('—')[0]}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Key Advantages Checklist */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              VERIFIED OPERATIONAL ADVANTAGES
            </span>
            <div className="space-y-1.5">
              {currentResult.explanation.primaryReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-navy-950 p-2 rounded-lg border border-surface-border text-xs text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trade-off & Avoided Hazards */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                OPERATIONAL TRADE-OFF
              </span>
              <div className="bg-amber-950/40 border border-amber-700/60 p-3 rounded-lg text-amber-200 text-xs font-mono leading-relaxed">
                {currentResult.explanation.tradeOff}
              </div>
            </div>

            {currentResult.explanation.avoidedHazards.length > 0 && (
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                  CRITICAL HAZARDS AVOIDED
                </span>
                <div className="space-y-1.5">
                  {currentResult.explanation.avoidedHazards.map((haz, idx) => (
                    <div key={idx} className="bg-navy-950 p-2.5 rounded-lg border border-red-900/60 text-xs">
                      <strong className="text-red-400 block font-mono">{haz.location}</strong>
                      <span className="text-slate-300 text-[11px]">{haz.hazard}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[10px] text-slate-400 font-mono border-t border-surface-border pt-2 italic">
              Architecture principle: AI/ML predicts hazard & disruption probabilities. Routing engine calculates network cost. Authorized officer executes decision.
            </div>
          </div>
        </div>
      </div>

      {/* Officer Decision & Approval Workflow (Section 10) */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-850 border border-surface-border rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              OFFICER DECISION & DISPATCH WORKFLOW
            </h3>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400">AUTHORITY:</span>
            <span className="text-cyan-300 font-bold uppercase">{currentRole.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-navy-950 p-4 rounded-xl border border-surface-border">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-mono text-xs text-slate-400">RECOMMENDED ROUTE:</span>
              <span className="font-mono font-bold text-white text-sm">{recommendedResult.name}</span>
            </div>
            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
              <span>Risk: <strong className="text-emerald-400">{recommendedResult.riskScorePct}%</strong></span>
              <span>•</span>
              <span>ETA: <strong className="text-white">{recommendedResult.eta}</strong></span>
              <span>•</span>
              <span>Disruption Exposure: <strong className="text-cyan-400">{recommendedResult.disruptionExposurePct}%</strong></span>
              <span>•</span>
              <span>
                Status:{' '}
                <strong
                  className={
                    routeApprovalStatus === 'APPROVED' ? 'text-emerald-400 uppercase' : 'text-amber-400 uppercase'
                  }
                >
                  {routeApprovalStatus === 'APPROVED' ? `APPROVED (Dispatched at ${dispatchedToDriverAt})` : 'PENDING REVIEW'}
                </strong>
              </span>
            </div>
          </div>

          {/* Action Buttons (Section 10) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleApprove(recommendedResult.routeId)}
              disabled={routeApprovalStatus === 'APPROVED'}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-mono font-bold text-xs px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{routeApprovalStatus === 'APPROVED' ? 'ROUTE APPROVED & DISPATCHED' : 'APPROVE ROUTE'}</span>
            </button>

            <button
              onClick={() => {
                const nextRoute = routes.find((r) => r.id !== recommendedResult.routeId);
                if (nextRoute) selectRoute(nextRoute);
              }}
              className="bg-navy-900 hover:bg-navy-800 text-slate-200 border border-surface-border font-mono text-xs px-4 py-2.5 rounded-lg transition-colors"
            >
              VIEW ALTERNATIVES
            </button>

            <button
              onClick={() => setIsRejectModalOpen(true)}
              className="bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/60 font-mono text-xs px-3.5 py-2.5 rounded-lg transition-colors"
            >
              REJECT
            </button>
          </div>
        </div>

        {routeApprovalStatus === 'APPROVED' && (
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-navy-950/60 px-3 py-2 rounded-lg border border-surface-border">
            <span>
              ✓ Route active in telematics feed. Driver Console receives turn-by-turn waypoint updates.
            </span>
            <button
              onClick={() => onNavigate('field-app')}
              className="text-cyan-400 underline font-bold hover:text-cyan-300"
            >
              Open Driver Console →
            </button>
          </div>
        )}
      </div>

      {/* Segment-by-Segment Risk Breakdown Table (Section 4) */}
      <div className="bg-navy-900 border border-surface-border rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              ROAD NETWORK SEGMENTS ALONG {currentResult.name.split('—')[0]} ({selectedSegments.length} SEGMENTS)
            </h3>
          </div>
          <DataStatusBadge type="MODEL_ESTIMATE" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-surface-border text-slate-400 text-[10px] uppercase">
                <th className="py-2 px-3">Segment ID</th>
                <th className="py-2 px-3">Road</th>
                <th className="py-2 px-3">Stretch</th>
                <th className="py-2 px-3">Dist.</th>
                <th className="py-2 px-3">Speed</th>
                <th className="py-2 px-3">Landslide</th>
                <th className="py-2 px-3">Flood</th>
                <th className="py-2 px-3">Condition</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-slate-200">
              {selectedSegments.map((seg) => (
                <tr key={seg.segment_id} className="hover:bg-navy-850 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-cyan-300">{seg.segment_id}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{seg.road_name}</td>
                  <td className="py-2.5 px-3 text-slate-300">{seg.start_node} → {seg.end_node}</td>
                  <td className="py-2.5 px-3">{seg.distance_km} km</td>
                  <td className="py-2.5 px-3">{seg.current_speed} km/h</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-bold ${
                        seg.landslide_risk >= 0.65
                          ? 'text-red-400'
                          : seg.landslide_risk >= 0.35
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {Math.round(seg.landslide_risk * 100)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-bold ${
                        seg.flood_risk >= 0.5 ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      {Math.round(seg.flood_risk * 100)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {seg.road_condition_label}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        seg.closure_status
                          ? 'bg-red-950 text-red-300 border border-red-700'
                          : seg.disruption_exposure >= 0.65
                          ? 'bg-orange-950 text-orange-300 border border-orange-700'
                          : seg.disruption_exposure >= 0.30
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      }`}
                    >
                      {seg.closure_status
                        ? 'BLOCKED'
                        : seg.disruption_exposure >= 0.65
                        ? 'HIGH RISK'
                        : seg.disruption_exposure >= 0.30
                        ? 'MODERATE'
                        : 'NORMAL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Elevation Profile & Topography Section */}
      {selectedRoute && (
        <ElevationProfileChart route={selectedRoute} />
      )}

      {/* Reject Route Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-surface-border rounded-xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
              <span className="font-mono text-xs font-bold text-white uppercase">
                REJECT ROUTE RECOMMENDATION
              </span>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">
                  OFFICIAL REJECTION RATIONALE
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify operational reason (e.g., bridge clearance concern, local curfew, convoy protocol)..."
                  className="w-full bg-navy-950 border border-surface-border rounded-lg p-2.5 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 bg-navy-950 text-slate-300 text-xs rounded-lg border border-surface-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
