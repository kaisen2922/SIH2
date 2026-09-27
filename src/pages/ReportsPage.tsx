import React, { useState } from 'react';
import {
  FileCheck2,
  Send,
  Upload,
  Camera,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { IncidentReport, RiskLevel } from '../types';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface ReportsPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const { incidents, submitIncidentReport, updateIncidentStatus } = useIncident();

  // Form Fields
  const [incidentType, setIncidentType] = useState<IncidentReport['incidentType']>('ROAD_OBSTRUCTION');
  const [location, setLocation] = useState('NH-29 Kohima Pass (MP 148)');
  const [severity, setSeverity] = useState<RiskLevel>('HIGH');
  const [description, setDescription] = useState('Large debris blocking one lane.');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitIncidentReport({
      incidentType,
      location,
      severity,
      description,
      title: `${incidentType.replace('_', ' ')} on ${location.split(' ')[0]}`,
      photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    });
    setHasSubmitted(true);
    setTimeout(() => setHasSubmitted(false), 3500);
  };

  const workflowSteps = [
    { key: 'SUBMITTED', label: 'SUBMITTED' },
    { key: 'SERVER_RECEIVED', label: 'SERVER RECEIVED' },
    { key: 'AI_ANALYSIS', label: 'AI ANALYSIS' },
    { key: 'FIELD_VERIFICATION', label: 'FIELD VERIFICATION' },
    { key: 'RESOLVED', label: 'RESOLVED' },
  ];

  const getStepIndex = (status: IncidentReport['status']) => {
    return workflowSteps.findIndex((s) => s.key === status);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <FileCheck2 className="w-6 h-6 text-cyan-400" />
              <span>FIELD INCIDENT REPORTS</span>
            </h1>
            <DataStatusBadge type="FIELD_REPORT" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            5-stage lifecycle tracking from crowd/patrol submission to AI triage and field resolution
          </p>
        </div>
      </div>

      {/* Main Grid: Submit Form (Left 5 cols) + Active Incident Stream & Lifecycle (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-5 bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
              <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                FIELD INCIDENT REPORT
              </h2>
              <span className="text-[10px] font-mono text-slate-400">GPS ACCREDITED</span>
            </div>

            {hasSubmitted && (
              <div className="mb-4 bg-emerald-950 border border-emerald-600 text-emerald-200 p-3 rounded-lg text-xs font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Incident Submitted! Dispatched to AI Analysis Queue.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                  INCIDENT TYPE
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs font-medium text-white px-3 py-2 outline-none focus:border-brand-blue"
                >
                  <option value="ROAD_OBSTRUCTION">Road obstruction</option>
                  <option value="LANDSLIDE">Landslide / Debris flow</option>
                  <option value="FLASH_FLOOD">Flash flood / Waterlogging</option>
                  <option value="BRIDGE_DAMAGE">Bridge damage / Structural scour</option>
                  <option value="SUBSIDENCE">Road subsidence / Fissure</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                  LOCATION (AUTO-DETECTED GPS)
                </label>
                <div className="flex items-center bg-navy-950 border border-surface-border rounded-lg px-3 py-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                  PHOTO ATTACHMENT
                </label>
                <div className="border-2 border-dashed border-surface-border rounded-lg p-3 text-center bg-navy-950/60 hover:border-cyan-400 transition-colors cursor-pointer flex flex-col items-center justify-center space-y-1">
                  <Camera className="w-5 h-5 text-cyan-400" />
                  <span className="text-[11px] text-slate-300">Evidence Photo Attached (debris.jpg)</span>
                  <span className="text-[9px] text-slate-500">Click or tap to replace media</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                  SEVERITY
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs font-bold text-orange-400 px-3 py-2 outline-none focus:border-brand-blue"
                >
                  <option value="CRITICAL">Critical (Total Blockage)</option>
                  <option value="HIGH">High (Single Lane Constriction)</option>
                  <option value="MODERATE">Moderate (Slow Speed Caution)</option>
                  <option value="LOW">Low (Minor Shoulder Debris)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-navy-950 border border-surface-border rounded-lg text-xs text-white p-3 outline-none focus:border-brand-blue resize-none"
                  placeholder="Describe road blockage and pass condition..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-brand-blue/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND REPORT</span>
              </button>
            </form>
          </div>
        </div>

        {/* Incidents Stream & Workflow Progression Tracker (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>ACTIVE INCIDENTS STREAM ({incidents.length})</span>
            <span>VERIFICATION PIPELINE</span>
          </div>

          <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
            {incidents.map((incident) => {
              const currentStepIdx = getStepIndex(incident.status);

              return (
                <div
                  key={incident.id}
                  className="bg-navy-850 rounded-xl p-4 border border-surface-border shadow-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-white">
                          #{incident.incidentNo}
                        </span>
                        <span className="text-slate-400 text-xs">• {incident.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {incident.location} • Reported {incident.reportedTime}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        incident.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-300 border-red-700'
                          : incident.severity === 'HIGH'
                          ? 'bg-orange-950 text-orange-300 border-orange-700'
                          : 'bg-amber-950 text-amber-300 border-amber-700'
                      }`}
                    >
                      {incident.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-navy-950 p-2.5 rounded border border-surface-border leading-relaxed">
                    "{incident.description}"
                  </p>

                  {/* 5-Stage Workflow Progression Tracker (Screen 11) */}
                  <div className="pt-2 border-t border-surface-border">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block mb-1.5">
                      LIFECYCLE WORKFLOW PROGRESSION
                    </span>

                    <div className="grid grid-cols-5 gap-1 text-center font-mono">
                      {workflowSteps.map((step, idx) => {
                        const isDone = idx < currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div
                            key={step.key}
                            className={`p-1 rounded text-[9px] font-bold border transition-colors ${
                              isCurrent
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-500 animate-pulse'
                                : isDone
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                                : 'bg-navy-950 text-slate-600 border-surface-border'
                            }`}
                          >
                            <span>{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                    <span className="text-cyan-400">
                      AI Confidence: {incident.aiConfidencePct}%
                    </span>
                    <div className="flex space-x-2">
                      {incident.status !== 'RESOLVED' && (
                        <button
                          onClick={() => updateIncidentStatus(incident.id, 'RESOLVED')}
                          className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded text-[10px]"
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button
                        onClick={() => onNavigate('field-teams')}
                        className="bg-navy-950 hover:bg-navy-900 text-slate-300 border border-surface-border px-2 py-0.5 rounded text-[10px]"
                      >
                        Assign Team
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
