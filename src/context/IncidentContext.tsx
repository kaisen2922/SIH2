import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  LogisticsMission,
  Vehicle,
  RouteOption,
  RoadCorridor,
  DisruptionPrediction,
  SupplyItem,
  Warehouse,
  SensorNode,
  IncidentReport,
  FieldTeam,
  AlertItem,
  DataSourcePipeline,
  ModelEvaluationMetric,
  UserRole,
  RiskLevel,
  MissionStatus,
  SimulationStepDefinition,
  RoadSegment,
  MissionType,
  RouteApprovalStatus,
  DynamicRouteResult,
  PublicRoadWarning,
} from '../types';
import {
  DEFAULT_ROAD_SEGMENTS,
  evaluateRouteOption,
  transformInternalToPublicWarnings,
} from '../services/routingEngine';
import {
  MOCK_MISSIONS,
  MOCK_VEHICLES,
  MOCK_ROUTES,
  MOCK_ROAD_CORRIDORS,
  MOCK_DISRUPTION_PREDICTIONS,
  MOCK_SUPPLY_ITEMS,
  MOCK_WAREHOUSES,
  MOCK_SENSORS,
  MOCK_INCIDENTS,
  MOCK_FIELD_TEAMS,
  MOCK_ALERTS,
  MOCK_DATA_PIPELINES,
  MOCK_MODEL_EVALUATION,
  EXTENDED_SIMULATION_STEPS,
} from '../data/mockData';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  category: 'MISSION' | 'ALERT' | 'DISPATCH' | 'REROUTE' | 'SUPPLY';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'MISSION' | 'DISRUPTION' | 'FLEET' | 'ALERT' | 'SUPPLY' | 'REPORT';
  targetTab: string;
  read: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface OfflineSyncStatus {
  isOffline: boolean;
  pendingCount: number;
  syncState: 'IDLE' | 'SYNCING' | 'SYNCED';
  lastSyncedAt: string;
}

interface IncidentContextType {
  // Core Logistics Data
  missions: LogisticsMission[];
  selectedMission: LogisticsMission;
  selectMission: (mission: LogisticsMission) => void;
  createMission: (missionData: Partial<LogisticsMission>) => void;
  updateMissionStatus: (id: string, status: MissionStatus) => void;

  // Fleet
  vehicles: Vehicle[];
  selectedVehicle: Vehicle;
  selectVehicle: (vehicle: Vehicle) => void;

  // Corridors & Road Network
  corridors: RoadCorridor[];
  selectedCorridor: RoadCorridor;
  selectCorridor: (corridor: RoadCorridor) => void;

  // Routes
  routes: RouteOption[];
  selectedRoute: RouteOption;
  selectRoute: (route: RouteOption) => void;

  // Predictions & Explainability
  disruptionPrediction: DisruptionPrediction;

  // Supply Intelligence
  supplyItems: SupplyItem[];
  prepositionSupply: (itemId: string, consignments: number) => void;

  // Warehouses
  warehouses: Warehouse[];

  // Sensors & IoT
  sensors: SensorNode[];

  // Field Incidents & Citizen Reports
  incidents: IncidentReport[];
  submitIncidentReport: (report: Partial<IncidentReport>) => void;
  updateIncidentStatus: (id: string, status: IncidentReport['status']) => void;

  // Field Teams
  fieldTeams: FieldTeam[];
  assignFieldTeam: (teamId: string, task: string, incidentId: string) => void;
  updateTeamStatus: (teamId: string, status: FieldTeam['status'], notes?: string) => void;

  // Alerts
  alerts: AlertItem[];
  broadcastAlert: (alert: Partial<AlertItem>) => void;

  // Data Pipelines & Evaluation
  dataPipelines: DataSourcePipeline[];
  modelEvaluation: ModelEvaluationMetric[];

  // Simulation Controller (11 steps)
  simulationState: 'IDLE' | 'RUNNING' | 'PAUSED';
  currentStepIndex: number;
  currentStep: SimulationStepDefinition;
  simulationSteps: SimulationStepDefinition[];
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  goToStep: (index: number) => void;

  // Offline Mode & Sync
  offlineStatus: OfflineSyncStatus;
  toggleOfflineMode: () => void;
  triggerManualSync: () => void;

  // Notifications & Audit
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  auditLogs: AuditLogItem[];

  // Road Segments & Dynamic Routing Engine
  roadSegments: RoadSegment[];
  updateSegmentRisk: (segmentId: string, updates: Partial<RoadSegment>) => void;
  setSegmentBlocked: (segmentId: string, blocked: boolean) => void;
  setSegmentRoadCondition: (segmentId: string, condition: number, label: RoadSegment['road_condition_label']) => void;

  activeMissionType: MissionType;
  setActiveMissionType: (type: MissionType) => void;
  dynamicRouteResults: DynamicRouteResult[];
  recommendedRouteResult: DynamicRouteResult | undefined;

  // Officer Decision & Dispatch Workflow (Section 10)
  routeApprovalStatus: RouteApprovalStatus;
  approvedRouteId: string | null;
  approveRoute: (routeId: string, officerNotes?: string) => void;
  rejectRoute: (routeId: string, reason: string) => void;
  dispatchedToDriverAt: string | null;

  // Dynamic Rerouting & Simulation Trigger (Section 15 & 31)
  rerouteAlert: {
    detected: boolean;
    previousRouteId: string;
    previousRouteName: string;
    newRouteId: string;
    newRouteName: string;
    reason: string;
    oldRiskPct: number;
    newRiskPct: number;
  } | null;
  approveReroute: () => void;
  triggerLandslideSpike: () => void;
  runEndToEndDemo: () => void;

  // Real-time Event System (Section 16)
  systemEvents: { id: string; type: string; timestamp: string; details: string; severity?: string }[];
  recordSystemEvent: (type: string, details: string, severity?: string) => void;

  // Citizen & Public Safety Pipeline (Section 17-19)
  publicWarnings: PublicRoadWarning[];
  submitCitizenIncident: (data: {
    title: string;
    category: string;
    corridor: string;
    location: string;
    description: string;
    photoUrl?: string;
  }) => void;
  verifyCitizenReport: (reportId: string) => void;

  // Top KPI Filter (Section 21)
  kpiFilter: 'ALL' | 'ACTIVE_MISSIONS' | 'AT_RISK' | 'DISRUPTED' | 'ACTIVE_VEHICLES' | 'ROAD_INCIDENTS' | 'SUPPLY_WARNINGS';
  setKpiFilter: (filter: 'ALL' | 'ACTIVE_MISSIONS' | 'AT_RISK' | 'DISRUPTED' | 'ACTIVE_VEHICLES' | 'ROAD_INCIDENTS' | 'SUPPLY_WARNINGS') => void;

  // Role & Permissions
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  canCreateMission: boolean;
  canIssueAlert: boolean;
  canModifyRoute: boolean;
  canAssignTeam: boolean;
  canManageSensors: boolean;
  canApproveRoute: boolean;
  canDispatchMission: boolean;
  canControlRoads: boolean;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Role State
  const [currentRole, setCurrentRole] = useState<UserRole>('logistics_officer');

  // Core Data States
  const [missions, setMissions] = useState<LogisticsMission[]>(MOCK_MISSIONS);
  const [selectedMission, setSelectedMission] = useState<LogisticsMission>(MOCK_MISSIONS[0]);

  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(MOCK_VEHICLES[0]);

  const [corridors, setCorridors] = useState<RoadCorridor[]>(MOCK_ROAD_CORRIDORS);
  const [selectedCorridor, setSelectedCorridor] = useState<RoadCorridor>(MOCK_ROAD_CORRIDORS[0]);

  const [routes, setRoutes] = useState<RouteOption[]>(MOCK_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(MOCK_ROUTES[2]); // Route C recommended

  const [disruptionPrediction, setDisruptionPrediction] = useState<DisruptionPrediction>(MOCK_DISRUPTION_PREDICTIONS);
  const [supplyItems, setSupplyItems] = useState<SupplyItem[]>(MOCK_SUPPLY_ITEMS);
  const [warehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES);
  const [sensors, setSensors] = useState<SensorNode[]>(MOCK_SENSORS);
  const [incidents, setIncidents] = useState<IncidentReport[]>(MOCK_INCIDENTS);
  const [fieldTeams, setFieldTeams] = useState<FieldTeam[]>(MOCK_FIELD_TEAMS);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [dataPipelines] = useState<DataSourcePipeline[]>(MOCK_DATA_PIPELINES);
  const [modelEvaluation] = useState<ModelEvaluationMetric[]>(MOCK_MODEL_EVALUATION);

  // Simulation Engine
  const [simulationState, setSimulationState] = useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Offline Engine
  const [offlineStatus, setOfflineStatus] = useState<OfflineSyncStatus>({
    isOffline: false,
    pendingCount: 0,
    syncState: 'IDLE',
    lastSyncedAt: 'Just now',
  });
  const [offlineQueue, setOfflineQueue] = useState<IncidentReport[]>([]);

  // Notifications & Audit Log
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Mission Disruption Predicted',
      message: 'Mission #NER-2042 (Medicines to Imphal) faces 71% landslide risk on NH-29.',
      timestamp: '5m ago',
      category: 'MISSION',
      targetTab: 'routes',
      read: false,
      priority: 'CRITICAL',
    },
    {
      id: 'notif-2',
      title: 'Fuel Shortage Risk in Imphal',
      message: 'Imphal depot fuel stock down to 34%. Projected runout within 18 hours.',
      timestamp: '12m ago',
      category: 'SUPPLY',
      targetTab: 'supply',
      read: false,
      priority: 'HIGH',
    },
    {
      id: 'notif-3',
      title: 'Single-Lane Obstruction Detected',
      message: 'Field telematics & AI CV flagged rockfall debris on NH-29 MP 148.',
      timestamp: '25m ago',
      category: 'REPORT',
      targetTab: 'incident-detection',
      read: true,
      priority: 'MEDIUM',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      timestamp: '2026-09-26 23:45:10 IST',
      user: 'Biren Das (Driver)',
      role: 'field_officer',
      action: 'Acknowledged reroute advisory to Route C (Lumding-Halflong corridor)',
      category: 'REROUTE',
    },
    {
      id: 'log-2',
      timestamp: '2026-09-26 23:30:00 IST',
      user: 'Operations Officer (NER Desk)',
      role: 'logistics_officer',
      action: 'Issued Official Critical Alert for Corridor NH-29',
      category: 'ALERT',
    },
  ]);

  // Road Segments State (Section 4)
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>(DEFAULT_ROAD_SEGMENTS);
  const [activeMissionType, setActiveMissionType] = useState<MissionType>('Emergency Medicine');

  // Officer Decision & Dispatch Workflow (Section 10)
  const [routeApprovalStatus, setRouteApprovalStatus] = useState<RouteApprovalStatus>('PENDING_REVIEW');
  const [approvedRouteId, setApprovedRouteId] = useState<string | null>('route-c');
  const [dispatchedToDriverAt, setDispatchedToDriverAt] = useState<string | null>('18:45 IST');

  // Dynamic Rerouting & Alert State (Section 15 & 31)
  const [rerouteAlert, setRerouteAlert] = useState<{
    detected: boolean;
    previousRouteId: string;
    previousRouteName: string;
    newRouteId: string;
    newRouteName: string;
    reason: string;
    oldRiskPct: number;
    newRiskPct: number;
  } | null>(null);

  // Top KPI Filter (Section 21)
  const [kpiFilter, setKpiFilter] = useState<'ALL' | 'ACTIVE_MISSIONS' | 'AT_RISK' | 'DISRUPTED' | 'ACTIVE_VEHICLES' | 'ROAD_INCIDENTS' | 'SUPPLY_WARNINGS'>('ALL');

  // Real-time Event System (Section 16)
  const [systemEvents, setSystemEvents] = useState<{
    id: string;
    type: string;
    timestamp: string;
    details: string;
    severity?: string;
  }[]>([
    {
      id: 'evt-1',
      type: 'HAZARD_DETECTED',
      timestamp: '5m ago',
      details: 'Pore pressure sensors flag slope instability on NH-29 Kohima pass.',
      severity: 'HIGH',
    },
    {
      id: 'evt-2',
      type: 'MISSION_DISPATCHED',
      timestamp: '15m ago',
      details: 'Mission #NER-2042 authorized by Logistics Officer via Route C.',
      severity: 'INFO',
    },
  ]);

  const recordSystemEvent = (type: string, details: string, severity: string = 'INFO') => {
    const newEvt = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      timestamp: 'Just now',
      details,
      severity,
    };
    setSystemEvents((prev) => [newEvt, ...prev.slice(0, 30)]);
  };

  // Public warnings generated via transformation layer (Section 17)
  const publicWarnings = useMemo(() => transformInternalToPublicWarnings(roadSegments), [roadSegments]);

  // Dynamic Routes Evaluation (Section 5, 6, 7)
  const dynamicRouteResults = useMemo(() => {
    return routes.map((r) => evaluateRouteOption(r, roadSegments, activeMissionType, selectedVehicle));
  }, [routes, roadSegments, activeMissionType, selectedVehicle]);

  // Find lowest cost suitable route as recommended
  const recommendedRouteResult = useMemo(() => {
    const suitable = dynamicRouteResults.filter((r) => r.status !== 'NOT_SUITABLE' && r.status !== 'AVOID');
    if (suitable.length > 0) {
      return [...suitable].sort((a, b) => a.cost - b.cost)[0];
    }
    return dynamicRouteResults[0];
  }, [dynamicRouteResults]);

  // RBAC Permission Computations (Section 13)
  const canCreateMission = ['logistics_officer', 'transport_officer', 'admin'].includes(currentRole);
  const canIssueAlert = ['logistics_officer', 'transport_officer', 'admin'].includes(currentRole);
  const canModifyRoute = ['logistics_officer', 'transport_officer', 'fleet_operator', 'admin'].includes(currentRole);
  const canAssignTeam = ['logistics_officer', 'admin'].includes(currentRole);
  const canManageSensors = ['admin', 'transport_officer'].includes(currentRole);
  const canApproveRoute = ['logistics_officer', 'admin'].includes(currentRole);
  const canDispatchMission = ['logistics_officer', 'admin'].includes(currentRole);
  const canControlRoads = ['transport_officer', 'admin'].includes(currentRole);

  // Apply Simulation Step Effects
  const applyStepEffects = (stepIndex: number) => {
    const step = EXTENDED_SIMULATION_STEPS[stepIndex];
    if (!step) return;

    // 1. Update Mission NER-2042
    setMissions((prev) =>
      prev.map((m) => {
        if (m.missionNo === 'NER-2042') {
          return {
            ...m,
            status: step.missionStatus,
            eta: step.eta,
            predictedDelayMin: step.predictedDelayMin,
            routeRisk: step.routeARiskPct > 70 ? 'CRITICAL' : step.routeARiskPct > 40 ? 'MODERATE' : 'LOW',
            disruptionReason: `Sim: ${step.title} — ${step.subtitle}`,
            progressPct: Math.min(95, 20 + stepIndex * 7),
          };
        }
        return m;
      })
    );

    // 2. Update Vehicle 07
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === 'veh-07') {
          return {
            ...v,
            status: step.vehicleStatus,
            currentSpeedKmh: step.vehicleSpeedKmh,
            lat: step.vehicleLat,
            lng: step.vehicleLng,
            eta: step.eta,
            delayMinutes: step.predictedDelayMin,
            routeRisk: step.routeARiskPct > 70 ? 'CRITICAL' : step.routeARiskPct > 40 ? 'MODERATE' : 'LOW',
          };
        }
        return v;
      })
    );

    // 3. Update Route Options
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === 'route-a') {
          return {
            ...r,
            riskScorePct: step.routeARiskPct,
            riskLevel: step.routeARiskPct > 75 ? 'HIGH' : step.routeARiskPct > 40 ? 'MODERATE' : 'LOW',
            recommended: step.recommendedRoute === 'ROUTE A',
          };
        }
        if (r.id === 'route-b') {
          return {
            ...r,
            riskScorePct: step.routeBRiskPct,
            recommended: step.recommendedRoute === 'ROUTE B',
          };
        }
        if (r.id === 'route-c') {
          return {
            ...r,
            riskScorePct: step.routeCRiskPct,
            recommended: step.recommendedRoute === 'ROUTE C',
          };
        }
        return r;
      })
    );

    // 4. Update Corridor NH-29
    setCorridors((prev) =>
      prev.map((c) => {
        if (c.code === 'NH-29') {
          return {
            ...c,
            rainfallMmH: step.rainfallMmH,
            landslideProbabilityPct: step.landslideProbPct,
            roadDisruptionProbabilityPct: step.roadDisruptionPct,
            status: step.landslideProbPct > 70 ? 'HIGH_RISK' : step.landslideProbPct > 40 ? 'MODERATE_RISK' : 'NORMAL',
          };
        }
        return c;
      })
    );

    // 5. Update Disruption Prediction Card
    setDisruptionPrediction((prev) => ({
      ...prev,
      rainfallDisruptionPct: Math.round(step.rainfallMmH * 1.7),
      landslideRiskPct: step.landslideProbPct,
      roadDisruptionPct: step.roadDisruptionPct,
      trafficDisruptionPct: Math.min(85, Math.round(step.roadDisruptionPct * 0.6)),
    }));

    // 6. Update Fuel & Supply if near T+50
    if (stepIndex >= 9) {
      setSupplyItems((prev) =>
        prev.map((s) => {
          if (s.category === 'FUEL') {
            return {
              ...s,
              currentStockPct: 34,
              riskLevel: 'CRITICAL',
              forecastSummary: 'Fuel shortage imminent in Imphal (~18h). Pre-positioning active.',
            };
          }
          return s;
        })
      );
    }

    // 7. Inject Alert if present in step
    if (step.activeAlertTitle) {
      const newAlert: AlertItem = {
        id: `sim-alert-${stepIndex}`,
        title: step.activeAlertTitle,
        severity: step.activeAlertSeverity || 'HIGH',
        corridor: 'NH-29 (Dimapur-Kohima-Imphal)',
        affectedMissionsCount: 4,
        affectedMissions: ['NER-2042', 'NER-2104', 'NER-1988'],
        onsetTime: 'Simulation Active',
        recommendedAction: 'Execute Route C diversion via Lumding.',
        isOfficial: true,
        channels: ['push', 'sms', 'radio'],
        status: 'BROADCAST',
        timestamp: `${step.timeCode} Event`,
        issuedBy: 'NERFLOW Automated Simulation',
      };
      setAlerts((prev) => {
        if (prev.some((a) => a.id === newAlert.id)) return prev;
        return [newAlert, ...prev];
      });
    }

    // 8. Add Notification
    setNotifications((prev) => [
      {
        id: `sim-notif-${Date.now()}`,
        title: `Simulation [${step.timeCode}]: ${step.title}`,
        message: step.subtitle,
        timestamp: 'Just now',
        category: 'MISSION',
        targetTab: step.tab,
        read: false,
        priority: step.landslideProbPct > 70 ? 'CRITICAL' : 'HIGH',
      },
      ...prev.slice(0, 15),
    ]);

    // 9. Synchronize road segments and reroute alert during simulation steps (Section 15 & 24)
    if (step.timeCode === 'T+22' || step.title === 'Route C Risk Increases') {
      setRoadSegments((prev) =>
        prev.map((seg) => {
          if (seg.segment_id === 'NH54-S303') {
            return {
              ...seg,
              landslide_risk: 0.76,
              disruption_exposure: 0.74,
              road_condition: 0.45,
              road_condition_label: 'Degraded',
              last_updated: 'T+22 Telemetry',
            };
          }
          return seg;
        })
      );
      setRerouteAlert({
        detected: true,
        previousRouteId: 'route-c',
        previousRouteName: 'Route C (Halflong Ridge)',
        newRouteId: 'route-b',
        newRouteName: 'Route B (Southern Highway via Silchar)',
        reason: 'Landslide risk increased on Halflong ridge pass (18% → 76%)',
        oldRiskPct: 18,
        newRiskPct: 76,
      });
      recordSystemEvent('HAZARD_DETECTED', 'Landslide risk increased on Route C (18% → 76%)', 'CRITICAL');
      recordSystemEvent('ROAD_RISK_CHANGED', 'Halflong Ridge Segment NH54-S303 degraded', 'WARNING');
    }

    if (step.timeCode === 'T+25' || step.title === 'Officer Approves Reroute') {
      setApprovedRouteId('route-b');
      setRouteApprovalStatus('APPROVED');
      setRerouteAlert(null);
      recordSystemEvent('MISSION_ROUTE_UPDATED', 'Route B approved by Disaster / Logistics Officer', 'SUCCESS');
    }

    if (step.timeCode === 'T+26' || step.title === 'Driver Receives Updated Route') {
      setDispatchedToDriverAt(new Date().toLocaleTimeString());
      recordSystemEvent('MISSION_DISPATCHED', 'Route B telematic packet confirmed by Driver Console', 'INFO');
    }

    if (step.timeCode === 'T+30' || step.title === 'Field Team Dispatched') {
      setFieldTeams((prev) =>
        prev.map((t, idx) =>
          idx === 0
            ? { ...t, status: 'EN_ROUTE', currentTask: 'Halflong pass boulder & mud clearance', location: 'Halflong Ridge' }
            : t
        )
      );
      recordSystemEvent('FIELD_TEAM_DISPATCHED', 'BRO Earthmoving Unit 03 dispatched to Halflong pass', 'INFO');
    }
  };

  // Simulation Timer Hook
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (simulationState === 'RUNNING') {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const next = prev + 1;
          if (next >= EXTENDED_SIMULATION_STEPS.length) {
            setSimulationState('PAUSED');
            return prev;
          }
          applyStepEffects(next);
          return next;
        });
      }, 5500); // 5.5s per step for clear observation
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [simulationState]);

  const startSimulation = () => {
    setSimulationState('RUNNING');
    applyStepEffects(currentStepIndex);
  };

  const pauseSimulation = () => {
    setSimulationState('PAUSED');
  };

  const resumeSimulation = () => {
    setSimulationState('RUNNING');
  };

  const resetSimulation = () => {
    setSimulationState('IDLE');
    setCurrentStepIndex(0);
    setMissions(MOCK_MISSIONS);
    setVehicles(MOCK_VEHICLES);
    setCorridors(MOCK_ROAD_CORRIDORS);
    setRoutes(MOCK_ROUTES);
    setDisruptionPrediction(MOCK_DISRUPTION_PREDICTIONS);
    setSupplyItems(MOCK_SUPPLY_ITEMS);
    setRoadSegments(DEFAULT_ROAD_SEGMENTS);
    setRouteApprovalStatus('PENDING_REVIEW');
    setApprovedRouteId('route-c');
    setRerouteAlert(null);
    setKpiFilter('ALL');
    recordSystemEvent('SIMULATION_RESET', 'Simulation state restored to baseline T+00', 'INFO');
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < EXTENDED_SIMULATION_STEPS.length) {
      setCurrentStepIndex(index);
      applyStepEffects(index);
    }
  };

  // Offline Mode Engine
  const toggleOfflineMode = () => {
    setOfflineStatus((prev) => ({
      ...prev,
      isOffline: !prev.isOffline,
    }));
  };

  const submitIncidentReport = (reportData: Partial<IncidentReport>) => {
    const newReport: IncidentReport = {
      id: `rep-${Date.now()}`,
      incidentNo: `NER-INC-${Math.floor(100 + Math.random() * 900)}`,
      title: reportData.title || 'Field Road Hazard',
      incidentType: reportData.incidentType || 'ROAD_OBSTRUCTION',
      location: reportData.location || 'NH Corridor (Field Auto-GPS)',
      corridor: reportData.corridor || 'NH-29',
      lat: reportData.lat || 25.52,
      lng: reportData.lng || 94.08,
      severity: reportData.severity || 'HIGH',
      photoUrl:
        reportData.photoUrl ||
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      description: reportData.description || 'Observed obstacle affecting traffic flow.',
      reportedBy: reportData.reportedBy || `${currentRole.replace('_', ' ').toUpperCase()} (Field Patrol)`,
      reportedTime: 'Just now',
      status: offlineStatus.isOffline ? 'SUBMITTED' : 'SERVER_RECEIVED',
      aiConfidencePct: 87,
      aiClassification: 'Road obstruction (boulder cluster)',
      potentialImpact: 'HIGH',
      recommendedAction: 'FIELD VERIFICATION & Excavator dispatch',
      isOfflineCreated: offlineStatus.isOffline,
      syncedAt: offlineStatus.isOffline ? null : new Date().toLocaleTimeString(),
    };

    if (offlineStatus.isOffline) {
      setOfflineQueue((prev) => [...prev, newReport]);
      setOfflineStatus((prev) => ({
        ...prev,
        pendingCount: prev.pendingCount + 1,
      }));
    } else {
      setIncidents((prev) => [newReport, ...prev]);
    }
  };

  const triggerManualSync = () => {
    if (offlineQueue.length === 0) return;
    setOfflineStatus((prev) => ({ ...prev, syncState: 'SYNCING' }));

    setTimeout(() => {
      setIncidents((prev) => [
        ...offlineQueue.map((item) => ({
          ...item,
          status: 'SERVER_RECEIVED' as const,
          syncedAt: 'Just now',
        })),
        ...prev,
      ]);
      setOfflineQueue([]);
      setOfflineStatus({
        isOffline: false,
        pendingCount: 0,
        syncState: 'SYNCED',
        lastSyncedAt: new Date().toLocaleTimeString(),
      });
    }, 2000);
  };

  const updateIncidentStatus = (id: string, status: IncidentReport['status']) => {
    setIncidents((prev) => prev.map((inc) => (inc.id === id ? { ...inc, status } : inc)));
  };

  const selectMission = (m: LogisticsMission) => setSelectedMission(m);
  const selectVehicle = (v: Vehicle) => setSelectedVehicle(v);
  const selectCorridor = (c: RoadCorridor) => setSelectedCorridor(c);
  const selectRoute = (r: RouteOption) => setSelectedRoute(r);

  const createMission = (missionData: Partial<LogisticsMission>) => {
    const newMission: LogisticsMission = {
      id: `ner-mission-${Math.floor(2100 + Math.random() * 800)}`,
      missionNo: `NER-${Math.floor(2100 + Math.random() * 800)}`,
      title: missionData.title || 'Regional Essential Cargo Delivery',
      cargo: missionData.cargo || 'Medical & Relief Supplies',
      cargoCategory: missionData.cargoCategory || 'medicines',
      origin: missionData.origin || 'Guwahati',
      destination: missionData.destination || 'Imphal',
      originCoords: missionData.originCoords || [26.1445, 91.7362],
      destinationCoords: missionData.destinationCoords || [24.817, 93.9368],
      vehicleId: missionData.vehicleId || 'veh-07',
      vehicleName: missionData.vehicleName || 'Relief Truck 07',
      priority: missionData.priority || 'CRITICAL',
      status: 'ON_ROUTE',
      eta: missionData.eta || '10h 30m',
      baselineEta: missionData.baselineEta || '9h 40m',
      predictedDelayMin: missionData.predictedDelayMin || 25,
      routeRisk: missionData.routeRisk || 'LOW',
      activeCorridor: missionData.activeCorridor || 'Route C (Bypass)',
      activeRouteId: missionData.activeRouteId || 'route-c',
      recommendedRouteId: 'route-c',
      disruptionReason: 'Planned via resilient low-risk corridor',
      progressPct: 5,
      assignedAt: new Date().toLocaleString(),
      weightTonnes: missionData.weightTonnes || 4.5,
      temperatureControlled: missionData.temperatureControlled ?? true,
    };
    setMissions((prev) => [newMission, ...prev]);
    setSelectedMission(newMission);
  };

  const updateMissionStatus = (id: string, status: MissionStatus) => {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const prepositionSupply = (itemId: string, consignments: number) => {
    setSupplyItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            consignmentsInTransit: item.consignmentsInTransit + consignments,
            forecastSummary: `Pre-positioned +${consignments} emergency consignments from Guwahati Hub.`,
          };
        }
        return item;
      })
    );
  };

  const assignFieldTeam = (teamId: string, task: string, incidentId: string) => {
    setFieldTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, status: 'EN_ROUTE', currentTask: task, assignedIncidentId: incidentId } : t))
    );
  };

  const updateTeamStatus = (teamId: string, status: FieldTeam['status'], note?: string) => {
    setFieldTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              status,
              notes: note ? [note, ...t.notes] : t.notes,
            }
          : t
      )
    );
  };

  const broadcastAlert = (alertData: Partial<AlertItem>) => {
    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      title: alertData.title || 'Official Operational Advisory',
      severity: alertData.severity || 'HIGH',
      corridor: alertData.corridor || 'NH-29',
      affectedMissionsCount: alertData.affectedMissionsCount || 3,
      affectedMissions: alertData.affectedMissions || ['NER-2042'],
      onsetTime: alertData.onsetTime || 'Immediate',
      recommendedAction: alertData.recommendedAction || 'Execute reroute protocol.',
      isOfficial: true,
      channels: alertData.channels || ['push', 'sms', 'radio'],
      status: 'BROADCAST',
      timestamp: 'Just now',
      issuedBy: `${currentRole.replace('_', ' ').toUpperCase()} (Command Authority)`,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Segment Manipulation methods (Section 4 & 12)
  const updateSegmentRisk = (segmentId: string, updates: Partial<RoadSegment>) => {
    setRoadSegments((prev) =>
      prev.map((s) => (s.segment_id === segmentId ? { ...s, ...updates, last_updated: 'Just now (Manual Update)' } : s))
    );
    recordSystemEvent('ROAD_RISK_CHANGED', `Road segment ${segmentId} parameters adjusted`, 'INFO');
  };

  const setSegmentBlocked = (segmentId: string, blocked: boolean) => {
    setRoadSegments((prev) =>
      prev.map((s) =>
        s.segment_id === segmentId
          ? {
              ...s,
              closure_status: blocked,
              disruption_exposure: blocked ? 0.98 : 0.2,
              last_updated: 'Just now (Officer Action)',
            }
          : s
      )
    );
    recordSystemEvent(
      blocked ? 'ROAD_BLOCKED' : 'ROAD_REOPENED',
      `Segment ${segmentId} status changed to ${blocked ? 'BLOCKED' : 'OPEN'} by Municipal Officer`,
      blocked ? 'CRITICAL' : 'SUCCESS'
    );
  };

  const setSegmentRoadCondition = (segmentId: string, condition: number, label: RoadSegment['road_condition_label']) => {
    setRoadSegments((prev) =>
      prev.map((s) =>
        s.segment_id === segmentId
          ? {
              ...s,
              road_condition: condition,
              road_condition_label: label,
              last_updated: 'Just now (Condition Assessment)',
            }
          : s
      )
    );
    recordSystemEvent('ROAD_RISK_CHANGED', `Segment ${segmentId} road condition updated to ${label}`, 'INFO');
  };

  // Officer Decision Workflow Methods (Section 10)
  const approveRoute = (routeId: string, officerNotes?: string) => {
    setApprovedRouteId(routeId);
    setRouteApprovalStatus('APPROVED');
    const timeStr = new Date().toLocaleTimeString();
    setDispatchedToDriverAt(timeStr);

    const targetRoute = routes.find((r) => r.id === routeId);

    setMissions((prev) =>
      prev.map((m) =>
        m.id === selectedMission.id
          ? {
              ...m,
              status: 'ON_ROUTE',
              activeRouteId: routeId,
              disruptionReason: officerNotes || `Authorized Route: ${targetRoute?.name || routeId}`,
            }
          : m
      )
    );

    recordSystemEvent(
      'MISSION_ROUTE_UPDATED',
      `Route ${routeId} approved and authorized for Mission #${selectedMission.missionNo}`,
      'SUCCESS'
    );
    recordSystemEvent('MISSION_DISPATCHED', `Mission #${selectedMission.missionNo} dispatched to Driver Console`, 'INFO');

    setNotifications((prev) => [
      {
        id: `notif-appr-${Date.now()}`,
        title: `Route Approved for #${selectedMission.missionNo}`,
        message: `Command desk authorized ${targetRoute?.name || routeId}. Telematics dispatched to driver app.`,
        timestamp: 'Just now',
        category: 'MISSION',
        targetTab: 'routes',
        read: false,
        priority: 'HIGH',
      },
      ...prev,
    ]);

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: `${currentRole.replace('_', ' ').toUpperCase()}`,
        role: currentRole,
        action: `Authorized and dispatched route: ${targetRoute?.name || routeId}`,
        category: 'DISPATCH',
      },
      ...prev,
    ]);
  };

  const rejectRoute = (routeId: string, reason: string) => {
    setRouteApprovalStatus('REJECTED');
    recordSystemEvent('ROUTE_REJECTED', `Route ${routeId} rejected by officer: ${reason}`, 'WARNING');
    setNotifications((prev) => [
      {
        id: `notif-rej-${Date.now()}`,
        title: `Route Rejected: ${routeId}`,
        message: `Reason: ${reason}. System calculating alternate corridors.`,
        timestamp: 'Just now',
        category: 'MISSION',
        targetTab: 'routes',
        read: false,
        priority: 'MEDIUM',
      },
      ...prev,
    ]);
  };

  // Dynamic Rerouting Demo & Triggers (Section 15, 31)
  const triggerLandslideSpike = () => {
    // 1. Landslide risk increases on Route C (Halflong Ridge segment NH54-S303)
    setRoadSegments((prev) =>
      prev.map((seg) => {
        if (seg.segment_id === 'NH54-S303') {
          return {
            ...seg,
            landslide_risk: 0.76, // 18% -> 76%
            disruption_exposure: 0.74,
            road_condition: 0.45,
            road_condition_label: 'Degraded',
            last_updated: 'Just now (Telemetry)',
          };
        }
        return seg;
      })
    );

    // 2. Set reroute alert banner
    setRerouteAlert({
      detected: true,
      previousRouteId: 'route-c',
      previousRouteName: 'Route C (Halflong Ridge)',
      newRouteId: 'route-b',
      newRouteName: 'Route B (Southern Highway via Silchar)',
      reason: 'Landslide risk increased on Halflong ridge (18% → 76%)',
      oldRiskPct: 18,
      newRiskPct: 76,
    });

    // 3. Mark mission at risk
    setMissions((prev) =>
      prev.map((m) =>
        m.missionNo === 'NER-2042'
          ? {
              ...m,
              status: 'AT_RISK',
              routeRisk: 'CRITICAL',
              disruptionReason: 'Slope failure detected on Route C; reroute to Route B recommended',
            }
          : m
      )
    );

    recordSystemEvent('HAZARD_DETECTED', 'Major slope displacement sensor spike on Route C Halflong bypass (76% risk)', 'CRITICAL');
    recordSystemEvent('ROAD_RISK_CHANGED', 'Halflong Ridge Segment NH54-S303 downgraded to DEGRADED', 'WARNING');

    setNotifications((prev) => [
      {
        id: `notif-reroute-${Date.now()}`,
        title: 'ROUTE CHANGE DETECTED: Mission #NER-2042',
        message: 'Route C disruption exposure increased to 76%. System recommends Route B (41% risk). Officer approval required.',
        timestamp: 'Just now',
        category: 'MISSION',
        targetTab: 'routes',
        read: false,
        priority: 'CRITICAL',
      },
      ...prev,
    ]);
  };

  const approveReroute = () => {
    if (!rerouteAlert) return;
    const newRouteId = rerouteAlert.newRouteId;
    approveRoute(newRouteId, `Dynamic reroute approved: ${rerouteAlert.reason}`);
    setRerouteAlert(null);

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === 'veh-07'
          ? {
              ...v,
              nextRisk: 'Executing Southern Corridor bypass (Route B)',
              delayMinutes: 35,
              routeRisk: 'MODERATE',
            }
          : v
      )
    );

    setFieldTeams((prev) =>
      prev.map((t, idx) =>
        idx === 0
          ? {
              ...t,
              status: 'EN_ROUTE',
              currentTask: 'Halflong pass boulder & mud clearing',
              location: 'Halflong Ridge (Route C)',
            }
          : t
      )
    );

    recordSystemEvent('FIELD_TEAM_DISPATCHED', 'BRO Response Team 03 dispatched to Halflong pass for rockfall clearance', 'INFO');
  };

  const runEndToEndDemo = () => {
    resetSimulation();
    startSimulation();
  };

  // Citizen Incident Pipeline (Section 17-19)
  const submitCitizenIncident = (data: {
    title: string;
    category: string;
    corridor: string;
    location: string;
    description: string;
    photoUrl?: string;
  }) => {
    const newReport: IncidentReport = {
      id: `cit-rep-${Date.now()}`,
      incidentNo: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title || 'Community Hazard Report',
      incidentType: (data.category as any) || 'ROAD_OBSTRUCTION',
      location: data.location || 'Local Road',
      corridor: data.corridor || 'NH-29',
      lat: 25.68,
      lng: 94.11,
      severity: 'HIGH',
      photoUrl:
        data.photoUrl ||
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      description: data.description || 'Observed water accumulation and mud on road shoulder.',
      reportedBy: 'Citizen / Community Report',
      reportedTime: 'Just now',
      status: 'SUBMITTED',
      aiConfidencePct: 84,
      aiClassification: 'Community crowd-sourced hazard report',
      potentialImpact: 'MEDIUM',
      recommendedAction: 'Awaiting Municipal Officer verification',
      isOfflineCreated: false,
      syncedAt: 'Just now',
    };

    setIncidents((prev) => [newReport, ...prev]);
    recordSystemEvent('CITIZEN_REPORT_SUBMITTED', `Citizen reported hazard near ${data.location}: ${data.title}`, 'INFO');

    setNotifications((prev) => [
      {
        id: `notif-cit-${Date.now()}`,
        title: 'New Citizen Incident Report',
        message: `${data.title} reported near ${data.location}. Requires Municipal Officer verification.`,
        timestamp: 'Just now',
        category: 'REPORT',
        targetTab: 'reports',
        read: false,
        priority: 'MEDIUM',
      },
      ...prev,
    ]);
  };

  const verifyCitizenReport = (reportId: string) => {
    const report = incidents.find((r) => r.id === reportId);
    if (!report) return;

    setIncidents((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'FIELD_VERIFICATION',
              recommendedAction: 'Verified by Municipal Officer; road risk updated.',
            }
          : r
      )
    );

    setRoadSegments((prev) =>
      prev.map((seg) => {
        if (seg.road_name === report.corridor || seg.segment_id.includes('NH29')) {
          return {
            ...seg,
            incident_risk: Math.min(0.9, seg.incident_risk + 0.25),
            disruption_exposure: Math.min(0.95, seg.disruption_exposure + 0.15),
            last_updated: 'Just now (Verified Report)',
          };
        }
        return seg;
      })
    );

    recordSystemEvent(
      'CITIZEN_REPORT_VERIFIED',
      `Municipal Officer verified incident ${report.incidentNo}. Road network risk recalculated.`,
      'SUCCESS'
    );
  };

  return (
    <IncidentContext.Provider
      value={{
        missions,
        selectedMission,
        selectMission,
        createMission,
        updateMissionStatus,
        vehicles,
        selectedVehicle,
        selectVehicle,
        corridors,
        selectedCorridor,
        selectCorridor,
        routes,
        selectedRoute,
        selectRoute,
        disruptionPrediction,
        supplyItems,
        prepositionSupply,
        warehouses,
        sensors,
        incidents,
        submitIncidentReport,
        updateIncidentStatus,
        fieldTeams,
        assignFieldTeam,
        updateTeamStatus,
        alerts,
        broadcastAlert,
        dataPipelines,
        modelEvaluation,
        simulationState,
        currentStepIndex,
        currentStep: EXTENDED_SIMULATION_STEPS[currentStepIndex],
        simulationSteps: EXTENDED_SIMULATION_STEPS,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        resetSimulation,
        goToStep,
        offlineStatus,
        toggleOfflineMode,
        triggerManualSync,
        notifications,
        markNotificationRead,
        clearNotifications,
        auditLogs,
        roadSegments,
        updateSegmentRisk,
        setSegmentBlocked,
        setSegmentRoadCondition,
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
        systemEvents,
        recordSystemEvent,
        publicWarnings,
        submitCitizenIncident,
        verifyCitizenReport,
        kpiFilter,
        setKpiFilter,
        currentRole,
        setCurrentRole,
        canCreateMission,
        canIssueAlert,
        canModifyRoute,
        canAssignTeam,
        canManageSensors,
        canApproveRoute,
        canDispatchMission,
        canControlRoads,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = (): IncidentContextType => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};

// Convenient alias for logistics naming
export const useLogistics = useIncident;
