import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { CheckSquare, ChevronRight, FileText, AlertCircle, ShieldCheck, Microscope, ClipboardCheck } from 'lucide-react';
import { ProgressRealism } from '../UI/ProgressRealism';
import { cn } from '../../lib/utils';
import { AppStep } from '../../types';

export function QualityPlanning() {
  const { state } = useApp();
  const [isPlanning, setIsPlanning] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  const startPlanning = () => setIsPlanning(true);
  const handleComplete = () => {
    setIsPlanning(false);
    setResultReady(true);
  };

  const STAGES = [
    { title: 'Incoming Inspection', color: 'bg-amber-500', count: 3 },
    { title: 'In-Process Quality', color: 'bg-blue-500', count: 6 },
    { title: 'Final Performance Test', color: 'bg-green-500', count: 4 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Quality Inspection Plan</h2>
        <p className="text-sm text-slate-500">AI-generated quality checkpoints embedded at critical stages of the manufacturing process.</p>
      </div>

      {!resultReady && !isPlanning ? (
        <div className="card-base text-center p-20">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckSquare className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Build Quality Control Plan</h3>
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">Generate a tiered inspection strategy using historical defect data and component criticalities.</p>
          <button onClick={startPlanning} className="btn-primary mx-auto flex items-center gap-2">Generate Quality Plan <ChevronRight /> </button>
        </div>
      ) : isPlanning ? (
        <ProgressRealism 
          title="Generating Quality Strategy"
          subtitle="Analyzing defect history and critical dimensions"
          messages={["Mapping critical dimensions...", "Identifying high-risk nodes...", "Setting tolerance bounds...", "Finalizing checklists..."]}
          onComplete={handleComplete}
        />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
           {STAGES.map((stage, i) => (
             <div key={i} className="space-y-2">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-1 h-4 rounded-full", stage.color)} />
                    <h4 className="text-sm font-bold text-slate-700">{stage.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">{stage.count} checkpoints</span>
               </div>
               
               <div className="table-container">
                 <table className="w-full">
                    <thead className="table-header">
                       <tr>
                         <th className="px-4 py-3 w-16">ID</th>
                         <th className="px-4 py-3">Activity</th>
                         <th className="px-4 py-3">Method</th>
                         <th className="px-4 py-3">Acceptance Criteria</th>
                         <th className="px-4 py-3">Responsible</th>
                       </tr>
                    </thead>
                    <tbody>
                       {[...Array(stage.count)].map((_, idx) => (
                         <tr key={idx} className="table-row">
                           <td className="px-4 py-3 font-mono text-[10px] text-blue-700">Q-{i+1}{idx+1}</td>
                           <td className="px-4 py-3 font-medium">Critical Dimension Check</td>
                           <td className="px-4 py-3 text-xs text-slate-500">Laser Micrometer</td>
                           <td className="px-4 py-3 text-xs text-slate-500 italic">Within +/- 0.005mm</td>
                           <td className="px-4 py-3 text-xs font-bold text-slate-600">QA Inspector</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
             </div>
           ))}

           <div className="card-base p-6 bg-blue-50/50 border-blue-200">
              <div className="flex gap-6 items-start">
                 <ShieldCheck className="w-10 h-10 text-blue-600" />
                 <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800">Quality Coverage Summary</h3>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                       <div className="p-3 bg-white border border-slate-200 rounded-md">
                          <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">First Pass Yield</p>
                          <p className="text-lg font-bold text-green-600">94.2%</p>
                       </div>
                       <div className="p-3 bg-white border border-slate-200 rounded-md">
                          <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Critical Gates</p>
                          <p className="text-lg font-bold text-slate-800">4 Points</p>
                       </div>
                       <div className="p-3 bg-white border border-slate-200 rounded-md">
                          <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Inspection Time</p>
                          <p className="text-lg font-bold text-slate-800">18 <span className="text-[10px] font-normal">min</span></p>
                       </div>
                       <div className="p-3 bg-white border border-slate-200 rounded-md">
                          <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Risk Score</p>
                          <p className="text-lg font-bold text-blue-600 text-center">Low</p>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <button className="btn-secondary text-xs flex items-center gap-2"><FileText size={14} /> Export Plan</button>
                    <button onClick={() => useApp().setStep(AppStep.VARIANTS)} className="btn-primary text-xs flex items-center gap-2">Next <ChevronRight size={14} /></button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
