import React from 'react';
import { Bell, ChevronRight, Loader2 } from 'lucide-react';
import { StepId } from '../types';

interface HeaderProps {
  currentStep: StepId;
  isProcessing: boolean;
  processingMessage?: string;
  hasNotifications?: boolean;
}

const STEP_TITLES: Record<StepId, { section: string; name: string }> = {
  dashboard: { section: 'Data Ingestion', name: 'Dashboard' },
  upload: { section: 'Data Ingestion', name: 'Upload eBOM' },
  cad: { section: 'Data Ingestion', name: 'CAD Viewer' },
  classify: { section: 'AI Processing', name: 'AI Classification' },
  mbom: { section: 'AI Processing', name: 'mBOM Generation' },
  routing: { section: 'AI Processing', name: 'Routing Planner' },
  balance: { section: 'AI Processing', name: 'Line Balancing' },
  constraints: { section: 'AI Processing', name: 'Constraints Engine' },
  quality: { section: 'Quality & Variants', name: 'Quality Planning' },
  variants: { section: 'Quality & Variants', name: 'Variant Manager' },
  erp: { section: 'Enterprise Sync', name: 'ERP Sync' },
  analytics: { section: 'Intelligence', name: 'Executive Analytics' },
  audit: { section: 'Governance', name: 'Audit Log' },
  insights: { section: 'Intelligence', name: 'Predictive Insights' },
  sync: { section: 'Intelligence', name: 'BOM Sync Monitor' },
  approve: { section: 'Governance', name: 'Approvals' },
  versions: { section: 'Governance', name: 'Version Control' },
  export: { section: 'Governance', name: 'Export' },
};

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  isProcessing,
  processingMessage = 'Processing...',
  hasNotifications = false,
}) => {
  const meta = STEP_TITLES[currentStep] || { section: 'System', name: 'Overview' };

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="text-slate-400">BOMfusionAI</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-500">{meta.section}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-900 font-semibold">{meta.name}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-1 text-xs text-blue-700 font-medium animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>{processingMessage}</span>
          </div>
        )}

        {/* Notifications */}
        <button
          className="relative p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          )}
        </button>

        {/* Active Project Badge */}
        <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          EMA-2024
        </div>
      </div>
    </header>
  );
};
