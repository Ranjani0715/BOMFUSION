import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './store/appStore';
import { AppStep } from './types';
import { 
  LayoutDashboard, Upload, Box, Cpu, GitBranch, Route, 
  BarChart2, Shield, CheckSquare, Layers, TrendingUp, 
  RefreshCw, ClipboardCheck, GitCommit, Download,
  Settings, Loader2
} from 'lucide-react';
import { cn } from './lib/utils';

// Pages - placeholder imports for now, will create them next
import { Dashboard } from './components/pages/Dashboard';
import { UploadPage } from './components/pages/Upload';
import { CADViewer } from './components/pages/CADViewer';
import { Classification } from './components/pages/Classification';
import { MBomGeneration } from './components/pages/MBomGeneration';
import { RoutingPlanner } from './components/pages/RoutingPlanner';
import { LineBalancing } from './components/pages/LineBalancing';
import { ConstraintsEngine } from './components/pages/ConstraintsEngine';
import { QualityPlanning } from './components/pages/QualityPlanning';
import { VariantManager } from './components/pages/VariantManager';
import { PredictiveInsights } from './components/pages/PredictiveInsights';
import { SyncMonitor } from './components/pages/SyncMonitor';
import { Approvals } from './components/pages/Approvals';
import { VersionControl } from './components/pages/VersionControl';
import { ExportPage } from './components/pages/Export';

const SIDEBAR_SECTIONS = [
  {
    label: 'Data Ingestion',
    items: [
      { id: AppStep.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
      { id: AppStep.UPLOAD, label: 'Upload eBOM', icon: Upload },
      { id: AppStep.CAD, label: 'CAD Viewer', icon: Box },
    ]
  },
  {
    label: 'AI Processing',
    items: [
      { id: AppStep.CLASSIFY, label: 'AI Classification', icon: Cpu },
      { id: AppStep.MBOM, label: 'mBOM Generation', icon: GitBranch },
      { id: AppStep.ROUTING, label: 'Routing Planner', icon: Route },
      { id: AppStep.BALANCE, label: 'Line Balancing', icon: BarChart2 },
      { id: AppStep.CONSTRAINTS, label: 'Constraints Engine', icon: Shield },
    ]
  },
  {
    label: 'Quality & Variants',
    items: [
      { id: AppStep.QUALITY, label: 'Quality Planning', icon: CheckSquare },
      { id: AppStep.VARIANTS, label: 'Variant Manager', icon: Layers },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { id: AppStep.INSIGHTS, label: 'Predictive Insights', icon: TrendingUp },
      { id: AppStep.SYNC, label: 'BOM Sync Monitor', icon: RefreshCw },
    ]
  },
  {
    label: 'Governance',
    items: [
      { id: AppStep.APPROVE, label: 'Approvals', icon: ClipboardCheck },
      { id: AppStep.VERSIONS, label: 'Version Control', icon: GitCommit },
      { id: AppStep.EXPORT, label: 'Export', icon: Download },
    ]
  }
];

const STEPPER_ITEMS = [
  AppStep.UPLOAD, AppStep.CAD, AppStep.CLASSIFY, AppStep.MBOM, AppStep.ROUTING,
  AppStep.BALANCE, AppStep.CONSTRAINTS, AppStep.QUALITY, AppStep.VARIANTS,
  AppStep.INSIGHTS, AppStep.SYNC, AppStep.APPROVE, AppStep.VERSIONS, AppStep.EXPORT
];

export default function App() {
  const { state, setStep } = useApp();

  const renderPage = () => {
    switch (state.currentStep) {
      case AppStep.DASHBOARD: return <Dashboard />;
      case AppStep.UPLOAD: return <UploadPage />;
      case AppStep.CAD: return <CADViewer />;
      case AppStep.CLASSIFY: return <Classification />;
      case AppStep.MBOM: return <MBomGeneration />;
      case AppStep.ROUTING: return <RoutingPlanner />;
      case AppStep.BALANCE: return <LineBalancing />;
      case AppStep.CONSTRAINTS: return <ConstraintsEngine />;
      case AppStep.QUALITY: return <QualityPlanning />;
      case AppStep.VARIANTS: return <VariantManager />;
      case AppStep.INSIGHTS: return <PredictiveInsights />;
      case AppStep.SYNC: return <SyncMonitor />;
      case AppStep.APPROVE: return <Approvals />;
      case AppStep.VERSIONS: return <VersionControl />;
      case AppStep.EXPORT: return <ExportPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-brand-background">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-sidebar flex-shrink-0 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <GitBranch className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-none">BOMfusionAI</h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Manufacturing Intelligence</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-hide py-2">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-2 text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = state.currentStep === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setStep(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                        isActive 
                          ? "bg-brand-sidebar-active text-white rounded-md" 
                          : "text-slate-400 hover:text-white hover:bg-brand-sidebar-hover rounded-md"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 bg-[rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">DR</div>
              <div>
                <p className="text-white text-xs font-semibold">Demo User</p>
                <p className="text-slate-400 text-[10px]">Manufacturing Engineer</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>BOMfusionAI</span>
            <span>/</span>
            <span className="text-slate-800 font-medium capitalize">{state.currentStep.toLowerCase()}</span>
          </div>

          <div className="flex items-center gap-4">
            {state.isProcessing && (
              <div className="flex items-center gap-2 py-1 px-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </div>
                <span className="text-xs text-slate-600 font-medium">Processing...</span>
              </div>
            )}
            
            <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-3 py-1 text-[11px] font-semibold">
              EMA-2024
            </div>
            
            <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Stepper */}
        <div className="bg-white border-b border-slate-200 py-3 px-6 flex overflow-x-auto scrollbar-hide flex-shrink-0">
          <div className="flex items-center gap-0 w-full min-w-max justify-between">
            {STEPPER_ITEMS.map((item, idx) => {
              const isLast = idx === STEPPER_ITEMS.length - 1;
              const isCompleted = STEPPER_ITEMS.indexOf(state.currentStep) > idx;
              const isCurrent = state.currentStep === item;
              
              return (
                <React.Fragment key={item}>
                  <div className="flex flex-col items-center gap-1.5 relative group px-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                      isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                    )}>
                      {isCompleted ? <ClipboardCheck className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={cn(
                      "text-[9px] font-semibold uppercase tracking-tighter transition-colors text-center whitespace-nowrap",
                      isCurrent ? "text-blue-600" : "text-slate-400"
                    )}>
                      {item}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={cn(
                      "h-[1px] flex-1 min-w-[20px] mb-4 transition-colors",
                      isCompleted ? "bg-green-500" : "bg-slate-200"
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Page Container */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
