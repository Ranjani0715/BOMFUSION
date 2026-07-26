import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  FileCode,
  Download,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Info,
  ArrowRight,
} from 'lucide-react';
import { ComponentItem, StepId } from '../types';
import { SAMPLE_COMPONENTS } from '../data/sampleData';
import {
  downloadXLSXBOM,
  generateEBOMCSV,
  generateEBOMJSON,
  generateEBOMXML,
  generateEBOMTXT,
  generateCADBOMTXT,
  downloadFile,
} from '../utils/fileGenerators';
import { runNonLinearProgress, revealRowsStaggered } from '../utils/aiSimulator';

interface UploadPageProps {
  onCompleteUpload: (components: ComponentItem[]) => void;
  onSelectStep: (step: StepId) => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingMessage: (msg: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  onCompleteUpload,
  onSelectStep,
  setIsProcessing,
  setProcessingMessage,
  addToast,
}) => {
  const [phase, setPhase] = useState<number>(0); // 0 = idle, 1 = file detected, 2 = parsing, 3 = table reveal, 4 = complete
  const [fileName, setFileName] = useState<string>('EMA-2024-BOM.xlsx');
  const [fileSize, setFileSize] = useState<string>('42.8 KB');
  const [progress, setProgress] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('Detecting file encoding...');
  const [displayedRows, setDisplayedRows] = useState<ComponentItem[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['EMA-001', 'EMA-002']));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartProcess = (name: string, size: string) => {
    setFileName(name);
    setFileSize(size);
    setPhase(1);
    setIsProcessing(true);
    setProcessingMessage('Parsing eBOM structure...');

    // Phase 2: Progress start after 300ms
    setTimeout(() => {
      setPhase(2);

      const statusMessages = [
        'Detecting file encoding...',
        'Reading column structure...',
        'Parsing row data...',
        'Building hierarchy tree...',
        'Validating part numbers...',
        'Parse complete.',
      ];

      runNonLinearProgress({
        onProgress: (p) => setProgress(p),
        onStatusMessage: (msg) => {
          setStatusMsg(msg);
          setProcessingMessage(msg);
        },
        statusMessages,
        totalItems: 25,
        onComplete: () => {
          setPhase(3);
          setIsProcessing(false);

          // Phase 3: Staggered row reveal
          revealRowsStaggered(
            SAMPLE_COMPONENTS,
            (revealed) => {
              setDisplayedRows(revealed);
            },
            () => {
              setPhase(4);
              onCompleteUpload(SAMPLE_COMPONENTS);
              addToast(
                'eBOM Ingestion Complete',
                'Successfully parsed 25 components across 3 hierarchy levels.',
                'success'
              );
            }
          );
        },
      });
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sz = (file.size / 1024).toFixed(1) + ' KB';
      handleStartProcess(file.name, sz);
    }
  };

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          eBOM Data Ingestion
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Import engineering bill of materials from design systems (PLM, CAD, ERP)
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-10 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer group shadow-xs"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept=".xlsx,.csv,.json,.xml,.txt"
          className="hidden"
        />
        <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mx-auto text-slate-400 group-hover:text-blue-600 transition-colors mb-3">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-base font-medium text-slate-700 group-hover:text-blue-700">
          Drop eBOM file here or click to browse
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Supported formats:
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          {['XLSX', 'CSV', 'JSON', 'XML', 'TXT'].map((fmt) => (
            <span
              key={fmt}
              className="bg-slate-100 text-slate-600 border border-slate-200 rounded px-2 py-0.5 text-xs font-mono"
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* Download Sample Files Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800">
          Download Sample Files
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-4">
          Use these real test files containing Electric Motor Assembly EMA-2024 engineering data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* File 1: XLSX */}
          <div className="p-3 border border-slate-200 rounded-md flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-mono font-semibold text-slate-800 truncate">
                  EMA-2024-BOM.xlsx
                </p>
                <p className="text-[11px] text-slate-500 truncate">Excel BOM format</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => downloadXLSXBOM(SAMPLE_COMPONENTS, 'EMA-2024-BOM.xlsx')}
                className="p-1.5 text-slate-600 hover:text-blue-600 rounded border border-slate-300 bg-white hover:bg-slate-50 text-xs"
                title="Download File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStartProcess('EMA-2024-BOM.xlsx', '42.8 KB')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded text-xs px-2.5 py-1 font-medium"
              >
                Test
              </button>
            </div>
          </div>

          {/* File 2: CSV */}
          <div className="p-3 border border-slate-200 rounded-md flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-mono font-semibold text-slate-800 truncate">
                  EMA-2024-BOM.csv
                </p>
                <p className="text-[11px] text-slate-500 truncate">Comma Separated</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  downloadFile(generateEBOMCSV(SAMPLE_COMPONENTS), 'EMA-2024-BOM.csv', 'text/csv')
                }
                className="p-1.5 text-slate-600 hover:text-blue-600 rounded border border-slate-300 bg-white hover:bg-slate-50 text-xs"
                title="Download File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStartProcess('EMA-2024-BOM.csv', '18.4 KB')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded text-xs px-2.5 py-1 font-medium"
              >
                Test
              </button>
            </div>
          </div>

          {/* File 3: JSON */}
          <div className="p-3 border border-slate-200 rounded-md flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileCode className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-mono font-semibold text-slate-800 truncate">
                  EMA-2024-BOM.json
                </p>
                <p className="text-[11px] text-slate-500 truncate">Structured JSON</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  downloadFile(
                    generateEBOMJSON(SAMPLE_COMPONENTS),
                    'EMA-2024-BOM.json',
                    'application/json'
                  )
                }
                className="p-1.5 text-slate-600 hover:text-blue-600 rounded border border-slate-300 bg-white hover:bg-slate-50 text-xs"
                title="Download File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStartProcess('EMA-2024-BOM.json', '24.1 KB')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded text-xs px-2.5 py-1 font-medium"
              >
                Test
              </button>
            </div>
          </div>

          {/* File 4: XML */}
          <div className="p-3 border border-slate-200 rounded-md flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileCode className="w-5 h-5 text-purple-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-mono font-semibold text-slate-800 truncate">
                  EMA-2024-BOM.xml
                </p>
                <p className="text-[11px] text-slate-500 truncate">PLM XML standard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  downloadFile(
                    generateEBOMXML(SAMPLE_COMPONENTS),
                    'EMA-2024-BOM.xml',
                    'application/xml'
                  )
                }
                className="p-1.5 text-slate-600 hover:text-blue-600 rounded border border-slate-300 bg-white hover:bg-slate-50 text-xs"
                title="Download File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStartProcess('EMA-2024-BOM.xml', '31.5 KB')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded text-xs px-2.5 py-1 font-medium"
              >
                Test
              </button>
            </div>
          </div>

          {/* File 5: TXT */}
          <div className="p-3 border border-slate-200 rounded-md flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-5 h-5 text-slate-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-mono font-semibold text-slate-800 truncate">
                  EMA-2024-BOM.txt
                </p>
                <p className="text-[11px] text-slate-500 truncate">Formatted Text Report</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  downloadFile(
                    generateEBOMTXT(SAMPLE_COMPONENTS),
                    'EMA-2024-BOM.txt',
                    'text/plain'
                  )
                }
                className="p-1.5 text-slate-600 hover:text-blue-600 rounded border border-slate-300 bg-white hover:bg-slate-50 text-xs"
                title="Download File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStartProcess('EMA-2024-BOM.txt', '12.3 KB')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded text-xs px-2.5 py-1 font-medium"
              >
                Test
              </button>
            </div>
          </div>

          {/* File 6: CAD TXT */}
          <div className="p-3 border border-slate-200 rounded-md flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-mono font-semibold text-slate-800 truncate">
                  EMA-2024-BOM-CAD.txt
                </p>
                <p className="text-[11px] text-slate-500 truncate">PTC Windchill CAD tree</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  downloadFile(
                    generateCADBOMTXT(SAMPLE_COMPONENTS),
                    'EMA-2024-BOM-CAD.txt',
                    'text/plain'
                  )
                }
                className="p-1.5 text-slate-600 hover:text-blue-600 rounded border border-slate-300 bg-white hover:bg-slate-50 text-xs"
                title="Download File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStartProcess('EMA-2024-BOM-CAD.txt', '15.8 KB')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded text-xs px-2.5 py-1 font-medium"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 1: File Detection Info Bar */}
      {phase >= 1 && (
        <div className="bg-slate-50 border border-slate-200 rounded-md px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800 font-mono">{fileName}</p>
              <p className="text-xs text-slate-500">
                Size: {fileSize} • Engineering BOM Data
              </p>
            </div>
          </div>
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 rounded px-2.5 py-0.5 text-xs font-medium">
            File Received
          </span>
        </div>
      )}

      {/* PHASE 2: Parsing Progress Card */}
      {phase === 2 && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <h3 className="text-sm font-semibold text-slate-800">
                Parsing File Hierarchy...
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-700">
              {progress}%
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 italic">{statusMsg}</p>
        </div>
      )}

      {/* PHASE 4: Parse Complete Alert Bar */}
      {phase >= 4 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md px-4 py-3 flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-800">
            Parse complete — 25 components identified across 3 assembly levels.
          </p>
        </div>
      )}

      {/* PHASE 5: Pre-Processing Stat Cards */}
      {phase >= 4 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Duplicates Removed
            </p>
            <p className="text-2xl font-semibold text-slate-800 mt-1">0</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs relative">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Naming Normalized
              </p>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                EMA_001 → EMA-001
              </span>
            </div>
            <p className="text-2xl font-semibold text-slate-800 mt-1">2</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Missing Fields
            </p>
            <p className="text-2xl font-semibold text-slate-800 mt-1">0</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Hierarchy Levels
            </p>
            <p className="text-2xl font-semibold text-slate-800 mt-1">3</p>
          </div>
        </div>
      )}

      {/* PHASE 3: Table Reveal */}
      {phase >= 3 && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Parsed eBOM Table ({displayedRows.length} / 25)
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Schema: Part No | Name | Qty | Level | Material | UoM | Weight | Dimensions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  downloadXLSXBOM(
                    displayedRows.length > 0 ? displayedRows : SAMPLE_COMPONENTS,
                    'EMA-2024-eBOM.xlsx'
                  )
                }
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded font-medium flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Export Excel
              </button>
              <button
                onClick={() =>
                  downloadFile(
                    generateEBOMCSV(displayedRows.length > 0 ? displayedRows : SAMPLE_COMPONENTS),
                    'EMA-2024-eBOM.csv',
                    'text/csv'
                  )
                }
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded font-medium flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                Export CSV
              </button>
              <button
                onClick={() => onSelectStep('export')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                Full Export Center
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">#</th>
                  <th className="px-3 py-2.5">Part Number</th>
                  <th className="px-3 py-2.5">Part Name</th>
                  <th className="px-3 py-2.5">Qty</th>
                  <th className="px-3 py-2.5">Level</th>
                  <th className="px-3 py-2.5">Material</th>
                  <th className="px-3 py-2.5">UoM</th>
                  <th className="px-3 py-2.5">Rev</th>
                  <th className="px-3 py-2.5">Description</th>
                  <th className="px-3 py-2.5">Weight (kg)</th>
                  <th className="px-3 py-2.5">Dimensions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 transition-all duration-200 transform translate-y-0 opacity-100"
                  >
                    <td className="px-3 py-2 text-xs font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-2 font-mono text-xs font-semibold text-blue-700">
                      {row.id}
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-800">{row.name}</td>
                    <td className="px-3 py-2 text-xs font-semibold">{row.qty}</td>
                    <td className="px-3 py-2">
                      <span className="bg-slate-100 text-slate-700 text-xs px-1.5 py-0.5 rounded font-mono">
                        {row.level}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs">{row.material}</td>
                    <td className="px-3 py-2 text-xs font-mono">{row.uom}</td>
                    <td className="px-3 py-2 text-xs font-mono">{row.revision}</td>
                    <td className="px-3 py-2 text-xs text-slate-500 max-w-xs truncate">
                      {row.description}
                    </td>
                    <td className="px-3 py-2 text-xs font-mono">{row.weightKg}</td>
                    <td className="px-3 py-2 text-xs font-mono text-slate-500">
                      {row.dimensions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PHASE 6: eBOM Tree */}
      {phase >= 4 && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Engineering BOM Hierarchy Tree
          </h3>

          <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 rounded-md font-sans">
            {SAMPLE_COMPONENTS.filter((c) => c.level === 'L1').map((l1) => {
              const l2Items = SAMPLE_COMPONENTS.filter((c) => c.level === 'L2');
              const isExpandedL1 = expandedNodes.has(l1.id);

              return (
                <div key={l1.id} className="space-y-1">
                  {/* L1 Node */}
                  <div
                    onClick={() => toggleNode(l1.id)}
                    className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-md cursor-pointer hover:bg-blue-50/50 transition-colors"
                  >
                    {isExpandedL1 ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="bg-blue-50 text-blue-700 text-xs font-mono font-semibold px-2 py-0.5 rounded border border-blue-200">
                      {l1.id}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{l1.name}</span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded font-mono">
                      Qty: {l1.qty}
                    </span>
                  </div>

                  {/* L2 Nodes */}
                  {isExpandedL1 && (
                    <div className="pl-6 space-y-1 border-l-2 border-slate-200 ml-3">
                      {l2Items.map((l2) => {
                        const l3Items = SAMPLE_COMPONENTS.filter((c) => c.level === 'L3');
                        const isExpandedL2 = expandedNodes.has(l2.id);

                        return (
                          <div key={l2.id} className="space-y-1">
                            <div
                              onClick={() => toggleNode(l2.id)}
                              className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-md cursor-pointer hover:bg-blue-50/50 transition-colors"
                            >
                              {isExpandedL2 ? (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="bg-slate-100 text-slate-700 text-xs font-mono font-medium px-1.5 py-0.5 rounded">
                                {l2.id}
                              </span>
                              <span className="text-xs font-medium text-slate-800">{l2.name}</span>
                              <span className="text-[11px] text-slate-500">Qty: {l2.qty}</span>
                            </div>

                            {/* L3 Nodes */}
                            {isExpandedL2 && (
                              <div className="pl-6 space-y-1 border-l-2 border-slate-200 ml-2">
                                {l3Items.slice(0, 4).map((l3) => (
                                  <div
                                    key={l3.id}
                                    className="flex items-center gap-2 p-1 bg-white border border-slate-100 rounded text-xs text-slate-600"
                                  >
                                    <span className="font-mono text-slate-500">{l3.id}</span>
                                    <span>{l3.name}</span>
                                    <span className="text-slate-400 font-mono">x{l3.qty}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE 7: Action Button */}
      {phase >= 4 && (
        <div className="flex justify-end pt-4">
          <button
            onClick={() => onSelectStep('classify')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2 animate-fade-in"
          >
            Proceed to AI Classification
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
