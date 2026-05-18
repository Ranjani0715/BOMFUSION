import React, { useState, useCallback } from 'react';
import { useApp } from '../../store/appStore';
import { UploadCloud, FileSpreadsheet, FileText, FileJson, CheckCircle2, Loader2, ChevronRight, ChevronDown } from 'lucide-react';
import { ProgressRealism } from '../UI/ProgressRealism';
import { MOTOR_COMPONENTS } from '../../data/sampleData';
import { cn } from '../../lib/utils';
import { AppStep, PartCategory } from '../../types';

export function UploadPage() {
  const { state, loadProject, setStep } = useApp();
  const [phase, setPhase] = useState<number>(0);
  const [visibleRows, setVisibleRows] = useState<number>(0);

  const startUpload = () => {
    setPhase(1); // Realism Triggered
  };

  const handleComplete = () => {
    setPhase(2); // Table reveal
    loadProject(MOTOR_COMPONENTS);
    
    // Randomized row reveal
    MOTOR_COMPONENTS.forEach((_, i) => {
      const delay = i * (Math.floor(Math.random() * 70) + 60);
      setTimeout(() => setVisibleRows(prev => prev + 1), delay);
    });
  };

  const SAMPLE_FILES = [
    { name: 'EMA-2024-BOM.xlsx', type: 'Spreadsheet', desc: 'Full engineering hierarchy' },
    { name: 'EMA-2024-BOM.csv', type: 'Flat CSV', desc: 'Legacy system format' },
    { name: 'EMA-2024-BOM.json', type: 'Nested JSON', desc: 'PLM direct export' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">eBOM Data Ingestion</h2>
        <p className="text-sm text-slate-500">Import engineering bill of materials from design systems</p>
      </div>

      {phase === 0 && (
        <>
          <div 
            onClick={startUpload}
            className="card-base border-2 border-dashed border-slate-300 p-16 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
          >
            <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Drop eBOM file here or click to browse</h3>
            <div className="flex gap-2 justify-center mt-4">
              {['XLSX', 'CSV', 'JSON', 'XML', 'TXT'].map(fmt => (
                <span key={fmt} className="bg-slate-100 text-slate-600 border border-slate-200 rounded px-2 py-0.5 text-[10px] font-mono leading-none">
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          <div className="card-base">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Download Sample Files</h3>
            <p className="text-xs text-slate-500 mb-6">Use these files to test the system with Electric Motor Assembly EMA-2024 data.</p>
            <div className="space-y-3">
              {SAMPLE_FILES.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-md hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-mono text-slate-700">{file.name}</p>
                      <p className="text-[10px] text-slate-500">{file.desc}</p>
                    </div>
                  </div>
                  <button className="btn-secondary text-[10px] py-1 px-3">Download</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {phase === 1 && (
        <ProgressRealism 
          title="Parsing File..."
          subtitle="Processing Electric Motor Assembly data structure"
          messages={[
            "Detecting file encoding...",
            "Reading column structure...",
            "Parsing row data...",
            "Building hierarchy tree...",
            "Validating part numbers...",
            "Applying schema rules..."
          ]}
          onComplete={handleComplete}
        />
      )}

      {phase >= 2 && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-slate-50 border border-slate-200 rounded-md px-4 py-3 flex items-center gap-4">
            <FileText className="w-5 h-5 text-slate-500" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-medium">EMA-2024-BOM.xlsx</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded">XLSX Detected</span>
              </div>
              <p className="text-[10px] text-slate-500">24.5 KB • 25 components identified • File received</p>
            </div>
            <span className="text-xs text-green-600 font-medium">Verification Successful</span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Duplicates Removed', val: 0, icon: CheckCircle2 },
              { label: 'Naming Normalized', val: 2, icon: Loader2, alert: true },
              { label: 'Missing Fields', val: 0, icon: CheckCircle2 },
              { label: 'Hierarchy Levels', val: 3, icon: CheckCircle2 }
            ].map((stat, i) => (
              <div key={i} className="card-base py-3 px-4 relative overflow-hidden">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{stat.val}</span>
                  {stat.alert && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded border border-amber-200" title="EMA_001 normalized to EMA-001 format">
                      MODIFIED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="table-container">
            <table className="w-full text-left">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Part Number</th>
                  <th className="px-4 py-3">Part Name</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">UoM</th>
                  <th className="px-4 py-3">Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {MOTOR_COMPONENTS.slice(0, visibleRows).map((part, i) => (
                  <tr 
                    key={part.id} 
                    className="table-row animate-in fade-in slide-in-from-bottom-1 duration-200"
                  >
                    <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-blue-700 text-xs font-semibold">{part.partNumber}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{part.name}</td>
                    <td className="px-4 py-3 text-slate-600">{part.quantity}</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">L{part.level}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{part.material}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{part.uom}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{part.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleRows >= 25 && (
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setStep(AppStep.CLASSIFY)}
                className="btn-primary flex items-center gap-2 group transform transition-all hover:translate-x-1"
              >
                Proceed to AI Classification
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
