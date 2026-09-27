import React from 'react';
import {
  Settings,
  Shield,
  UserCheck,
  CheckCircle2,
  XCircle,
  Key,
  Lock,
  Radio,
  Server,
  Bell,
  Navigation,
} from 'lucide-react';
import { UserRole } from '../types';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface SettingsPageProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentRole, onRoleChange }) => {
  const {
    canCreateMission,
    canIssueAlert,
    canModifyRoute,
    canAssignTeam,
    canManageSensors,
    auditLogs,
  } = useIncident();

  const rolesConfig: {
    id: UserRole;
    name: string;
    description: string;
    permissions: string[];
  }[] = [
    {
      id: 'logistics_officer',
      name: 'Disaster / Logistics Officer',
      description: 'Supreme command authority for emergency freight dispatch, alerts, and team allocations.',
      permissions: ['Create Missions', 'Issue Emergency Alerts', 'Modify Route Recommendations', 'Assign Field Teams'],
    },
    {
      id: 'transport_officer',
      name: 'Municipal / Transport Officer',
      description: 'State PWD and transport highway control authority; monitors bridges and speed regulations.',
      permissions: ['Create Missions', 'Issue Emergency Alerts', 'Modify Route Recommendations', 'Manage Sensors'],
    },
    {
      id: 'fleet_operator',
      name: 'Fleet Operator',
      description: 'Fleet coordinator managing vehicle telematics, fuel routing, and driver communication.',
      permissions: ['Modify Route Recommendations', 'Track Telematics'],
    },
    {
      id: 'field_officer',
      name: 'Field Officer',
      description: 'On-ground patrol unit conducting roadblock inspections, sensor validation, and driver app updates.',
      permissions: ['Submit Ground Reports', 'Update Field Status'],
    },
    {
      id: 'driver',
      name: 'Vehicle Driver / Crew',
      description: 'Mobile convoy operator executing approved logistics routes and reporting immediate road obstacles.',
      permissions: ['View Assigned Mission', 'View Approved Route', 'Start Navigation', 'Submit Driver Road Alert', 'Emergency SOS'],
    },
    {
      id: 'citizen',
      name: 'Citizen / Public Safety View',
      description: 'Public community user receiving simplified road disruption warnings and submitting crowd-sourced road condition reports.',
      permissions: ['View Public Safety Advisories', 'Check Safer Corridors', 'Submit Citizen Road Report'],
    },
    {
      id: 'admin',
      name: 'System Administrator',
      description: 'Complete administrative access over IoT hardware nodes, API integrations, and RBAC policies.',
      permissions: ['Create Missions', 'Issue Emergency Alerts', 'Modify Route Recommendations', 'Assign Field Teams', 'Manage Sensors', 'Security Audit'],
    },
    {
      id: 'viewer',
      name: 'Read-only Viewer',
      description: 'Auditor or inter-agency observer with read-only visualization privileges across corridors.',
      permissions: ['Read-only View'],
    },
  ];

  const permissionMatrix = [
    {
      action: 'Create Logistics Missions',
      desc: 'Commission new emergency or scheduled supply movement',
      authorized: canCreateMission,
      rolesAllowed: ['Disaster / Logistics Officer', 'Transport Officer', 'System Admin'],
    },
    {
      action: 'Issue Emergency Alerts',
      desc: 'Broadcast multi-channel warnings to regional drivers & public',
      authorized: canIssueAlert,
      rolesAllowed: ['Disaster / Logistics Officer', 'Transport Officer', 'System Admin'],
    },
    {
      action: 'Modify Route Recommendations',
      desc: 'Override standard routing with custom safety corridors',
      authorized: canModifyRoute,
      rolesAllowed: ['Disaster / Logistics Officer', 'Transport Officer', 'Fleet Operator', 'System Admin'],
    },
    {
      action: 'Assign Field Teams',
      desc: 'Dispatch emergency response units & heavy equipment',
      authorized: canAssignTeam,
      rolesAllowed: ['Disaster / Logistics Officer', 'System Admin'],
    },
    {
      action: 'Manage IoT Sensors',
      desc: 'Calibrate threshold values, update mesh keys, and manage nodes',
      authorized: canManageSensors,
      rolesAllowed: ['Transport Officer', 'System Admin'],
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-navy-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center space-x-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span>SETTINGS & ROLE-BASED ACCESS CONTROL (RBAC)</span>
            </h1>
            <DataStatusBadge type="LIVE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Operational security policies, identity verification, and capability permissions across the 6 regional roles
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-navy-900 border border-surface-border px-3 py-1.5 rounded-lg text-xs font-mono">
          <span className="text-slate-400">ACTIVE ROLE:</span>
          <span className="font-bold text-cyan-400 uppercase">{currentRole.replace('_', ' ')}</span>
        </div>
      </div>

      {/* RBAC Permission Enforcement Matrix (Screen 20) */}
      <div className="bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              OPERATIONAL PERMISSION MATRIX (FOR CURRENT ROLE)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">ENFORCED IN REAL-TIME</span>
        </div>

        <div className="divide-y divide-surface-border bg-navy-950/60 rounded-xl border border-surface-border overflow-hidden">
          {permissionMatrix.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-white text-sm block">{item.action}</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">{item.desc}</span>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  Authorized Roles: {item.rolesAllowed.join(', ')}
                </span>
              </div>

              <div className="shrink-0 flex items-center space-x-2">
                {item.authorized ? (
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>AUTHORIZED</span>
                  </span>
                ) : (
                  <span className="bg-red-950 text-red-300 border border-red-700 px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center space-x-1.5">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>RESTRICTED</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Switcher Grid (Screen 20) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>CONFIGURED OPERATIONAL ROLES (6)</span>
          <span>SELECT TO TEST RBAC ENFORCEMENT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesConfig.map((role) => {
            const isActive = currentRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => onRoleChange(role.id)}
                className={`rounded-xl p-5 border cursor-pointer transition-all shadow-lg flex flex-col justify-between ${
                  isActive
                    ? 'bg-navy-800 border-brand-cyan ring-2 ring-brand-cyan/40'
                    : 'bg-navy-850 border-surface-border hover:bg-navy-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white text-sm font-mono">{role.name}</h3>
                    {isActive && (
                      <span className="bg-cyan-950 text-cyan-300 border border-cyan-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {role.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-surface-border/60">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    GRANTED CAPABILITIES
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((p, i) => (
                      <span
                        key={i}
                        className="bg-navy-950 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-surface-border"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-navy-800 border border-surface-border rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            SECURITY & DISPATCH AUDIT TRAIL
          </h3>
          <span className="text-[10px] font-mono text-slate-400">IMMUTABLE LOG</span>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="bg-navy-950 p-2.5 rounded-lg border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono"
            >
              <div>
                <span className="text-cyan-400 font-bold">{log.user}</span>
                <span className="text-slate-400 ml-2">({log.role})</span>
                <span className="text-white block sm:inline sm:ml-2">— {log.action}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
