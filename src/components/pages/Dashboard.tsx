import React from 'react';
import { useApp } from '../../store/appStore';
import { MOTOR_COMPONENTS } from '../../data/sampleData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { AppStep, PartCategory } from '../../types';
import { 
  Users, CheckCircle2, AlertCircle, Clock, 
  ArrowRight, FileText, Database, ShieldAlert,
  Layers, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Dashboard() {
  const { state, loadProject, setStep } = useApp();

  const handleLoadDemo = () => {
    loadProject(MOTOR_COMPONENTS);
  };

  const METRICS = [
    { label: 'Total Components', value: state.isProjectLoaded ? '25' : '0', trend: 'In Scope', icon: Database },
    { label: 'Conversion Accuracy', value: state.isProjectLoaded ? '96.4%' : '--', trend: '+1.2% v2.1', icon: CheckCircle2 },
    { label: 'Active Variants', value: state.isProjectLoaded ? '3' : '0', trend: 'Base, HE, EX', icon: LayersIcon },
    { label: 'Pending Approvals', value: state.isProjectLoaded ? '5' : '0', trend: 'Critical Check req.', icon: Clock },
    { label: 'Open NCRs', value: '0', trend: 'All clear', icon: AlertCircle },
    { label: 'Sync Status', value: state.isProjectLoaded ? 'In Sync' : '--', trend: 'v3.0.4', icon: RefreshIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Manufacturing Intelligence Dashboard</h2>
          <p className="text-sm text-slate-500">EMA-2024 — Electric Motor Assembly</p>
        </div>
        {!state.isProjectLoaded && (
          <button 
            onClick={handleLoadDemo}
            className="btn-primary flex items-center gap-2"
          >
            Load Demo Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {METRICS.map((metric, i) => (
          <div key={i} className="card-base p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{metric.label}</p>
              <metric.icon className="w-3 h-3 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              {metric.label === 'Sync Status' && state.isProjectLoaded && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
              {metric.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="card-base">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Active Project</h3>
          <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-3 py-1 text-xs font-medium">
            EMA-2024
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Overall Progress</span>
            <span className="font-semibold">{state.isProjectLoaded ? '45%' : '0%'}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-1000" 
              style={{ width: state.isProjectLoaded ? '45%' : '0%' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Started: May 18, 2026</span>
            <span>Status: In Progress</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-base">
          <h3 className="text-sm font-semibold text-slate-700 mb-6">BOM Status — All Departments</h3>
          <div className="table-container min-w-full">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Detail</th>
                  <th className="px-4 py-3 text-left">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dept: 'Engineering eBOM', status: state.isProjectLoaded ? 'COMPLETE' : 'PENDING', detail: '25 Items mapped', time: 'Last week' },
                  { dept: 'Manufacturing mBOM', status: state.mBomGenerated ? 'COMPLETE' : state.isProjectLoaded ? 'PENDING' : 'OPEN', detail: 'Station mapping', time: 'Pending' },
                  { dept: 'Routing Plan', status: state.routingDone ? 'COMPLETE' : 'OPEN', detail: '16 Operations', time: '--' },
                  { dept: 'Quality Plan', status: 'OPEN', detail: '13 Checkpoints', time: '--' },
                  { dept: 'Approvals', status: 'LOCKED', detail: 'Pending final mBOM', time: '--' },
                  { dept: 'Export', status: 'LOCKED', detail: 'Waiting release', time: '--' },
                ].map((row, i) => (
                  <tr key={i} className="table-row">
                    <td className="px-4 py-3 font-medium">{row.dept}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold border",
                        row.status === 'COMPLETE' ? "bg-green-50 text-green-700 border-green-200" :
                        row.status === 'PENDING' ? "bg-blue-50 text-blue-700 border-blue-200" :
                        row.status === 'LOCKED' ? "bg-slate-50 text-slate-400 border-slate-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{row.detail}</td>
                    <td className="px-4 py-3 text-slate-400 text-[10px]">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-base flex flex-col h-full">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Activity</h3>
          <div className="flex-1 items-center justify-center flex">
            {!state.isProjectLoaded ? (
              <div className="text-center">
                <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-500 transition-opacity">No activity yet — load a project to begin.</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                {[
                  { step: 'eBOM Upload', result: 'EMA-2024 Project Loaded', time: '2m ago' },
                  { step: 'CAD Sync', result: '3D Hierarchy Verified', time: '1m ago' }
                ].map((act, i) => (
                  <div key={i} className="flex gap-3 relative pb-4">
                    {i !== 1 && <div className="absolute left-1.5 top-4 bottom-0 w-[1px] bg-slate-100" />}
                    <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-600 z-10" />
                    <div className="flex-1 -mt-1">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-semibold text-slate-700">{act.step}</p>
                        <span className="text-[10px] text-slate-400">{act.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{act.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LayersIcon(props: any) { return <Layers {...props} />; }
function RefreshIcon(props: any) { return <RefreshCw {...props} />; }
