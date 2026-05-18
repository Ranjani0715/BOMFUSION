import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { Route, ChevronRight, FileSpreadsheet, Play, Activity, Clock, Layers, ShieldCheck, Box, HardHat, TrendingDown } from 'lucide-react';
import { ProgressRealism } from '../UI/ProgressRealism';
import { ROUTING_OPERATIONS } from '../../data/sampleData';
import { cn } from '../../lib/utils';
import { AppStep } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function RoutingPlanner() {
  const { state, setRoutingDone } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibleRows, setVisibleRows] = useState<number>(0);

  const startGeneration = () => {
    setIsGenerating(true);
  };

  const handleComplete = () => {
    setIsGenerating(false);
    setRoutingDone(true);
    ROUTING_OPERATIONS.forEach((_, i) => {
      const delay = i * (Math.floor(Math.random() * 60) + 30);
      setTimeout(() => setVisibleRows(prev => prev + 1), delay);
    });
  };

  const getStationBadge = (id: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-rose-100 text-rose-800 border-rose-200'
    ];
    return colors[id - 1];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Manufacturing Routing Generator</h2>
          <p className="text-sm text-slate-500">AI-generated operation sequence with workstation assignments, machine requirements, and skill mapping.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-md px-4 py-2 flex gap-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> ST-1</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> ST-2</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> ST-3</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> ST-4</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> ST-5</div>
        </div>
      </div>

      {!state.routingDone && !isGenerating && (
        <div className="card-base text-center p-20">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Route className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Automated Routing Planner</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
            The AI engine will sequence operations, assign labor skills, and map machine resources following assembly precedence rules.
          </p>
          <button 
            onClick={startGeneration}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            Generate Routing Plan
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {isGenerating && (
        <ProgressRealism 
          title="Routing Generation in Progress"
          subtitle="Mapping operations to workstations and calculating cycle times"
          messages={[
            "Syncing mBOM station nodes from PostgreSQL...",
            "Executing TensorFlow Routing Sequence Optimizer...",
            "Evaluating machine-tool compatibility (PyTorch)...",
            "Applying NumPy-optimized load-balancing heuristics...",
            "Resolving operation dependencies via Graph API...",
            "Routing plan synchronization complete."
          ]}
          onComplete={handleComplete}
        />
      )}

      {state.routingDone && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="table-container">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 w-20">Op. ID</th>
                  <th className="px-4 py-3">Operation Name</th>
                  <th className="px-4 py-3">Station</th>
                  <th className="px-4 py-3">Machine / Tool</th>
                  <th className="px-4 py-3 text-right">Cycle Time</th>
                  <th className="px-4 py-3">Depends On</th>
                  <th className="px-4 py-3">Skill Required</th>
                </tr>
              </thead>
              <tbody>
                {ROUTING_OPERATIONS.slice(0, visibleRows).map((op) => (
                  <tr key={op.id} className="table-row animate-in fade-in slide-in-from-bottom-1 border-b border-slate-100">
                    <td className="px-4 py-4 font-mono text-[10px] font-bold text-blue-700 bg-blue-50/30">
                      {op.id}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-800">{op.name}</td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-bold border",
                        getStationBadge(op.stationId)
                      )}>
                        ST-{op.stationId}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[10px] text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-slate-400" />
                        {op.machine}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[10px] font-mono text-right font-bold text-slate-700">
                      {op.cycleTime}s
                    </td>
                    <td className="px-4 py-4">
                      {op.dependsOn ? (
                        <span className="text-[9px] text-amber-700 font-mono bg-amber-50 px-1 rounded border border-amber-100">
                          {op.dependsOn}
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-300 italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 rounded font-medium">
                           {op.skillRequired}
                         </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 card-base">
              <h3 className="text-sm font-semibold text-slate-700 mb-6">Operation Cycle Time Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ROUTING_OPERATIONS} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="id" type="category" width={60} fontSize={10} fontStyle="mono" axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#F8FAFC' }}
                      contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    />
                    <Bar dataKey="cycleTime" radius={[0, 4, 4, 0]}>
                       {ROUTING_OPERATIONS.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={
                           entry.stationId === 1 ? '#3B82F6' : // Blue
                           entry.stationId === 2 ? '#8B5CF6' : // Purple
                           entry.stationId === 3 ? '#10B981' : // Emerald
                           entry.stationId === 4 ? '#F59E0B' : // Amber
                           '#E11D48' // Rose (ST5)
                         } />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 card-base p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Routing Reliability Metrics</h3>
              <div className="space-y-6">
                {[
                  { label: 'Sequence Integrity', val: '100%', score: 100, color: 'bg-green-500' },
                  { label: 'Resource Contention', val: '8%', score: 8, color: 'bg-green-500' },
                  { label: 'Precedence Logic', val: 'Verified', score: 100, color: 'bg-green-500' },
                  { label: 'Skill Gap Index', val: '0.12', score: 12, color: 'bg-blue-500' },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-1.5 font-bold uppercase tracking-tight text-slate-600">
                      <span>{m.label}</span>
                      <span className="text-slate-800">{m.val}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={cn("h-full transition-all duration-1000", m.color)} style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={() => useApp().setStep(AppStep.BALANCE)}
                  className="btn-primary w-full group flex items-center justify-center gap-2"
                >
                  Proceed to Line Balancing
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
