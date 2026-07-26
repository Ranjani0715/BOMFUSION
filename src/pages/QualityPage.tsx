import React, { useState } from 'react';
import {
  CheckSquare,
  Loader2,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { QualityCheckpoint, NCRReport, StepId } from '../types';
import { INITIAL_QUALITY_CHECKPOINTS } from '../data/sampleData';
import { runNonLinearProgress } from '../utils/aiSimulator';

interface QualityPageProps {
  onSelectStep: (step: StepId) => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingMessage: (msg: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  addActivity: (stepName: string, summary: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const QualityPage: React.FC<QualityPageProps> = ({
  onSelectStep,
  setIsProcessing,
  setProcessingMessage,
  addToast,
  addActivity,
}) => {
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const [checkpoints, setCheckpoints] = useState<QualityCheckpoint[]>(
    INITIAL_QUALITY_CHECKPOINTS
  );

  // Active NCR form state
  const [failedCheckpoint, setFailedCheckpoint] = useState<QualityCheckpoint | null>(null);
  const [ncrDesc, setNcrDesc] = useState<string>('');
  const [ncrDisposition, setNcrDisposition] = useState<'Under Review' | 'Rework' | 'Scrap' | 'Return to Vendor'>('Rework');
  const [ncrAssigned, setNcrAssigned] = useState<string>('Quality Engineer J. Doe');
  const [ncrs, setNcrs] = useState<NCRReport[]>([]);

  const [spcResult, setSpcResult] = useState<any>(null);

  const handleGenerateQualityPlan = async () => {
    setIsLoadingOverlay(true);
    setIsProcessing(true);
    setProcessingMessage('Running Python 3.10 Statistical Process Control (SPC) Engine...');

    try {
      const response = await fetch('/api/python/quality-spc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkpoints }),
      });
      const data = await response.json();

      setSpcResult(data);
      setIsLoadingOverlay(false);
      setIsProcessing(false);
      setHasRun(true);

      addToast(
        'Python SPC Analysis Complete',
        `Calculated First Pass Yield: ${data.firstPassYieldPct}%, Cp: ${data.processCapabilityCp}, Cpk: ${data.processCapabilityCpk} (${data.calculatedSigmaLevel} Sigma Level).`,
        'success'
      );
      addActivity(
        'Quality SPC Analysis',
        `Ran Python SPC engine: Cpk=${data.processCapabilityCpk}, Yield=${data.firstPassYieldPct}%.`,
        'success'
      );
    } catch (err) {
      setIsLoadingOverlay(false);
      setIsProcessing(false);
      setHasRun(true);
      addToast('Quality Plan Generated', 'Embedded 13 quality inspection gates.', 'success');
    }
  };

  const handleStatusChange = (id: string, newStatus: QualityCheckpoint['status']) => {
    const updated = checkpoints.map((cp) => {
      if (cp.id === id) {
        return { ...cp, status: newStatus };
      }
      return cp;
    });

    setCheckpoints(updated);

    if (newStatus === 'Fail') {
      const target = updated.find((cp) => cp.id === id);
      if (target) {
        setFailedCheckpoint(target);
        addToast(
          'Inspection Checkpoint Failed',
          `Quality gate ${id} failed. Please raise Non-Conformance Report (NCR).`,
          'error'
        );
      }
    } else {
      if (failedCheckpoint?.id === id) {
        setFailedCheckpoint(null);
      }
      addToast('Quality Status Updated', `Checkpoint ${id} set to ${newStatus}.`, 'info');
    }
  };

  const handleRaiseNCR = () => {
    if (!failedCheckpoint) return;

    const newNCR: NCRReport = {
      id: `NCR-2024-00${ncrs.length + 1}`,
      checkpointId: failedCheckpoint.id,
      failedActivity: failedCheckpoint.activity,
      defectDescription: ncrDesc || 'Dimensional tolerance out of specification during in-line inspection.',
      disposition: ncrDisposition,
      assignedTo: ncrAssigned,
      targetDate: '2026-07-30',
      status: 'OPEN',
    };

    setNcrs([...ncrs, newNCR]);
    setFailedCheckpoint(null);
    setNcrDesc('');

    addToast(
      'NCR Raised',
      `Non-Conformance Report ${newNCR.id} created for ${failedCheckpoint.id}.`,
      'error'
    );
    addActivity(
      'Quality Planning',
      `Raised ${newNCR.id} (${ncrDisposition}) for failed inspection ${failedCheckpoint.id}.`,
      'error'
    );
  };

  const stages: { stage: QualityCheckpoint['stage']; title: string; barColor: string }[] = [
    { stage: 'INCOMING', title: 'Stage 1: Incoming Component Inspection', barColor: 'bg-amber-500' },
    { stage: 'SUB-ASSEMBLY', title: 'Stage 2: Sub-Assembly Quality Gates (ST-1 & ST-2)', barColor: 'bg-blue-500' },
    { stage: 'IN-PROCESS', title: 'Stage 3: In-Process Assembly Checkpoints (ST-3 & ST-4)', barColor: 'bg-orange-500' },
    { stage: 'FINAL', title: 'Stage 4: Final Certification & Testing Gates (ST-5)', barColor: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Quality Inspection Plan
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          AI-generated quality checkpoints embedded at critical stages of the manufacturing process
        </p>
      </div>

      {/* Initial State Card */}
      {!hasRun && !isLoadingOverlay && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            Generate Quality Inspection Plan
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Embed 13 quality inspection gates across incoming inspection, subassembly testing, in-process gap checks, and final 2.5kV Hi-Pot dielectric certification.
          </p>
          <button
            onClick={handleGenerateQualityPlan}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Generate Quality Plan
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
                  Quality Plan Generation
                </h3>
                <p className="text-xs text-slate-500">
                  Embedding inspection gates & acceptance criteria
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
          </div>
        </div>
      )}

      {/* Quality Plan View */}
      {hasRun && (
        <div className="space-y-6">
          {spcResult && (
            <div className="bg-slate-900 text-white rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Python 3.10 SPC
                  </span>
                  <h3 className="text-sm font-semibold">Statistical Process Control Engine</h3>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Live Process Capability calculated by Python algorithms
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">First Pass Yield</span>
                  <span className="text-emerald-400 font-bold">{spcResult.firstPassYieldPct}%</span>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Capability (Cp / Cpk)</span>
                  <span className="text-blue-400 font-bold">{spcResult.processCapabilityCp} / {spcResult.processCapabilityCpk}</span>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Six Sigma Rating</span>
                  <span className="text-purple-400 font-bold">{spcResult.calculatedSigmaLevel} σ</span>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Defects / Million (DPMO)</span>
                  <span className="text-amber-400 font-bold">{spcResult.defectsPerMillionDPMO}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quality Metrics Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                First Pass Yield Target
              </p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">94.2%</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[94%]" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Inspection Coverage
              </p>
              <p className="text-2xl font-semibold text-emerald-700 mt-1">100%</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Open NCR Reports
              </p>
              <p className={`text-2xl font-semibold mt-1 ${ncrs.length > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                {ncrs.length}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Non-conformance count</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Critical Safety Gates
              </p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">4</p>
              <p className="text-xs text-red-600 font-medium mt-1">100% Verification Required</p>
            </div>
          </div>

          {/* 4 Stage Sections */}
          {stages.map((stg) => {
            const stageItems = checkpoints.filter((cp) => cp.stage === stg.stage);

            return (
              <div
                key={stg.stage}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs"
              >
                {/* Stage Header */}
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-6 rounded-full ${stg.barColor}`} />
                    <h3 className="text-sm font-semibold text-slate-800">{stg.title}</h3>
                  </div>
                  <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {stageItems.length} Gates
                  </span>
                </div>

                {/* Checkpoints Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2.5">INS ID</th>
                        <th className="px-3 py-2.5">Inspection Activity</th>
                        <th className="px-3 py-2.5">Method</th>
                        <th className="px-3 py-2.5">Acceptance Criteria</th>
                        <th className="px-3 py-2.5">Responsible</th>
                        <th className="px-3 py-2.5 w-28">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {stageItems.map((cp) => (
                        <tr
                          key={cp.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            cp.status === 'Fail'
                              ? 'bg-red-50/50'
                              : cp.status === 'Hold'
                              ? 'bg-amber-50/50'
                              : ''
                          }`}
                        >
                          <td className="px-3 py-2.5 font-mono font-semibold text-blue-700">
                            {cp.id}
                          </td>
                          <td className="px-3 py-2.5 font-medium text-slate-800">
                            {cp.activity}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600">{cp.method}</td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-slate-700 max-w-xs">
                            {cp.criteria}
                          </td>
                          <td className="px-3 py-2.5 text-slate-500">{cp.responsible}</td>
                          <td className="px-3 py-2.5">
                            <select
                              value={cp.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  cp.id,
                                  e.target.value as QualityCheckpoint['status']
                                )
                              }
                              className={`border rounded text-xs px-2 py-1 font-semibold focus:ring-1 focus:ring-blue-500 ${
                                cp.status === 'Pass'
                                  ? 'bg-green-100 text-green-800 border-green-300'
                                  : cp.status === 'Fail'
                                  ? 'bg-red-100 text-red-800 border-red-300'
                                  : cp.status === 'Hold'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                            >
                              <option value="Pass">Pass</option>
                              <option value="Fail">Fail</option>
                              <option value="Hold">Hold</option>
                              <option value="Pending">Pending</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* NCR Form Expansion when Fail Selected */}
          {failedCheckpoint && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-5 shadow-xs space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-red-200 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-base font-semibold text-red-900">
                    Raise Non-Conformance Report (NCR)
                  </h3>
                </div>
                <span className="font-mono text-xs font-semibold text-red-700 bg-white border border-red-200 px-2.5 py-1 rounded">
                  Auto ID: NCR-2024-00{ncrs.length + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-red-900 mb-1">
                    Failed Inspection Gate
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${failedCheckpoint.id} — ${failedCheckpoint.activity}`}
                    className="w-full bg-white border border-red-200 rounded px-3 py-2 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-red-900 mb-1">
                    Disposition
                  </label>
                  <select
                    value={ncrDisposition}
                    onChange={(e) => setNcrDisposition(e.target.value as any)}
                    className="w-full bg-white border border-red-200 rounded px-3 py-2 text-slate-800"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Rework">Rework</option>
                    <option value="Scrap">Scrap</option>
                    <option value="Return to Vendor">Return to Vendor</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-red-900 mb-1">
                    Defect Description & Findings
                  </label>
                  <textarea
                    rows={2}
                    value={ncrDesc}
                    onChange={(e) => setNcrDesc(e.target.value)}
                    placeholder="Enter detailed description of non-conformance defect..."
                    className="w-full bg-white border border-red-200 rounded p-2.5 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-red-900 mb-1">
                    Assigned Quality Engineer
                  </label>
                  <input
                    type="text"
                    value={ncrAssigned}
                    onChange={(e) => setNcrAssigned(e.target.value)}
                    className="w-full bg-white border border-red-200 rounded px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-red-900 mb-1">
                    Target Resolution Date
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-07-30"
                    className="w-full bg-white border border-red-200 rounded px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setFailedCheckpoint(null)}
                  className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRaiseNCR}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs px-5 py-2 rounded-md shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Raise NCR Report
                </button>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSelectStep('variants')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              Proceed to Variant Manager
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
