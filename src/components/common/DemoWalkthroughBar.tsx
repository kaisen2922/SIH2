import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';
import { DataStatusBadge } from './DataStatusBadge';

interface DemoWalkthroughBarProps {
  onClose?: () => void;
  onNavigate?: (tab: string) => void;
}

export const DemoWalkthroughBar: React.FC<DemoWalkthroughBarProps> = ({
  onClose,
  onNavigate,
}) => {
  const {
    simulationState,
    currentStepIndex,
    currentStep,
    simulationSteps,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    goToStep,
    runEndToEndDemo,
  } = useIncident();

  const handleToggle = () => {
    if (simulationState === 'RUNNING') {
      pauseSimulation();
    } else if (simulationState === 'PAUSED') {
      resumeSimulation();
    } else {
      startSimulation();
    }
  };

  const handleStepClick = (index: number) => {
    goToStep(index);
    if (onNavigate && simulationSteps[index].tab) {
      onNavigate(simulationSteps[index].tab);
    }
  };

  return (
    <div className="bg-navy-850/95 border-b border-surface-border text-slate-100 px-4 py-2.5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Step Indicator & Controls */}
        <div className="flex items-center space-x-3">
          <DataStatusBadge type="SIMULATION" />

          <div className="flex items-center space-x-1.5 bg-navy-950 px-2 py-1 rounded border border-surface-border">
            <button
              onClick={() => handleStepClick(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous Step"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleToggle}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                simulationState === 'RUNNING'
                  ? 'bg-amber-500 text-navy-950 hover:bg-amber-400'
                  : 'bg-brand-blue text-white hover:bg-blue-600'
              }`}
            >
              {simulationState === 'RUNNING' ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{simulationState === 'PAUSED' ? 'RESUME' : 'START SIMULATION'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleStepClick(Math.min(simulationSteps.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === simulationSteps.length - 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next Step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={resetSimulation}
              className="p-1 text-slate-400 hover:text-white ml-1"
              title="Reset Scenario"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dedicated Full Automated Replay Button */}
          <button
            onClick={runEndToEndDemo}
            className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-navy-950 font-extrabold text-[11px] font-mono px-2.5 py-1 rounded shadow-md transition-all shrink-0"
            title="Runs full 10-step sequence with 3s delays"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>RUN END-TO-END DEMO</span>
          </button>

          {/* Current Step Description */}
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-cyan-400 font-extrabold text-xs">
                [{currentStep.timeCode}]
              </span>
              <span className="font-semibold text-white text-xs">{currentStep.title}</span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-md lg:max-w-xl">
              {currentStep.subtitle}
            </p>
          </div>
        </div>

        {/* Action Button & Close */}
        <div className="flex items-center space-x-2 justify-end">
          {currentStep.tab && onNavigate && (
            <button
              onClick={() => onNavigate(currentStep.tab)}
              className="flex items-center space-x-1 text-xs bg-navy-950 hover:bg-navy-800 text-cyan-300 border border-cyan-800/60 px-2.5 py-1 rounded transition-colors font-mono"
            >
              <span>INSPECT MODULE: {currentStep.tab.toUpperCase()}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-navy-800"
              title="Hide Walkthrough Bar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Step Timeline Scrubber */}
      <div className="mt-2.5 pt-2 border-t border-surface-border/60 overflow-x-auto pb-1">
        <div className="flex items-center space-x-1.5 min-w-[700px]">
          {simulationSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={idx}
                onClick={() => handleStepClick(idx)}
                className={`flex-1 flex flex-col items-center p-1 rounded transition-all text-center group ${
                  isCurrent
                    ? 'bg-brand-blue/30 border border-cyan-400 text-white'
                    : isCompleted
                    ? 'bg-navy-950/70 border border-emerald-800/40 text-slate-300 hover:bg-navy-800'
                    : 'bg-navy-950/40 border border-surface-border text-slate-500 hover:bg-navy-900'
                }`}
              >
                <div className="flex items-center space-x-1 mb-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCurrent
                        ? 'bg-cyan-400 animate-ping'
                        : isCompleted
                        ? 'bg-emerald-400'
                        : 'bg-slate-600'
                    }`}
                  />
                  <span className="font-mono text-[10px] font-bold">{step.timeCode}</span>
                </div>
                <span className="text-[10px] truncate max-w-[85px] leading-tight block">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
