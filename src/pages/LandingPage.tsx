import React from 'react';
import {
  Navigation,
  BrainCircuit,
  Route,
  Truck,
  ShieldCheck,
  ChevronRight,
  Boxes,
  CloudRain,
  MapPin,
  ExternalLink,
  Smartphone,
  Radio,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onPlanMission: () => void;
  onEnterDriverApp: () => void;
  onEnterCitizenApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onPlanMission,
  onEnterDriverApp,
  onEnterCitizenApp,
}) => {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-brand-blue selection:text-white">
      {/* Top Public Header */}
      <header className="border-b border-surface-border bg-navy-900/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue via-brand-cyan to-teal-500 flex items-center justify-center shadow-lg shadow-brand-blue/30">
              <Navigation className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-mono">
                  NERFLOW<span className="text-brand-cyan ml-0.5">AI</span>
                </span>
                <span className="bg-navy-950 text-[10px] text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  NER LOGISTICS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                AI-Powered Logistics & Accessibility Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onEnterDriverApp}
              className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-300 hover:text-cyan-400 font-medium px-3 py-2 rounded-lg transition-colors border border-surface-border hover:bg-navy-850"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Driver App</span>
            </button>

            {onEnterCitizenApp && (
              <button
                onClick={onEnterCitizenApp}
                className="hidden md:flex items-center space-x-1.5 text-xs text-emerald-300 hover:text-emerald-200 font-medium px-3 py-2 rounded-lg transition-colors border border-emerald-800/60 hover:bg-emerald-950/60"
              >
                <span>Citizen Safety</span>
              </button>
            )}

            <button
              onClick={onEnterDashboard}
              className="bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-brand-blue/30 transition-all flex items-center space-x-1.5"
            >
              <span>OPEN COMMAND CENTER</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        {/* Subtle Background Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-navy-900 border border-cyan-800/60 px-3 py-1.5 rounded-full text-xs font-mono text-cyan-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>NORTH EASTERN REGION (NER) LOGISTICS INTELLIGENCE PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Predict disruptions.<br />
            <span className="bg-gradient-to-r from-brand-cyan via-teal-400 to-blue-400 bg-clip-text text-transparent">
              Optimize routes.
            </span><br />
            Keep essential supplies moving.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered regional logistics intelligence for safer transportation, emergency supply movement
            and resilient connectivity across the North Eastern Region.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto bg-brand-blue hover:bg-blue-600 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-xl shadow-brand-blue/40 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>OPEN COMMAND CENTER</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onPlanMission}
              className="w-full sm:w-auto bg-navy-900 hover:bg-navy-850 text-cyan-300 border border-cyan-700/60 font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Route className="w-4 h-4 text-cyan-400" />
              <span>PLAN A LOGISTICS MISSION</span>
            </button>
          </div>
        </div>

        {/* Three Hero Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto w-full">
          {/* Card 1: PREDICT */}
          <div className="bg-navy-900/80 border border-surface-border hover:border-cyan-500/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div className="font-mono text-xs font-bold text-cyan-400 tracking-wider mb-1">
              01. PREDICT
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Disruption Intelligence</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Predicts rainfall blockages, steep terrain landslides, and road subsidence 2–4 hours before
              impact using multi-sensor environmental data fusion.
            </p>
          </div>

          {/* Card 2: ROUTE */}
          <div className="bg-navy-900/80 border border-surface-border hover:border-blue-500/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Route className="w-6 h-6" />
            </div>
            <div className="font-mono text-xs font-bold text-blue-400 tracking-wider mb-1">
              02. ROUTE
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Risk-Aware Route Optimization</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Balances travel time, elevation hazard curves, vehicle suitability, and live corridor risks
              to recommend genuinely safe transit corridors.
            </p>
          </div>

          {/* Card 3: DELIVER */}
          <div className="bg-navy-900/80 border border-surface-border hover:border-teal-500/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div className="font-mono text-xs font-bold text-teal-400 tracking-wider mb-1">
              03. DELIVER
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Fleet & Supply Intelligence</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tracks convoys, forecasts essential medicine and fuel depletion in isolated districts, and
              enables proactive pre-positioning before crises.
            </p>
          </div>
        </div>

        {/* Regional States Covered Banner */}
        <div className="mt-16 text-center border-t border-surface-border/70 pt-8">
          <p className="text-xs font-mono uppercase text-slate-500 font-bold tracking-widest mb-3">
            COVERING CRITICAL LIFELINE CORRIDORS ACROSS ALL 8 NER STATES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-300">
            {['Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'].map((st, i) => (
              <span key={i} className="bg-navy-900 px-3 py-1 rounded-md border border-surface-border font-semibold">
                {st}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-navy-950 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        NERFLOW AI — Regional Logistics & Accessibility Intelligence Platform
      </footer>
    </div>
  );
};
