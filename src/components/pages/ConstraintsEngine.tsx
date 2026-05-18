import React, { useState } from 'react';
import { useApp } from '../../store/appStore';
import { Shield, ChevronRight, CheckCircle2, AlertTriangle, AlertCircle, HardHat, Cog, Clock } from 'lucide-react';
import { ProgressRealism } from '../UI/ProgressRealism';
import { cn } from '../../lib/utils';
import { AppStep } from '../../types';

export function ConstraintsEngine() {
  const { state } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  const startAnalysis = () => setIsAnalyzing(true);
  const handleComplete = () => {
    setIsAnalyzing(false);
    setResultReady(true);
  };

  const CONSTRAINT_CARDS = [
    {
      title: 'Assembly Precedence',
      status: '6 / 6 Rules Satisfied',
      statusType: 'success',
      items: [
        { id: 'PREC-001', desc: 'Stator wrap before frame insertion', status: 'SATISFIED' },
        { id: 'PREC-002', desc: 'Bearing press before end shield mounting', status: 'SATISFIED' },
        { id: 'PREC-003', desc: 'Rotor balancing before final shaft assembly', status: 'SATISFIED' }
      ]
    },
    {
      title: 'Machine Availability',
      status: '2 Critical Issues',
      statusType: 'danger',
      items: [
        { id: 'MACH-001', name: 'CNC Lathe', util: 68, status: 'OK' },
        { id: 'MACH-005', name: 'Motor Test Bench', util: 92, status: 'CRITICAL' },
        { id: 'MACH-009', name: 'Spray Booth', util: 95, status: 'CRITICAL' }
      ]
    },
    {
      title: 'Tooling Requirements',
      status: '1 Critical, 1 Warning',
      statusType: 'danger',
      items: [
        { id: 'TOOL-F01', name: 'Assembly Fixture EMA-F01', status: 'NOT AVAILABLE' },
        { id: 'TOOL-S02', name: 'Spray Booth Filters', status: 'LOW STOCK' }
      ]
    },
    {
      title: 'Workforce Skills',
      status: '2 Warnings',
      statusType: 'warning',
      items: [
        { id: 'SKILL-L4', name: 'Senior Assembler L4', risk: 'HIGH RISK' },
        { id: 'SKILL-L3', name: 'Balancing Tech L3', risk: 'MEDIUM RISK' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Manufacturing Constraint Validation Engine</h2>
        <p className="text-sm text-slate-500">Pre-production constraint analysis across precedence, machine availability, tooling, and labor.</p>
      </div>

      {!resultReady && !isAnalyzing && (
        <div className="card-base text-center p-20">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Constraint Validation Ready</h3>
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">Verify your production plan against real-factory constraints including factory calendars, machine maintenance and skill matrices.</p>
          <button onClick={startAnalysis} className="btn-primary mx-auto flex items-center gap-2">Run Constraint Analysis <ChevronRight /> </button>
        </div>
      )}

      {isAnalyzing && (
        <ProgressRealism 
          title="Constraint Analysis Running"
          subtitle="Scanning resource schedules and dependency rules"
          messages={["Loading resource schedules...", "Checking tooling inventory...", "Verifying skills matrix...", "Scanning for conflicts..."]}
          onComplete={handleComplete}
        />
      )}

      {resultReady && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {CONSTRAINT_CARDS.map((card, i) => (
                <div key={i} className="card-base p-0 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700">{card.title}</h4>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                      card.statusType === 'success' ? "bg-green-100 text-green-700 border-green-200" :
                      card.statusType === 'danger' ? "bg-red-100 text-red-700 border-red-200" :
                      "bg-amber-100 text-amber-700 border-amber-200"
                    )}>
                      {card.status}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    {card.items.map((item: any, ii) => (
                      <div key={ii} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2">
                           <span className="font-mono text-[9px] text-slate-400">{item.id}</span>
                           <span className="text-slate-700 font-medium">{item.name || item.desc}</span>
                        </div>
                        <span className={cn(
                          "font-bold text-[9px]",
                          item.status === 'SATISFIED' || item.status === 'OK' ? "text-green-600" : 
                          item.status === 'CRITICAL' || item.status === 'NOT AVAILABLE' ? "text-red-600" : "text-amber-600"
                        )}>
                          {item.status || item.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           </div>

           <div className="card-base border-t-4 border-amber-500">
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                    <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={220} strokeDashoffset={220 - (220 * 0.79)} className="text-amber-500" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">79%</div>
                </div>
                <div>
                   <h3 className="text-sm font-bold text-slate-800">Production Readiness</h3>
                   <p className="text-xs text-slate-500 leading-relaxed max-w-lg mt-1">
                     The assembly plan is 79% ready for execution. Two critical machine capacity issues and one tooling gap (EMA-F01) must be resolved before the production launch scheduled for next week.
                   </p>
                   <div className="flex gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-red-600 font-bold bg-red-50 border border-red-100 px-2 py-0.5 rounded uppercase"><AlertCircle size={12} /> 2 Critical</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded uppercase"><AlertTriangle size={12} /> 3 Warnings</div>
                   </div>
                </div>
                <div className="ml-auto">
                   <button onClick={() => useApp().setStep(AppStep.QUALITY)} className="btn-primary">Finalize Plan</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
