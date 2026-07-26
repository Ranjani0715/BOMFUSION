import React, { useState } from 'react';
import {
  Route,
  Loader2,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Edit2,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { RoutingOperation, StepId } from '../types';
import { INITIAL_ROUTING_OPERATIONS } from '../data/sampleData';
import { runNonLinearProgress, revealRowsStaggered } from '../utils/aiSimulator';

interface RoutingPageProps {
  onSelectStep: (step: StepId) => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingMessage: (msg: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  addActivity: (stepName: string, summary: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const RoutingPage: React.FC<RoutingPageProps> = ({
  onSelectStep,
  setIsProcessing,
  setProcessingMessage,
  addToast,
  addActivity,
}) => {
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('Loading mBOM station structure...');
  const [counter, setCounter] = useState<number>(1);
  const [routings, setRoutings] = useState<RoutingOperation[]>(INITIAL_ROUTING_OPERATIONS);
  const [displayedRows, setDisplayedRows] = useState<RoutingOperation[]>([]);
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'primary' | 'alternate'>('primary');

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<RoutingOperation>>({});

  const stationColors: Record<string, { bg: string; text: string; hex: string }> = {
    'ST-1': { bg: 'bg-blue-100', text: 'text-blue-800', hex: '#2563EB' },
    'ST-2': { bg: 'bg-purple-100', text: 'text-purple-800', hex: '#7C3AED' },
    'ST-3': { bg: 'bg-emerald-100', text: 'text-emerald-800', hex: '#059669' },
    'ST-4': { bg: 'bg-amber-100', text: 'text-amber-800', hex: '#D97706' },
    'ST-5': { bg: 'bg-rose-100', text: 'text-rose-800', hex: '#E11D48' },
  };

  const handleGenerateRouting = () => {
    setIsLoadingOverlay(true);
    setIsProcessing(true);
    setProcessingMessage('Generating Routing Sequence...');

    const statusMessages = [
      'Loading mBOM station structure...',
      'Mapping operations to workstations...',
      'Calculating cycle times from historical data...',
      'Assigning machine requirements...',
      'Resolving operation dependencies...',
      'Routing plan complete.',
    ];

    runNonLinearProgress({
      onProgress: (p) => setProgress(p),
      onStatusMessage: (msg) => {
        setStatusMsg(msg);
        setProcessingMessage(msg);
      },
      onCounterUpdate: (c) => setCounter(c),
      statusMessages,
      totalItems: 16,
      onComplete: () => {
        setIsLoadingOverlay(false);
        setIsProcessing(false);
        setHasRun(true);

        revealRowsStaggered(
          routings,
          (revealed) => setDisplayedRows(revealed),
          () => {
            addToast(
              'Routing Generated',
              'Sequenced 16 operations across 5 workstations with machine and skill mappings.',
              'success'
            );
            addActivity(
              'Routing Planner',
              'Generated 16 manufacturing operations with machine and skill assignments.',
              'success'
            );
          }
        );
      },
    });
  };

  const toggleRow = (id: string) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEditing = (row: RoutingOperation) => {
    setEditingId(row.id);
    setEditForm({ ...row });
  };

  const saveEditing = () => {
    if (!editingId) return;
    const updated = routings.map((r) => {
      if (r.id === editingId) {
        return {
          ...r,
          ...editForm,
          isModified: true,
        };
      }
      return r;
    });

    setRoutings(updated);
    setDisplayedRows(updated.slice(0, displayedRows.length));
    setEditingId(null);

    addToast('Operation Updated', `Operation ${editingId} modified manually.`, 'info');
    addActivity('Routing Planner', `Modified operation ${editingId} parameters.`, 'warning');
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  // Alternate backup operations
  const alternateRoutings = routings.map((r) => ({
    ...r,
    machine: r.machine + ' (Backup Unit B)',
    cycleTimeSec: Math.round(r.cycleTimeSec * 1.15),
    skill: 'Manual Backup Operator L2',
  }));

  const activeRoutings = activeTab === 'primary' ? displayedRows : alternateRoutings;

  // Gantt Chart Data
  const ganttData = displayedRows.map((r) => ({
    name: r.id,
    opName: r.name,
    station: r.stationId,
    duration: r.cycleTimeSec,
    color: stationColors[r.stationId]?.hex || '#2563EB',
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Manufacturing Routing Generator
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          AI-generated operation sequence with workstation assignments, machine requirements, and skill mappings
        </p>
      </div>

      {/* Initial State Card */}
      {!hasRun && !isLoadingOverlay && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Route className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            Generate Manufacturing Routing Sequence
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Sequence all 16 shop-floor operations OP-101 through OP-116 with automated cycle time calculations, machine tool assignments, skill prerequisites, and precedence dependencies.
          </p>
          <button
            onClick={handleGenerateRouting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Route className="w-4 h-4" />
            Generate Routing Plan
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoadingOverlay && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-8 max-w-md w-full space-y-5 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Routing Generation in Progress
                </h3>
                <p className="text-xs text-slate-500">
                  Mapping operations to workstations & machine tools
                </p>
              </div>
            </div>

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
                Mapping {counter} / 16
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {hasRun && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-0">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('primary')}
                className={`pb-2.5 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === 'primary'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Primary Routing Sequence
              </button>
              <button
                onClick={() => setActiveTab('alternate')}
                className={`pb-2.5 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === 'alternate'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Alternate / Backup Routing
              </button>
            </div>
            <span className="text-xs text-slate-500">
              Total Operations: {activeRoutings.length}
            </span>
          </div>

          {/* Dense Operations Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="w-10 px-3 py-2.5"></th>
                    <th className="w-24 px-3 py-2.5">Op. ID</th>
                    <th className="px-3 py-2.5">Operation Name</th>
                    <th className="px-3 py-2.5">Station</th>
                    <th className="px-3 py-2.5">Machine / Tool</th>
                    <th className="px-3 py-2.5 text-right">Cycle Time</th>
                    <th className="px-3 py-2.5">Depends On</th>
                    <th className="px-3 py-2.5">Skill Required</th>
                    <th className="w-20 px-3 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activeRoutings.map((row) => {
                    const isExpanded = expandedRowIds.has(row.id);
                    const isEditing = editingId === row.id;
                    const stStyle = stationColors[row.stationId] || {
                      bg: 'bg-blue-100',
                      text: 'text-blue-800',
                    };

                    if (isEditing) {
                      return (
                        <tr key={row.id} className="bg-amber-50/50">
                          <td className="px-3 py-2"></td>
                          <td className="px-3 py-2 font-mono text-xs font-semibold text-blue-700">
                            {row.id}
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                              }
                              className="w-full border border-slate-300 rounded text-xs px-2 py-1 bg-white"
                            />
                          </td>
                          <td className="px-3 py-2 text-xs">{row.stationId}</td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={editForm.machine || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, machine: e.target.value })
                              }
                              className="w-full border border-slate-300 rounded text-xs px-2 py-1 bg-white"
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <input
                              type="number"
                              value={editForm.cycleTimeSec || 0}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  cycleTimeSec: Number(e.target.value),
                                })
                              }
                              className="w-20 text-right border border-slate-300 rounded text-xs px-2 py-1 bg-white"
                            />
                          </td>
                          <td className="px-3 py-2 text-xs font-mono">{row.dependsOn}</td>
                          <td className="px-3 py-2 text-xs">{row.skill}</td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={saveEditing}
                                className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                title="Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <React.Fragment key={row.id}>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => toggleRow(row.id)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <ChevronRight
                                className={`w-4 h-4 transition-transform ${
                                  isExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-3 py-2 font-mono text-xs font-semibold text-blue-700">
                            <span className="bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                              {row.id}
                            </span>
                            {row.isModified && (
                              <span className="ml-1 text-[10px] text-amber-700 font-sans font-semibold">
                                MOD
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 font-medium text-slate-800">
                            {row.name}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stStyle.bg} ${stStyle.text}`}
                            >
                              {row.stationId}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-slate-600">
                            {row.machine}
                          </td>
                          <td className="px-3 py-2 text-xs font-mono text-right font-semibold text-slate-800">
                            {row.cycleTimeSec}s
                          </td>
                          <td className="px-3 py-2 text-xs font-mono text-amber-700 font-semibold">
                            {row.dependsOn}
                          </td>
                          <td className="px-3 py-2 text-xs text-purple-700">
                            {row.skill}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => startEditing(row)}
                              className="text-slate-400 hover:text-blue-600 p-1"
                              title="Edit Row"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Rationale Row */}
                        {isExpanded && (
                          <tr className="bg-slate-50 border-t border-slate-100">
                            <td colSpan={9} className="px-8 py-3 text-xs text-slate-600">
                              <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px] mr-2">
                                AI Rationale:
                              </span>
                              <span className="italic">{row.rationale}</span>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gantt Chart Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">
              Operation Cycle Time Gantt Distribution
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ganttData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" unit="s" stroke="#64748B" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} />
                  <Tooltip
                    formatter={(val: any) => [`${val} seconds`, 'Cycle Time']}
                    labelFormatter={(lbl: any) => `Operation: ${lbl}`}
                  />
                  <Bar dataKey="duration" radius={[0, 4, 4, 0]}>
                    {ganttData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSelectStep('balance')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              Proceed to Line Balancing
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
