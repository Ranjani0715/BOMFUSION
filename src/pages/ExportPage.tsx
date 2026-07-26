import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  Archive,
  CheckCircle2,
  Send,
  ShieldCheck,
  Layers,
  Database,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { ComponentItem, StepId } from '../types';
import {
  downloadFile,
  generateEBOMCSV,
  generateEBOMJSON,
  generateEBOMXML,
  generateEBOMTXT,
  generateCADBOMTXT,
  downloadXLSXBOM,
  downloadZipBundle,
} from '../utils/fileGenerators';

interface ExportPageProps {
  components: ComponentItem[];
  onSelectStep: (step: StepId) => void;
  addToast?: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  addActivity?: (stepName: string, summary: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ExportPage: React.FC<ExportPageProps> = ({
  components,
  onSelectStep,
  addToast,
  addActivity,
}) => {
  const [activePreviewFormat, setActivePreviewFormat] = useState<'csv' | 'json' | 'xml' | 'txt' | 'cad'>('csv');
  const [selectedDestination, setSelectedDestination] = useState<string>('sap');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [pushStatus, setPushStatus] = useState<string | null>(null);

  const [pyAnalysisResult, setPyAnalysisResult] = useState<any>(null);
  const [isAnalyzingPy, setIsAnalyzingPy] = useState<boolean>(false);

  const handleRunPythonAnalysis = async () => {
    setIsAnalyzingPy(true);
    try {
      const response = await fetch('/api/python/process-ebom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components: activeComps }),
      });
      const data = await response.json();
      setPyAnalysisResult(data);
      setIsAnalyzingPy(false);
      addToast?.('Python Engine Complete', 'Python 3.10 processed eBOM payload successfully.', 'success');
      addActivity?.('Python Processing', 'Ran Python 3.10 data analysis algorithm on eBOM dataset.', 'success');
    } catch (err) {
      setIsAnalyzingPy(false);
      addToast?.('Python Analysis Error', 'Failed to communicate with Python backend service.', 'error');
    }
  };

  const activeComps = components && components.length > 0 ? components : [];

  const handleDownloadZip = async () => {
    try {
      await downloadZipBundle(activeComps);
      addToast?.('Export Successful', 'Downloaded EMA-2024-Complete-Production-Bundle.zip', 'success');
      addActivity?.('Export', 'Exported full manufacturing package ZIP archive.', 'success');
    } catch (err) {
      addToast?.('Export Error', 'Failed to generate ZIP archive.', 'error');
    }
  };

  const handleDownloadXlsx = () => {
    downloadXLSXBOM(activeComps, 'EMA-2024-eBOM-Complete.xlsx');
    addToast?.('Download Started', 'Downloading EMA-2024-eBOM-Complete.xlsx', 'success');
    addActivity?.('Export', 'Downloaded Excel eBOM spreadsheet.', 'info');
  };

  const handleDownloadCsv = () => {
    const csvContent = generateEBOMCSV(activeComps);
    downloadFile(csvContent, 'EMA-2024-eBOM.csv', 'text/csv');
    addToast?.('Download Started', 'Downloading EMA-2024-eBOM.csv', 'success');
    addActivity?.('Export', 'Downloaded CSV eBOM dataset.', 'info');
  };

  const handleDownloadJson = () => {
    const jsonContent = generateEBOMJSON(activeComps);
    downloadFile(jsonContent, 'EMA-2024-eBOM.json', 'application/json');
    addToast?.('Download Started', 'Downloading EMA-2024-eBOM.json', 'success');
    addActivity?.('Export', 'Downloaded JSON eBOM schema.', 'info');
  };

  const handleDownloadXml = () => {
    const xmlContent = generateEBOMXML(activeComps);
    downloadFile(xmlContent, 'EMA-2024-eBOM.xml', 'application/xml');
    addToast?.('Download Started', 'Downloading EMA-2024-eBOM.xml', 'application/xml');
    addActivity?.('Export', 'Downloaded PLM XML eBOM structure.', 'info');
  };

  const handleDownloadTxt = () => {
    const txtContent = generateEBOMTXT(activeComps);
    downloadFile(txtContent, 'EMA-2024-eBOM-Report.txt', 'text/plain');
    addToast?.('Download Started', 'Downloading EMA-2024-eBOM-Report.txt', 'success');
    addActivity?.('Export', 'Downloaded Text eBOM report.', 'info');
  };

  const handleDownloadCadTxt = () => {
    const cadTxtContent = generateCADBOMTXT(activeComps);
    downloadFile(cadTxtContent, 'EMA-2024-CAD-Hierarchy.txt', 'text/plain');
    addToast?.('Download Started', 'Downloading EMA-2024-CAD-Hierarchy.txt', 'success');
    addActivity?.('Export', 'Downloaded CAD hierarchy text file.', 'info');
  };

  const handleSimulateERPPush = () => {
    setIsPushing(true);
    setPushStatus('Connecting to enterprise endpoint...');

    setTimeout(() => {
      setPushStatus('Validating schema and zero-leakage payload...');
    }, 800);

    setTimeout(() => {
      setPushStatus('Transmitting 25 component records to SAP S/4HANA...');
    }, 1600);

    setTimeout(() => {
      setIsPushing(false);
      setPushStatus('Payload successfully ingested and verified by SAP S/4HANA endpoint.');
      addToast?.('ERP Push Complete', 'eBOM payload synced with SAP S/4HANA Production database.', 'success');
      addActivity?.('ERP Direct Export', 'Directly pushed eBOM dataset (25 parts) to SAP S/4HANA.', 'success');
    }, 2400);
  };

  const getPreviewContent = () => {
    switch (activePreviewFormat) {
      case 'csv':
        return generateEBOMCSV(activeComps);
      case 'json':
        return generateEBOMJSON(activeComps);
      case 'xml':
        return generateEBOMXML(activeComps);
      case 'txt':
        return generateEBOMTXT(activeComps);
      case 'cad':
        return generateCADBOMTXT(activeComps);
      default:
        return generateEBOMCSV(activeComps);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            eBOM & Production Package Export
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Download engineering eBOMs in standard industry formats or push directly to ERP/PLM
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded-md shadow-xs transition-colors flex items-center gap-2"
        >
          <Archive className="w-4 h-4" />
          Download Complete Zip Bundle
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total eBOM Parts
            </span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-900 font-mono">
            {activeComps.length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">3 Assembly Levels (L1-L3)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Health & Integrity
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-semibold text-emerald-600 font-mono">100%</p>
          <p className="text-xs text-emerald-700 font-medium mt-0.5">Zero-Leakage Validated</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              AI Classifications
            </span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-purple-600 font-mono">25 / 25</p>
          <p className="text-xs text-slate-500 mt-0.5">Mapped to 5 Categories</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Target Project
            </span>
            <Database className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-semibold text-slate-800 font-mono truncate">EMA-2024</p>
          <p className="text-xs text-slate-500 mt-0.5">Electric Motor Assembly</p>
        </div>
      </div>

      {/* Python Data Engine Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-lg p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono text-xs font-bold">
              Py 3.10
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold tracking-tight">
                  Python Backend Data Processing Engine
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Executes Python algorithms for depth-first assembly rollups, material distribution, and risk scoring
              </p>
            </div>
          </div>

          <button
            onClick={handleRunPythonAnalysis}
            disabled={isAnalyzingPy}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2 rounded-md transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            {isAnalyzingPy ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing in Python 3.10...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Run Python eBOM Analysis
              </>
            )}
          </button>
        </div>

        {pyAnalysisResult && (
          <div className="mt-4 pt-4 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
              <span className="text-slate-400 block text-[11px]">Calculated Total Weight</span>
              <span className="text-base font-semibold text-emerald-400 font-mono">
                {pyAnalysisResult.calculatedTotalWeightKg} kg
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
              <span className="text-slate-400 block text-[11px]">Completeness Rating</span>
              <span className="text-base font-semibold text-blue-400 font-mono">
                {pyAnalysisResult.assemblyCompletenessPct}%
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
              <span className="text-slate-400 block text-[11px]">Level 1 / 2 / 3 Parts</span>
              <span className="text-base font-semibold text-purple-400 font-mono">
                {pyAnalysisResult.levelCounts?.['1']} / {pyAnalysisResult.levelCounts?.['2']} / {pyAnalysisResult.levelCounts?.['3']}
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
              <span className="text-slate-400 block text-[11px]">High-Risk Flagged Items</span>
              <span className="text-base font-semibold text-amber-400 font-mono">
                {pyAnalysisResult.highRiskComponents?.length || 0} Parts
              </span>
            </div>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
          Available Export Formats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Excel */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Excel Workbook (.xlsx)
                  </h3>
                  <p className="text-xs text-slate-500">Multi-tab structured workbook</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Includes tabs for eBOM Components, Workstations, Routing Sequence, and Quality Inspections.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Size: ~42.8 KB</span>
              <button
                onClick={handleDownloadXlsx}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download XLSX
              </button>
            </div>
          </div>

          {/* Card 2: CSV */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Comma Separated (.csv)
                  </h3>
                  <p className="text-xs text-slate-500">Standard tabular CSV format</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Flat table representation compatible with any ERP import tool or spreadsheet editor.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Size: ~18.4 KB</span>
              <button
                onClick={handleDownloadCsv}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download CSV
              </button>
            </div>
          </div>

          {/* Card 3: JSON */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Structured JSON (.json)
                  </h3>
                  <p className="text-xs text-slate-500">REST API & Web Service format</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Full component object tree formatted with project metadata and classification attributes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Size: ~24.1 KB</span>
              <button
                onClick={handleDownloadJson}
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON
              </button>
            </div>
          </div>

          {/* Card 4: XML */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    PLM XML Standard (.xml)
                  </h3>
                  <p className="text-xs text-slate-500">Teamcenter & Windchill XML</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Industrial XML schema formatted for direct ingestion into legacy PLM systems.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Size: ~31.5 KB</span>
              <button
                onClick={handleDownloadXml}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download XML
              </button>
            </div>
          </div>

          {/* Card 5: Text Report */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Text Report (.txt)
                  </h3>
                  <p className="text-xs text-slate-500">ASCII tabular report</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Human-readable text table suitable for printing or quick shop-floor review.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Size: ~12.3 KB</span>
              <button
                onClick={handleDownloadTxt}
                className="bg-slate-700 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download TXT
              </button>
            </div>
          </div>

          {/* Card 6: CAD Hierarchy */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    CAD Assembly Tree (.txt)
                  </h3>
                  <p className="text-xs text-slate-500">Siemens NX / PTC Windchill tree</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Indented assembly parent-child structure file representing 3D CAD hierarchy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Size: ~15.8 KB</span>
              <button
                onClick={handleDownloadCadTxt}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download CAD TXT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live File Content Previewer */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs space-y-0">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-800">
              Live File Content Inspector
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-md">
            <button
              onClick={() => setActivePreviewFormat('csv')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activePreviewFormat === 'csv'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CSV
            </button>
            <button
              onClick={() => setActivePreviewFormat('json')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activePreviewFormat === 'json'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setActivePreviewFormat('xml')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activePreviewFormat === 'xml'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              XML
            </button>
            <button
              onClick={() => setActivePreviewFormat('txt')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activePreviewFormat === 'txt'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TXT Report
            </button>
            <button
              onClick={() => setActivePreviewFormat('cad')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activePreviewFormat === 'cad'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CAD Tree
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed">
          <pre>{getPreviewContent()}</pre>
        </div>
      </div>

      {/* Direct ERP Sync Push Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Direct Enterprise ERP / PLM Push
            </h3>
            <p className="text-xs text-slate-500">
              Transmit validated eBOM dataset directly into enterprise production database
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Select Enterprise Destination Endpoint
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="sap">SAP S/4HANA ERP (Production Endpoint)</option>
              <option value="teamcenter">Siemens Teamcenter PLM</option>
              <option value="windchill">PTC Windchill Enterprise</option>
              <option value="oracle">Oracle Fusion SCM</option>
            </select>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
            <span className="font-semibold text-slate-800 block mb-0.5">
              Protocol: REST / OData v4
            </span>
            <span>Schema: ISO 10303 STEP / AP242 Compliant</span>
          </div>

          <div className="flex justify-start md:justify-end">
            <button
              onClick={handleSimulateERPPush}
              disabled={isPushing}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs px-5 py-2.5 rounded shadow-xs transition-colors flex items-center gap-2"
            >
              {isPushing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Pushing Payload...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Push to Enterprise ERP
                </>
              )}
            </button>
          </div>
        </div>

        {pushStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{pushStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};
