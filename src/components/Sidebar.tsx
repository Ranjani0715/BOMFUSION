import React from 'react';
import {
  LayoutDashboard,
  Upload,
  Box,
  Cpu,
  GitBranch,
  Route,
  BarChart2,
  Shield,
  CheckSquare,
  Layers,
  TrendingUp,
  RefreshCw,
  ClipboardCheck,
  GitCommit,
  Download,
  Settings,
  Settings2,
  Network,
} from 'lucide-react';
import { StepId } from '../types';

interface SidebarProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
}

interface NavItem {
  id: StepId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: 'DATA INGESTION',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'upload', label: 'Upload eBOM', icon: Upload },
      { id: 'cad', label: 'CAD Viewer', icon: Box },
    ],
  },
  {
    title: 'AI PROCESSING',
    items: [
      { id: 'classify', label: 'AI Classification', icon: Cpu },
      { id: 'mbom', label: 'mBOM Generation', icon: GitBranch },
      { id: 'routing', label: 'Routing Planner', icon: Route },
      { id: 'balance', label: 'Line Balancing', icon: BarChart2 },
      { id: 'constraints', label: 'Constraints Engine', icon: Shield },
    ],
  },
  {
    title: 'QUALITY & VARIANTS',
    items: [
      { id: 'quality', label: 'Quality Planning', icon: CheckSquare },
      { id: 'variants', label: 'Variant Manager', icon: Layers },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'insights', label: 'Predictive Insights', icon: TrendingUp },
      { id: 'sync', label: 'BOM Sync Monitor', icon: RefreshCw },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      { id: 'approve', label: 'Approvals', icon: ClipboardCheck },
      { id: 'versions', label: 'Version Control', icon: GitCommit },
      { id: 'export', label: 'Export', icon: Download },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentStep, onSelectStep }) => {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#1A2B4A] flex flex-col z-30 shadow-md">
      {/* Logo Header */}
      <div className="p-4 border-b border-slate-700/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
          <div className="relative w-5 h-5 flex items-center justify-center">
            <Settings2 className="w-5 h-5 absolute text-white" />
            <Network className="w-3 h-3 absolute text-blue-200" />
          </div>
        </div>
        <div className="overflow-hidden">
          <h1 className="text-white font-semibold text-lg tracking-tight leading-tight">
            BOMfusionAI
          </h1>
          <p className="text-xs text-slate-400 font-medium truncate">
            Manufacturing Intelligence
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <h2 className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
              {section.title}
            </h2>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentStep === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectStep(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white rounded-md shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#243554] rounded-md'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Profile Section */}
      <div className="p-3 border-t border-slate-700/60 bg-[#14223B] flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-blue-900/80 border border-blue-500/30 flex items-center justify-center text-white font-semibold text-xs shrink-0">
            DU
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium leading-tight truncate">
              Demo User
            </p>
            <p className="text-slate-400 text-xs truncate">
              Manufacturing Engineer
            </p>
          </div>
        </div>
        <button
          className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-[#243554] transition-colors"
          title="User Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
