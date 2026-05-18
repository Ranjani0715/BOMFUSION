import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { BarChart2, ChevronRight, Search, Play, Activity, TrendingDown, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { ProgressRealism } from '../UI/ProgressRealism';
import { STATIONS } from '../../data/sampleData';
import { cn } from '../../lib/utils';
import { AppStep } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export function LineBalancing() {
  const { state } = useApp();
  const [isBalancing, setIsBalancing] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const [query, setQuery] = useState('');
  const [ans, setAns] = useState<string | null>(null);

  const TAKT_SEC = 2400; // Total 480 min (28800s) / 12 units = 2400s

  const startAnalysis = () => {
    setIsBalancing(true);
  };

  const handleComplete = () => {
    setIsBalancing(false);
    setResultReady(true);
  };

  const handleQuery = () => {
    setAns('Processing query...');
    setTimeout(() => {
      if (query.toLowerCase().includes('bottleneck')) {
        setAns('The primary bottleneck is identified at Station 5 (Final Test & Packing) with a cycle time of 1,620s. While below the Takt time of 2,400s, it represents the highest congestion point in the primary flow.');
      } else if (query.toLowerCase().includes('efficiency')) {
        setAns('Current line efficiency is 45.25%. This is significantly impacted by the underloaded Station 4 (Electrical & Secondary). Moving sub-assembly tasks from ST3 to ST4 is recommended.');
      } else {
        setAns('Based on the current EMA-2024 routing plan, all stations are within the 2,400s Takt limit. Recommendation: Consolidate ST4 tasks with ST3 for a 4-station configuration if throughput demand remains at 12 units/day.');
      }
    }, 1200);
  };

  const chartData = STATIONS.map(s => ({
    name: `ST-${s.stationId}`,
    time: s.cycleTime,
    fullTime: s.cycleTime,
    status: s.cycleTime > TAKT_SEC ? 'BOTTLENECK' : s.cycleTime < 500 ? 'UNDERLOADED' : 'BALANCED'
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Assembly Line Balancing and Optimization</h2>
        <p className="text-sm text-slate-500">Takt time analysis, bottleneck detection, and production throughput optimization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-base col-span-1">
          <h3 className="text-sm font-semibold text-slate-700 mb-6">Takt Time Calculator</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 block">Available Time (min/day)</label>
              <input type="number" defaultValue={480} className="input-base" readOnly />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 block">Customer Demand (units/day)</label>
              <input type="number" defaultValue={12} className="input-base" readOnly />
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md mt-6">
               <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Calculated Takt Time</p>
               <p className="text-lg font-bold text-slate-800">40.0 minutes</p>
               <p className="text-[10px] text-blue-600 font-mono">2,400 seconds per unit</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card-base flex flex-col justify-center text-center p-10">
          {!resultReady && !isBalancing ? (
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <BarChart2 className="text-blue-600 w-8 h-8" />
               </div>
               <h3 className="text-lg font-medium text-slate-800 mb-2">Efficiency Analysis Ready</h3>
               <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">Analyze the routing plan against customer demand to identify bottlenecks and underutilized resources.</p>
               <button onClick={startAnalysis} className="btn-primary mx-auto flex items-center gap-2">Run Line Balance Analysis <ChevronRight size={16} /> </button>
             </div>
          ) : isBalancing ? (
            <ProgressRealism 
              title="Optimization Analysis Running"
              subtitle="Processing station metrics and identifying bottlenecks"
              messages={["Loading station cycle times...", "Identifying bottlenecks...", "Generating recommendations..."]}
              onComplete={handleComplete}
            />
          ) : (
            <div className="h-full w-full">
               <h3 className="text-left text-sm font-semibold text-slate-700 mb-6">Cycle Time per Station vs. Takt</h3>
               <div className="h-[280px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                     <YAxis fontSize={10} axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                     />
                     <ReferenceLine y={TAKT_SEC} stroke="#DC2626" strokeDasharray="4 2" label={{ value: 'Takt: 2,400s', fontSize: 9, fill: '#DC2626', position: 'right' }} />
                     <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.status === 'UNDERLOADED' ? '#D97706' : entry.time > 2000 ? '#3B82F6' : '#10B981'} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-5 gap-2 mt-4">
                  {chartData.map((s, i) => (
                    <div key={i} className="text-center font-mono italic text-[9px]">
                       <p className="font-bold text-slate-700">{s.time}s</p>
                       <span className={cn(
                         "px-1 rounded",
                         s.status === 'UNDERLOADED' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                       )}>{s.status}</span>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      {resultReady && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="card-base border-l-4 border-amber-500 overflow-hidden relative">
            <div className="absolute top-4 right-4">
               <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] px-2 py-0.5 rounded font-bold">BOMfusionAI AI ANALYSIS</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Optimization Recommendations</h3>
            <div className="space-y-4">
               <p className="text-xs text-slate-600 leading-relaxed italic">
                 "Line efficiency is currently 45.25%. Station 4 is significantly underloaded (300s) compared to the 2,400s Takt. I recommend moving the 'Nameplate Riveting' and 'Fan Assembly' tasks from ST3 and integrating them into ST4 to better balance physical footprints."
               </p>
               <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-md">
                     <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Efficiency</p>
                     <p className="text-lg font-bold text-blue-600">45.2%</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-md">
                     <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Throughput</p>
                     <p className="text-lg font-bold text-slate-800">1.5 <span className="text-[10px] font-normal">u/hr</span></p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-md">
                     <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Capacity Loss</p>
                     <p className="text-lg font-bold text-red-600">28%</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="card-base">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Production Intelligence Query</h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about your production plan..."
                  className="input-base pl-10 pr-20"
                />
                <button 
                  onClick={handleQuery}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold"
                >
                  QUERY
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {['Where is the bottleneck?', 'Can I hit 15 units/day?', 'Labor skill gap analysis', 'ST4 Underloading fix'].map(q => (
                  <button 
                    key={q} 
                    onClick={() => setQuery(q)}
                    className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded hover:bg-slate-100 text-slate-600"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {ans && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-md animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">BOMfusionAI Response:</p>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{ans}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => useApp().setStep(AppStep.CONSTRAINTS)}
          className="btn-primary group flex items-center gap-2"
        >
          Proceed to Constraints Engine
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
