import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'NERFLOW AI Regional Logistics Intelligence REST Server',
    region: 'North Eastern Region (NER)',
    timestamp: new Date().toISOString(),
    systemUptimePct: 99.98,
  });
});

app.listen(PORT, () => {
  console.log(`NERFLOW AI Regional Logistics Server running on http://localhost:${PORT}`);
});
