import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const MOCK_MISSIONS = [
  {
    id: 'ner-mission-2042',
    missionNo: 'NER-2042',
    title: 'Emergency Medicines to Regional Civil Hospital',
    cargo: 'Emergency Medicines',
    origin: 'Guwahati',
    destination: 'Imphal',
    vehicleName: 'Relief Truck 07',
    priority: 'CRITICAL',
    status: 'AT_RISK',
    eta: '8h 42m',
    baselineEta: '8h 10m',
    predictedDelayMin: 32,
    routeRisk: 'MODERATE',
    activeCorridor: 'NH-29',
  },
  {
    id: 'ner-mission-2051',
    missionNo: 'NER-2051',
    title: 'Cold-Chain Pediatric Vaccines',
    cargo: 'Pediatric Vaccines & Blood Plasma',
    origin: 'Silchar',
    destination: 'Aizawl',
    vehicleName: 'Vehicle 01 (Cold-Reefer)',
    priority: 'CRITICAL',
    status: 'ON_ROUTE',
    eta: '4h 15m',
    baselineEta: '4h 10m',
    predictedDelayMin: 5,
    routeRisk: 'LOW',
    activeCorridor: 'NH-306',
  },
  {
    id: 'ner-mission-2060',
    missionNo: 'NER-2060',
    title: 'Disaster Search & Rescue Heavy Gear',
    cargo: 'Hydraulic Cutters, Winches & Drones',
    origin: 'Guwahati',
    destination: 'Silchar',
    vehicleName: 'Vehicle 04 (Heavy Flatbed)',
    priority: 'CRITICAL',
    status: 'DISRUPTED',
    eta: '12h 40m',
    baselineEta: '7h 30m',
    predictedDelayMin: 310,
    routeRisk: 'CRITICAL',
    activeCorridor: 'NH-6',
  },
];

const MOCK_CORRIDORS = [
  { code: 'NH-29', name: 'Guwahati - Dimapur - Kohima - Imphal Lifeline', status: 'HIGH_RISK', traffic: 'Heavy', landslideProbabilityPct: 71 },
  { code: 'NH-27', name: 'East-West Regional Arterial', status: 'NORMAL', traffic: 'Normal', landslideProbabilityPct: 12 },
  { code: 'NH-6', name: 'Shillong - Jowai - Silchar Mountain Pass', status: 'BLOCKED', traffic: 'Gridlock', landslideProbabilityPct: 88 },
  { code: 'NH-37', name: 'Upper Assam Valley', status: 'NORMAL', traffic: 'Normal', landslideProbabilityPct: 8 },
];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'NERFLOW AI — Regional Logistics & Accessibility Intelligence REST Server',
    region: 'North Eastern Region (NER)',
    timestamp: new Date().toISOString(),
    uptime: '99.98%',
  });
});

app.get('/api/missions', (req, res) => {
  res.json({ success: true, count: MOCK_MISSIONS.length, data: MOCK_MISSIONS });
});

app.get('/api/corridors', (req, res) => {
  res.json({ success: true, count: MOCK_CORRIDORS.length, data: MOCK_CORRIDORS });
});

app.listen(PORT, () => {
  console.log(`NERFLOW AI Regional Logistics REST Server running on http://localhost:${PORT}`);
});
