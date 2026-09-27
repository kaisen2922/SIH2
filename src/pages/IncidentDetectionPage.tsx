import React, { useState } from 'react';
import {
  Eye,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface IncidentDetectionPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const IncidentDetectionPage: React.FC<IncidentDetectionPageProps> = ({ onNavigate }) => {
  const { incidents, submitIncidentReport, verifyCitizenReport } = useIncident();

  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    classification: string;
    confidencePct: number;
    location: string;
    impact: string;
    recommendedAction: string;
    boundingBoxes: { label: string; x: number; y: number; w: number; h: number }[];
  }>({
    classification: 'Possible road obstruction (boulder & debris cluster)',
    confidencePct: 87,
    location: 'NH-29 Corridor (MP 148 near Kohima)',
    impact: 'HIGH (Blocks southbound commercial lane)',
    recommendedAction: 'FIELD VERIFICATION & Excavator dispatch',
    boundingBoxes: [
      { label: 'Boulder Debris (87%)', x: 28, y: 35, w: 44, h: 42 },
      { label: 'Lane Constriction (91%)', x: 20, y: 30, w: 60, h: 55 },
    ],
  });

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setAnalysisResult({
        classification: 'Severe rockfall & slope toe slip',
        confidencePct: 92,
        location: 'NH-6 Sonapur Tunnel Approach',
        impact: 'CRITICAL (Both lanes obstructed)',
        recommendedAction: 'Full corridor shutdown; reroute via Dima Hasao',
        boundingBoxes: [
          { label: 'Slope Failure (92%)', x: 22, y: 25, w: 56, h: 50 },
        ],
      });
    }, 800);
  };

  const handleDispatchFieldTeam = () => {
    onNavigate('field-teams');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <Eye className="w-6 h-6 text-cyan-400" />
              <span>AI INCIDENT DETECTION</span>
            </h1>
            <DataStatusBadge type="SIMULATION" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Automated computer vision hazard classification from patrol cameras, drones, and citizen uploads
          </p>
        </div>

        <button
          onClick={() => onNavigate('reports')}
          className="bg-navy-900 hover:bg-navy-850 text-cyan-300 border border-cyan-800/60 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Incident Reports Stream</span>
        </button>
      </div>

      {/* Main Grid: Upload & Inspection Canvas (Left) + CV Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Image Box (7 cols) */}
        <div className="lg:col-span-7 bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              INSPECTION EVIDENCE MEDIA
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSimulateUpload}
                disabled={isProcessing}
                className="bg-navy-950 hover:bg-navy-900 text-cyan-300 border border-cyan-800/60 text-xs font-mono px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Sample / Drone Frame</span>
              </button>
            </div>
          </div>

          {/* Visual Container with Simulated AI Bounding Boxes */}
          <div className="relative rounded-xl overflow-hidden border border-surface-border bg-black max-h-[420px] flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Road Obstruction Evidence"
              className="w-full h-full object-cover max-h-[420px]"
            />

            {/* AI Bounding Boxes overlay */}
            {!isProcessing &&
              analysisResult.boundingBoxes.map((box, i) => (
                <div
                  key={i}
                  className="absolute border-2 border-cyan-400 bg-cyan-500/15 rounded pointer-events-none transition-all"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`,
                  }}
                >
                  <span className="absolute -top-6 left-0 bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-700 whitespace-nowrap shadow-md">
                    {box.label}
                  </span>
                </div>
              ))}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center space-y-2 text-cyan-400 font-mono text-xs">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>RUNNING CONVOLUTIONAL INFERENCE...</span>
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>INPUT: NHIDCL Highway Patrol Camera #04</span>
            <span>FRAME RESOLUTION: 1920x1080 @ 30 FPS</span>
          </div>
        </div>

        {/* AI Analysis Result Panel (5 cols) (Screen 10 exact format) */}
        <div className="lg:col-span-5 bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  MODEL TELEMETRY
                </span>
                <h3 className="font-bold text-white text-base mt-0.5">AI ANALYSIS RESULT</h3>
              </div>
              <DataStatusBadge type="MODEL_ESTIMATE" />
            </div>

            <div className="bg-navy-950 p-3.5 rounded-lg border border-surface-border space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">CLASSIFICATION</span>
                <span className="text-white font-bold text-sm block mt-0.5">
                  {analysisResult.classification}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border/60">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">CONFIDENCE</span>
                  <span className="text-cyan-400 font-bold text-base">
                    {analysisResult.confidencePct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">POTENTIAL IMPACT</span>
                  <span className="text-red-400 font-bold text-base">
                    {analysisResult.impact.split(' ')[0]}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border/60">
                <span className="text-slate-400 text-[10px] uppercase block">LOCATION</span>
                <span className="text-slate-200 block">{analysisResult.location}</span>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="bg-amber-950/40 border border-amber-700/60 p-3 rounded-lg text-amber-200 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block mb-1">
                RECOMMENDED ACTION
              </span>
              <p className="font-semibold text-sm">{analysisResult.recommendedAction}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-surface-border">
            <button
              onClick={handleDispatchFieldTeam}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-brand-blue/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>DISPATCH FIELD VERIFICATION TEAM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Citizen Community Reports Stream & Verification (Section 9 Requirement) */}
      <div className="bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              CITIZEN COMMUNITY HAZARD FEED & VERIFICATION
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            SOURCE: CITIZEN APP MESH
          </span>
        </div>

        <div className="space-y-3">
          {incidents
            .filter((i) => i.source === 'CITIZEN_REPORT' || i.reportedBy?.includes('Citizen') || i.id.startsWith('cit-'))
            .map((inc) => (
              <div
                key={inc.id}
                className="bg-navy-950 p-4 rounded-lg border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-sm">#{inc.incidentNo} — {inc.title}</span>
                    <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                      CITIZEN REPORT
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${
                        inc.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                      }`}
                    >
                      {inc.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING VERIFICATION'}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs font-sans leading-relaxed">
                    "{inc.description}"
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                    <span>Location: <strong className="text-slate-200">{inc.location}</strong></span>
                    <span>•</span>
                    <span>Reported: {inc.reportedTime}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-bold">AI Correlation Score: {inc.aiConfidencePct}%</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {inc.verificationStatus !== 'VERIFIED' ? (
                    <button
                      onClick={() => verifyCitizenReport(inc.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors flex items-center space-x-1 shadow-md shadow-emerald-600/30"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>VERIFY REPORT</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold bg-emerald-950/80 border border-emerald-700 px-2.5 py-1 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>OFFICIALLY VERIFIED</span>
                    </div>
                  )}

                  <button
                    onClick={() => onNavigate('field-teams')}
                    className="bg-navy-900 hover:bg-navy-850 text-slate-300 border border-surface-border text-xs px-2.5 py-1.5 rounded transition-colors"
                  >
                    Dispatch Team
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Honest Prototype Notice */}
      <div className="bg-navy-900/60 border border-surface-border rounded-lg p-3 flex items-start space-x-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Prototype Integrity Notice:</strong> AI Computer Vision detection results
          shown above are simulated for verification workflow demonstration. In production, this connects to edge
          YOLOv8 / ViT inference nodes deployed on border roads patrol vehicles and UAV inspection drones.
        </p>
      </div>
    </div>
  );
};
