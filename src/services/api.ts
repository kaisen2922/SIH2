import {
  MOCK_MISSIONS,
  MOCK_VEHICLES,
  MOCK_ROAD_CORRIDORS,
  MOCK_ROUTES,
  MOCK_DISRUPTION_PREDICTIONS,
  MOCK_SUPPLY_ITEMS,
  MOCK_WAREHOUSES,
  MOCK_SENSORS,
  MOCK_INCIDENTS,
  MOCK_FIELD_TEAMS,
  MOCK_ALERTS,
  MOCK_DATA_PIPELINES,
  MOCK_MODEL_EVALUATION,
} from '../data/mockData';
import {
  LogisticsMission,
  Vehicle,
  RoadCorridor,
  RouteOption,
  DisruptionPrediction,
  SupplyItem,
  Warehouse,
  SensorNode,
  IncidentReport,
  FieldTeam,
  AlertItem,
  DataSourcePipeline,
  ModelEvaluationMetric,
} from '../types';

// Simulated latency to mimic actual GIS & telematics API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const nerflowApi = {
  // Missions API
  async getMissions(): Promise<LogisticsMission[]> {
    await delay(120);
    return [...MOCK_MISSIONS];
  },

  async getMissionById(id: string): Promise<LogisticsMission | undefined> {
    await delay(80);
    return MOCK_MISSIONS.find(
      (m) => m.id === id || m.missionNo.toLowerCase() === id.toLowerCase()
    );
  },

  // Fleet Telematics API
  async getVehicles(): Promise<Vehicle[]> {
    await delay(100);
    return [...MOCK_VEHICLES];
  },

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    await delay(60);
    return MOCK_VEHICLES.find((v) => v.id === id);
  },

  // Road Corridors API
  async getCorridors(): Promise<RoadCorridor[]> {
    await delay(100);
    return [...MOCK_ROAD_CORRIDORS];
  },

  // Route Intelligence API
  async getRoutes(origin: string, destination: string): Promise<RouteOption[]> {
    await delay(150);
    return [...MOCK_ROUTES];
  },

  // Disruption Predictions API
  async getDisruptionPrediction(corridorCode: string): Promise<DisruptionPrediction> {
    await delay(100);
    return { ...MOCK_DISRUPTION_PREDICTIONS, corridorCode };
  },

  // Supply Intelligence API
  async getSupplyItems(): Promise<SupplyItem[]> {
    await delay(100);
    return [...MOCK_SUPPLY_ITEMS];
  },

  // Warehouses API
  async getWarehouses(): Promise<Warehouse[]> {
    await delay(100);
    return [...MOCK_WAREHOUSES];
  },

  // IoT Sensor Telemetry API
  async getSensors(): Promise<SensorNode[]> {
    await delay(120);
    return [...MOCK_SENSORS];
  },

  // Field Incidents API
  async getIncidents(): Promise<IncidentReport[]> {
    await delay(100);
    return [...MOCK_INCIDENTS];
  },

  async submitIncident(incident: Partial<IncidentReport>): Promise<IncidentReport> {
    await delay(300);
    const newIncident: IncidentReport = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      incidentNo: `NER-INC-${Math.floor(100 + Math.random() * 900)}`,
      title: incident.title || 'Reported Road Obstruction',
      incidentType: incident.incidentType || 'ROAD_OBSTRUCTION',
      location: incident.location || 'NH-29 Corridor',
      corridor: incident.corridor || 'NH-29',
      lat: incident.lat || 25.52,
      lng: incident.lng || 94.08,
      severity: incident.severity || 'HIGH',
      photoUrl:
        incident.photoUrl ||
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      description: incident.description || 'Verified via patrol unit',
      reportedBy: incident.reportedBy || 'Patrol Unit',
      reportedTime: 'Just now',
      status: 'SERVER_RECEIVED',
      aiConfidencePct: 87,
      aiClassification: 'Road obstruction (boulder cluster)',
      potentialImpact: 'HIGH',
      recommendedAction: 'FIELD VERIFICATION & Excavator dispatch',
      isOfflineCreated: false,
      syncedAt: 'Just now',
    };
    MOCK_INCIDENTS.unshift(newIncident);
    return newIncident;
  },

  // Alerts API
  async getAlerts(): Promise<AlertItem[]> {
    await delay(80);
    return [...MOCK_ALERTS];
  },

  // Data Sources Pipeline API
  async getDataPipelines(): Promise<DataSourcePipeline[]> {
    await delay(100);
    return [...MOCK_DATA_PIPELINES];
  },

  // Model Evaluation Metrics API
  async getModelEvaluation(): Promise<ModelEvaluationMetric[]> {
    await delay(100);
    return [...MOCK_MODEL_EVALUATION];
  },
};

