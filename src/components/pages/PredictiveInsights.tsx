import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { TrendingUp, ChevronRight, AlertTriangle, ShieldCheck, BarChart2, Info, Activity, Package } from 'lucide-react';
import { ProgressRealism } from '../UI/ProgressRealism';
import { cn } from '../../lib/utils';
import { AppStep } from '../../types';

export function PredictiveInsights() {
  const { state } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  const startAnalysis = () => setIsRunning(true);
  const handleComplete = () => {
    setIsRunning(false);
    setResultReady(true);
  };

  const ALERTS = [
    { type: 'CRITICAL', title: 'Silicon Steel Shortage', text: 'Stator Core (EMA-002) material lead time increasing from 4 to 8 weeks. Strategic buffer required.', color: 'border-red-500 text-red-700 bg-red-50' },
    { type: 'MEDIUM', title: 'Copper Price Volatility', text: 'Market forecast shows 12% upside in LME copper. Recommend early procurement for phase windings.', color: 'border-amber-500 text-amber-700 bg-amber-50' },
    { type: 'LOW', title: 'Labor Optimization Opportunity', text: 'ST4 underloading could be resolved by shifting end-shield prep from ST3.', color: 'border-blue-500 text-blue-700 bg-blue-50' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Predictive Risk Intelligence</h2>
        <p className="text-sm text-slate-500">AI-powered supply chain risk assessment and production launch readiness analysis.</p>
      </div>

      {!resultReady && !isRunning ? (
        <div className="card-base text-center p-20">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Predictive Engines Ready</h3>
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">Analyze global supply chain trends, labor availability and machine health to predict production risks.</p>
          <button onClick={startAnalysis} className="btn-primary mx-auto flex items-center gap-2">Run Risk Analysis <ChevronRight /> </button>
        </div>
      ) : isRunning ? (
        <ProgressRealism 
          title="Running Neural Risk Analysis"
          subtitle="Executing TensorCore regression clusters for supply chain forecasting"
          messages={[
            "Initializing TensorFlow 2.x Session...",
            "Loading PyTorch pre-trained ResNet/BERT weight vectors...",
            "Scraping global LME price indices...",
            "Correlating 400+ supplier health telemetry signals...",
            "Executing Scikit-learn Random Forest ensemble...",
            "Normalizing risk weightings across nodes...",
            "Synthesizing manufacturing readiness score..."
          ]}
          onComplete={handleComplete}
        />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                 <div className="card-base p-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-6">Monte Carlo Risk Probability Distribution</h3>
                    <div className="h-[200px] flex items-end justify-between gap-1 px-4 relative">
                       {/* Probability Curve Simulation */}
                       {[...Array(40)].map((_, i) => {
                          const height = Math.abs(Math.sin(i * 0.15) * 80) + (i > 25 ? 20 : 60) + (Math.random() * 20);
                          return (
                            <div 
                              key={i} 
                              className={cn(
                                "flex-1 rounded-t-sm transition-all duration-1000",
                                i > 28 ? 'bg-red-400' : i > 15 ? 'bg-blue-400' : 'bg-slate-300'
                              )}
                              style={{ height: `${height}%` }}
                            />
                          );
                       })}
                       <div className="absolute inset-x-0 bottom-0 h-px bg-slate-300" />
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/80 border border-slate-200 px-2 py-1 rounded text-[9px] font-mono text-slate-600">
                          P(95) Variance: ±12.4%
                       </div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-mono text-slate-400">
                       <span>Confidence Low</span>
                       <span>Expected Mean (μ)</span>
                       <span>Confidence High</span>
                    </div>
                 </div>

                 <div className="card-base p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                       <h3 className="text-sm font-semibold text-slate-700">Supply Chain Risk Heatmap</h3>
                       <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-100" /> LOW</span>
                          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-100" /> MED</span>
                          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-100" /> HIGH</span>
                       </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-13 gap-1">
                         {[...Array(3)].map((_, r) => (
                           <React.Fragment key={r}>
                             <div className="text-[9px] font-bold text-slate-400 flex items-center h-5 uppercase">{['Supply', 'Cost', 'Lead'][r]}</div>
                             {[...Array(12)].map((_, c) => (
                               <div key={c} className={cn(
                                 "h-5 rounded-sm border border-white",
                                 (r === 0 && c === 1) || (r === 2 && c === 4) ? 'bg-red-100' : 
                                 (r === 1 && c > 8) ? 'bg-amber-100' : 'bg-green-100'
                               )} />
                             ))}
                           </React.Fragment>
                         ))}
                      </div>
                      <div className="flex justify-between mt-4">
                         <div className="flex gap-1">
                            {[...Array(12)].map((_, i) => (
                              <div key={i} className="text-[8px] font-mono w-5 text-center text-slate-400">EMA-{i+1}</div>
                            ))}
                         </div>
                      </div>
                    </div>
                 </div>

                 <div className="table-container">
                    <div className="px-4 py-3 border-b border-slate-100 font-bold text-xs text-slate-700">Risk Assessment by Component</div>
                    <table className="w-full">
                       <thead className="table-header">
                          <tr>
                             <th className="px-4 py-3">Part</th>
                             <th className="px-4 py-3">Description</th>
                             <th className="px-4 py-3">Risk Level</th>
                             <th className="px-4 py-3">Lead Time Risk</th>
                             <th className="px-4 py-3">Mitigation</th>
                          </tr>
                       </thead>
                       <tbody>
                          <tr className="table-row">
                             <td className="px-4 py-3 font-mono text-[10px] font-bold text-blue-700">EMA-002</td>
                             <td className="px-4 py-3 text-xs">Stator Core</td>
                             <td className="px-4 py-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">CRITICAL</span></td>
                             <td className="px-4 py-3 text-xs text-slate-600">+45 Days</td>
                             <td className="px-4 py-3 text-[10px] text-blue-600 font-bold">Alternate Sourcing</td>
                          </tr>
                          <tr className="table-row">
                             <td className="px-4 py-3 font-mono text-[10px] font-bold text-blue-700">EMA-003</td>
                             <td className="px-4 py-3 text-xs">Stator Winding</td>
                             <td className="px-4 py-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">HIGH</span></td>
                             <td className="px-4 py-3 text-xs text-slate-600">+12 Days</td>
                             <td className="px-4 py-3 text-[10px] text-blue-600 font-bold">Blanket Order</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 {ALERTS.map((alert, i) => (
                    <div key={i} className={cn("card-base border-l-4 p-4 animate-in slide-in-from-right-4 duration-300", alert.color.split(' ')[0], alert.color.split(' ')[2])}>
                       <div className="flex justify-between items-start mb-2">
                          <span className={cn("text-[9px] font-bold uppercase tracking-wider", alert.color.split(' ')[1])}>{alert.type} ALERT</span>
                          <AlertTriangle size={14} className={alert.color.split(' ')[1]} />
                       </div>
                       <h4 className="text-sm font-bold text-slate-800 mb-1">{alert.title}</h4>
                       <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{alert.text}</p>
                    </div>
                 ))}

                 <div className="card-base text-center p-6 bg-slate-50 border-slate-200">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-4">Production Readiness</p>
                    <div className="relative w-32 h-32 mx-auto">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="50" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                          <circle cx="64" cy="64" r="50" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={314} strokeDashoffset={314 - (314 * 0.71)} className="text-amber-500 animate-pulse" />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold">71%</span>
                          <span className="text-[8px] text-slate-500 uppercase font-bold">Ready</span>
                       </div>
                    </div>
                    <button className="btn-primary w-full mt-6 text-xs" onClick={() => useApp().setStep(AppStep.SYNC)}>Next: Sync Monitor</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
