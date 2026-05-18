import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { Cpu, CheckCircle2, ChevronRight, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { ProgressRealism } from '../UI/ProgressRealism';
import { MOTOR_COMPONENTS } from '../../data/sampleData';
import { cn } from '../../lib/utils';
import { AppStep, PartCategory } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function Classification() {
  const { state, setClassificationDone } = useApp();
  const [isClassifying, setIsClassifying] = useState(false);
  const [visibleRows, setVisibleRows] = useState<number>(0);

  const startClassification = () => {
    setIsClassifying(true);
  };

  const handleComplete = () => {
    setIsClassifying(false);
    setClassificationDone(true);
    
    // Randomized row reveal
    MOTOR_COMPONENTS.forEach((_, i) => {
      const delay = i * (Math.floor(Math.random() * 80) + 40);
      setTimeout(() => setVisibleRows(prev => prev + 1), delay);
    });
  };

  const getCategoryTheme = (cat?: PartCategory) => {
    switch (cat) {
      case PartCategory.MANUFACTURED: return 'bg-cat-manufactured-bg text-cat-manufactured-text border-blue-200';
      case PartCategory.PURCHASED: return 'bg-cat-purchased-bg text-cat-purchased-text border-purple-200';
      case PartCategory.FASTENER: return 'bg-cat-fastener-bg text-cat-fastener-text border-amber-200';
      case PartCategory.CONSUMABLE: return 'bg-cat-consumable-bg text-cat-consumable-text border-orange-200';
      case PartCategory.FLOOR_STOCK: return 'bg-cat-floor-bg text-cat-floor-text border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const pieData = [
    { name: 'Manufactured', value: 9, color: '#2563EB' },
    { name: 'Purchased', value: 7, color: '#8B5CF6' },
    { name: 'Fastener', value: 4, color: '#D97706' },
    { name: 'Consumable', value: 4, color: '#EA580C' },
    { name: 'Floor Stock', value: 1, color: '#64748B' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">AI Component Classification Engine</h2>
        <p className="text-sm text-slate-500">Intelligent categorization of engineering components for manufacturing treatment.</p>
      </div>

      {!state.classificationDone && !isClassifying && (
        <div className="card-base text-center p-20">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Cpu className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Ready to Analyze Components</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
            The AI engine will analyze geometry, materials, and naming conventions to determine manufacturing treatment for 25 items.
          </p>
          <button 
            onClick={startClassification}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            Run Classification Analysis
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {isClassifying && (
        <ProgressRealism 
          title="Classification Analysis Running"
          subtitle="Analyzing 25 components against manufacturing knowledge base"
          messages={[
            "Initializing Rule-based AI Engine (v2.4)...",
            "Loading Scikit-learn Random Forest weights...",
            "Applying ISO-4957 Material Rule Set...",
            "Geometric Pattern Matching via TensorFlow...",
            "Evaluating Pandas DataFrames for cost trends...",
            "Heuristic resolution of floor stock ambiguity...",
            "Classification synchronization complete."
          ]}
          onComplete={handleComplete}
        />
      )}

      {state.classificationDone && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="table-container">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3">Part No.</th>
                  <th className="px-4 py-3">Component Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Manufacturing Rationale</th>
                  <th className="px-4 py-3">Override</th>
                </tr>
              </thead>
              <tbody>
                {MOTOR_COMPONENTS.slice(0, visibleRows).map((part) => (
                  <tr key={part.id} className="table-row animate-in fade-in slide-in-from-bottom-1">
                    <td className="px-4 py-3">
                      <span className="font-mono text-blue-700 text-[10px] font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {part.partNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{part.name}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                        getCategoryTheme(part.category)
                      )}>
                        {part.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            (part.confidence || 0) > 95 ? "bg-green-500" : "bg-blue-500"
                          )} style={{ width: `${part.confidence}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{part.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-slate-500 italic max-w-xs truncate" title={part.rationale}>
                      {part.rationale}
                    </td>
                    <td className="px-4 py-3">
                      <select className="bg-white border border-slate-200 rounded text-[10px] px-1 py-0.5 outline-none focus:border-blue-400">
                        <option>None</option>
                        <option>Force Manufactured</option>
                        <option>Force Purchased</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 card-base p-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Category Breakdown</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 mt-2">
                 {pieData.map(d => (
                   <div key={d.name} className="flex items-center justify-between text-[10px]">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                       <span className="text-slate-600">{d.name}</span>
                     </div>
                     <span className="font-bold">{d.value}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="lg:col-span-3 card-base p-6 flex flex-col justify-center">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800 flex gap-4">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Exclusion Notification</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    2 consumable items (EMA-022, EMA-024) and 1 floor stock item (EMA-025) have been excluded from assembly routing logic. These will be managed as bulk issue items in the ERP system to optimize warehouse retrieval cycles.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => useApp().setStep(AppStep.MBOM)}
                  className="btn-primary group flex items-center gap-2"
                >
                  Generate Manufacturing BOM
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
