import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { Layers, ChevronRight, FileSpreadsheet, Plus, Info, RefreshCw, Archive, Zap, ShieldCheck } from 'lucide-react';
import { ProgressRealism } from '../UI/ProgressRealism';
import { cn } from '../../lib/utils';
import { AppStep } from '../../types';

export function VariantManager() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('Standard');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = ['Standard', 'High-Efficiency', 'Explosion-Proof'];

  const handleTabChange = (t: string) => {
    if (t === activeTab) return;
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(t);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Product Variant Configuration Manager</h2>
        <p className="text-sm text-slate-500">Manage multiple product configurations with delta tracking and variant-specific mBOMs.</p>
      </div>

      <div className="flex border-b border-slate-200 gap-8">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={cn(
              "pb-4 text-sm font-semibold transition-all relative",
              activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        ))}
        <button className="ml-auto pb-4 text-blue-600 text-[10px] font-bold flex items-center gap-1 hover:underline">
          <Plus size={12} /> ADD NEW CONFIGURATION
        </button>
      </div>

      <div className="relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
             {[
               { label: 'Variant Efficiency', val: activeTab === 'High-Efficiency' ? '+4.2%' : 'Baseline', icon: Zap },
               { label: 'Cost Impact', val: activeTab === 'Standard' ? '$0.00' : activeTab === 'High-Efficiency' ? '+$124.50' : '+$482.00', icon: TrendingUpIcon },
               { label: 'Lead Time Delta', val: activeTab === 'Explosion-Proof' ? '+14 days' : 'Same', icon: ClockIcon },
               { label: 'Certification', val: activeTab === 'Explosion-Proof' ? 'ATEX Zone 1' : 'Standard', icon: ShieldCheck }
             ].map((m, i) => (
                <div key={i} className="card-base py-3">
                   <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{m.label}</p>
                   <div className="flex items-center gap-2">
                      <m.icon className="w-4 h-4 text-slate-400" />
                      <p className="text-base font-bold text-slate-800">{m.val}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="table-container">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center">
               <span className="text-[10px] font-bold text-slate-500 uppercase">BOM Delta Table — Comparison to Baseline</span>
               <span className="text-[10px] text-blue-600 font-mono">25 Components + {activeTab === 'Standard' ? 0 : 2} Delta Items</span>
            </div>
            <table className="w-full">
               <thead className="table-header">
                 <tr>
                    <th className="px-4 py-3">Part No.</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Base Value</th>
                    <th className="px-4 py-3">Variant Value</th>
                    <th className="px-4 py-3">Change Note</th>
                 </tr>
               </thead>
               <tbody className="bg-white">
                  {activeTab === 'Standard' ? (
                    <tr className="table-row">
                      <td colSpan={6} className="px-4 py-20 text-center text-slate-400 italic text-sm">
                        Standard configuration matched base eBOM. No deltas detected.
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr className="table-row bg-amber-50/30 border-l-2 border-amber-400">
                        <td className="px-4 py-3 font-mono text-[10px] font-bold">EMA-001</td>
                        <td className="px-4 py-3 text-xs">Motor Frame</td>
                        <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 px-1.5 rounded text-[9px] font-bold">MODIFIED</span></td>
                        <td className="px-4 py-3 text-xs">Cast Iron</td>
                        <td className="px-4 py-3 text-xs font-bold">{activeTab === 'Explosion-Proof' ? 'Cast Steel (A216)' : 'Lighter Alloy'}</td>
                        <td className="px-4 py-3 text-[10px] text-slate-500 italic">Material shift for {activeTab === 'Explosion-Proof' ? 'structural pressure' : 'efficiency'}.</td>
                      </tr>
                      <tr className="table-row bg-green-50/30 border-l-2 border-green-400">
                        <td className="px-4 py-3 font-mono text-[10px] font-bold">EMA-EX1</td>
                        <td className="px-4 py-3 text-xs">Pressure Valve</td>
                        <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-1.5 rounded text-[9px] font-bold">ADDED</span></td>
                        <td className="px-4 py-3 text-xs">--</td>
                        <td className="px-4 py-3 text-xs font-bold">Brass (EEx)</td>
                        <td className="px-4 py-3 text-[10px] text-slate-500 italic">Explosion containment relief system.</td>
                      </tr>
                    </>
                  )}
               </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button className="btn-secondary flex items-center gap-2"><FileSpreadsheet size={16} /> Export {activeTab} BOM</button>
        <button onClick={() => useApp().setStep(AppStep.INSIGHTS)} className="btn-primary group flex items-center gap-2">Proceed to Insights <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

// Minimal icons
function TrendingUpIcon(props: any) { return <TrendingUp {...props} />; }
import { TrendingUp, Clock } from 'lucide-react';
function ClockIcon(props: any) { return <Clock {...props} />; }
