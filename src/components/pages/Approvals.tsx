import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { ClipboardCheck, CheckCircle2, ChevronRight, Check, X, ShieldCheck, AlertCircle, HardHat } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppStep } from '../../types';
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

export function Approvals() {
  const { state, setApproval } = useApp();
  const [complete, setComplete] = useState(false);

  const DECISIONS = [
    { id: 'DEC-01', type: 'Category Classification', rec: 'Mark EMA-002 as Manufactured', conf: 96.2, rationale: 'Complex laminations require specialized stacking jigs in CorePrep department.' },
    { id: 'DEC-02', type: 'Workstation Mapping', rec: 'Move OP-111 to ST-4', conf: 98.4, rationale: 'Fan assembly logical flow is better integrated at Station 4 than Station 3.' },
    { id: 'DEC-03', type: 'Alternate Routing', rec: 'Enable backup op OP-104B', conf: 89.1, rationale: 'CNC capacity at 92% requires pre-authorized alternative for shaft turning.' },
    { id: 'DEC-04', type: 'Skill Requirement', rec: 'Mandate L4 Supervisor for ST-1', conf: 94.7, rationale: 'Stator winding insertion complexity requires certified senior inspector oversight.' },
    { id: 'DEC-05', type: 'Quality Frequency', rec: 'Increase to 100% for EMA-007', conf: 91.2, rationale: 'Drive end bearings identified as critical single point of thermal failure.' }
  ];

  const handleApprove = (id: string) => {
    setApproval(id, true);
    if (Object.keys(state.approvals).length === 4) {
      // Logic for all 5
    }
  };

  const allApproved = DECISIONS.every(d => state.approvals[d.id]);

  const handleRelease = () => {
    setComplete(true);
  };

  if (complete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-6 animate-in zoom-in-95 duration-500">
         <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
         </div>
         <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-800">Manufacturing BOM Released</h2>
            <p className="text-slate-500">EMA-2024 Configuration v3.0 has been successfully released to production systems.</p>
         </div>
         <div className="flex gap-4">
            <button className="btn-secondary">Download Release Package</button>
            <button onClick={() => useApp().setStep(AppStep.VERSIONS)} className="btn-primary">Continue to Version Control</button>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Engineering Review and Approval Workflow</h2>
          <p className="text-sm text-slate-500">All AI-generated manufacturing decisions require engineer authorization before production release.</p>
        </div>
        <div className="text-right">
           <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Approval Progress</p>
           <p className="text-sm font-bold text-slate-700">{Object.keys(state.approvals).length} of 5 reviewed</p>
        </div>
      </div>

      <div className="space-y-4">
        {DECISIONS.map((dec) => {
          const isApproved = state.approvals[dec.id];
          return (
            <div key={dec.id} className={cn(
              "card-base transition-all duration-300",
              isApproved ? "border-green-400 bg-green-50/30" : "bg-white"
            )}>
              <div className="flex gap-6">
                <div className="w-16 h-16 flex-shrink-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={8} data={[{ value: dec.conf, fill: dec.conf > 95 ? '#10B981' : '#3B82F6' }]} startAngle={90} endAngle={90 - (360 * dec.conf / 100)}>
                          <RadialBar dataKey="value" cornerRadius={4} />
                       </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px]">{Math.round(dec.conf)}%</div>
                </div>
                
                <div className="flex-1 space-y-3">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{dec.id}</span>
                      <span className="text-sm font-bold text-slate-800">{dec.type}</span>
                      {isApproved && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[8px] font-bold border border-green-200">AUTHORIZED by DEMO_USER</span>}
                   </div>
                   
                   <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Recommendation</p>
                      <p className="text-sm font-medium text-slate-700">{dec.rec}</p>
                   </div>
                   
                   <div className="bg-slate-50 border border-slate-100 rounded-md p-3">
                      <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">AI Rationale</p>
                      <p className="text-[11px] text-slate-600 italic leading-relaxed">{dec.rationale}</p>
                   </div>
                </div>

                <div className="flex flex-col gap-2 justify-center">
                   {!isApproved ? (
                     <>
                        <button onClick={() => handleApprove(dec.id)} className="bg-green-600 text-white rounded px-4 py-2 text-xs font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                           <Check size={14} /> APPROVE
                        </button>
                        <button className="bg-white border border-slate-200 rounded px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                           <X size={14} /> REJECT
                        </button>
                     </>
                   ) : (
                     <div className="flex flex-col items-center text-green-600">
                        <CheckCircle2 size={24} />
                        <span className="text-[9px] font-bold mt-1">APPROVED</span>
                     </div>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6">
        <button 
          disabled={!allApproved}
          onClick={handleRelease}
          className={cn(
            "w-full py-4 rounded-lg font-bold text-sm transition-all duration-500 shadow-lg",
            allApproved 
              ? "bg-green-600 text-white hover:bg-green-700 animate-pulse" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          {allApproved ? 'RELEASE TO PRODUCTION — v3.0 FINAL' : 'AUTHORIZE ALL DECISIONS TO PROCEED'}
        </button>
      </div>
    </div>
  );
}
