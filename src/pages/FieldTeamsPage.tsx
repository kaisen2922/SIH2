import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit3,
  Phone,
  MessageSquare,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { FieldTeam } from '../types';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface FieldTeamsPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const FieldTeamsPage: React.FC<FieldTeamsPageProps> = ({ onNavigate }) => {
  const { fieldTeams, updateTeamStatus, assignFieldTeam, canAssignTeam } = useIncident();

  const [selectedTeam, setSelectedTeam] = useState<FieldTeam>(fieldTeams[0]);
  const [newNote, setNewNote] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTask, setAssignTask] = useState('Clear single-lane debris');
  const [assignIncidentId, setAssignIncidentId] = useState('inc-402');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    updateTeamStatus(selectedTeam.id, selectedTeam.status, newNote.trim());
    setNewNote('');
  };

  const handleStatusChange = (status: FieldTeam['status']) => {
    updateTeamStatus(selectedTeam.id, status);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignFieldTeam(selectedTeam.id, assignTask, assignIncidentId);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <Users className="w-6 h-6 text-cyan-400" />
              <span>FIELD RESPONSE TEAMS</span>
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Deployment, live status, task verification, and incident management for on-ground response units
          </p>
        </div>

        {canAssignTeam && (
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-brand-blue/30"
          >
            <Plus className="w-4 h-4" />
            <span>ASSIGN UNIT TASK</span>
          </button>
        )}
      </div>

      {/* Main Grid: Teams List (5 cols) + Selected Team Detail / Note Log (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Teams List (Screen 16 exact teams: Team Alpha, Team Bravo, etc.) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>ACTIVE UNITS ({fieldTeams.length})</span>
            <span>RADIO DISPATCH</span>
          </div>

          <div className="space-y-3">
            {fieldTeams.map((team) => {
              const isSelected = selectedTeam.id === team.id;
              const isOnSite = team.status === 'ON_SITE';
              const isEnRoute = team.status === 'EN_ROUTE';

              return (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`bg-navy-850 rounded-xl p-4 border cursor-pointer transition-all shadow-md hover:bg-navy-800 ${
                    isSelected
                      ? 'border-brand-cyan ring-2 ring-brand-cyan/40 bg-navy-800'
                      : 'border-surface-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white text-sm font-mono">{team.name}</h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {team.personnelCount} Personnel • Unit ID: {team.id}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        isOnSite
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                          : isEnRoute
                          ? 'bg-amber-950 text-amber-300 border-amber-600 animate-pulse'
                          : 'bg-navy-950 text-slate-400 border-surface-border'
                      }`}
                    >
                      {team.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="bg-navy-950 p-2.5 rounded-lg border border-surface-border space-y-1 text-xs font-mono mb-2">
                    <div className="flex items-center text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1.5 shrink-0" />
                      <span className="text-slate-400 mr-1">Location:</span>
                      <strong className="text-white">{team.location}</strong>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
                      <span className="text-slate-400 mr-1">ETA:</span>
                      <strong className="text-amber-300">{team.eta}</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">
                      ASSIGNED TASK
                    </span>
                    <p className="font-medium text-white text-[11px] line-clamp-1 mt-0.5">
                      {team.currentTask}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Team Management Detail (Screen 16 actions: Assign, Update status, Add notes, Close incident) */}
        <div className="lg:col-span-7 bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                UNIT DISPATCH CONTROLLER
              </span>
              <h2 className="text-lg font-bold text-white font-mono mt-0.5">{selectedTeam.name}</h2>
              <span className="text-xs text-slate-400 font-mono">
                Current Sector: {selectedTeam.location} • VHF Comm: {selectedTeam.contact}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => handleStatusChange('ON_SITE')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                  selectedTeam.status === 'ON_SITE'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-navy-950 text-slate-400 hover:text-white border border-surface-border'
                }`}
              >
                ON SITE
              </button>
              <button
                onClick={() => handleStatusChange('EN_ROUTE')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                  selectedTeam.status === 'EN_ROUTE'
                    ? 'bg-amber-600 text-white'
                    : 'bg-navy-950 text-slate-400 hover:text-white border border-surface-border'
                }`}
              >
                EN ROUTE
              </button>
              <button
                onClick={() => handleStatusChange('STANDBY')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                  selectedTeam.status === 'STANDBY'
                    ? 'bg-blue-600 text-white'
                    : 'bg-navy-950 text-slate-400 hover:text-white border border-surface-border'
                }`}
              >
                STANDBY
              </button>
            </div>
          </div>

          {/* Current Task Detail */}
          <div className="bg-navy-950 p-4 rounded-xl border border-surface-border space-y-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
              PRIMARY MISSION TASK
            </span>
            <h3 className="text-base font-bold text-white">{selectedTeam.currentTask}</h3>
            {selectedTeam.assignedIncidentId && (
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 pt-1">
                <span>Bound Incident:</span>
                <span className="text-cyan-300 font-bold">#{selectedTeam.assignedIncidentId}</span>
                <button
                  onClick={() => onNavigate('incident-detection')}
                  className="text-cyan-400 underline hover:text-cyan-300 ml-2"
                >
                  View CV Evidence
                </button>
              </div>
            )}
          </div>

          {/* Add Notes & Incident Log */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold block">
              OPERATIONAL LOG & TELEMETRY NOTES
            </span>

            <div className="bg-navy-950 p-3 rounded-xl border border-surface-border space-y-2 max-h-48 overflow-y-auto">
              {selectedTeam.notes.length === 0 ? (
                <div className="text-slate-500 text-xs font-mono">No notes logged yet.</div>
              ) : (
                selectedTeam.notes.map((note, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs font-mono text-slate-300">
                    <span className="text-cyan-400 shrink-0">►</span>
                    <span>{note}</span>
                  </div>
                ))
              )}
            </div>

            {/* Note Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log field update or obstacle measurement..."
                className="flex-1 bg-navy-950 border border-surface-border rounded-lg text-xs text-white px-3 py-2 outline-none focus:border-brand-blue"
              />
              <button
                onClick={handleAddNote}
                className="bg-brand-blue hover:bg-blue-600 text-white font-mono text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
