import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Search,
  ChevronRight,
  Navigation,
  AlertTriangle,
  Clock,
  X,
  MapPin,
  Truck,
  Warehouse as WarehouseIcon,
  Radio,
  FileCheck2,
  CloudRain,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import {
  RoadCorridor,
  RoadSegment,
  Vehicle,
  LogisticsMission,
  SensorNode,
  IncidentReport,
  Warehouse,
  RiskLevel,
} from '../../types';
import { useIncident } from '../../context/IncidentContext';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface RegionalMapProps {
  onSelectCorridor?: (corridor: RoadCorridor) => void;
  onNavigateToModule?: (tab: string, params?: any) => void;
  heightClass?: string;
  showInspectorByDefault?: boolean;
  highlightRouteId?: string;
  showRouteAlternatives?: boolean;
  onSelectSegment?: (segment: RoadSegment) => void;
}

export const RegionalMap: React.FC<RegionalMapProps> = ({
  onSelectCorridor,
  onNavigateToModule,
  heightClass = 'h-[calc(100vh-140px)]',
  showInspectorByDefault = true,
  highlightRouteId,
  showRouteAlternatives = true,
  onSelectSegment,
}) => {
  const {
    corridors,
    selectedCorridor,
    selectCorridor,
    vehicles,
    selectedVehicle,
    selectVehicle,
    selectedMission,
    sensors,
    incidents,
    warehouses,
    routes,
    selectedRoute,
    selectRoute,
    roadSegments,
    setSegmentBlocked,
    setSegmentRoadCondition,
    kpiFilter,
    setKpiFilter,
    canControlRoads,
  } = useIncident();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer visibility toggles
  const [layers, setLayers] = useState({
    roadStatus: true,
    segments: true,
    routes: true,
    vehicles: true,
    sensors: true,
    incidents: true,
    warehouses: true,
    landslideRisk: true,
    rainfall: true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'corridor' | 'segment' | 'vehicle' | 'incident' | 'sensor' | 'warehouse';
    data: any;
  } | null>({
    type: 'corridor',
    data: selectedCorridor,
  });

  const [isLayerDropdownOpen, setIsLayerDropdownOpen] = useState(false);

  // Regional quick zoom presets
  const regionalPresets = [
    { name: 'ALL NER', center: [25.8, 92.8] as [number, number], zoom: 7 },
    { name: 'Guwahati - Imphal (Lifeline)', center: [25.5, 92.8] as [number, number], zoom: 8 },
    { name: 'Assam Valley', center: [26.2, 92.5] as [number, number], zoom: 7.5 },
    { name: 'Nagaland - Manipur', center: [25.2, 93.9] as [number, number], zoom: 8 },
    { name: 'Meghalaya Upland', center: [25.5, 91.8] as [number, number], zoom: 8.5 },
  ];

  // Tile Layer
  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
  const tileUrl = cartoApiKey
    ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoApiKey}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25.8, 92.8],
      zoom: 7,
      zoomControl: false,
    });

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Map Layers whenever data or layer toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Helper: corridor color
    const getCorridorColor = (status: RoadCorridor['status']) => {
      switch (status) {
        case 'NORMAL':
          return '#22C55E'; // Green
        case 'MODERATE_RISK':
          return '#F59E0B'; // Yellow / Amber
        case 'HIGH_RISK':
          return '#F97316'; // Orange
        case 'BLOCKED':
          return '#EF4444'; // Red
        default:
          return '#06B6D4';
      }
    };

    // Helper: segment color based on risk and closure (Section 3 & 4)
    const getSegmentColor = (seg: RoadSegment) => {
      if (seg.closure_status) return '#EF4444'; // Red - Blocked
      if (seg.disruption_exposure >= 0.65 || seg.landslide_risk >= 0.65) return '#F97316'; // Orange - High Risk
      if (seg.disruption_exposure >= 0.30 || seg.landslide_risk >= 0.30) return '#F59E0B'; // Yellow - Moderate Risk
      return '#22C55E'; // Green - Normal
    };

    // 1. Draw Road Segments (Centralized Model)
    if (layers.segments && roadSegments.length > 0) {
      roadSegments.forEach((seg) => {
        const isSelected = selectedItem?.type === 'segment' && selectedItem.data.segment_id === seg.segment_id;
        const color = getSegmentColor(seg);

        // Highlight halo for blocked or high risk segments
        if (seg.closure_status || seg.landslide_risk >= 0.65 || isSelected) {
          L.polyline([seg.start_coords, seg.end_coords], {
            color: color,
            weight: isSelected ? 12 : 9,
            opacity: 0.3,
            lineCap: 'round',
          }).addTo(group);
        }

        const polyline = L.polyline([seg.start_coords, seg.end_coords], {
          color: color,
          weight: isSelected ? 6 : 4.5,
          opacity: 0.95,
          dashArray: seg.closure_status ? '6, 6' : undefined,
        }).addTo(group);

        polyline.on('click', () => {
          setSelectedItem({ type: 'segment', data: seg });
          onSelectSegment?.(seg);
        });

        const statusLabel = seg.closure_status
          ? 'BLOCKED / SEVERE'
          : seg.disruption_exposure >= 0.65
          ? 'HIGH RISK'
          : seg.disruption_exposure >= 0.30
          ? 'MODERATE RISK'
          : 'NORMAL';

        polyline.bindTooltip(
          `<div class="font-mono text-xs text-white bg-navy-950 p-1.5 rounded border border-slate-700 shadow-xl">
            <div class="font-bold text-cyan-400">${seg.road_name}: ${seg.segment_id}</div>
            <div class="text-[10px] text-slate-300">${seg.start_node} → ${seg.end_node}</div>
            <div class="flex items-center space-x-2 mt-0.5 text-[10px]">
              <span class="font-bold" style="color: ${color}">${statusLabel}</span>
              <span class="text-slate-400">• Slide: ${Math.round(seg.landslide_risk * 100)}%</span>
            </div>
          </div>`,
          { sticky: true, className: 'leaflet-tooltip-dark' }
        );
      });
    }

    // 1b. Draw Multi-Criteria Route Options (Route A, B, C) if enabled
    if (layers.routes && showRouteAlternatives && routes.length > 0) {
      routes.forEach((route) => {
        const isSelected = (highlightRouteId || selectedRoute?.id) === route.id;
        let routeColor = '#34D399'; // Green/Emerald
        if (route.id === 'route-a') routeColor = '#F87171'; // Red
        if (route.id === 'route-b') routeColor = '#FBBF24'; // Amber
        if (route.id === 'route-c') routeColor = '#06B6D4'; // Cyan

        if (isSelected) {
          L.polyline(route.coordinates, {
            color: routeColor,
            weight: 12,
            opacity: 0.35,
            lineCap: 'round',
          }).addTo(group);
        }

        const routeLine = L.polyline(route.coordinates, {
          color: routeColor,
          weight: isSelected ? 5 : 3.5,
          opacity: isSelected ? 0.95 : 0.6,
          dashArray: route.id === 'route-a' ? '6, 6' : undefined,
        }).addTo(group);

        routeLine.on('click', () => {
          selectRoute(route);
        });

        routeLine.bindTooltip(
          `<div class="font-mono text-xs text-white bg-navy-950 p-1.5 rounded border border-slate-700 shadow-xl">
            <div class="font-bold" style="color: ${routeColor}">${route.name}</div>
            <div class="text-[10px] text-slate-300">ETA: ${route.eta} • Risk: ${route.riskScorePct}%</div>
            ${route.recommended ? '<span class="text-[9px] text-emerald-400 font-bold uppercase">★ RECOMMENDED</span>' : ''}
          </div>`,
          { sticky: true, className: 'leaflet-tooltip-dark' }
        );
      });
    }

    // 1c. Draw Road Corridors
    if (layers.roadStatus) {
      corridors.forEach((corr) => {
        const isSelected = selectedCorridor?.id === corr.id;
        const color = getCorridorColor(corr.status);

        // Halo / Outer Glow for High Risk / Selected
        if (isSelected || corr.status === 'HIGH_RISK' || corr.status === 'BLOCKED') {
          L.polyline(corr.waypoints, {
            color: corr.status === 'BLOCKED' ? '#EF4444' : '#F97316',
            weight: isSelected ? 10 : 8,
            opacity: 0.35,
            lineCap: 'round',
          }).addTo(group);
        }

        const polyline = L.polyline(corr.waypoints, {
          color: color,
          weight: isSelected ? 5 : 3.5,
          opacity: 0.75,
          dashArray: corr.status === 'BLOCKED' ? '6, 8' : undefined,
        }).addTo(group);

        polyline.on('click', () => {
          selectCorridor(corr);
          setSelectedItem({ type: 'corridor', data: corr });
          onSelectCorridor?.(corr);
        });

        // Tooltip
        polyline.bindTooltip(
          `<div class="font-mono text-xs font-bold text-white bg-navy-950 p-1 rounded border border-slate-700">
            ${corr.code}: ${corr.name}
            <div class="text-[10px] text-cyan-400 font-semibold">${corr.status.replace('_', ' ')} • ${corr.traffic} Traffic</div>
          </div>`,
          { sticky: true, className: 'leaflet-tooltip-dark' }
        );
      });
    }

    // 2. Draw Warehouses
    if (layers.warehouses) {
      warehouses.forEach((wh) => {
        const customIcon = L.divIcon({
          className: 'custom-warehouse-icon',
          html: `<div class="w-7 h-7 bg-navy-950 border-2 border-cyan-400 rounded-lg flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([wh.lat, wh.lng], { icon: customIcon }).addTo(group);
        marker.on('click', () => {
          setSelectedItem({ type: 'warehouse', data: wh });
        });
        marker.bindTooltip(`<b>${wh.name}</b><br/><span style="font-size:10px; color:#06b6d4">${wh.city}, ${wh.state}</span>`, {
          offset: [0, -10],
        });
      });
    }

    // 3. Draw Vehicles
    if (layers.vehicles) {
      vehicles.forEach((veh) => {
        const isSelected = selectedVehicle?.id === veh.id;
        const statusColor =
          veh.status === 'AT_RISK'
            ? '#F59E0B'
            : veh.status === 'STOPPED'
            ? '#EF4444'
            : '#22C55E';

        const customIcon = L.divIcon({
          className: 'custom-vehicle-marker',
          html: `<div class="relative group cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-navy-950 border-2 flex items-center justify-center text-white shadow-xl ${
              isSelected ? 'border-cyan-400 ring-2 ring-cyan-400 scale-110' : 'border-slate-500'
            }" style="border-color: ${statusColor}">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
            </div>
            <div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style="background-color: ${statusColor}"></div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([veh.lat, veh.lng], { icon: customIcon }).addTo(group);
        marker.on('click', () => {
          selectVehicle(veh);
          setSelectedItem({ type: 'vehicle', data: veh });
        });
        marker.bindTooltip(
          `<b>${veh.name}</b><br/>${veh.cargo}<br/><span style="color:${statusColor}">${veh.status} (${veh.currentSpeedKmh} km/h)</span>`,
          { offset: [0, -14] }
        );
      });
    }

    // 4. Draw Sensors
    if (layers.sensors) {
      sensors.forEach((sens) => {
        const isWarning = sens.status === 'WARNING' || sens.status === 'DEGRADED';
        const sensorColor = isWarning ? '#F97316' : '#06B6D4';

        const customIcon = L.divIcon({
          className: 'custom-sensor-marker',
          html: `<div class="w-5 h-5 rounded-full bg-navy-950 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-md ${
            isWarning ? 'animate-pulse' : ''
          }">
            <div class="w-2 h-2 rounded-full" style="background-color: ${sensorColor}"></div>
          </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([sens.lat, sens.lng], { icon: customIcon }).addTo(group);
        marker.on('click', () => {
          setSelectedItem({ type: 'sensor', data: sens });
        });
        marker.bindTooltip(
          `<b>${sens.code}</b><br/>${sens.name}<br/>Rainfall: ${sens.rainfallMmH} mm/h | Soil: ${sens.soilMoisturePct}%`,
          { offset: [0, -10] }
        );
      });
    }

    // 5. Draw Incidents
    if (layers.incidents) {
      incidents.forEach((inc) => {
        const customIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: `<div class="relative group cursor-pointer animate-bounce">
            <div class="w-8 h-8 rounded-lg bg-red-600 border border-white text-white flex items-center justify-center shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([inc.lat, inc.lng], { icon: customIcon }).addTo(group);
        marker.on('click', () => {
          setSelectedItem({ type: 'incident', data: inc });
        });
        marker.bindTooltip(
          `<b style="color:#ef4444">${inc.incidentNo}</b><br/>${inc.title}<br/>Severity: ${inc.severity}`,
          { offset: [0, -14] }
        );
      });
    }
  }, [corridors, selectedCorridor, vehicles, selectedVehicle, sensors, incidents, warehouses, layers, roadSegments, routes, selectedRoute, highlightRouteId, kpiFilter]);

  // Handle Preset Jump
  const handleFlyTo = (center: [number, number], zoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, zoom, { duration: 1.2 });
    }
  };

  return (
    <div className={`relative w-full ${heightClass} bg-navy-950 overflow-hidden flex flex-col`}>
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Search Input */}
        <div className="pointer-events-auto flex items-center bg-navy-900/95 border border-surface-border rounded-lg shadow-xl px-3 py-1.5 w-72 sm:w-80 backdrop-blur-md">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search city, road, corridor, warehouse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-100 placeholder-slate-400 w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Regional Quick Jump Buttons & Layers Dropdown */}
        <div className="pointer-events-auto flex items-center space-x-2">
          {/* Quick presets */}
          <div className="hidden md:flex items-center space-x-1 bg-navy-900/95 border border-surface-border rounded-lg p-1 shadow-xl text-xs backdrop-blur-md">
            {regionalPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleFlyTo(preset.center, preset.zoom)}
                className="px-2.5 py-1 rounded text-[11px] font-mono font-medium text-slate-300 hover:bg-navy-800 hover:text-cyan-400 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Active Filter Indicator */}
          {kpiFilter !== 'ALL' && (
            <div className="flex items-center space-x-1.5 bg-brand-cyan/20 border border-brand-cyan text-brand-cyan px-2.5 py-1 rounded-lg text-xs font-mono font-bold backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>FILTER: {kpiFilter.replace('_', ' ')}</span>
              <button
                onClick={() => setKpiFilter('ALL')}
                className="text-slate-300 hover:text-white ml-1 underline text-[10px]"
                title="Clear Filter"
              >
                Reset
              </button>
            </div>
          )}

          {/* Layer Controls Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLayerDropdownOpen(!isLayerDropdownOpen)}
              className="flex items-center space-x-1.5 bg-navy-900/95 hover:bg-navy-800 border border-surface-border text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl backdrop-blur-md transition-colors"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Layers</span>
            </button>

            {isLayerDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-navy-900 border border-surface-border rounded-lg shadow-2xl p-3 text-xs z-50 space-y-2">
                <div className="font-mono text-[10px] uppercase font-bold text-slate-400 border-b border-surface-border pb-1">
                  MAP INTELLIGENCE LAYERS
                </div>
                {Object.entries(layers).map(([key, val]) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer text-slate-200 hover:text-white">
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => setLayers({ ...layers, [key]: e.target.checked })}
                      className="rounded border-slate-700 bg-navy-950 text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Legend on Bottom Left (Section 3) */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-navy-900/95 border border-surface-border p-3 rounded-lg shadow-xl text-[11px] backdrop-blur-md hidden sm:block max-w-xs">
        <div className="font-mono font-bold text-slate-400 text-[10px] uppercase mb-1.5 flex items-center justify-between">
          <span>ROAD RISK & CORRIDOR LEGEND</span>
          <DataStatusBadge type="MODEL_ESTIMATE" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[10px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">GREEN: Normal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">YELLOW: Moderate</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1.5 rounded-full bg-orange-500"></span>
            <span className="text-slate-300">ORANGE: High Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1.5 rounded-full bg-red-500"></span>
            <span className="text-slate-300">RED: Blocked/Severe</span>
          </div>
          <div className="flex items-center space-x-1.5 col-span-2 pt-1 border-t border-surface-border">
            <span className="w-3 h-1 bg-cyan-400"></span>
            <span className="text-cyan-300">CYAN: Route C (Recommended)</span>
          </div>
        </div>
      </div>

      {/* Floating Detailed Inspector Panel on Bottom/Right (Section 22) */}
      {selectedItem && (
        <div className="absolute bottom-4 right-4 z-[1000] w-80 sm:w-96 bg-navy-900/95 border border-surface-border rounded-xl shadow-2xl p-4 text-xs backdrop-blur-md max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-surface-border pb-2.5 mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold">
                  {selectedItem.type === 'segment' ? 'ROAD SEGMENT INTELLIGENCE' : `${selectedItem.type.toUpperCase()} INSPECTOR`}
                </span>
                <DataStatusBadge type={selectedItem.type === 'segment' ? 'MODEL_ESTIMATE' : 'LIVE'} />
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">
                {selectedItem.type === 'segment' && `${selectedItem.data.road_name} • ${selectedItem.data.segment_id}`}
                {selectedItem.type === 'corridor' && `${selectedItem.data.code} Corridor`}
                {selectedItem.type === 'vehicle' && selectedItem.data.name}
                {selectedItem.type === 'incident' && selectedItem.data.incidentNo}
                {selectedItem.type === 'sensor' && selectedItem.data.code}
                {selectedItem.type === 'warehouse' && selectedItem.data.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-navy-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content: Road Segment Inspector (Section 22 exact requirements) */}
          {selectedItem.type === 'segment' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                    selectedItem.data.closure_status
                      ? 'bg-red-950 text-red-300 border border-red-600/70 animate-pulse'
                      : selectedItem.data.disruption_exposure >= 0.65
                      ? 'bg-orange-950 text-orange-300 border border-orange-600/70'
                      : selectedItem.data.disruption_exposure >= 0.3
                      ? 'bg-amber-950 text-amber-300 border border-amber-600/70'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-600/70'
                  }`}
                >
                  {selectedItem.data.closure_status
                    ? 'BLOCKED / SEVERE'
                    : selectedItem.data.disruption_exposure >= 0.65
                    ? 'HIGH RISK'
                    : selectedItem.data.disruption_exposure >= 0.3
                    ? 'MODERATE RISK'
                    : 'NORMAL'}
                </span>
              </div>

              <div className="bg-navy-950 p-2.5 rounded-lg border border-surface-border text-slate-300">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">SECTOR STRETCH</span>
                <span className="font-mono font-bold text-white text-xs">
                  {selectedItem.data.start_node} → {selectedItem.data.end_node}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Distance: {selectedItem.data.distance_km} km • Current Speed: {selectedItem.data.current_speed} km/h
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-navy-950 p-2.5 rounded-lg border border-surface-border font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">FLOOD RISK</span>
                  <span className="text-white font-bold">{Math.round(selectedItem.data.flood_risk * 100)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">LANDSLIDE RISK</span>
                  <span className="text-orange-400 font-bold">{Math.round(selectedItem.data.landslide_risk * 100)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">INCIDENT RISK</span>
                  <span className="text-amber-400 font-bold">
                    {selectedItem.data.incident_risk > 0.3 ? 'Hazard Active' : 'None Reported'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">DISRUPTION EXP.</span>
                  <span className="text-cyan-400 font-bold">{Math.round(selectedItem.data.disruption_exposure * 100)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ROAD CONDITION</span>
                  <span className="text-slate-200 font-bold">{selectedItem.data.road_condition_label} ({(selectedItem.data.road_condition * 100).toFixed(0)}%)</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">CONFIDENCE</span>
                  <span className="text-emerald-400 font-bold">{Math.round(selectedItem.data.confidence * 100)}% (High)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono bg-navy-950 px-2.5 py-1.5 rounded border border-surface-border">
                <span>Updated: <strong className="text-slate-200">{selectedItem.data.last_updated}</strong></span>
                <span>Max Ht: <strong className="text-slate-200">{selectedItem.data.vehicle_restrictions.max_height_m}m</strong></span>
              </div>

              {/* Actions Section (Section 22) */}
              <div className="space-y-2 pt-1">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onNavigateToModule?.('routes', { segmentId: selectedItem.data.segment_id })}
                    className="flex-1 bg-brand-blue hover:bg-blue-600 text-white font-medium py-1.5 rounded transition-colors text-center text-xs"
                  >
                    View Routes
                  </button>
                  <button
                    onClick={() => onNavigateToModule?.('reports', { corridor: selectedItem.data.road_name })}
                    className="flex-1 bg-navy-950 hover:bg-navy-800 text-cyan-300 border border-cyan-800/60 rounded py-1.5 text-xs font-medium"
                  >
                    Report Issue
                  </button>
                </div>

                {/* Road Control Actions (Municipal / Transport Officer authority) */}
                <button
                  onClick={() => setSegmentBlocked(selectedItem.data.segment_id, !selectedItem.data.closure_status)}
                  className={`w-full py-1.5 rounded font-mono font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 ${
                    selectedItem.data.closure_status
                      ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                      : 'bg-red-900/80 hover:bg-red-800 text-red-200 border border-red-700'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{selectedItem.data.closure_status ? 'OPEN / CLEAR ROAD' : 'MARK ROAD BLOCKED'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Body Content by Type */}
          {selectedItem.type === 'corridor' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                    selectedItem.data.status === 'HIGH_RISK'
                      ? 'bg-orange-950 text-orange-300 border border-orange-600/70'
                      : selectedItem.data.status === 'BLOCKED'
                      ? 'bg-red-950 text-red-300 border border-red-600/70'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-600/70'
                  }`}
                >
                  {selectedItem.data.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-navy-950 p-2.5 rounded-lg border border-surface-border font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">TRAFFIC</span>
                  <span className="text-white font-bold">{selectedItem.data.traffic}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">WEATHER</span>
                  <span className="text-white font-bold">{selectedItem.data.rainfallMmH} mm/h</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">LANDSLIDE PROB.</span>
                  <span className="text-orange-400 font-bold">{selectedItem.data.landslideProbabilityPct}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">DISRUPTION PROB.</span>
                  <span className="text-amber-400 font-bold">{selectedItem.data.roadDisruptionProbabilityPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-navy-950 px-3 py-2 rounded border border-surface-border">
                <span className="text-slate-300">Affected Missions:</span>
                <span className="font-mono font-bold text-cyan-400">
                  {selectedItem.data.affectedMissions} Active
                </span>
              </div>

              <div className="bg-amber-950/40 border border-amber-700/50 p-2.5 rounded-lg text-amber-200">
                <span className="text-[10px] font-mono font-bold uppercase block text-amber-400 mb-0.5">
                  RECOMMENDED ACTION
                </span>
                <p className="text-[11px] leading-relaxed">{selectedItem.data.recommendedAction}</p>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={() => onNavigateToModule?.('routes', { corridor: selectedItem.data.code })}
                  className="flex-1 bg-brand-blue hover:bg-blue-600 text-white font-medium py-1.5 rounded transition-colors text-center"
                >
                  Plan Alternate Route
                </button>
                <button
                  onClick={() => onNavigateToModule?.('disruptions', { corridor: selectedItem.data.code })}
                  className="px-3 bg-navy-950 hover:bg-navy-800 text-cyan-300 border border-cyan-800/60 rounded"
                >
                  AI Risk
                </button>
              </div>
            </div>
          )}

          {selectedItem.type === 'vehicle' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60">
                  {selectedItem.data.status}
                </span>
              </div>

              <div className="bg-navy-950 p-2.5 rounded-lg border border-surface-border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cargo:</span>
                  <span className="text-white font-medium">{selectedItem.data.cargo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Route:</span>
                  <span className="text-white font-mono">{selectedItem.data.origin} → {selectedItem.data.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Speed:</span>
                  <span className="text-white font-mono font-bold">{selectedItem.data.currentSpeedKmh} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI ETA:</span>
                  <span className="text-amber-300 font-mono font-bold">{selectedItem.data.eta} (+{selectedItem.data.delayMinutes}m delay)</span>
                </div>
              </div>

              <div className="bg-red-950/40 border border-red-700/50 p-2.5 rounded-lg text-red-200">
                <span className="text-[10px] font-mono font-bold uppercase block text-red-400 mb-0.5">
                  NEXT ANTICIPATED RISK
                </span>
                <p className="text-[11px]">{selectedItem.data.nextRisk}</p>
              </div>

              <button
                onClick={() => onNavigateToModule?.('fleet', { vehicleId: selectedItem.data.id })}
                className="w-full bg-brand-blue hover:bg-blue-600 text-white font-medium py-1.5 rounded transition-colors text-center"
              >
                Track Vehicle Telematics
              </button>
            </div>
          )}

          {selectedItem.type === 'incident' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Severity:</span>
                <span className="font-mono font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-700/60">
                  {selectedItem.data.severity}
                </span>
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed">{selectedItem.data.description}</p>
              <div className="text-[10px] font-mono text-slate-400">
                Reported: {selectedItem.data.reportedTime} by {selectedItem.data.reportedBy}
              </div>
              <div className="bg-navy-950 p-2 rounded border border-surface-border">
                <span className="text-[10px] font-mono text-cyan-400 block font-bold">AI COMPUTER VISION</span>
                <span className="text-white font-bold">{selectedItem.data.aiClassification}</span>
                <span className="text-slate-400 block text-[10px]">Confidence: {selectedItem.data.aiConfidencePct}%</span>
              </div>
              <button
                onClick={() => onNavigateToModule?.('incident-detection')}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-1.5 rounded"
              >
                Review CV Evidence & Verify
              </button>
            </div>
          )}

          {selectedItem.type === 'sensor' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sensor Status:</span>
                <span className="font-mono font-bold text-cyan-300 bg-navy-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedItem.data.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-navy-950 p-2.5 rounded font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">RAINFALL</span>
                  <span className="text-white font-bold">{selectedItem.data.rainfallMmH} mm/h</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">SOIL MOISTURE</span>
                  <span className="text-white font-bold">{selectedItem.data.soilMoisturePct}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">WATER LEVEL Δ</span>
                  <span className="text-white font-bold">+{selectedItem.data.waterLevelDeltaM} m</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">BATTERY</span>
                  <span className="text-emerald-400 font-bold">{selectedItem.data.batteryPct}%</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateToModule?.('iot')}
                className="w-full bg-brand-blue hover:bg-blue-600 text-white font-medium py-1.5 rounded"
              >
                View Full IoT Telemetry
              </button>
            </div>
          )}

          {selectedItem.type === 'warehouse' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hub Status:</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {selectedItem.data.status}
                </span>
              </div>
              <div className="bg-navy-950 p-2.5 rounded space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Capacity Used:</span>
                  <span className="text-white font-bold">{selectedItem.data.capacityPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medicines Stock:</span>
                  <span className="text-cyan-400 font-bold">{selectedItem.data.medicinesStockPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fuel Reserves:</span>
                  <span className="text-amber-400 font-bold">{selectedItem.data.fuelStockPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active In/Out:</span>
                  <span className="text-white">{selectedItem.data.activeMissionsIn} In / {selectedItem.data.activeMissionsOut} Out</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateToModule?.('warehouses')}
                className="w-full bg-brand-blue hover:bg-blue-600 text-white font-medium py-1.5 rounded"
              >
                Manage Warehouse Logistics
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
