import React, { useState } from 'react';
import { UserRole } from './types';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GlobalIncidentBar } from './components/common/GlobalIncidentBar';
import { DemoWalkthroughBar } from './components/common/DemoWalkthroughBar';
import { DataProvenanceModal } from './components/common/DataProvenanceModal';

// All Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { RoadNetworkPage } from './pages/RoadNetworkPage';
import { WeatherRiskPage } from './pages/WeatherRiskPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { RoutesPage } from './pages/RoutesPage';
import { SupplyPage } from './pages/SupplyPage';
import { IncidentDetectionPage } from './pages/IncidentDetectionPage';
import { MissionsPage } from './pages/MissionsPage';
import { FleetPage } from './pages/FleetPage';
import { CargoPage } from './pages/CargoPage';
import { WarehousesPage } from './pages/WarehousesPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AlertsPage } from './pages/AlertsPage';
import { FieldTeamsPage } from './pages/FieldTeamsPage';
import { ReportsPage } from './pages/ReportsPage';
import { IoTPage } from './pages/IoTPage';
import { OfflineFieldPage } from './pages/OfflineFieldPage';
import { DriverAppPage } from './pages/DriverAppPage';
import { CitizenAppPage } from './pages/CitizenAppPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ModelFeedbackPage } from './pages/ModelFeedbackPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';

import { IncidentProvider, useIncident } from './context/IncidentContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [navParams, setNavParams] = useState<any>({});
  const [isWalkthroughBarOpen, setIsWalkthroughBarOpen] = useState(true);
  const [isProvenanceModalOpen, setIsProvenanceModalOpen] = useState(false);

  const {
    currentRole,
    setCurrentRole,
    simulationState,
  } = useIncident();

  const handleNavigate = (tab: string, params?: any) => {
    if (params) {
      setNavParams(params);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on landing page, show full Landing experience
  if (activeTab === 'landing') {
    return (
      <LandingPage
        onEnterDashboard={() => setActiveTab('dashboard')}
        onPlanMission={() => setActiveTab('routes')}
        onEnterDriverApp={() => setActiveTab('field-app')}
        onEnterCitizenApp={() => setActiveTab('citizen-app')}
      />
    );
  }

  // If on mobile Driver App, render mobile-optimized view without desktop sidebar
  if (activeTab === 'field-app') {
    return (
      <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
        <DriverAppPage onNavigate={handleNavigate} />
      </div>
    );
  }

  // If on Citizen Safety App, render dedicated commuter/citizen view
  if (activeTab === 'citizen-app') {
    return (
      <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
        <CitizenAppPage onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Top Command Platform Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Persistent Global Mission & Disruption Bar */}
      <GlobalIncidentBar onNavigate={handleNavigate} />

      {/* Guided Simulation Replay Scrubber Bar */}
      {(simulationState !== 'IDLE' || isWalkthroughBarOpen) && (
        <DemoWalkthroughBar
          onClose={() => setIsWalkthroughBarOpen(false)}
          onNavigate={handleNavigate}
        />
      )}

      {/* Main Command Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          currentRole={currentRole}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto bg-navy-950">
          {/* MONITOR */}
          {activeTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {activeTab === 'map' && <MapPage onNavigate={handleNavigate} />}
          {activeTab === 'roads' && <RoadNetworkPage onNavigate={handleNavigate} />}
          {activeTab === 'weather' && <WeatherRiskPage onNavigate={handleNavigate} />}

          {/* INTELLIGENCE */}
          {(activeTab === 'disruptions' || activeTab === 'predictions') && (
            <PredictionsPage onNavigate={handleNavigate} />
          )}
          {activeTab === 'routes' && <RoutesPage onNavigate={handleNavigate} />}
          {activeTab === 'supply' && <SupplyPage onNavigate={handleNavigate} />}
          {activeTab === 'incident-detection' && (
            <IncidentDetectionPage onNavigate={handleNavigate} />
          )}

          {/* LOGISTICS */}
          {activeTab === 'missions' && <MissionsPage onNavigate={handleNavigate} />}
          {activeTab === 'fleet' && <FleetPage onNavigate={handleNavigate} />}
          {activeTab === 'cargo' && <CargoPage onNavigate={handleNavigate} />}
          {activeTab === 'warehouses' && <WarehousesPage onNavigate={handleNavigate} />}

          {/* RESPONSE */}
          {activeTab === 'emergency' && <EmergencyPage onNavigate={handleNavigate} />}
          {activeTab === 'alerts' && <AlertsPage onNavigate={handleNavigate} />}
          {(activeTab === 'field-teams' || activeTab === 'field') && (
            <FieldTeamsPage onNavigate={handleNavigate} />
          )}
          {activeTab === 'reports' && <ReportsPage onNavigate={handleNavigate} />}

          {/* SYSTEM */}
          {activeTab === 'iot' && <IoTPage onNavigate={handleNavigate} />}
          {activeTab === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} />}
          {activeTab === 'model-feedback' && <ModelFeedbackPage />}
          {activeTab === 'datasources' && <DataSourcesPage />}
          {activeTab === 'settings' && (
            <SettingsPage currentRole={currentRole} onRoleChange={setCurrentRole} />
          )}

          {/* OFFLINE MODE */}
          {activeTab === 'offline-mode' && <OfflineFieldPage onNavigate={handleNavigate} />}
        </main>
      </div>

      {/* Global Data Lineage & Algorithmic Provenance Modal */}
      <DataProvenanceModal
        isOpen={isProvenanceModalOpen}
        onClose={() => setIsProvenanceModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <IncidentProvider>
      <AppContent />
    </IncidentProvider>
  );
};
