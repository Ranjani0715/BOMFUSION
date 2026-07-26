import React from 'react';
import {
  Layers,
  Cpu,
  GitBranch,
  ClipboardCheck,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { StepId, ActivityLog } from '../types';

interface DashboardPageProps {
  onSelectStep: (step: StepId) => void;
  onLoadDemoProject?: () => void;
  activities?: ActivityLog[];
  completedSteps?: Set<StepId>;
  components?: any[];
  addToast?: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectStep,
  onLoadDemoProject = () => {},
  activities = [],
  completedSteps = new Set<StepId>(['upload', 'cad', 'classify', 'mbom', 'routing']),
}) => {
  const safeCompletedSteps = completedSteps || new Set<StepId>();
  const isLoaded = safeCompletedSteps.has('upload');

  const deptStatuses = [
    {
      dept: 'Engineering eBOM',
      status: safeCompletedSteps.has('upload') ? 'COMPLETED' : 'PENDING',
      detail: safeCompletedSteps.has('upload')
        ? '25 components ingested across 3 levels'
        : 'Awaiting file ingestion',
      updated: 'Today 08:02',
    },
    {
      dept: 'AI Classification',
      status: safeCompletedSteps.has('classify') ? 'COMPLETED' : 'PENDING',
      detail: safeCompletedSteps.has('classify')
        ? 'Categorized with 96.4% confidence'
        : 'Not executed',
      updated: safeCompletedSteps.has('classify') ? 'Today 08:05' : '-',
    },
    {
      dept: 'Manufacturing mBOM',
      status: safeCompletedSteps.has('mbom') ? 'COMPLETED' : 'IN_PROGRESS',
      detail: safeCompletedSteps.has('mbom')
        ? 'Structured into 5 workstations'
        : 'Baseline tree ready',
      updated: safeCompletedSteps.has('mbom') ? 'Today 08:08' : 'Today 08:00',
    },
    {
      dept: 'Routing Plan',
      status: safeCompletedSteps.has('routing') ? 'COMPLETED' : 'PENDING',
      detail: safeCompletedSteps.has('routing')
        ? '16 operations sequenced across 5 stations'
        : 'Awaiting generation',
      updated: safeCompletedSteps.has('routing') ? 'Today 08:10' : '-',
    },
    {
      dept: 'Quality Plan',
      status: safeCompletedSteps.has('quality') ? 'COMPLETED' : 'PENDING',
      detail: safeCompletedSteps.has('quality')
        ? '13 inspection gates configured'
        : 'Awaiting generation',
      updated: safeCompletedSteps.has('quality') ? 'Today 08:12' : '-',
    },
    {
      dept: 'Approvals & Governance',
      status: safeCompletedSteps.has('approve') ? 'APPROVED' : 'IN_REVIEW',
      detail: safeCompletedSteps.has('approve')
        ? 'Version 3.0 Released to Production'
        : '5 pending AI decisions',
      updated: safeCompletedSteps.has('approve') ? 'Today 08:15' : 'Today 08:00',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Manufacturing Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            EMA-2024 — Electric Motor Assembly
          </p>
        </div>
        <button
          onClick={onLoadDemoProject}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
        >
          <FolderOpen className="w-4 h-4" />
          Load Demo Project
        </button>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Components
          </p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">25</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">3 Assembly Levels</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Conversion Accuracy
          </p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">96.4%</p>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Zero-leakage verified
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Active Variants
          </p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">3</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Std / HE / EX Zone 1</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Pending Approvals
          </p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">
            {safeCompletedSteps.has('approve') ? '0' : '5'}
          </p>
          <p className="text-xs text-amber-700 font-medium mt-1">AI Decisions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Open NCRs
          </p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">0</p>
          <p className="text-xs text-emerald-700 font-medium mt-1">Zero Non-conformance</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Sync Status
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-base font-semibold text-slate-800">In Sync</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">eBOM ↔ mBOM Live</p>
        </div>
      </div>

      {/* Active Project Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-800">
              Active Project: EMA-2024
            </h2>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {safeCompletedSteps.has('approve') ? 'Released to Production' : 'In Progress'}
            </span>
          </div>
          <span className="text-xs text-slate-500">Started: Today 08:00</span>
        </div>

        {/* Horizontal Process Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Overall Conversion Pipeline Completion</span>
            <span>{Math.round(((safeCompletedSteps.size || 0) / 14) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.round(((safeCompletedSteps.size || 0) / 14) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Unified BOM Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unified BOM Status Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">
              BOM Status — All Departments
            </h3>
            <span className="text-xs text-slate-500">Live Synchronization</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Department</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Details</th>
                  <th className="px-4 py-2.5">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {deptStatuses.map((d, i) => {
                  let badge = (
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Pending
                    </span>
                  );
                  if (d.status === 'COMPLETED' || d.status === 'APPROVED') {
                    badge = (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {d.status === 'APPROVED' ? 'Approved' : 'Completed'}
                      </span>
                    );
                  } else if (d.status === 'IN_PROGRESS' || d.status === 'IN_REVIEW') {
                    badge = (
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        In Review
                      </span>
                    );
                  }

                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{d.dept}</td>
                      <td className="px-4 py-3">{badge}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{d.detail}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{d.updated}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Recent Activity
            </h3>
            <span className="text-xs text-slate-400">Audit Trail</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-80 pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">
                No activity yet — load a project to begin.
              </p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-700">
                      {act.stepName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{act.summary}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
