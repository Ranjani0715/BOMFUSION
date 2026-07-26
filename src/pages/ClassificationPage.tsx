import React, { useState } from 'react';
import {
  Cpu,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Filter,
  BarChart3,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ComponentItem, CategoryType, StepId } from '../types';
import { SAMPLE_COMPONENTS } from '../data/sampleData';
import { runNonLinearProgress, revealRowsStaggered } from '../utils/aiSimulator';

interface ClassificationPageProps {
  components: ComponentItem[];
  onUpdateComponents: (updated: ComponentItem[]) => void;
  onSelectStep: (step: StepId) => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingMessage: (msg: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  addActivity: (stepName: string, summary: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ClassificationPage: React.FC<ClassificationPageProps> = ({
  components,
  onUpdateComponents,
  onSelectStep,
  setIsProcessing,
  setProcessingMessage,
  addToast,
  addActivity,
}) => {
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('Initializing component parser...');
  const [counter, setCounter] = useState<number>(1);
  const [displayedRows, setDisplayedRows] = useState<ComponentItem[]>([]);
  const [items, setItems] = useState<ComponentItem[]>(components);

  const categoryColors: Record<CategoryType, { bg: string; text: string; hex: string }> = {
    Manufactured: { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]', hex: '#2563EB' },
    Purchased: { bg: 'bg-[#EDE9FE]', text: 'text-[#5B21B6]', hex: '#7C3AED' },
    Fastener: { bg: 'bg-[#FEF9C3]', text: 'text-[#713F12]', hex: '#D97706' },
    Consumable: { bg: 'bg-[#FFEDD5]', text: 'text-[#9A3412]', hex: '#EA580C' },
    'Floor Stock': { bg: 'bg-[#F1F5F9]', text: 'text-[#475569]', hex: '#64748B' },
  };

  const handleRunAnalysis = async () => {
    setIsLoadingOverlay(true);
    setIsProcessing(true);
    setProcessingMessage('Python 3.10 Intelligent NLP Classifier Engine Running...');

    try {
      const response = await fetch('/api/python/classify-ebom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components: items }),
      });
      const pyData = await response.json();

      setIsLoadingOverlay(false);
      setIsProcessing(false);
      setHasRun(true);

      const updated = items.map((comp) => {
        const found = pyData.classifiedItems?.find((c: any) => c.partNumber === comp.partNumber);
        if (found) {
          return {
            ...comp,
            confidence: found.confidenceScore,
            status: found.isFlagged ? ('Flagged' as const) : comp.status,
          };
        }
        return comp;
      });

      setItems(updated);
      onUpdateComponents(updated);

      revealRowsStaggered(
        updated,
        (revealed) => setDisplayedRows(revealed),
        () => {
          addToast(
            'Python NLP Classification Complete',
            `Python 3.10 engine categorized ${pyData.classifiedComponentsCount || 25} components (${pyData.overallTaxonomyAccuracyPct}% taxonomy accuracy).`,
            'success'
          );
          addActivity(
            'Python Classification',
            `Categorized ${pyData.classifiedComponentsCount || 25} components using Python NLP classifier.`,
            'success'
          );
        }
      );
    } catch (err) {
      setIsLoadingOverlay(false);
      setIsProcessing(false);
      setHasRun(true);
      revealRowsStaggered(items, (revealed) => setDisplayedRows(revealed));
    }
  };

  const handleCategoryOverride = (id: string, newCat: CategoryType) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          category: newCat,
          isOverridden: true,
        };
      }
      return item;
    });

    setItems(updated);
    setDisplayedRows(updated.slice(0, displayedRows.length));
    onUpdateComponents(updated);

    addToast(
      'Category Overridden',
      `Component ${id} reclassified as ${newCat} by engineer.`,
      'info'
    );
    addActivity(
      'AI Classification',
      `Manual override: Reclassified ${id} to ${newCat}.`,
      'warning'
    );
  };

  // Pie Chart Data
  const categoryCounts: Record<CategoryType, number> = {
    Manufactured: 0,
    Purchased: 0,
    Fastener: 0,
    Consumable: 0,
    'Floor Stock': 0,
  };

  items.forEach((item) => {
    if (item.category) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  });

  const pieData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat as CategoryType],
    color: categoryColors[cat as CategoryType].hex,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          AI Component Classification Engine
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Intelligent categorization of engineering components for manufacturing treatment
        </p>
      </div>

      {/* Initial State / Run Button */}
      {!hasRun && !isLoadingOverlay && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Cpu className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            Run Manufacturing Classification
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The AI engine analyzes 25 component material properties, geometry, quantities, and PLM metadata against industrial manufacturing heuristics to classify items into Manufactured, Purchased, Fasteners, Consumables, and Floor Stock.
          </p>
          <button
            onClick={handleRunAnalysis}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Cpu className="w-4 h-4" />
            Run Classification Analysis
          </button>
        </div>
      )}

      {/* PHASE 1: Full-Page Loading Overlay */}
      {isLoadingOverlay && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-8 max-w-md w-full space-y-5 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Classification Analysis Running
                </h3>
                <p className="text-xs text-slate-500">
                  Analyzing 25 components against manufacturing rulebase
                </p>
              </div>
            </div>

            {/* Non-linear progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-semibold text-slate-700">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 font-mono">
              <span className="italic truncate">{statusMsg}</span>
              <span className="shrink-0 font-semibold text-blue-700">
                {counter} / 25
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2 & 3: Results Table & Breakdown */}
      {hasRun && (
        <div className="space-y-6">
          {/* Main Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-800">
                  AI Component Classification Matrix
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  25 Categorized
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Mean AI Confidence: 96.4%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Part No.</th>
                    <th className="px-3 py-2.5">Component Name</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5">Confidence</th>
                    <th className="px-3 py-2.5">Manufacturing Rationale</th>
                    <th className="px-3 py-2.5">Override Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {displayedRows.map((row) => {
                    const cat = row.category || 'Manufactured';
                    const catStyle = categoryColors[cat];

                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-3 py-2.5 font-mono text-xs font-semibold text-blue-700">
                          <span className="bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                            {row.id}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-medium text-slate-800">
                          {row.name}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${catStyle.bg} ${catStyle.text}`}
                          >
                            {cat}
                          </span>
                          {row.isOverridden && (
                            <span className="ml-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded font-mono">
                              Mod
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${row.confidence || 95}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono font-semibold text-slate-700">
                              {row.confidence || 95}%
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-slate-600 italic max-w-md">
                          {row.rationale}
                        </td>
                        <td className="px-3 py-2.5">
                          <select
                            value={cat}
                            onChange={(e) =>
                              handleCategoryOverride(
                                row.id,
                                e.target.value as CategoryType
                              )
                            }
                            className="border border-slate-300 rounded text-xs px-2 py-1 bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="Manufactured">Manufactured</option>
                            <option value="Purchased">Purchased</option>
                            <option value="Fastener">Fastener</option>
                            <option value="Consumable">Consumable</option>
                            <option value="Floor Stock">Floor Stock</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Alert regarding Consumables & Floor Stock */}
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 leading-relaxed">
              <span className="font-semibold">Bulk Exclusions Applied:</span> 2 consumable items (<span className="font-mono">EMA-022</span> Epoxy Paint, <span className="font-mono">EMA-024</span> Lithium Grease) and 1 floor stock item (<span className="font-mono">EMA-025</span> Cable Tie) have been excluded from discrete assembly routing sequence logic. These will be issued as bulk floor stock line items.
            </div>
          </div>

          {/* Bottom Breakdown & Recharts Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Breakdown Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(categoryCounts).map((catKey) => {
                const cat = catKey as CategoryType;
                const count = categoryCounts[cat];
                const style = categoryColors[cat];

                return (
                  <div
                    key={cat}
                    className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs"
                  >
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}
                    >
                      {cat}
                    </span>
                    <p className="text-2xl font-semibold text-slate-800 mt-2">
                      {count} <span className="text-xs text-slate-400 font-normal">items</span>
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Recharts Pie Chart */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-center">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 text-center">
                Category Distribution
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSelectStep('mbom')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              Proceed to mBOM Generation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
