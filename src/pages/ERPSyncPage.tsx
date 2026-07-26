import React, { useState } from 'react';
import {
  RefreshCw,
  Loader2,
  CheckCircle2,
  Server,
  Database,
  Download,
  ArrowRight,
  Send,
  Code,
} from 'lucide-react';
import { StepId } from '../types';
import { runNonLinearProgress } from '../utils/aiSimulator';
import { downloadFile } from '../utils/fileGenerators';

interface ERPSyncPageProps {
  onSelectStep: (step: StepId) => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingMessage: (msg: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  addActivity: (stepName: string, summary: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ERPSyncPage: React.FC<ERPSyncPageProps> = ({
  onSelectStep,
  setIsProcessing,
  setProcessingMessage,
  addToast,
  addActivity,
}) => {
  const [selectedSystem, setSelectedSystem] = useState<string>('SAP S/4HANA');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const systems = [
    { name: 'SAP S/4HANA', type: 'ERP / PP', status: 'Connected', icon: 'SAP' },
    { name: 'Siemens Teamcenter', type: 'PLM', status: 'Connected', icon: 'TC' },
    { name: 'PTC Windchill', type: 'PLM', status: 'Standby', icon: 'WC' },
    { name: 'Oracle NetSuite', type: 'ERP', status: 'Standby', icon: 'NS' },
  ];

  const handleExecuteSync = () => {
    setIsLoading(true);
    setIsProcessing(true);
    setProcessingMessage(`Connecting to ${selectedSystem}...`);
    setSyncLogs([]);

    const steps = [
      `Establishing TLS OData v4 handshake with ${selectedSystem}...`,
      'Authenticating API credentials & OAuth2 token...',
      'Validating payload schema against SAP CS01 BOM structures...',
      'Creating 25 Material Master records in SAP MM...',
      'Dispatching 5 Workcenter Routing sequences to SAP PP...',
      'Embedding 13 Quality Inspection gates in SAP QM...',
      'ERP Sync Dispatch Complete. HTTP 201 Created.',
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < steps.length) {
        setSyncLogs((prev) => [...prev, steps[currentIdx]]);
        setProcessingMessage(steps[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsLoading(false);
        setIsProcessing(false);
        setIsSynced(true);

        addToast(
          'ERP Synchronization Complete',
          `Successfully dispatched mBOM & Routing to ${selectedSystem}. Document #SAP-8841.`,
          'success'
        );
        addActivity(
          'ERP Sync',
          `Dispatched mBOM to ${selectedSystem} (Document #SAP-BOM-2024-8841).`,
          'success'
        );
      }
    }, 600);
  };

  const sampleJSONPayload = JSON.stringify(
    {
      documentHeader: {
        documentId: 'SAP-BOM-2024-8841',
        system: selectedSystem,
        project: 'EMA-2024',
        timestamp: new Date().toISOString(),
        status: '201 CREATED',
      },
      summary: {
        materialMasterCount: 25,
        workcenterCount: 5,
        operationCount: 16,
        qualityCheckpointCount: 13,
      },
      workcenterMappings: [
        { stationId: 'ST-1', sapWorkcenter: 'WC_ROTOR_01', cycleTimeSec: 1350 },
        { stationId: 'ST-2', sapWorkcenter: 'WC_STATOR_02', cycleTimeSec: 900 },
        { stationId: 'ST-3', sapWorkcenter: 'WC_INTEG_03', cycleTimeSec: 1260 },
        { stationId: 'ST-4', sapWorkcenter: 'WC_FINAL_04', cycleTimeSec: 300 },
        { stationId: 'ST-5', sapWorkcenter: 'WC_TEST_05', cycleTimeSec: 1620 },
      ],
    },
    null,
    2
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Enterprise System Sync (ERP / MES / PLM)
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Bi-directional integration and dispatch of engineering & manufacturing data to enterprise software
        </p>
      </div>

      {/* Target System Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {systems.map((s) => {
          const isSelected = selectedSystem === s.name;

          return (
            <div
              key={s.name}
              onClick={() => setSelectedSystem(s.name)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {s.icon}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    s.status === 'Connected'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mt-2">{s.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{s.type}</p>
            </div>
          );
        })}
      </div>

      {/* Sync Configuration Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Target Integration Endpoint: {selectedSystem}
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              https://sap.enterprise.internal:8443/odata/v4/ProductionBOM/
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Endpoint Online
          </span>
        </div>

        {/* Sync Scope Options */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Dispatch Payload Scope
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <label className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-md bg-slate-50 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>mBOM Station Structure (5 Workstations)</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-md bg-slate-50 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>Routing Operations & Workcenters (16 Operations)</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-md bg-slate-50 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>Quality Checkpoint Plan (13 Quality Gates)</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-md bg-slate-50 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>Material Master Records (25 Component MM)</span>
            </label>
          </div>
        </div>

        {/* Sync Dispatch Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleExecuteSync}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors inline-flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Execute ERP Sync Dispatch
          </button>
        </div>
      </div>

      {/* Sync Execution Console / Terminal */}
      {syncLogs.length > 0 && (
        <div className="bg-slate-900 text-slate-200 rounded-lg p-4 font-mono text-xs space-y-1.5 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
            <span className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              ERP Integration Dispatch Console
            </span>
            <span>{isLoading ? 'In Progress...' : 'Dispatch Complete'}</span>
          </div>

          <div className="space-y-1 pt-1 max-h-48 overflow-y-auto">
            {syncLogs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-slate-500">
                  [{new Date().toLocaleTimeString()}]
                </span>
                <span
                  className={
                    log.includes('Complete')
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-300'
                  }
                >
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payload Inspection Window */}
      {isSynced && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Confirmed OData Sync Response Payload
            </h3>

            <button
              onClick={() =>
                downloadFile(
                  sampleJSONPayload,
                  `SAP-Sync-Payload-${Date.now()}.json`,
                  'application/json'
                )
              }
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download JSON Payload
            </button>
          </div>

          <pre className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-md overflow-x-auto shadow-inner leading-relaxed">
            {sampleJSONPayload}
          </pre>
        </div>
      )}

      {/* Action Row */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onSelectStep('analytics')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
        >
          Proceed to Executive Analytics
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
