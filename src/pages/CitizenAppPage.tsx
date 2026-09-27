import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  Navigation,
  Compass,
  ArrowRight,
  PhoneCall,
  Info,
  Clock,
  Car,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { DataStatusBadge } from '../components/common/DataStatusBadge';

interface CitizenAppPageProps {
  onNavigate?: (tab: string, params?: any) => void;
}

export const CitizenAppPage: React.FC<CitizenAppPageProps> = ({ onNavigate }) => {
  const {
    publicWarnings,
    roadSegments,
    incidents,
    submitCitizenIncident,
  } = useIncident();

  // State for Safer Route recommendation
  const [showSaferRoutes, setShowSaferRoutes] = useState(false);

  // Form State
  const [hazardType, setHazardType] = useState('Landslide');
  const [location, setLocation] = useState('NH-29 Km 42.5 near Pagla Pahar (Dimapur-Kohima)');
  const [description, setDescription] = useState('Massive rocks and wet mud covering the outer lane after heavy morning rains.');
  const [photoAttached, setPhotoAttached] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const hazardOptions = [
    'Landslide',
    'Waterlogging / Flash Flood',
    'Bridge Damage / Structural Creep',
    'Traffic Gridlock',
    'Road Collapse / Subsidence',
    'Fallen Tree / Heavy Debris',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitCitizenIncident({
        title: `${hazardType} on ${location.split(' ')[0]}`,
        category: hazardType,
        corridor: 'NH-29',
        location,
        description,
        photoUrl: photoAttached
          ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
          : undefined,
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 600);
  };

  const handleUseGps = () => {
    setLocation('GPS: 25.7512° N, 93.8541° E (NH-29 Pagla Pahar, Nagaland)');
  };

  // Filter citizen submitted incidents from the context
  const citizenReports = incidents.filter(
    (inc) => inc.source === 'CITIZEN_REPORT' || inc.reportedBy?.includes('Citizen') || inc.id.startsWith('cit-')
  );

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Mobile-Friendly Header */}
      <header className="bg-navy-900 border-b border-surface-border px-4 py-3 sticky top-0 z-40 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-teal-500 flex items-center justify-center shadow-md">
              <Navigation className="w-4 h-4 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white font-mono">
                  NERFLOW<span className="text-brand-cyan">CITIZEN</span>
                </span>
                <span className="bg-cyan-950 text-[9px] text-cyan-300 border border-cyan-800/80 px-1 py-0.2 rounded font-mono font-bold">
                  PUBLIC ADVISORY
                </span>
              </div>
              <p className="text-[10px] text-slate-400">North Eastern Region Road Safety & Commuter Alert</p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs bg-navy-950 hover:bg-navy-800 text-cyan-300 border border-cyan-800/60 px-2.5 py-1.5 rounded transition-colors font-mono"
            >
              ← Command Center
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-5 space-y-4">
        {/* Region & Mesh Status */}
        <div className="flex items-center justify-between bg-navy-900/80 border border-surface-border p-2.5 rounded-lg text-xs font-mono">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="text-slate-300">LOCATION: Dimapur – Kohima – Imphal Corridor</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">LIVE ADVISORY MESH</span>
          </div>
        </div>

        {/* 1. Primary Road Disruption Alert (Section 9 Requirement) */}
        <div className="bg-gradient-to-br from-amber-950/70 via-navy-900 to-navy-900 border-2 border-amber-600/80 rounded-xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                ROAD DISRUPTION NEAR YOU
              </span>
            </div>
            <DataStatusBadge type="OFFICIAL_ALERT" />
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
            ⚠️ NH-29 near Dimapur experiencing high landslide probability (74%). Single-lane movement only. Expect 3+ hour delays.
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-3 text-xs font-mono bg-navy-950/80 p-2.5 rounded-lg border border-surface-border">
            <div>
              <span className="text-slate-400 text-[10px] block">AFFECTED HIGHWAY</span>
              <span className="text-white font-bold">NH-29 (MP 42.5)</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">ESTIMATED DELAY</span>
              <span className="text-amber-300 font-bold">+180 mins (3 hrs)</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-[10px] block">PASSABILITY</span>
              <span className="text-orange-400 font-bold">Light Vehicles Only</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            NHIDCL patrol and Border Roads Organisation (BRO) have mobilized heavy excavators at Pagla Pahar.
            Commercial vehicles and inter-district travelers are advised to utilize alternate bypasses or postpone non-emergency journeys.
          </p>

          {/* FIND SAFER ROUTE CTA Button */}
          <div className="pt-2 border-t border-surface-border/60">
            <button
              onClick={() => setShowSaferRoutes(!showSaferRoutes)}
              className="w-full bg-gradient-to-r from-brand-blue to-teal-600 hover:from-blue-600 hover:to-teal-500 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-blue/30"
            >
              <Compass className="w-4 h-4 text-cyan-200" />
              <span>{showSaferRoutes ? 'HIDE SAFER CORRIDORS' : 'FIND SAFER ROUTE (AI RECOMMENDED)'}</span>
              {showSaferRoutes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Safer Route Expandable Recommendations */}
          {showSaferRoutes && (
            <div className="mt-4 pt-3 border-t border-surface-border/70 space-y-3 font-mono text-xs animate-fadeIn">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                VERIFIED ALTERNATIVE CORRIDORS
              </span>

              {/* Corridor A: Route C */}
              <div className="bg-navy-950 p-3 rounded-lg border border-cyan-800/80 hover:border-cyan-500 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded text-[10px] font-bold">
                      RECOMMENDED
                    </span>
                    <span className="font-bold text-white text-xs">Route C: Lumding–Halflong–Silchar Bypass</span>
                  </div>
                  <span className="text-cyan-400 font-bold">4h 45m</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mb-2">
                  All clear of active slip zones. Highway surface dry, dual-lane operational. +35 km longer distance but eliminates 180-min mountain bottleneck.
                </p>
                <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                  <span>Distance: 275 km</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Risk Exposure: 18% (Low)</span>
                  <span>•</span>
                  <span>All Vehicles Passable</span>
                </div>
              </div>

              {/* Corridor B: Route B */}
              <div className="bg-navy-950 p-3 rounded-lg border border-surface-border hover:border-amber-700/60 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-700 rounded text-[10px] font-bold">
                      MODERATE RISK
                    </span>
                    <span className="font-bold text-white text-xs">Route B: NH-6 / NH-37 Sonapur Approach</span>
                  </div>
                  <span className="text-amber-300 font-bold">4h 10m</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mb-2">
                  Precautionary monitoring active near Sonapur tunnel. Slow crawl traffic observed. Suitable for SUVs and commercial trucks.
                </p>
                <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                  <span>Distance: 232 km</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">Risk Exposure: 42% (Moderate)</span>
                  <span>•</span>
                  <span>Expect 45m delay</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Citizen Incident Reporting Form (Section 9 Requirement) */}
        <div className="bg-navy-850 border border-surface-border rounded-xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base font-mono">
                  REPORT ROAD HAZARD
                </h3>
                <p className="text-[11px] text-slate-400">Crowdsource road blockages directly to Disaster Logistics</p>
              </div>
            </div>
            <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
              COMMUNITY FEED
            </span>
          </div>

          {submitSuccess && (
            <div className="mb-4 bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-3 rounded-lg text-xs font-mono flex items-start space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">HAZARD REPORT TRANSMITTED SUCCESSFULLY!</span>
                <span className="text-[11px] text-emerald-300">
                  Transmitted to NERFLOW AI Disruption Center. Tagged as <strong>PENDING VERIFICATION</strong> with edge correlation score 78%.
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
            {/* Hazard Type Selection */}
            <div>
              <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                HAZARD TYPE *
              </label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="w-full bg-navy-950 border border-surface-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
              >
                {hazardOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Input with Auto-Detect GPS Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase text-slate-400 font-bold">
                  LOCATION (ROAD / CORRIDOR / KM) *
                </label>
                <button
                  type="button"
                  onClick={handleUseGps}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Auto-detect GPS</span>
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-navy-950 border border-surface-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                placeholder="e.g. NH-29 Km 42 near Pagla Pahar"
                required
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                HAZARD DESCRIPTION *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-navy-950 border border-surface-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-cyan leading-relaxed font-sans text-xs"
                placeholder="Describe road blockage, trapped vehicles, depth of mud, or lane passability..."
                required
              />
            </div>

            {/* Mock Photo Upload */}
            <div>
              <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                PHOTO EVIDENCE
              </label>
              <div className="flex items-center justify-between bg-navy-950 border border-surface-border rounded-lg p-2.5">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300 text-[11px]">
                    {photoAttached ? 'boulder_debris_geo_tagged.jpg (1.8 MB)' : 'No photo selected'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoAttached(!photoAttached)}
                  className="text-[10px] bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-cyan-800/60 px-2 py-1 rounded"
                >
                  {photoAttached ? 'Remove' : 'Attach Photo'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-brand-blue/30"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>TRANSMITTING TO DISPATCH MESH...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>SUBMIT HAZARD REPORT</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 3. Community Reports Stream */}
        <div className="bg-navy-850 border border-surface-border rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              RECENT COMMUNITY SUBMISSIONS ({citizenReports.length})
            </span>
            <span className="text-[10px] text-slate-400 font-mono">CROSS-VERIFIED BY AI</span>
          </div>

          <div className="space-y-2.5">
            {citizenReports.length === 0 ? (
              <div className="text-center py-4 text-slate-500 font-mono text-xs">
                No citizen reports pending verification.
              </div>
            ) : (
              citizenReports.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="bg-navy-950 p-3 rounded-lg border border-surface-border text-xs font-mono space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{r.title}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        r.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                      }`}
                    >
                      {r.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING VERIFICATION'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    "{r.description}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-surface-border/50">
                    <span>{r.location}</span>
                    <span className="text-cyan-400">AI Confidence: {r.aiConfidencePct}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Emergency Contacts Card */}
        <div className="bg-navy-900/60 border border-surface-border rounded-xl p-4 text-xs font-mono space-y-2">
          <div className="flex items-center space-x-2 text-white font-bold">
            <PhoneCall className="w-4 h-4 text-red-400" />
            <span>NORTH EAST EMERGENCY HELPLINES</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-navy-950 p-2 rounded border border-surface-border">
              <span className="text-slate-400 block text-[9px]">NATIONAL EMERGENCY</span>
              <span className="text-red-400 font-bold text-sm">112</span>
            </div>
            <div className="bg-navy-950 p-2 rounded border border-surface-border">
              <span className="text-slate-400 block text-[9px]">STATE DISASTER (SDMA)</span>
              <span className="text-amber-400 font-bold text-sm">1070</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
