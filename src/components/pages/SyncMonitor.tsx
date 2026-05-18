import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, ChevronRight, GitMerge, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppStep, PartCategory } from '../../types';

export function SyncMonitor() {
  const { state } = useApp();
  const [ecoActive, setEcoActive] = useState(false);
  const [isPropagating, setIsPropagating] = useState(false);

  const simulateECO = () => {
    setEcoActive(true);
  };

  const handlePropagate = () => {
    setIsPropagating(true);
    setTimeout(() => {
      setEcoActive(false);
      setIsPropagating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">eBOM to mBOM Synchronization Monitor</h2>
        <p className="text-sm text-slate-500">Real-time detection and resolution of mismatches between engineering design and manufacturing plan.</p>
      </div>

      <div className={cn(
        "p-4 rounded-md border flex items-center gap-4 transition-all duration-500",
        ecoActive ? "bg-red-50 border-red-300 text-red-900" : "bg-green-50 border-green-300 text-green-900"
      )}>
        {ecoActive ? (
          <XCircle className="w-8 h-8 text-red-600 animate-pulse" />
        ) : (
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        )}
        <div className="flex-1">
          <p className="text-sm font-bold">
            {ecoActive ? "Synchronization mismatch detected — 1 component requires mBOM update." : "eBOM and mBOM are synchronized — 25 of 25 components mapped."}
          </p>
          <p className="text-xs opacity-75">
            {ecoActive ? "Engineering Change Order ECO-2024-002 has modified Shaft (EMA-006) dimensions. Update required in Station 1 and Station 3." : "Unified source of truth is active. Continuous monitoring connected to PLM system."}
          </p>
        </div>
        {!ecoActive && (
          <button onClick={simulateECO} className="bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-md hover:bg-amber-700 transition-colors">
            SIMULATE ECO
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 card-base">
          <h3 className="text-sm font-semibold text-slate-700 mb-6">Component Mapping Integrity</h3>
          <div className="table-container">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3">Part No.</th>
                  <th className="px-4 py-3">Component Name</th>
                  <th className="px-4 py-3">Engineering Level</th>
                  <th className="px-4 py-3">Manufacturing Station</th>
                  <th className="px-4 py-3">Sync Status</th>
                </tr>
              </thead>
              <tbody>
                {['EMA-001', 'EMA-002', 'EMA-003', 'EMA-004', 'EMA-005', 'EMA-006'].map((id, i) => {
                  const isMismatched = ecoActive && id === 'EMA-006';
                  return (
                    <tr key={i} className={cn("table-row transition-colors", isMismatched && "bg-red-50/50")}>
                      <td className="px-4 py-3 font-mono text-[10px] font-bold text-blue-700">{id}</td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-700">Component Name {i+1}</td>
                      <td className="px-4 py-3"><span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">L{i % 2 + 1}</span></td>
                      <td className="px-4 py-3 text-[10px] font-bold text-slate-500 tracking-tighter uppercase">ST-{i % 5 + 1}</td>
                      <td className="px-4 py-3">
                         <span className={cn(
                           "flex items-center gap-1.5 text-[9px] font-bold rounded-full px-2 py-0.5 border",
                           isMismatched ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"
                         )}>
                            {isMismatched ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                            {isMismatched ? "MISMATCH" : "SYNCHRONIZED"}
                         </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {ecoActive && (
            <div className="card-base animate-in slide-in-from-top-4 duration-500">
               <h3 className="text-sm font-semibold text-slate-700 mb-4">Impact Analysis — ECO-2024-002</h3>
               <div className="space-y-4">
                  {[
                    { label: 'Affected Stations', val: 'ST-1, ST-3', icon: GitMerge },
                    { label: 'Affected Ops', val: 'OP-106, OP-107', icon: Zap },
                    { label: 'Risk Assessment', val: 'HIGH — Tooling gap', icon: AlertTriangle }
                  ].map((row, i) => (
                    <div key={i} className="flex gap-3">
                       <row.icon size={14} className="text-slate-400 mt-0.5" />
                       <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{row.label}</p>
                          <p className="text-xs font-bold text-slate-800">{row.val}</p>
                       </div>
                    </div>
                  ))}
                  
                  <button 
                    disabled={isPropagating}
                    onClick={handlePropagate}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                  >
                    {isPropagating ? <RefreshCw className="animate-spin" size={14} /> : null}
                    {isPropagating ? 'Propagating Change...' : 'Propagate to mBOM'}
                  </button>
               </div>
            </div>
          )}

          <div className="card-base bg-slate-50 border-slate-200">
             <h3 className="text-sm font-semibold text-slate-700 mb-4">Unified Source of Truth</h3>
             <div className="space-y-3">
                {[
                  { dept: 'Engineering', status: 'v3.2', time: 'Active' },
                  { dept: 'Manufacturing', status: 'v3.2', time: 'Active' },
                  { dept: 'Quality Control', status: 'v3.1', time: 'Legacy' },
                  { dept: 'Procurement', status: 'v3.2', time: 'Active' }
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-slate-100">
                     <span className="text-xs font-medium text-slate-700">{row.dept}</span>
                     <div className="flex gap-2">
                        <span className="text-[9px] font-mono text-blue-600 font-bold px-1 rounded bg-blue-50">{row.status}</span>
                        <span className="text-[9px] text-green-600 font-bold">{row.time}</span>
                     </div>
                  </div>
                ))}
             </div>
             <button onClick={() => useApp().setStep(AppStep.APPROVE)} className="btn-secondary w-full mt-6 text-xs">Proceed to Approvals</button>
          </div>
        </div>
      </div>
    </div>
  );
}
