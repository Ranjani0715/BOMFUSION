import React, { useState } from 'react';
import {
  Layers,
  Loader2,
  CheckCircle2,
  Plus,
  Minus,
  RefreshCw,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { StepId } from '../types';
import { runNonLinearProgress } from '../utils/aiSimulator';

interface VariantPageProps {
  onSelectStep: (step: StepId) => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingMessage: (msg: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  addActivity: (stepName: string, summary: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

interface VariantDeltaItem {
  id: string;
  name: string;
  stdQty: number;
  expVariant: string;
  evVariant: string;
  status: 'BASE' | 'REPLACED' | 'ADDED' | 'QTY_CHANGE';
}

export const VariantPage: React.FC<VariantPageProps> = ({
  onSelectStep,
  setIsProcessing,
  setProcessingMessage,
  addToast,
  addActivity,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<'STD' | 'EXP' | 'EV'>('STD');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Variant options
  const [voltage, setVoltage] = useState<'400V' | '690V' | '800V'>('400V');
  const [ipRating, setIpRating] = useState<'IP55' | 'IP66 Ex d'>('IP55');
  const [cooling, setCooling] = useState<'Air Fan' | 'Liquid Jacket'>('Air Fan');

  const deltaItems: VariantDeltaItem[] = [
    { id: 'EMA-001', name: 'Cast Iron Motor Frame 180M', stdQty: 1, expVariant: 'Ex d Flameproof Frame 180M', evVariant: 'Aluminum Liquid Jacket Frame', status: 'REPLACED' },
    { id: 'EMA-002', name: 'Rotary Shaft 42mm Steel 4140', stdQty: 1, expVariant: 'Shaft 42mm Stainless 316', evVariant: 'Hollow Lightweight Shaft', status: 'REPLACED' },
    { id: 'EMA-006', name: 'Cast Aluminum Terminal Box', stdQty: 1, expVariant: 'Heavy-Duty Ex Stainless Box', evVariant: 'SiC Power Inverter Module', status: 'REPLACED' },
    { id: 'EMA-011', name: 'Cooling Fan Polypropylene', stdQty: 1, expVariant: 'Antistatic Bronze Fan', evVariant: 'Removed (Liquid Cooled)', status: 'REPLACED' },
    { id: 'EMA-020', name: 'Deep Groove Ball Bearing 6308', stdQty: 2, expVariant: 'Insulated Ceramic Bearing 6308', evVariant: 'High-Speed Hybrid Bearing', status: 'REPLACED' },
    { id: 'EMA-X01', name: 'Ex Flameproof Seal Kit', stdQty: 0, expVariant: 'Qty 1 (Ex d Certified)', evVariant: 'None', status: 'ADDED' },
    { id: 'EMA-X02', name: 'Liquid Coolant Manifold Block', stdQty: 0, expVariant: 'None', evVariant: 'Qty 1 Dual Port', status: 'ADDED' },
    { id: 'EMA-008', name: 'Terminal Block Ceramic 6-Pin', stdQty: 1, expVariant: 'Qty 1 High-Temp Ex', evVariant: 'High Voltage Busbar Assembly', status: 'REPLACED' },
    { id: 'EMA-012', name: 'Steel Fan Cover Shroud', stdQty: 1, expVariant: 'Steel Fan Cover Shroud', evVariant: 'Removed', status: 'REPLACED' },
    { id: 'EMA-003', name: 'Laminated Stator Core Stack', stdQty: 1, expVariant: 'Laminated Stator Core Stack', evVariant: 'High-Frequency Silicon Steel Core', status: 'REPLACED' },
  ];

  const handleGenerateVariantmBOM = () => {
    setIsLoading(true);
    setIsProcessing(true);
    setProcessingMessage(`Generating Variant mBOM for EMA-2024-${selectedVariant}...`);

    runNonLinearProgress({
      onProgress: () => {},
      onStatusMessage: (msg) => setProcessingMessage(msg),
      statusMessages: [
        'Loading base mBOM template...',
        'Applying variant rules & feature flags...',
        'Computing delta part substitution...',
        'Re-balancing station routing for variant...',
        'Variant mBOM complete.',
      ],
      totalItems: 10,
      onComplete: () => {
        setIsLoading(false);
        setIsProcessing(false);

        addToast(
          'Variant mBOM Generated',
          `Successfully derived mBOM structure for EMA-2024-${selectedVariant}.`,
          'success'
        );
        addActivity(
          'Variant Manager',
          `Generated variant mBOM for EMA-2024-${selectedVariant} with derived routing.`,
          'success'
        );
      },
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          BOM Variant Management Engine
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage motor product family configurations, options, and variant delta BOM generation
        </p>
      </div>

      {/* 3 Variant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => setSelectedVariant('STD')}
          className={`p-5 rounded-lg border cursor-pointer transition-all ${
            selectedVariant === 'STD'
              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              EMA-2024-STD
            </span>
            {selectedVariant === 'STD' && (
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-800 mt-2">
            Standard Industrial Motor
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            400V, 3-Phase, IP55 Enclosure, Air Cooled, Standard Junction Box.
          </p>
          <div className="mt-3 text-xs font-semibold text-slate-700">
            25 Base Components
          </div>
        </div>

        <div
          onClick={() => setSelectedVariant('EXP')}
          className={`p-5 rounded-lg border cursor-pointer transition-all ${
            selectedVariant === 'EXP'
              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              EMA-2024-EXP
            </span>
            {selectedVariant === 'EXP' && (
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-800 mt-2">
            Explosion-Proof Motor (Ex d)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            400V, Ex d IIB T4 Hazardous Area, IP66, Flameproof Stainless Box.
          </p>
          <div className="mt-3 text-xs font-semibold text-slate-700">
            26 Components (7 Delta Replacements)
          </div>
        </div>

        <div
          onClick={() => setSelectedVariant('EV')}
          className={`p-5 rounded-lg border cursor-pointer transition-all ${
            selectedVariant === 'EV'
              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              EMA-2024-EV
            </span>
            {selectedVariant === 'EV' && (
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-800 mt-2">
            High-Efficiency EV Drive
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            800V SiC Inverter Integrated, Liquid Cooled Jacket, Ceramic Bearings.
          </p>
          <div className="mt-3 text-xs font-semibold text-slate-700">
            24 Components (9 Delta Replacements)
          </div>
        </div>
      </div>

      {/* Feature Configuration Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Feature Option Configuration Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Voltage Class
            </label>
            <select
              value={voltage}
              onChange={(e) => setVoltage(e.target.value as any)}
              className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
            >
              <option value="400V">400V Low Voltage</option>
              <option value="690V">690V Heavy Industrial</option>
              <option value="800V">800V EV High Voltage</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Enclosure Protection Rating
            </label>
            <select
              value={ipRating}
              onChange={(e) => setIpRating(e.target.value as any)}
              className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
            >
              <option value="IP55">IP55 Standard Enclosure</option>
              <option value="IP66 Ex d">IP66 Ex d Flameproof</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Cooling Method
            </label>
            <select
              value={cooling}
              onChange={(e) => setCooling(e.target.value as any)}
              className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
            >
              <option value="Air Fan">Air Forced Surface Fan</option>
              <option value="Liquid Jacket">Liquid Jacket Cooling</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Active Configuration: {voltage} | {ipRating} | {cooling}
          </span>

          <button
            onClick={handleGenerateVariantmBOM}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-5 py-2 rounded-md shadow-xs flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Layers className="w-3.5 h-3.5" />
            )}
            Generate Derived Variant mBOM
          </button>
        </div>
      </div>

      {/* Delta Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Variant Delta BOM Comparison Matrix
          </h3>
          <span className="text-xs text-slate-500">
            Comparing against Baseline (EMA-2024-STD)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5">Part ID</th>
                <th className="px-3 py-2.5">Baseline Item (STD)</th>
                <th className="px-3 py-2.5">STD Qty</th>
                <th className="px-3 py-2.5">EXP Variant Item</th>
                <th className="px-3 py-2.5">EV Drive Item</th>
                <th className="px-3 py-2.5">Delta Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {deltaItems.map((item) => {
                let statusBg = 'bg-slate-100 text-slate-700';
                if (item.status === 'REPLACED') statusBg = 'bg-blue-100 text-blue-800';
                else if (item.status === 'ADDED') statusBg = 'bg-emerald-100 text-emerald-800';
                else if (item.status === 'QTY_CHANGE') statusBg = 'bg-amber-100 text-amber-800';

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5 font-mono font-semibold text-blue-700">
                      {item.id}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-800">{item.name}</td>
                    <td className="px-3 py-2.5 font-mono text-center">{item.stdQty}</td>
                    <td className="px-3 py-2.5 text-slate-600">{item.expVariant}</td>
                    <td className="px-3 py-2.5 text-slate-600">{item.evVariant}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusBg}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onSelectStep('erp')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
        >
          Proceed to ERP Sync
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
