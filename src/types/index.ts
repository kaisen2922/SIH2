export type UserRole =
  | 'logistics_officer'
  | 'transport_officer'
  | 'fleet_operator'
  | 'field_officer'
  | 'driver'
  | 'citizen'
  | 'admin'
  | 'viewer';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type MissionStatus = 'PLANNED' | 'ON_ROUTE' | 'AT_RISK' | 'DISRUPTED' | 'DELIVERED' | 'DELAYED';

export type MissionType =
  | 'Emergency Medicine'
  | 'Food Supply'
  | 'Fuel Supply'
  | 'Relief Materials'
  | 'Normal Cargo'
  | 'Personnel Transport';

export type RouteApprovalStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISPATCHED';

export type CargoCategory = 'medicines' | 'food' | 'fuel' | 'water' | 'rescue' | 'general';

export interface VehicleRestrictions {
  max_height_m: number;
  max_weight_tonnes: number;
  max_width_m: number;
  requires_chains?: boolean;
  restricted_vehicle_types?: string[];
}

export interface RoadSegment {
  segment_id: string; // e.g. "NH29-S1042"
  road_name: string; // e.g. "NH-29"
  start_node: string;
  end_node: string;
  start_coords: [number, number];
  end_coords: [number, number];
  distance_km: number;
  base_travel_time: number; // in minutes
  current_speed: number; // in km/h
  flood_risk: number; // 0.0 to 1.0
  landslide_risk: number; // 0.0 to 1.0
  rainfall_risk: number; // 0.0 to 1.0
  incident_risk: number; // 0.0 to 1.0
  road_condition: number; // 0.0 (destroyed) to 1.0 (good)
  road_condition_label: 'Good' | 'Fair' | 'Degraded' | 'Severe';
  closure_status: boolean; // true if closed/blocked
  disruption_exposure: number; // 0.0 to 1.0
  confidence: number; // e.g. 0.89
  last_updated: string;
  vehicle_restrictions: VehicleRestrictions;
}

export interface RouteWhyExplanation {
  primaryReasons: string[];
  tradeOff: string;
  avoidedHazards: { location: string; hazard: string }[];
  suitabilityNote: string;
}

export interface DynamicRouteResult {
  routeId: string;
  name: string;
  corridor: string;
  segments: string[];
  eta: string;
  durationMinutes: number;
  delayMinutes: number;
  distanceKm: number;
  riskScorePct: number;
  riskLevel: RiskLevel;
  disruptionExposurePct: number;
  status: 'RECOMMENDED' | 'ALTERNATIVE' | 'AVOID' | 'NOT_SUITABLE';
  unsuitableReason?: string;
  explanation: RouteWhyExplanation;
  cost: number;
}

export interface PublicRoadWarning {
  id: string;
  roadName: string;
  corridor: string;
  location: string;
  severity: 'WARNING' | 'ALERT' | 'CRITICAL';
  headline: string;
  publicAdvice: string;
  expectedDelay: string;
  saferAlternative: string;
  lastUpdated: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface LogisticsMission {
  id: string;
  missionNo: string; // e.g. "NER-2042"
  title: string;
  cargo: string;
  cargoCategory: CargoCategory;
  origin: string; // "Guwahati"
  destination: string; // "Imphal"
  originCoords: [number, number];
  destinationCoords: [number, number];
  vehicleId: string;
  vehicleName: string;
  priority: 'CRITICAL' | 'HIGH' | 'STANDARD';
  status: MissionStatus;
  eta: string; // "8h 42m"
  baselineEta: string; // "8h 10m"
  predictedDelayMin: number; // 32
  routeRisk: RiskLevel; // 'MODERATE'
  activeCorridor: string; // "NH-29"
  activeRouteId: string;
  recommendedRouteId: string;
  disruptionReason: string;
  progressPct: number;
  assignedAt: string;
  weightTonnes: number;
  temperatureControlled?: boolean;
}

export interface Vehicle {
  id: string;
  name: string; // "Relief Truck 07"
  type: 'Heavy Truck' | 'Medium Logistics 4x4' | 'Cold-Storage Reefer' | 'Fuel Tanker' | 'Light Rapid Van';
  regNumber: string;
  driverName: string;
  driverContact: string;
  status: 'ON_ROUTE' | 'AT_RISK' | 'DELAYED' | 'STOPPED' | 'AVAILABLE';
  currentSpeedKmh: number;
  origin: string;
  destination: string;
  lat: number;
  lng: number;
  heading: number;
  fuelPct: number;
  eta: string;
  baselineEta: string;
  delayMinutes: number;
  cargo: string;
  routeRisk: RiskLevel;
  nextRisk: string; // "Landslide-prone corridor (NH-29)"
  missionId: string;
  odometerKm: number;
  heightMeters?: number;
  widthMeters?: number;
  capacityTonnes?: number;
  refrigerationRequired?: boolean;
  fuelRangeKm?: number;
}

export interface RouteOption {
  id: string;
  name: string;
  corridor: string;
  riskLevel: RiskLevel;
  riskScorePct: number;
  distanceKm: number;
  durationHours: number;
  eta: string;
  elevationProfile: { distanceKm: number; elevationM: number; risk: RiskLevel }[];
  coordinates: [number, number][];
  hazards: string[];
  recommended: boolean;
  recommendationReason: string;
  safetyScore: number;
  etaScore: number;
  vehicleSuitability: string;
  roadCondition: 'Good' | 'Fair' | 'Degraded' | 'Severe';
  segmentIds?: string[];
  disruptionExposurePct?: number;
  delayMinutes?: number;
  suitabilityStatus?: 'RECOMMENDED' | 'ALTERNATIVE' | 'AVOID' | 'NOT_SUITABLE';
  unsuitableReason?: string;
  whyExplanation?: RouteWhyExplanation;
}

export interface RoadCorridor {
  id: string;
  code: string; // "NH-29", "NH-27", "NH-6", "NH-37", "NH-8", "NH-10"
  name: string;
  states: string[];
  status: 'NORMAL' | 'MODERATE_RISK' | 'HIGH_RISK' | 'BLOCKED';
  traffic: 'Normal' | 'Moderate' | 'Heavy' | 'Gridlock';
  weather: string;
  rainfallMmH: number;
  landslideProbabilityPct: number;
  roadDisruptionProbabilityPct: number;
  affectedMissions: number;
  recommendedAction: string;
  waypoints: [number, number][];
  lengthKm: number;
  bridgesAtRisk: number;
  elevationMinM: number;
  elevationMaxM: number;
}

export interface DisruptionPrediction {
  id: string;
  corridorCode: string;
  corridorName: string;
  rainfallDisruptionPct: number;
  landslideRiskPct: number;
  roadDisruptionPct: number;
  trafficDisruptionPct: number;
  disruptionWindowHours: string; // "2–4 HOURS"
  modelConfidencePct: number;
  primaryFactors: { factor: string; contributionPct: number; description: string }[];
  recommendedMitigation: string;
  modelEstimate: boolean;
}

export interface SupplyItem {
  id: string;
  category: 'MEDICINES' | 'FOOD' | 'FUEL' | 'WATER' | 'SHELTER';
  name: string;
  currentStockPct: number;
  demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  riskLevel: RiskLevel;
  criticalLocation: string;
  runoutHoursEstimate: number;
  forecastSummary: string;
  recommendedAction: string;
  consignmentsInTransit: number;
  consumptionRatePerDay: string;
}

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  capacityPct: number;
  medicinesStockPct: number;
  foodStockPct: number;
  fuelStockPct: number;
  waterStockPct: number;
  activeMissionsIn: number;
  activeMissionsOut: number;
  contact: string;
  status: 'OPERATIONAL' | 'CONGESTED' | 'ISOLATED';
}

export interface SensorNode {
  id: string;
  code: string; // "NER-SENSOR-042"
  name: string;
  type: 'rainfall' | 'water_level' | 'soil_moisture' | 'vibration' | 'multi_hazard';
  state: string;
  corridor: string;
  lat: number;
  lng: number;
  rainfallMmH: number;
  waterLevelDeltaM: number;
  soilMoisturePct: number;
  vibrationLevel: 'Nominal' | 'Elevated' | 'High';
  status: 'ONLINE' | 'WARNING' | 'OFFLINE' | 'DEGRADED' | 'LOW_BATTERY';
  batteryPct: number;
  lastUpdated: string;
  isSimulated: boolean;
}

export interface IncidentReport {
  id: string;
  incidentNo: string;
  title: string;
  incidentType: 'ROAD_OBSTRUCTION' | 'LANDSLIDE' | 'FLASH_FLOOD' | 'BRIDGE_DAMAGE' | 'SUBSIDENCE';
  location: string;
  corridor: string;
  lat: number;
  lng: number;
  severity: RiskLevel;
  photoUrl: string;
  description: string;
  reportedBy: string;
  reportedTime: string;
  status: 'SUBMITTED' | 'SERVER_RECEIVED' | 'AI_ANALYSIS' | 'FIELD_VERIFICATION' | 'RESOLVED';
  aiConfidencePct: number;
  aiClassification: string;
  potentialImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedAction: string;
  isOfflineCreated: boolean;
  syncedAt: string | null;
  source?: 'CITIZEN_REPORT' | 'FIELD_PATROL' | 'IOT_CV_CAMERA' | 'OFFICIAL';
  verificationStatus?: 'PENDING_VERIFICATION' | 'VERIFIED' | 'DISMISSED';
}

export type KpiFilterType =
  | 'ALL'
  | 'ACTIVE_MISSIONS'
  | 'AT_RISK'
  | 'DISRUPTED'
  | 'ACTIVE_VEHICLES'
  | 'ROAD_INCIDENTS'
  | 'SUPPLY_WARNINGS';

export interface FieldTeam {
  id: string;
  name: string;
  status: 'ON_SITE' | 'EN_ROUTE' | 'STANDBY' | 'ASSIGNED';
  location: string;
  corridor: string;
  lat: number;
  lng: number;
  eta: string;
  currentTask: string;
  assignedIncidentId: string;
  contact: string;
  personnelCount: number;
  notes: string[];
}

export interface AlertItem {
  id: string;
  title: string;
  severity: RiskLevel;
  corridor: string;
  affectedMissionsCount: number;
  affectedMissions: string[];
  onsetTime: string;
  recommendedAction: string;
  isOfficial: boolean;
  channels: ('push' | 'sms' | 'radio' | 'field_comm')[];
  status: 'BROADCAST' | 'AUTHORIZED' | 'PENDING';
  timestamp: string;
  issuedBy: string;
}

export interface DataSourcePipeline {
  id: string;
  name: string;
  provider: string;
  category:
    | 'Weather'
    | 'Terrain'
    | 'Satellite'
    | 'Road Network'
    | 'GPS Telematics'
    | 'IoT Sensors'
    | 'Field Reports'
    | 'Historical Incidents';
  status: 'ONLINE' | 'DELAYED' | 'DEGRADED' | 'OFFLINE';
  lastUpdated: string;
  latencyMs: number;
  coveragePct: number;
  qualityScorePct: number;
  isLiveConnected: boolean;
}

export interface ModelEvaluationMetric {
  id: string;
  metric: string;
  currentValue: number;
  unit: string;
  targetValue: number;
  benchmark: string;
  category: 'Accuracy' | 'Lead Time' | 'Reliability' | 'Routing';
  description: string;
}

export interface SimulationStepDefinition {
  timeCode: string;
  title: string;
  tab: string;
  subtitle: string;
  routeARiskPct: number;
  routeBRiskPct: number;
  routeCRiskPct: number;
  recommendedRoute: 'ROUTE A' | 'ROUTE B' | 'ROUTE C';
  rainfallMmH: number;
  landslideProbPct: number;
  roadDisruptionPct: number;
  missionStatus: MissionStatus;
  vehicleStatus: 'ON_ROUTE' | 'AT_RISK' | 'DELAYED' | 'STOPPED';
  vehicleSpeedKmh: number;
  vehicleLat: number;
  vehicleLng: number;
  eta: string;
  predictedDelayMin: number;
  fuelDemandStatus: string;
  activeAlertTitle?: string;
  activeAlertSeverity?: RiskLevel;
  newIncidentReported?: boolean;
}
