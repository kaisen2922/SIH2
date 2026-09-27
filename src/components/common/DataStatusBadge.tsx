import React from 'react';

export type DataBadgeType =
  | 'LIVE'
  | 'MODEL_ESTIMATE'
  | 'SIMULATION'
  | 'HISTORICAL'
  | 'FIELD_REPORT'
  | 'OFFICIAL_ALERT'
  | 'DEMO_MODE';

interface DataStatusBadgeProps {
  type: DataBadgeType;
  className?: string;
  size?: 'sm' | 'md';
}

export const DataStatusBadge: React.FC<DataStatusBadgeProps> = ({
  type,
  className = '',
  size = 'sm',
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'LIVE':
        return {
          label: 'LIVE DATA',
          bg: 'bg-emerald-950/90 text-emerald-300 border-emerald-600/70',
          dot: 'bg-emerald-400 animate-pulse',
        };
      case 'MODEL_ESTIMATE':
        return {
          label: 'MODEL ESTIMATE',
          bg: 'bg-blue-950/90 text-blue-300 border-blue-600/70',
          dot: 'bg-blue-400',
        };
      case 'SIMULATION':
        return {
          label: 'SIMULATION MODE · REPLAY',
          bg: 'bg-amber-950/90 text-amber-300 border-amber-600/70',
          dot: 'bg-amber-400 animate-pulse',
        };
      case 'HISTORICAL':
        return {
          label: 'HISTORICAL',
          bg: 'bg-slate-900/90 text-slate-400 border-slate-700/70',
          dot: 'bg-slate-400',
        };
      case 'FIELD_REPORT':
        return {
          label: 'FIELD REPORT',
          bg: 'bg-purple-950/90 text-purple-300 border-purple-600/70',
          dot: 'bg-purple-400',
        };
      case 'OFFICIAL_ALERT':
        return {
          label: 'OFFICIAL ALERT',
          bg: 'bg-red-950/90 text-red-300 border-red-600/70',
          dot: 'bg-red-400 animate-pulse',
        };
      case 'DEMO_MODE':
      default:
        return {
          label: 'DEMO MODE',
          bg: 'bg-amber-950/90 text-amber-300 border-amber-600/70',
          dot: 'bg-amber-400',
        };
    }
  };

  const config = getBadgeConfig();
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-mono font-bold uppercase rounded border tracking-wider shadow-sm ${config.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
