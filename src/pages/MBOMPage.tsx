import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  GitMerge,
  Download,
  ArrowRight,
  Info,
  X,
  Zap,
} from 'lucide-react';
import { ComponentItem, MBOMStation, StepId } from '../types';
import { SAMPLE_COMPONENTS, INITIAL_MBOM_STATIONS } from '../data/sampleData';
import { runNonLinearProgress, runTypewriter } from '../utils/aiSimulator';
import { downloadXLSXBOM, downloadFile, generateEBOMJSON } from '../utils/fileGenerators';

interface MBOMPageProps {
  components?: ComponentItem[];
  onSelectStep: (step: StepId) => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingMessage: (msg: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  addActivity: (stepName: string, summary: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const MBOMPage: React.FC<MBOMPageProps> = ({
  components = SAMPLE_COMPONENTS,
  onSelectStep,
  setIsProcessing,
  setProcessingMessage,
  addToast,
  addActivity,
}) => {
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('Loading eBOM structure...');
  const [counter, setCounter] = useState<number>(1);
  const [stations, setStations] = useState<MBOMStation[]>(INITIAL_MBOM_STATIONS);
  const [expandedStations, setExpandedStations] = useState<Set<string>>(
    new Set(['ST-1', 'ST-2', 'ST-3', 'ST-4', 'ST-5'])
  );
  const [selectedPart, setSelectedPart] = useState<ComponentItem | null>(null);

  // Typewriter explainability text
  const [typewriterTexts, setTypewriterTexts] = useState<string[]>(['', '', '', '', '']);

  const explainabilityReasons = [
    'Rotor/Shaft assembly (ST1) and Stator/Frame prep (ST2) execute in parallel to save 900 seconds prior to core merging.',
    'Fastener items (EMA-016, EMA-017, EMA-018, EMA-019) mapped directly to station point-of-use tooling bins.',
    'Consumable paint (EMA-022) and grease (EMA-024) routed as bulk line feeds without individual assembly steps.',
    'Terminal box wiring andceramic block mount grouped into Station 5 to consolidate electrical certification testing.',
    '100% zero-leakage verified: All 25 eBOM components mapped without missing or duplicate part numbers.',
  ];

  const handleGenerateMBOM = () => {
    setIsLoadingOverlay(true);
    setIsProcessing(true);
    setProcessingMessage('Generating Manufacturing BOM...');

    const statusMessages = [
      'Loading eBOM structure...',
      'Analyzing component relationships...',
      'Computing assembly precedence graph...',
      'Identifying parallel assembly opportunities...',
      'Grouping components by workstation...',
      'Detecting sub-assembly candidates...',
      'Running zero-leakage validation...',
      'Generating explainability report...',
      'mBOM structure complete.',
    ];

    runNonLinearProgress({
      onProgress: (p) => setProgress(p),
      onStatusMessage: (msg) => {
        setStatusMsg(msg);
        setProcessingMessage(msg);
      },
      onCounterUpdate: (c) => setCounter(c),
      statusMessages,
      totalItems: 25,
      onComplete: () => {
        setIsLoadingOverlay(false);
        setIsProcessing(false);
        setHasRun(true);

        addToast(
          'mBOM Generation Complete',
          'Successfully restructured 25 components into 5 manufacturing stations.',
          'success'
        );
        addActivity(
          'mBOM Generation',
          'Restructured eBOM into 5 workstation stations with zero leakage.',
          'success'
        );

        // Start typewriter effects for explainability cards
        explainabilityReasons.forEach((text, i) => {
          runTypewriter(text, (current) => {
            setTypewriterTexts((prev) => {
              const copy = [...prev];
              copy[i] = current;
              return copy;
            });
          });
        });
      },
    });
  };

  const toggleStation = (id: string) => {
    setExpandedStations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Manufacturing BOM Generation
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          AI restructures engineering design hierarchy into station-based manufacturing assembly sequence
        </p>
      </div>

      {/* Initial State Card */}
      {!hasRun && !isLoadingOverlay && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <GitBranch className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            Generate Manufacturing Assembly BOM
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Transform the flat 25-component eBOM into a station-decomposed mBOM optimized for shop-floor execution across 5 dedicated workstations with parallel sub-assembly routing.
          </p>
          <button
            onClick={handleGenerateMBOM}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <GitBranch className="w-4 h-4" />
            Generate Manufacturing BOM
          </button>
        </div>
      )}

      {/* Full-Page Loading Overlay */}
      {isLoadingOverlay && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-8 max-w-md w-full space-y-5 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  mBOM Generation in Progress
                </h3>
                <p className="text-xs text-slate-500">
                  Restructuring 25 components into station sequence
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
                {counter} / 25
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Generated mBOM Layout */}
      {hasRun && (
        <div className="space-y-6">
          {/* Split 40% / 60% Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT 40% — eBOM Panel */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col h-[600px]">
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-lg">
                <h3 className="text-sm font-semibold text-slate-800">
                  Engineering BOM — Input
                </h3>
                <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  25 Parts
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {components.map((part) => (
                  <div
                    key={part.id}
                    className="p-2 border border-slate-200 rounded-md text-xs flex items-center justify-between bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60 shrink-0">
                        {part.id}
                      </span>
                      <span className="text-slate-800 font-medium truncate">
                        {part.name}
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px] shrink-0">
                      Qty: {part.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT 60% — mBOM Tree Panel */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col h-[600px]">
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-lg">
                <h3 className="text-sm font-semibold text-slate-800">
                  Manufacturing BOM — Generated
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  5 Workstations
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {stations.map((st) => {
                  const isExpanded = expandedStations.has(st.id);

                  return (
                    <div
                      key={st.id}
                      className="border border-slate-200 rounded-md overflow-hidden shadow-2xs"
                    >
                      {/* Station Header */}
                      <div
                        onClick={() => toggleStation(st.id)}
                        className="bg-[#1E3A5F] text-white p-3 cursor-pointer flex items-center justify-between hover:bg-[#183050] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-500 text-white rounded text-xs font-mono font-semibold px-2 py-0.5">
                            {st.id}
                          </span>
                          <span className="text-sm font-semibold">{st.name}</span>
                          <span className="bg-blue-400/30 text-blue-200 rounded-full text-xs px-2 py-0.5 font-medium ml-1">
                            {st.components.length} parts
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-blue-200 font-mono">
                            {st.cycleTimeSec}s
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-blue-300 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* Station Content */}
                      {isExpanded && (
                        <div className="divide-y divide-slate-100">
                          {/* Operations Summary */}
                          <div className="bg-slate-50 px-4 py-2 text-xs text-slate-600 border-b border-slate-100 flex items-center justify-between">
                            <span className="font-semibold text-slate-700">
                              Operations:
                            </span>
                            <span className="truncate max-w-md font-mono text-[11px] text-slate-500">
                              {st.operationsList.join(' → ')}
                            </span>
                          </div>

                          {/* Sub-assembly reference if any */}
                          {st.subAssemblies &&
                            st.subAssemblies.map((sub) => (
                              <div
                                key={sub.id}
                                className="bg-blue-50 border border-blue-200 rounded-md mx-3 my-2 px-3 py-2 text-xs text-blue-800 font-medium flex items-center gap-2"
                              >
                                <GitMerge className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>{sub.name}</span>
                              </div>
                            ))}

                          {/* Part Rows */}
                          {st.components.map((part) => (
                            <div
                              key={part.id}
                              onClick={() => setSelectedPart(part)}
                              className="pl-6 pr-4 py-2 bg-white flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                <span className="font-mono text-xs font-semibold text-blue-700">
                                  {part.id}
                                </span>
                                <span className="text-sm text-slate-800">
                                  {part.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500 font-mono">
                                  {part.material}
                                </span>
                                <span className="bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded font-mono">
                                  x{part.qty}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Part Detail Card Modal/Panel if selected */}
          {selectedPart && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative shadow-xs">
              <button
                onClick={() => setSelectedPart(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Part Assignment Detail: {selectedPart.id} — {selectedPart.name}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-700">
                <div>
                  <span className="text-slate-500">Quantity:</span> {selectedPart.qty} {selectedPart.uom}
                </div>
                <div>
                  <span className="text-slate-500">Material:</span> {selectedPart.material}
                </div>
                <div>
                  <span className="text-slate-500">Category:</span> {selectedPart.category}
                </div>
                <div>
                  <span className="text-slate-500">Weight:</span> {selectedPart.weightKg} kg
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">AI Rationale:</span> {selectedPart.rationale}
                </div>
              </div>
            </div>
          )}

          {/* BOM Reconciliation Panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">
              BOM Reconciliation & Zero-Leakage Audit
            </h3>

            <div className="flex items-center justify-center gap-8 py-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Engineering eBOM
                </p>
                <p className="text-2xl font-semibold text-slate-800 mt-0.5">25 Components</p>
              </div>

              <div className="w-24 h-0.5 bg-emerald-500 relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Manufacturing mBOM
                </p>
                <p className="text-2xl font-semibold text-slate-800 mt-0.5">25 Mapped</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md p-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Zero-Leakage Validation Passed: All 25 engineering components successfully mapped to manufacturing stations. No components lost in translation.
              </span>
            </div>
          </div>

          {/* SVG Assembly Flow Diagram */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">
              Assembly Flow Sequence Diagram
            </h3>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-md p-4 overflow-x-auto">
              <svg width="780" height="130" className="mx-auto block font-sans">
                {/* ST1 Box */}
                <rect x="20" y="20" width="150" height="40" rx="6" fill="#1E3A5F" stroke="#2563EB" strokeWidth="1" />
                <text x="95" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  ST-1: Rotor/Shaft
                </text>
                <text x="95" y="52" textAnchor="middle" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                  1,350 sec
                </text>

                {/* ST2 Box */}
                <rect x="20" y="70" width="150" height="40" rx="6" fill="#1E3A5F" stroke="#2563EB" strokeWidth="1" />
                <text x="95" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  ST-2: Stator/Frame
                </text>
                <text x="95" y="102" textAnchor="middle" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                  900 sec
                </text>

                {/* Parallel Bracket & Arrow */}
                <path d="M 170 40 L 210 40 L 210 65 L 240 65" fill="none" stroke="#2563EB" strokeWidth="2" />
                <path d="M 170 90 L 210 90 L 210 65 L 240 65" fill="none" stroke="#2563EB" strokeWidth="2" />
                <polygon points="240,65 232,60 232,70" fill="#2563EB" />

                {/* Bracket Label */}
                <rect x="180" y="55" width="60" height="18" rx="3" fill="#EFF6FF" stroke="#93C5FD" />
                <text x="210" y="67" textAnchor="middle" fill="#1E40AF" fontSize="8" fontWeight="600">
                  Parallel: -900s
                </text>

                {/* ST3 Box */}
                <rect x="245" y="45" width="150" height="40" rx="6" fill="#1E3A5F" stroke="#2563EB" strokeWidth="1" />
                <text x="320" y="63" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  ST-3: Main Core
                </text>
                <text x="320" y="77" textAnchor="middle" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                  1,260 sec
                </text>

                {/* Arrow ST3 -> ST4 */}
                <path d="M 395 65 L 435 65" fill="none" stroke="#2563EB" strokeWidth="2" />
                <polygon points="435,65 427,60 427,70" fill="#2563EB" />

                {/* ST4 Box */}
                <rect x="440" y="45" width="150" height="40" rx="6" fill="#1E3A5F" stroke="#2563EB" strokeWidth="1" />
                <text x="515" y="63" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  ST-4: End Shields & Fan
                </text>
                <text x="515" y="77" textAnchor="middle" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                  300 sec
                </text>

                {/* Arrow ST4 -> ST5 */}
                <path d="M 590 65 L 630 65" fill="none" stroke="#2563EB" strokeWidth="2" />
                <polygon points="630,65 622,60 622,70" fill="#2563EB" />

                {/* ST5 Box */}
                <rect x="635" y="45" width="130" height="40" rx="6" fill="#1E3A5F" stroke="#2563EB" strokeWidth="1" />
                <text x="700" y="63" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  ST-5: Final Test
                </text>
                <text x="700" y="77" textAnchor="middle" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                  1,620 sec
                </text>
              </svg>
            </div>
          </div>

          {/* Explainability Panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">
              AI Decomposition Explainability Report
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {typewriterTexts.map((text, idx) => (
                <div
                  key={idx}
                  className="bg-white border-l-4 border-blue-600 border border-slate-200 rounded-md p-3.5 space-y-1 shadow-2xs"
                >
                  <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                    AI Rationale #{idx + 1}
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans min-h-[32px]">
                    {text || 'Generating explanation...'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Export Row */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                Export mBOM:
              </span>
              <button
                onClick={() =>
                  downloadXLSXBOM(
                    components && components.length > 0 ? components : SAMPLE_COMPONENTS,
                    'EMA-2024-mBOM.xlsx',
                    stations
                  )
                }
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Excel
              </button>
              <button
                onClick={() =>
                  downloadFile(
                    generateEBOMJSON(
                      components && components.length > 0 ? components : SAMPLE_COMPONENTS
                    ),
                    'EMA-2024-mBOM.json',
                    'application/json'
                  )
                }
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON
              </button>
            </div>

            <button
              onClick={() => onSelectStep('routing')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              Proceed to Routing Planner
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
