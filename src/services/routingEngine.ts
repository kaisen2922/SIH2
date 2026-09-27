import {
  RoadSegment,
  RouteOption,
  Vehicle,
  MissionType,
  RiskLevel,
  RouteWhyExplanation,
  DynamicRouteResult,
  PublicRoadWarning,
} from '../types';

export interface RoutingWeights {
  travelTimeWeight: number;
  floodRiskWeight: number;
  landslideRiskWeight: number;
  incidentRiskWeight: number;
  roadConditionWeight: number;
  delayWeight: number;
}

// Mission type weights
export const MISSION_TYPE_WEIGHTS: Record<MissionType, RoutingWeights> = {
  'Emergency Medicine': {
    travelTimeWeight: 0.20,
    floodRiskWeight: 0.25,
    landslideRiskWeight: 0.40, // High priority on safety & non-blockage
    incidentRiskWeight: 0.25,
    roadConditionWeight: 0.15,
    delayWeight: 0.20,
  },
  'Food Supply': {
    travelTimeWeight: 0.30,
    floodRiskWeight: 0.20,
    landslideRiskWeight: 0.25,
    incidentRiskWeight: 0.20,
    roadConditionWeight: 0.15,
    delayWeight: 0.25,
  },
  'Fuel Supply': {
    travelTimeWeight: 0.20,
    floodRiskWeight: 0.25,
    landslideRiskWeight: 0.40, // Avoid rollovers & fire risks in slide zones
    incidentRiskWeight: 0.25,
    roadConditionWeight: 0.30, // Avoid steep unpaved grades
    delayWeight: 0.15,
  },
  'Relief Materials': {
    travelTimeWeight: 0.25,
    floodRiskWeight: 0.25,
    landslideRiskWeight: 0.25,
    incidentRiskWeight: 0.20,
    roadConditionWeight: 0.20,
    delayWeight: 0.20,
  },
  'Normal Cargo': {
    travelTimeWeight: 0.45, // Cost & ETA sensitive
    floodRiskWeight: 0.15,
    landslideRiskWeight: 0.15,
    incidentRiskWeight: 0.15,
    roadConditionWeight: 0.10,
    delayWeight: 0.25,
  },
  'Personnel Transport': {
    travelTimeWeight: 0.20,
    floodRiskWeight: 0.30,
    landslideRiskWeight: 0.50, // Zero casualty tolerance
    incidentRiskWeight: 0.30,
    roadConditionWeight: 0.20,
    delayWeight: 0.15,
  },
};

// Default Centralized Road Segments Model (Section 4)
export const DEFAULT_ROAD_SEGMENTS: RoadSegment[] = [
  // --- NH-29 Segments (Guwahati -> Dimapur -> Kohima -> Imphal) ---
  {
    segment_id: 'NH29-S101',
    road_name: 'NH-29',
    start_node: 'Guwahati',
    end_node: 'Nagaon',
    start_coords: [26.1445, 91.7362],
    end_coords: [26.3467, 92.684],
    distance_km: 120,
    base_travel_time: 110,
    current_speed: 65,
    flood_risk: 0.12,
    landslide_risk: 0.08,
    rainfall_risk: 0.15,
    incident_risk: 0.05,
    road_condition: 0.88,
    road_condition_label: 'Good',
    closure_status: false,
    disruption_exposure: 0.14,
    confidence: 0.94,
    last_updated: '2 min ago',
    vehicle_restrictions: {
      max_height_m: 4.8,
      max_weight_tonnes: 40,
      max_width_m: 3.6,
    },
  },
  {
    segment_id: 'NH29-S102',
    road_name: 'NH-29',
    start_node: 'Nagaon',
    end_node: 'Dimapur',
    start_coords: [26.3467, 92.684],
    end_coords: [25.9068, 93.727],
    distance_km: 140,
    base_travel_time: 145,
    current_speed: 58,
    flood_risk: 0.22,
    landslide_risk: 0.18,
    rainfall_risk: 0.28,
    incident_risk: 0.10,
    road_condition: 0.82,
    road_condition_label: 'Good',
    closure_status: false,
    disruption_exposure: 0.24,
    confidence: 0.91,
    last_updated: '4 min ago',
    vehicle_restrictions: {
      max_height_m: 4.5,
      max_weight_tonnes: 35,
      max_width_m: 3.4,
    },
  },
  {
    segment_id: 'NH29-S103',
    road_name: 'NH-29',
    start_node: 'Dimapur',
    end_node: 'Kohima Summit',
    start_coords: [25.9068, 93.727],
    end_coords: [25.6751, 94.1086],
    distance_km: 74,
    base_travel_time: 130,
    current_speed: 34,
    flood_risk: 0.35,
    landslide_risk: 0.76, // Active landslide risk pass
    rainfall_risk: 0.68,
    incident_risk: 0.55,
    road_condition: 0.38,
    road_condition_label: 'Degraded',
    closure_status: false,
    disruption_exposure: 0.74,
    confidence: 0.92,
    last_updated: 'Just now',
    vehicle_restrictions: {
      max_height_m: 4.0,
      max_weight_tonnes: 25,
      max_width_m: 3.0,
      requires_chains: true,
    },
  },
  {
    segment_id: 'NH29-S1042', // Explicit example from prompt Section 4
    road_name: 'NH-29',
    start_node: 'Kohima Summit',
    end_node: 'Senapati',
    start_coords: [25.6751, 94.1086],
    end_coords: [25.2676, 94.0186],
    distance_km: 62,
    base_travel_time: 105,
    current_speed: 35,
    flood_risk: 0.35,
    landslide_risk: 0.71,
    rainfall_risk: 0.65,
    incident_risk: 0.05,
    road_condition: 0.82,
    road_condition_label: 'Fair',
    closure_status: false,
    disruption_exposure: 0.61,
    confidence: 0.89,
    last_updated: 'demo',
    vehicle_restrictions: {
      max_height_m: 4.0,
      max_weight_tonnes: 25,
      max_width_m: 3.0,
    },
  },
  {
    segment_id: 'NH29-S105',
    road_name: 'NH-29',
    start_node: 'Senapati',
    end_node: 'Imphal',
    start_coords: [25.2676, 94.0186],
    end_coords: [24.817, 93.9368],
    distance_km: 84,
    base_travel_time: 90,
    current_speed: 55,
    flood_risk: 0.18,
    landslide_risk: 0.22,
    rainfall_risk: 0.25,
    incident_risk: 0.08,
    road_condition: 0.84,
    road_condition_label: 'Good',
    closure_status: false,
    disruption_exposure: 0.22,
    confidence: 0.93,
    last_updated: '5 min ago',
    vehicle_restrictions: {
      max_height_m: 4.5,
      max_weight_tonnes: 35,
      max_width_m: 3.4,
    },
  },

  // --- Route B Segments (NH-6 / NH-37 via Shillong & Silchar) ---
  {
    segment_id: 'NH6-S201',
    road_name: 'NH-6',
    start_node: 'Guwahati',
    end_node: 'Shillong',
    start_coords: [26.1445, 91.7362],
    end_coords: [25.5788, 91.8933],
    distance_km: 100,
    base_travel_time: 120,
    current_speed: 50,
    flood_risk: 0.15,
    landslide_risk: 0.25,
    rainfall_risk: 0.35,
    incident_risk: 0.12,
    road_condition: 0.85,
    road_condition_label: 'Good',
    closure_status: false,
    disruption_exposure: 0.26,
    confidence: 0.92,
    last_updated: '3 min ago',
    vehicle_restrictions: {
      max_height_m: 4.6,
      max_weight_tonnes: 35,
      max_width_m: 3.5,
    },
  },
  {
    segment_id: 'NH6-S202',
    road_name: 'NH-6',
    start_node: 'Shillong',
    end_node: 'Jowai',
    start_coords: [25.5788, 91.8933],
    end_coords: [25.17, 92.41],
    distance_km: 65,
    base_travel_time: 95,
    current_speed: 42,
    flood_risk: 0.28,
    landslide_risk: 0.38,
    rainfall_risk: 0.44,
    incident_risk: 0.20,
    road_condition: 0.70,
    road_condition_label: 'Fair',
    closure_status: false,
    disruption_exposure: 0.38,
    confidence: 0.90,
    last_updated: '6 min ago',
    vehicle_restrictions: {
      max_height_m: 4.2,
      max_weight_tonnes: 30,
      max_width_m: 3.2,
    },
  },
  {
    segment_id: 'NH6-S203',
    road_name: 'NH-6',
    start_node: 'Jowai',
    end_node: 'Silchar',
    start_coords: [25.17, 92.41],
    end_coords: [24.8333, 92.7789],
    distance_km: 155,
    base_travel_time: 240,
    current_speed: 38,
    flood_risk: 0.42,
    landslide_risk: 0.52,
    rainfall_risk: 0.58,
    incident_risk: 0.35,
    road_condition: 0.55,
    road_condition_label: 'Degraded',
    closure_status: false,
    disruption_exposure: 0.48,
    confidence: 0.88,
    last_updated: 'Just now',
    vehicle_restrictions: {
      max_height_m: 4.2,
      max_weight_tonnes: 28,
      max_width_m: 3.2,
    },
  },
  {
    segment_id: 'NH37-S204',
    road_name: 'NH-37',
    start_node: 'Silchar',
    end_node: 'Jiribam',
    start_coords: [24.8333, 92.7789],
    end_coords: [24.8, 93.12],
    distance_km: 50,
    base_travel_time: 75,
    current_speed: 40,
    flood_risk: 0.32,
    landslide_risk: 0.28,
    rainfall_risk: 0.35,
    incident_risk: 0.15,
    road_condition: 0.75,
    road_condition_label: 'Fair',
    closure_status: false,
    disruption_exposure: 0.32,
    confidence: 0.90,
    last_updated: '10 min ago',
    vehicle_restrictions: {
      max_height_m: 4.4,
      max_weight_tonnes: 30,
      max_width_m: 3.4,
    },
  },
  {
    segment_id: 'NH37-S205',
    road_name: 'NH-37',
    start_node: 'Jiribam',
    end_node: 'Imphal',
    start_coords: [24.8, 93.12],
    end_coords: [24.817, 93.9368],
    distance_km: 140,
    base_travel_time: 210,
    current_speed: 40,
    flood_risk: 0.25,
    landslide_risk: 0.36,
    rainfall_risk: 0.38,
    incident_risk: 0.18,
    road_condition: 0.72,
    road_condition_label: 'Fair',
    closure_status: false,
    disruption_exposure: 0.35,
    confidence: 0.89,
    last_updated: '8 min ago',
    vehicle_restrictions: {
      max_height_m: 4.2,
      max_weight_tonnes: 28,
      max_width_m: 3.2,
    },
  },

  // --- Route C Segments (NH-27 / NH-54 Resilient Halflong Ridge Bypass) ---
  {
    segment_id: 'NH27-S301',
    road_name: 'NH-27',
    start_node: 'Guwahati',
    end_node: 'Doboka Junction',
    start_coords: [26.1445, 91.7362],
    end_coords: [26.12, 92.86],
    distance_km: 140,
    base_travel_time: 125,
    current_speed: 68,
    flood_risk: 0.10,
    landslide_risk: 0.05,
    rainfall_risk: 0.14,
    incident_risk: 0.04,
    road_condition: 0.92,
    road_condition_label: 'Good',
    closure_status: false,
    disruption_exposure: 0.12,
    confidence: 0.95,
    last_updated: '1 min ago',
    vehicle_restrictions: {
      max_height_m: 5.0,
      max_weight_tonnes: 45,
      max_width_m: 3.8,
    },
  },
  {
    segment_id: 'NH54-S302',
    road_name: 'NH-54',
    start_node: 'Doboka Junction',
    end_node: 'Lumding',
    start_coords: [26.12, 92.86],
    end_coords: [25.75, 93.17],
    distance_km: 80,
    base_travel_time: 85,
    current_speed: 56,
    flood_risk: 0.12,
    landslide_risk: 0.10,
    rainfall_risk: 0.16,
    incident_risk: 0.06,
    road_condition: 0.88,
    road_condition_label: 'Good',
    closure_status: false,
    disruption_exposure: 0.15,
    confidence: 0.93,
    last_updated: '5 min ago',
    vehicle_restrictions: {
      max_height_m: 4.8,
      max_weight_tonnes: 40,
      max_width_m: 3.6,
    },
  },
  {
    segment_id: 'NH54-S303',
    road_name: 'NH-54',
    start_node: 'Lumding',
    end_node: 'Halflong Ridge',
    start_coords: [25.75, 93.17],
    end_coords: [25.18, 93.02],
    distance_km: 100,
    base_travel_time: 130,
    current_speed: 46,
    flood_risk: 0.15,
    landslide_risk: 0.18, // Bedrock ridge pass - low slide history
    rainfall_risk: 0.22,
    incident_risk: 0.08,
    road_condition: 0.84,
    road_condition_label: 'Good',
    closure_status: false,
    disruption_exposure: 0.18,
    confidence: 0.91,
    last_updated: '3 min ago',
    vehicle_restrictions: {
      max_height_m: 4.5,
      max_weight_tonnes: 35,
      max_width_m: 3.4,
    },
  },
  {
    segment_id: 'NH37-S304',
    road_name: 'NH-37',
    start_node: 'Halflong Ridge',
    end_node: 'Jiribam Connector',
    start_coords: [25.18, 93.02],
    end_coords: [24.8, 93.12],
    distance_km: 110,
    base_travel_time: 140,
    current_speed: 48,
    flood_risk: 0.18,
    landslide_risk: 0.20,
    rainfall_risk: 0.25,
    incident_risk: 0.09,
    road_condition: 0.82,
    road_condition_label: 'Good',
    closure_status: false,
    disruption_exposure: 0.20,
    confidence: 0.90,
    last_updated: '6 min ago',
    vehicle_restrictions: {
      max_height_m: 4.5,
      max_weight_tonnes: 35,
      max_width_m: 3.4,
    },
  },
  {
    segment_id: 'NH37-S305',
    road_name: 'NH-37',
    start_node: 'Jiribam Connector',
    end_node: 'Imphal',
    start_coords: [24.8, 93.12],
    end_coords: [24.817, 93.9368],
    distance_km: 115,
    base_travel_time: 150,
    current_speed: 46,
    flood_risk: 0.20,
    landslide_risk: 0.22,
    rainfall_risk: 0.26,
    incident_risk: 0.10,
    road_condition: 0.80,
    road_condition_label: 'Good',
    closure_status: false,
    disruption_exposure: 0.21,
    confidence: 0.92,
    last_updated: '2 min ago',
    vehicle_restrictions: {
      max_height_m: 4.4,
      max_weight_tonnes: 32,
      max_width_m: 3.3,
    },
  },
];

// Mapping of route IDs to ordered segment IDs
export const ROUTE_SEGMENT_MAPPING: Record<string, string[]> = {
  'route-a': ['NH29-S101', 'NH29-S102', 'NH29-S103', 'NH29-S1042', 'NH29-S105'],
  'route-b': ['NH6-S201', 'NH6-S202', 'NH6-S203', 'NH37-S204', 'NH37-S205'],
  'route-c': ['NH27-S301', 'NH54-S302', 'NH54-S303', 'NH37-S304', 'NH37-S305'],
};

/**
 * Calculates dynamic route metrics, constraints, and scoring across segments
 */
export function evaluateRouteOption(
  route: RouteOption,
  segments: RoadSegment[],
  missionType: MissionType,
  vehicle?: Vehicle | null
): DynamicRouteResult {
  const segmentIds = ROUTE_SEGMENT_MAPPING[route.id] || [];
  const routeSegments = segments.filter((s) => segmentIds.includes(s.segment_id));

  // Default to Route Option values if segment map is sparse
  let totalDistanceKm = 0;
  let totalBaseMinutes = 0;
  let maxLandslideRisk = 0;
  let maxFloodRisk = 0;
  let totalDisruptionSum = 0;
  let hasClosedSegment = false;
  let closedSegmentName = '';
  let worstRoadCondition = 1.0;

  // Constraint check variables
  let isSuitable = true;
  let unsuitableReason = '';

  const weights = MISSION_TYPE_WEIGHTS[missionType] || MISSION_TYPE_WEIGHTS['Emergency Medicine'];

  routeSegments.forEach((seg) => {
    totalDistanceKm += seg.distance_km;
    totalBaseMinutes += seg.base_travel_time;
    if (seg.landslide_risk > maxLandslideRisk) maxLandslideRisk = seg.landslide_risk;
    if (seg.flood_risk > maxFloodRisk) maxFloodRisk = seg.flood_risk;
    totalDisruptionSum += seg.disruption_exposure;
    if (seg.road_condition < worstRoadCondition) worstRoadCondition = seg.road_condition;

    if (seg.closure_status) {
      hasClosedSegment = true;
      closedSegmentName = `${seg.road_name} (${seg.start_node} → ${seg.end_node})`;
    }

    // Vehicle constraint checks (Section 7)
    if (vehicle) {
      const vHeight = vehicle.heightMeters || (vehicle.type === 'Heavy Truck' ? 4.1 : 3.2);
      const vWeight = vehicle.capacityTonnes || (vehicle.type === 'Heavy Truck' ? 24 : 8);
      const vWidth = vehicle.widthMeters || 2.8;

      if (vHeight > seg.vehicle_restrictions.max_height_m) {
        isSuitable = false;
        unsuitableReason = `Vehicle height (${vHeight.toFixed(1)}m) exceeds clearance (${seg.vehicle_restrictions.max_height_m}m) on ${seg.road_name}`;
      } else if (vWeight > seg.vehicle_restrictions.max_weight_tonnes) {
        isSuitable = false;
        unsuitableReason = `Vehicle weight (${vWeight}T) exceeds bridge rating (${seg.vehicle_restrictions.max_weight_tonnes}T) on ${seg.road_name}`;
      } else if (vWidth > seg.vehicle_restrictions.max_width_m) {
        isSuitable = false;
        unsuitableReason = `Vehicle width (${vWidth}m) exceeds mountain lane width (${seg.vehicle_restrictions.max_width_m}m) on ${seg.road_name}`;
      }
    }
  });

  const avgDisruption = routeSegments.length > 0 ? totalDisruptionSum / routeSegments.length : route.riskScorePct / 100;
  const disruptionExposurePct = Math.round(avgDisruption * 100);

  // Dynamic travel delay computation (weather, speed reduction, bottleneck)
  const penaltyFactor = (maxLandslideRisk * 0.4 + maxFloodRisk * 0.3 + (1 - worstRoadCondition) * 0.3);
  const calculatedDelayMinutes = Math.round(totalBaseMinutes * penaltyFactor * 0.5);
  const totalDurationMinutes = totalBaseMinutes + calculatedDelayMinutes;

  const hours = Math.floor(totalDurationMinutes / 60);
  const mins = Math.round(totalDurationMinutes % 60);
  const dynamicEta = `${hours}h ${mins.toString().padStart(2, '0')}m`;

  // Route cost formula (Section 5)
  // route_cost = travel_time + flood_penalty + landslide_penalty + incident_penalty + road_condition_penalty + delay_penalty
  const travelTimeNorm = totalDurationMinutes / 600; // 10h baseline
  const floodPenalty = maxFloodRisk * 100 * weights.floodRiskWeight;
  const landslidePenalty = maxLandslideRisk * 100 * weights.landslideRiskWeight;
  const roadConditionPenalty = (1 - worstRoadCondition) * 100 * weights.roadConditionWeight;
  const delayPenalty = calculatedDelayMinutes * weights.delayWeight;

  const routeCost =
    travelTimeNorm * weights.travelTimeWeight * 100 +
    floodPenalty +
    landslidePenalty +
    roadConditionPenalty +
    delayPenalty +
    (hasClosedSegment ? 1000 : 0);

  // Combined risk score percentage
  const combinedRiskPct = Math.min(
    98,
    Math.round(maxLandslideRisk * 50 + maxFloodRisk * 25 + (1 - worstRoadCondition) * 25)
  );

  let riskLevel: RiskLevel = 'LOW';
  if (combinedRiskPct >= 75 || hasClosedSegment) riskLevel = 'CRITICAL';
  else if (combinedRiskPct >= 55) riskLevel = 'HIGH';
  else if (combinedRiskPct >= 30) riskLevel = 'MODERATE';

  // Status computation
  let status: DynamicRouteResult['status'] = 'ALTERNATIVE';
  if (!isSuitable) {
    status = 'NOT_SUITABLE';
  } else if (hasClosedSegment || combinedRiskPct >= 75) {
    status = 'AVOID';
  }

  // Generate "Why This Route?" Explanation (Section 9)
  const explanation = generateWhyExplanation(
    route.id,
    route.name,
    combinedRiskPct,
    disruptionExposurePct,
    maxLandslideRisk,
    worstRoadCondition,
    calculatedDelayMinutes,
    hasClosedSegment,
    closedSegmentName,
    missionType,
    isSuitable,
    unsuitableReason
  );

  return {
    routeId: route.id,
    name: route.name,
    corridor: route.corridor,
    segments: segmentIds,
    eta: dynamicEta,
    durationMinutes: totalDurationMinutes,
    delayMinutes: calculatedDelayMinutes,
    distanceKm: totalDistanceKm || route.distanceKm,
    riskScorePct: combinedRiskPct,
    riskLevel,
    disruptionExposurePct,
    status,
    unsuitableReason: isSuitable ? undefined : unsuitableReason,
    explanation,
    cost: Math.round(routeCost),
  };
}

/**
 * Generates transparent 5-second comprehensible reason for recommendation (Section 9)
 */
function generateWhyExplanation(
  routeId: string,
  routeName: string,
  riskPct: number,
  disruptionPct: number,
  landslideRisk: number,
  roadCondition: number,
  delayMin: number,
  hasClosedSegment: boolean,
  closedSegmentName: string,
  missionType: MissionType,
  isSuitable: boolean,
  unsuitableReason?: string
): RouteWhyExplanation {
  const primaryReasons: string[] = [];
  const avoidedHazards: { location: string; hazard: string }[] = [];

  if (!isSuitable) {
    return {
      primaryReasons: [
        'ROUTE NOT SUITABLE FOR VEHICLE SPECIFICATIONS',
        unsuitableReason || 'Physical clearance or weight rating violated',
      ],
      tradeOff: 'Safety violation: cannot dispatch this vehicle type on this corridor.',
      avoidedHazards: [],
      suitabilityNote: 'Select smaller vehicle or alternate route.',
    };
  }

  if (hasClosedSegment) {
    return {
      primaryReasons: [
        'ACTIVE ROAD CLOSURE DETECTED',
        `Blocked segment on ${closedSegmentName}`,
      ],
      tradeOff: 'Impasse / zero transit capability.',
      avoidedHazards: [{ location: closedSegmentName, hazard: 'Active complete road block' }],
      suitabilityNote: 'Do not dispatch.',
    };
  }

  if (disruptionPct <= 25) {
    primaryReasons.push('Lowest predicted disruption exposure across all corridors');
    primaryReasons.push('No active road closures or major bottlenecks');
    primaryReasons.push('Lower landslide exposure along bedrock ridge alignments');
    primaryReasons.push('Stable road conditions with verified pavement integrity');
    primaryReasons.push(`High reliability for ${missionType} delivery requirements`);
    primaryReasons.push('Suitable for current vehicle specifications & bridge clearances');

    avoidedHazards.push({
      location: 'NH-29 Segment 103 (Kohima pass)',
      hazard: 'High landslide exposure (76%) & saturated mountain slopes',
    });
    avoidedHazards.push({
      location: 'NH-6 Sonapur corridor',
      hazard: 'Seasonal mudslip & bridge approach wearing',
    });

    return {
      primaryReasons,
      tradeOff: `+${Math.max(30, delayMin + 15)} min compared with direct route; trades distance for zero-failure reliability.`,
      avoidedHazards,
      suitabilityNote: `Fully approved for ${missionType}; high safety margin for life-critical cargo.`,
    };
  }

  if (disruptionPct > 60 || landslideRisk > 0.65) {
    primaryReasons.push('High vulnerability to active slope failures & cloudburst rainfall');
    primaryReasons.push('Heavy congestion and single-lane debris clearing operations');
    primaryReasons.push('Severe delay probability exceeding safe mission thresholds');

    return {
      primaryReasons,
      tradeOff: 'Fastest nominal distance (480 km), but unacceptable risk of cargo stranding or loss.',
      avoidedHazards: [],
      suitabilityNote: 'High disruption exposure; avoid for critical supplies.',
    };
  }

  // Moderate Route B
  primaryReasons.push('Moderate disruption exposure along southern state highway');
  primaryReasons.push('Open bypass when northern ridge corridors encounter active blockages');
  primaryReasons.push('Meghalaya plateau weather remains manageable with caution');

  avoidedHazards.push({
    location: 'NH-29 Kohima crest',
    hazard: 'Avoids active rockfall zone near milestone 148',
  });

  return {
    primaryReasons,
    tradeOff: '+35 min additional transit time vs direct pass; viable backup when primary corridor is blocked.',
    avoidedHazards,
    suitabilityNote: 'Recommended as secondary corridor under dynamic rerouting.',
  };
}

/**
 * Public Safety Data Transformation Layer (Section 17)
 * Transforms internal technical ML & sensor metrics into simplified, clear citizen advisories.
 */
export function transformInternalToPublicWarnings(segments: RoadSegment[]): PublicRoadWarning[] {
  const warnings: PublicRoadWarning[] = [];

  segments.forEach((seg) => {
    if (seg.closure_status) {
      warnings.push({
        id: `pub-${seg.segment_id}`,
        roadName: seg.road_name,
        corridor: `${seg.road_name} (${seg.start_node} → ${seg.end_node})`,
        location: `${seg.start_node} to ${seg.end_node}`,
        severity: 'CRITICAL',
        headline: `ROAD CLOSED: Severe blockage on ${seg.road_name}`,
        publicAdvice: `Emergency road closure between ${seg.start_node} and ${seg.end_node}. All civilian transit halted. Please take alternate highways.`,
        expectedDelay: 'Indefinite / road clearing active',
        saferAlternative: 'NH-27 Lumding / Dima Hasao bypass',
        lastUpdated: seg.last_updated,
        status: 'ACTIVE',
      });
    } else if (seg.landslide_risk >= 0.65) {
      warnings.push({
        id: `pub-${seg.segment_id}`,
        roadName: seg.road_name,
        corridor: `${seg.road_name} near ${seg.start_node}`,
        location: `${seg.start_node} mountain sector`,
        severity: 'ALERT',
        headline: `ELEVATED LANDSLIDE RISK: ${seg.road_name} near ${seg.start_node}`,
        publicAdvice: `Slope instability and heavy rainfall observed. Avoid this corridor if possible. Drive with extreme caution.`,
        expectedDelay: '+45 to 60 min delay',
        saferAlternative: 'Consider Southern or Halflong ridge routes',
        lastUpdated: seg.last_updated,
        status: 'ACTIVE',
      });
    } else if (seg.flood_risk >= 0.50 || seg.disruption_exposure >= 0.60) {
      warnings.push({
        id: `pub-${seg.segment_id}`,
        roadName: seg.road_name,
        corridor: `${seg.road_name} valley stretch`,
        location: `${seg.start_node} to ${seg.end_node}`,
        severity: 'WARNING',
        headline: `WATERLOGGING & SLOW TRAFFIC: ${seg.road_name}`,
        publicAdvice: `Flash runoff reported on road shoulders. Reduced speed limits in effect. Commercial convoys moving slowly.`,
        expectedDelay: '+25 to 35 min delay',
        saferAlternative: 'Bypass via upper arterial',
        lastUpdated: seg.last_updated,
        status: 'ACTIVE',
      });
    }
  });

  return warnings;
}
