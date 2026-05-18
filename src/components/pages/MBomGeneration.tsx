import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { GitBranch, ChevronRight, ChevronDown, CheckCircle2, GitMerge, FileSpreadsheet, FileJson } from 'lucide-react';
import { ProgressRealism } from '../UI/ProgressRealism';
import { MOTOR_COMPONENTS, STATIONS } from '../../data/sampleData';
import { cn } from '../../lib/utils';
import { AppStep, PartCategory } from '../../types';

export function MBomGeneration() {
  const { state, setMBomGenerated } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedStations, setExpandedStations] = useState<number[]>([1, 2, 3, 4, 5]);

  const startGeneration = () => {
    setIsGenerating(true);
  };

  const handleComplete = () => {
    setIsGenerating(false);
    setMBomGenerated(true);
  };

  const toggleStation = (id: number) => {
    setExpandedStations(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Manufacturing BOM Generation</h2>
        <p className="text-sm text-slate-500">AI restructures engineering design hierarchy into station-based manufacturing assembly sequence.</p>
      </div>

      {!state.mBomGenerated && !isGenerating && (
        <div className="card-base text-center p-20">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <GitBranch className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">mBOM Structure Planning</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
            The system will map 25 components to 5 assembly stations based on precedence, tooling, and labor specialization.
          </p>
          <button 
            onClick={startGeneration}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            Generate Manufacturing BOM
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {isGenerating && (
        <ProgressRealism 
          title="mBOM Generation in Progress"
          subtitle="Restructuring 25 components into manufacturing assembly sequence"
          messages={[
            "Loading eBOM structure...",
            "Analyzing component relationships...",
            "Computing assembly precedence graph...",
            "Grouping components by workstation...",
            "Detecting sub-assembly candidates...",
            "Running zero-leakage validation...",
            "mBOM structure complete."
          ]}
          onComplete={handleComplete}
        />
      )}

      {state.mBomGenerated && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
            {/* Left: eBOM */}
            <div className="card-base flex flex-col h-full bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700">Engineering BOM — Input</h3>
                <span className="bg-slate-200 text-slate-600 px-2 rounded-full text-[10px] font-bold">25 PARTS</span>
              </div>
              <div className="overflow-y-auto flex-1 space-y-1">
                {MOTOR_COMPONENTS.map(p => (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-1.5 opacity-60">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      p.category === PartCategory.MANUFACTURED ? 'bg-blue-500' : 'bg-slate-400'
                    )} />
                    <span className="font-mono text-[9px] text-slate-500 w-16">{p.partNumber}</span>
                    <span className="text-[10px] text-slate-600 truncate">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: mBOM */}
            <div className="card-base flex flex-col h-full overflow-hidden p-0 border-slate-300">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-sm font-semibold text-slate-700">Manufacturing BOM — Generated</h3>
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 rounded-full text-[10px] font-bold">5 STATIONS</span>
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1 p-3 space-y-3 bg-slate-50/30">
                {STATIONS.map((station) => (
                  <div key={station.stationId} className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
                    <div 
                      onClick={() => toggleStation(station.stationId)}
                      className="bg-[#1E3A5F] text-white px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#254a7a] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-500 text-white font-mono text-[10px] px-1.5 rounded font-bold">ST-{station.stationId}</span>
                        <span className="text-sm font-semibold">{station.stationName}</span>
                        <span className="bg-blue-400/40 text-white text-[10px] px-1.5 rounded-full">{station.components.length} parts</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-blue-200 font-mono tracking-tight">{Math.floor(station.cycleTime / 60)}m {station.cycleTime % 60}s</span>
                        {expandedStations.includes(station.stationId) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    {expandedStations.includes(station.stationId) && (
                      <div className="animate-in slide-in-from-top-2 duration-200">
                        {station.components.map(comp => (
                          <div key={comp.id} className="px-5 py-2 border-b border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-default">
                             <div className={cn(
                                "w-2 h-2 rounded-full",
                                comp.category === PartCategory.MANUFACTURED ? 'bg-blue-500' : 
                                comp.category === PartCategory.PURCHASED ? 'bg-purple-500' : 'bg-slate-300'
                             )} />
                             <span className="font-mono text-[9px] text-blue-700 font-bold bg-blue-50 px-1 rounded">{comp.partNumber}</span>
                             <span className="text-xs text-slate-700 flex-1">{comp.name}</span>
                             <span className="text-[10px] text-slate-400 font-mono">{comp.material}</span>
                             <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded">x{comp.quantity}</span>
                          </div>
                        ))}
                        <div className="bg-slate-50 px-5 py-2 text-[10px] border-t border-slate-100">
                           <span className="font-bold text-slate-500 uppercase tracking-tighter">Planned Operations:</span>
                           <div className="flex flex-wrap gap-2 mt-1">
                             {station.operations.map((op, oi) => (
                               <div key={oi} className="flex items-center gap-1 text-slate-600">
                                 {oi > 0 && <span className="text-slate-300">→</span>}
                                 <span>{op}</span>
                               </div>
                             ))}
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-base p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-6">Zero-Leakage Validation</h3>
              <div className="flex items-center gap-8 px-4">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Engineering eBOM</p>
                  <p className="text-2xl font-bold">25</p>
                  <p className="text-[10px] text-slate-400 mt-1">Total components</p>
                </div>
                <div className="flex-1 relative h-0.5 bg-green-500">
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500 bg-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Manufacturing mBOM</p>
                  <p className="text-2xl font-bold text-green-600">25</p>
                  <p className="text-[10px] text-slate-400 mt-1">Successfully mapped</p>
                </div>
              </div>
              <p className="mt-8 text-xs text-slate-500 bg-green-50 border border-green-100 p-3 rounded text-center">
                All 25 engineering components successfully mapped to manufacturing stations. No components lost in translation.
              </p>
            </div>

            <div className="card-base p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-6">Assembly Flow Diagram</h3>
            <div className="flex justify-center py-4 bg-slate-50 rounded-lg border border-slate-100">
               <svg width="400" height="150" viewBox="0 0 400 150">
                  {/* Station 1 & 2 Parallel */}
                  <rect x="20" y="10" width="80" height="40" rx="4" fill="#F8FAFC" stroke="#1E3A5F" strokeWidth="1" />
                  <text x="60" y="30" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1E3A5F">ST-1</text>
                  <text x="60" y="42" textAnchor="middle" fontSize="6" fill="#64748B">Core Prep</text>
                  
                  <rect x="20" y="100" width="80" height="40" rx="4" fill="#F8FAFC" stroke="#1E3A5F" strokeWidth="1" />
                  <text x="60" y="120" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1E3A5F">ST-2</text>
                  <text x="60" y="132" textAnchor="middle" fontSize="6" fill="#64748B">Rotor Assy</text>
                  
                  {/* Arrows to Merge */}
                  <path d="M100 30 L130 30 L160 65" fill="none" stroke="#2563EB" strokeWidth="1" />
                  <path d="M100 120 L130 120 L160 85" fill="none" stroke="#2563EB" strokeWidth="1" />
                  
                  {/* Station 3 */}
                  <rect x="160" y="55" width="80" height="40" rx="4" fill="#F8FAFC" stroke="#1E3A5F" strokeWidth="1" />
                  <text x="200" y="75" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1E3A5F">ST-3</text>
                  <text x="200" y="87" textAnchor="middle" fontSize="6" fill="#64748B">Integration</text>
                  
                  {/* Path Forward */}
                  <line x1="240" y1="75" x2="280" y2="75" stroke="#2563EB" strokeWidth="1" />
                  
                  {/* Station 4 */}
                  <rect x="280" y="55" width="80" height="40" rx="4" fill="#F8FAFC" stroke="#1E3A5F" strokeWidth="1" />
                  <text x="320" y="75" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1E3A5F">ST-4 / ST-5</text>
                  <text x="320" y="87" textAnchor="middle" fontSize="6" fill="#64748B">Test & Pack</text>
                  
                  <text x="130" y="15" textAnchor="middle" fontSize="6" fill="#166534" fontWeight="bold">REDUCED LEAD TIME</text>
               </svg>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
                <button className="btn-secondary py-1.5 flex items-center gap-2"><FileSpreadsheet className="w-3.5 h-3.5" /> Download XLSX</button>
                <button 
                  onClick={() => useApp().setStep(AppStep.ROUTING)}
                  className="btn-primary group flex items-center gap-2"
                >
                  Proceed to Routing Planner
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
