import React from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Route,
  CloudRain,
  BrainCircuit,
  Navigation,
  Boxes,
  Eye,
  PackageCheck,
  Truck,
  Warehouse,
  ShieldAlert,
  Bell,
  Users,
  FileCheck2,
  Radio,
  BarChart3,
  GitCompare,
  Server,
  Settings as SettingsIcon,
  Smartphone,
  WifiOff,
  ChevronRight,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useIncident } from '../../context/IncidentContext';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, currentRole }) => {
  const { alerts, incidents, missions, vehicles, supplyItems, offlineStatus } = useIncident();

  const activeAlertsCount = alerts.filter((a) => a.status === 'BROADCAST').length;
  const criticalMissionsCount = missions.filter((m) => m.status === 'AT_RISK' || m.status === 'DISRUPTED').length;
  const pendingIncidentsCount = incidents.filter((i) => i.status === 'AI_ANALYSIS' || i.status === 'SUBMITTED').length;
  const criticalSuppliesCount = supplyItems.filter((s) => s.riskLevel === 'CRITICAL').length;

  const navGroups = [
    {
      title: 'MONITOR',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'map', label: 'Regional Map', icon: MapIcon, badge: 'GIS' },
        { id: 'roads', label: 'Road Network', icon: Route },
        { id: 'weather', label: 'Weather & Risk', icon: CloudRain },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'disruptions', label: 'AI Disruption Center', icon: BrainCircuit, badge: 'AI' },
        { id: 'routes', label: 'Route Intelligence', icon: Navigation },
        { id: 'supply', label: 'Supply Forecast', icon: Boxes, badge: criticalSuppliesCount > 0 ? `${criticalSuppliesCount} Risk` : undefined },
        { id: 'incident-detection', label: 'Incident Detection', icon: Eye, badge: 'CV' },
      ],
    },
    {
      title: 'LOGISTICS',
      items: [
        { id: 'missions', label: 'Missions', icon: PackageCheck, badge: criticalMissionsCount > 0 ? `${criticalMissionsCount} Alert` : undefined },
        { id: 'fleet', label: 'Fleet', icon: Truck, badge: `${vehicles.length}` },
        { id: 'cargo', label: 'Cargo', icon: Boxes },
        { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
      ],
    },
    {
      title: 'RESPONSE',
      items: [
        { id: 'emergency', label: 'Emergency Logistics', icon: ShieldAlert, badge: 'CRITICAL' },
        { id: 'alerts', label: 'Alerts', icon: Bell, badge: `${activeAlertsCount} Active` },
        { id: 'field-teams', label: 'Field Teams', icon: Users },
        { id: 'reports', label: 'Incident Reports', icon: FileCheck2, badge: pendingIncidentsCount > 0 ? `${pendingIncidentsCount} New` : undefined },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'iot', label: 'IoT Network', icon: Radio },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'model-feedback', label: 'Model Feedback', icon: GitCompare, badge: 'XGB' },
        { id: 'datasources', label: 'Data Sources', icon: Server },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-navy-900 border-r border-surface-border min-h-[calc(100vh-53px)] flex flex-col justify-between shrink-0 select-none">
      <div className="py-2.5 px-2 space-y-3.5 overflow-y-auto max-h-[calc(100vh-140px)]">
        {/* Navigation Groups */}
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 py-0.5 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
              {group.title}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 font-semibold'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 ml-1">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badge === 'AI' || item.badge === 'GIS' || item.badge === 'CV'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-700/50'
                            : item.badge === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border border-red-700/50'
                            : 'bg-navy-950 text-amber-400 border border-amber-700/50'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </div>
                </button>
              );
            })}
          </div>
        ))}

        {/* Quick Purpose-Built Apps Section */}
        <div className="pt-2 border-t border-surface-border space-y-1.5">
          <div className="px-3 py-0.5 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
            FIELD & CITIZEN ACCESS
          </div>
          <button
            onClick={() => onNavigate('field-app')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'field-app'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-navy-950 text-cyan-300 hover:bg-navy-850 border border-cyan-800/50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Field / Driver App</span>
            </div>
            <span className="text-[9px] font-mono bg-cyan-900/60 text-cyan-200 px-1.5 py-0.5 rounded">MOBILE</span>
          </button>

          <button
            onClick={() => onNavigate('citizen-app')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'citizen-app'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-navy-950 text-emerald-300 hover:bg-navy-850 border border-emerald-800/50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Citizen Safety App</span>
            </div>
            <span className="text-[9px] font-mono bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded">PUBLIC</span>
          </button>

          <button
            onClick={() => onNavigate('offline-mode')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'offline-mode'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-navy-950 text-amber-300 hover:bg-navy-850 border border-amber-800/50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span>Offline Field Mode</span>
            </div>
            {offlineStatus.pendingCount > 0 ? (
              <span className="text-[9px] font-mono bg-red-950 text-red-300 px-1.5 py-0.5 rounded font-bold">
                {offlineStatus.pendingCount} QUEUED
              </span>
            ) : (
              <span className="text-[9px] font-mono bg-amber-900/60 text-amber-200 px-1.5 py-0.5 rounded">CACHE</span>
            )}
          </button>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-surface-border bg-navy-950/70 shrink-0">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 font-bold">NER MESH ACTIVE</span>
          </span>
          <span className="text-slate-500 font-bold">NER LOGISTICS</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
          <span>ROLE: <span className="text-slate-200 font-bold uppercase">{currentRole.replace('_', ' ')}</span></span>
          <span className="text-cyan-400 font-mono">v2.4-NER</span>
        </div>
      </div>
    </aside>
  );
};
