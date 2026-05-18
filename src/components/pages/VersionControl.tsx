import React from 'react';
import { useApp } from '../../store/appStore';
import { GitCommit, Clock, GitPullRequest, Search, FileText, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppStep } from '../../types';

export function VersionControl() {
  const { state } = useApp();

  const VERSIONS = [
    { v: 'v3.0', title: 'PRODUCTION RELEASE', desc: 'Final approved mBOM for launch', time: '14:22:05 TODAY', type: 'success' },
    { v: 'v2.1', title: 'AI REFINEMENT', desc: 'Station balancing optimization applied', time: '12:05:12 TODAY', type: 'info' },
    { v: 'v2.0', title: 'INITIAL CONVERSION', desc: 'AI-generated station mapping draft', time: '11:55:30 TODAY', type: 'info' },
    { v: 'v1.0', title: 'ENGINEERING BASELINE', desc: 'Original eBOM ingestion', time: '11:42:15 TODAY', type: 'default' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">BOM Version Control and Change Management</h2>
        <p className="text-sm text-slate-500">Complete change history, effectivity management, and audit trail for all BOM modifications.</p>
      </div>

      <div className="card-base p-6">
         <h3 className="text-sm font-semibold text-slate-700 mb-8">Evolution Timeline</h3>
         <div className="relative flex justify-between">
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-100 z-0" />
            {VERSIONS.map((v, i) => (
              <div key={i} className="flex flex-col items-center relative z-10 w-40">
                 <div className={cn(
                   "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3",
                   v.type === 'success' ? 'bg-green-500 text-white' : 
                   v.type === 'info' ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'
                 )}>
                   <GitCommit size={20} />
                 </div>
                 <p className="text-xs font-bold text-slate-800">{v.v}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{v.title}</p>
                 <p className="text-[9px] text-slate-500 text-center mt-1 leading-tight">{v.desc}</p>
                 <span className="text-[8px] text-slate-400 mt-2 font-mono">{v.time}</span>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 card-base">
           <h3 className="text-sm font-semibold text-slate-700 mb-6">Full Audit Trail</h3>
           <div className="table-container max-h-[400px] overflow-y-auto">
              <table className="w-full">
                 <thead className="table-header">
                    <tr>
                       <th className="px-4 py-3">Timestamp</th>
                       <th className="px-4 py-3">Action</th>
                       <th className="px-4 py-3">User</th>
                       <th className="px-4 py-3">Reference</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {[
                      { time: '14:23:12', action: 'Production Release Approved', user: 'DEMO_USER', ref: 'BOM-v3.0' },
                      { time: '14:22:05', action: 'Approvals Stage Completed', user: 'SYSTEM', ref: 'REL-2024A' },
                      { time: '14:15:30', action: 'Approval Granted - DEC-03', user: 'DEMO_USER', ref: 'DEC-01' },
                      { time: '13:55:12', action: 'Routing Plan Finalized', user: 'SYSTEM', ref: 'RT-112' },
                      { time: '12:42:01', action: 'Classification Override Applied', user: 'DEMO_USER', ref: 'EMA-006' }
                    ].map((row, i) => (
                      <tr key={i} className="text-[11px] text-slate-600">
                         <td className="px-4 py-3 font-mono">{row.time}</td>
                         <td className="px-4 py-3 font-medium text-slate-800">{row.action}</td>
                         <td className="px-4 py-3"><span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">{row.user}</span></td>
                         <td className="px-4 py-3 font-mono text-blue-600">{row.ref}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="card-base bg-blue-50/50 border-blue-200">
              <h3 className="text-xs font-bold text-blue-700 uppercase mb-4">Version Comparison</h3>
              <div className="space-y-4">
                 <div className="flex gap-2">
                    <select className="flex-1 bg-white border border-slate-200 rounded text-xs p-2"><option>v1.0 (Base)</option></select>
                    <div className="flex items-center text-slate-400"><ArrowRight size={14} /></div>
                    <select className="flex-1 bg-white border border-slate-200 rounded text-xs p-2"><option>v3.0 (Target)</option></select>
                 </div>
                 <button className="btn-primary w-full text-xs">Run Comparison</button>
              </div>
           </div>

           <div className="card-base">
              <h3 className="text-xs font-bold text-slate-700 uppercase mb-4">Effectivity Management</h3>
              <div className="space-y-3">
                 <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Effective Date:</span>
                    <span className="font-bold">IMMEDIATE</span>
                 </div>
                 <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Lot Number Start:</span>
                    <span className="font-mono font-bold">20240518-001</span>
                 </div>
                 <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Reason for Change:</span>
                    <span className="font-bold">New Product Launch</span>
                 </div>
              </div>
              <button onClick={() => useApp().setStep(AppStep.EXPORT)} className="btn-secondary w-full mt-6 text-xs">Proceed to Export</button>
           </div>
        </div>
      </div>
    </div>
  );
}
