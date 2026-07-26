import React, { useState } from 'react';
import {
  Shield,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Check,
  ArrowRight,
  Wrench,
  Users,
} from 'lucide-react';
import { StepId } from '../types';
import { INITIAL_CONSTRAINTS } from '../data/sampleData';
import { runNonLinearProgress } from '../utils/aiSimulator';

interface ConstraintsPageProps {
  onSelectStep: (step: StepId) => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingMessage: (msg: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  addActivity: (stepName: string, summary: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ConstraintsPage: React.FC<ConstraintsPageProps> = ({
  onSelectStep,
  setIsProcessing,
  setProcessingMessage,
  addToast,
  addActivity,
}) => {
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string>('Loading production resource database...');

  // Resolved conflicts state
  const [resolvedConflicts, setResolvedConflicts] = useState<Set<string>>(new Set());

  const handleRunAnalysis = () => {
    setIsLoadingOverlay(true);
    setIsProcessing(true);
    setProcessingMessage('Running Constraint Validation...');

    const statusMessages = [
      'Loading production resource database...',
      'Analyzing assembly precedence rules...',
      'Checking machine utilization schedules...',
      'Validating tooling inventory...',
      'Verifying workforce skill matrix...',
      'Scanning for resource conflicts...',
      'Generating constraint report...',
    ];

    runNonLinearProgress({
      onProgress: (p) => setProgress(p),
      onStatusMessage: (msg) => {
        setStatusMsg(msg);
        setProcessingMessage(msg);
      },
      statusMessages,
      totalItems: 24,
      onComplete: () => {
        setIsLoadingOverlay(false);
        setIsProcessing(false);
        setHasRun(true);

        addToast(
          'Constraint Report Ready',
          'Identified 2 critical machine & tooling issues needing pre-launch resolution.',
          'warning'
        );
        addActivity(
          'Constraints Engine',
          'Evaluated 24 constraints: 19 Satisfied, 3 Warnings, 2 Critical Issues.',
          'warning'
        );
      },
    });
  };

  const handleMarkResolved = (id: string) => {
    setResolvedConflicts((prev) => new Set([...prev, id]));
    addToast('Conflict Marked Resolved', `Resource conflict ${id} resolved by engineer.`, 'success');
  };

  const machines = [
    { name: 'Induction Heater H-20', station: 'ST-1', shifts: 2, util: 62, status: 'OK' },
    { name: 'Automated Inserter INS-04', station: 'ST-1', shifts: 2, util: 74, status: 'OK' },
    { name: 'Schenck Balancer B-100', station: 'ST-1', shifts: 2, util: 58, status: 'OK' },
    { name: 'Hydraulic Press HP-50', station: 'ST-2', shifts: 2, util: 45, status: 'OK' },
    { name: 'Coil Winder W-12', station: 'ST-2', shifts: 2, util: 81, status: 'WARNING' },
    { name: 'Servo Bearing Press P-02', station: 'ST-3', shifts: 2, util: 68, status: 'OK' },
    { name: 'Spray Booth & Oven', station: 'ST-2', shifts: 2, util: 95, status: 'CRITICAL' },
    { name: 'Pneumatic Runner N-08', station: 'ST-4', shifts: 2, util: 38, status: 'OK' },
    { name: 'Motor Test Bench MTB-01', station: 'ST-5', shifts: 2, util: 92, status: 'CRITICAL' },
  ];

  const tooling = [
    { item: 'Assembly Fixture EMA-F01', station: 'ST-3', status: 'NOT AVAILABLE', action: 'Order Required' },
    { item: 'Spray Booth Air Filters', station: 'ST-2', status: 'LOW STOCK', action: 'Reorder Now' },
    { item: 'Schenck Balancing Arbor A-02', station: 'ST-1', status: 'AVAILABLE', action: 'In Stock' },
    { item: 'Bearing Press Adaptor Set', station: 'ST-3', status: 'AVAILABLE', action: 'In Stock' },
    { item: 'Hi-Pot Test Cable Harness', station: 'ST-5', status: 'AVAILABLE', action: 'In Stock' },
  ];

  const workforce = [
    { skill: 'Senior Assembler Level 4', required: 'OP-110 Air Gap Entry', avail: 1, risk: 'HIGH RISK (Single Point)' },
    { skill: 'Balancing Tech Level 3', required: 'OP-104 Dynamic Balancing', avail: 1, risk: 'MEDIUM RISK' },
    { skill: 'Thermal Assembly Level 2', required: 'OP-101 Shrink Fit', avail: 3, risk: 'LOW RISK' },
    { skill: 'Electrical Tech Level 3', required: 'OP-114/115 Wiring & Hi-Pot', avail: 2, risk: 'LOW RISK' },
  ];

  const conflicts = [
    { id: 'CONF-01', resource: 'Motor Test Bench MTB-01', demand: 'EMA-2024 testing overlaps with Generator Gen-12 Order', time: 'Shift A 10:00-12:00', rec: 'Reschedule Gen-12 testing to Shift B' },
    { id: 'CONF-02', resource: 'Induction Heater H-20', demand: 'Shared coil heater assigned to Line 2 motor shafting', time: 'Shift A 08:30-09:30', rec: 'Pre-heat shaft batch during night shift' },
    { id: 'CONF-03', resource: 'Senior Assembler (J. Smith)', demand: 'Assigned to OP-110 and Line 3 emergency maintenance', time: 'Shift B 14:00-16:00', rec: 'Cross-train Level 3 Assembler M. Davis' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Manufacturing Constraint Validation Engine
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Pre-production constraint analysis across precedence, machine availability, tooling, skills, and resource conflicts
        </p>
      </div>

      {/* Initial State Card */}
      {!hasRun && !isLoadingOverlay && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            Run Pre-Production Constraint Analysis
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Verify 24 shop-floor constraints across assembly precedence graph, machine tool availability schedules, tooling inventory, workforce certification levels, and concurrent line resource conflicts.
          </p>
          <button
            onClick={handleRunAnalysis}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Run Constraint Analysis
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
                  Constraint Validation in Progress
                </h3>
                <p className="text-xs text-slate-500">
                  Checking 24 rules across shop-floor resource database
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

            <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 font-mono italic">
              {statusMsg}
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {hasRun && (
        <div className="space-y-6">
          {/* CARD 1 — Assembly Precedence */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs space-y-0">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Assembly Precedence Rules (6 Rules)
              </h3>
              <span className="bg-green-100 text-green-700 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                6 / 6 Satisfied
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2">Rule ID</th>
                  <th className="px-4 py-2">Constraint Description</th>
                  <th className="px-4 py-2">Components</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_CONSTRAINTS.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-mono font-semibold text-blue-700">{rule.id}</td>
                    <td className="px-4 py-2.5 text-slate-800">{rule.description}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">{rule.components}</td>
                    <td className="px-4 py-2.5">
                      <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                        SATISFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-green-50 border-t border-green-200 px-4 py-2.5 text-xs text-green-800 font-medium">
              All assembly precedence constraints verified. Production sequence is logically valid.
            </div>
          </div>

          {/* CARD 2 — Machine Availability */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Machine Tool Utilization & Capacity (9 Machines)
              </h3>
              <span className="bg-red-100 text-red-700 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                2 Critical Issues
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2">Machine Name</th>
                  <th className="px-4 py-2">Station</th>
                  <th className="px-4 py-2">Shifts</th>
                  <th className="px-4 py-2">Utilization (%)</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {machines.map((m, i) => {
                  let barColor = 'bg-emerald-500';
                  if (m.util > 85) barColor = 'bg-red-500';
                  else if (m.util > 70) barColor = 'bg-amber-500';

                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{m.name}</td>
                      <td className="px-4 py-2.5 text-slate-500 font-mono">{m.station}</td>
                      <td className="px-4 py-2.5 text-slate-600">{m.shifts} Shifts</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${m.util}%` }} />
                          </div>
                          <span className="font-mono font-semibold text-slate-700">{m.util}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            m.status === 'OK'
                              ? 'bg-green-100 text-green-700'
                              : m.status === 'WARNING'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="bg-red-50 border-t border-red-200 px-4 py-2.5 text-xs text-red-800 font-medium">
              Capacity Critical Alert: Spray Booth (95%) and Motor Test Bench (92%) exceed target utilization threshold (85%). Overtime shift or secondary bench required.
            </div>
          </div>

          {/* CARD 3 — Tooling Requirements */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                Tooling & Fixture Inventory Availability
              </h3>
              <span className="bg-red-100 text-red-700 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                1 Critical, 1 Warning
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2">Tooling Item</th>
                  <th className="px-4 py-2">Required At</th>
                  <th className="px-4 py-2">Availability Status</th>
                  <th className="px-4 py-2">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tooling.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{t.item}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">{t.station}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.status === 'AVAILABLE'
                            ? 'bg-green-100 text-green-700'
                            : t.status === 'LOW STOCK'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-semibold text-slate-700">{t.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-red-50 border-t border-red-200 px-4 py-2.5 text-xs text-red-800 font-medium">
              Critical Tooling Deficit: Assembly Fixture EMA-F01 is not available in shop inventory. Purchase order PO-8812 must be expedited prior to ST3 launch.
            </div>
          </div>

          {/* CARD 4 — Workforce Skills */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Workforce Skill Certification Matrix
              </h3>
              <span className="bg-amber-100 text-amber-700 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                2 Warnings
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2">Skill Level</th>
                  <th className="px-4 py-2">Required For</th>
                  <th className="px-4 py-2">Available Count</th>
                  <th className="px-4 py-2">Risk Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workforce.map((w, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{w.skill}</td>
                    <td className="px-4 py-2.5 text-slate-600">{w.required}</td>
                    <td className="px-4 py-2.5 font-mono font-semibold">{w.avail} Certified</td>
                    <td className="px-4 py-2.5 font-semibold text-amber-700">{w.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARD 5 — Resource Conflicts */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                Concurrent Resource Conflicts Detected (3 Conflicts)
              </h3>
              <span className="bg-amber-100 text-amber-700 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                {3 - resolvedConflicts.size} Active
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2">Conflict ID</th>
                  <th className="px-4 py-2">Resource</th>
                  <th className="px-4 py-2">Conflicting Demand</th>
                  <th className="px-4 py-2">Timeframe</th>
                  <th className="px-4 py-2">Recommended Resolution</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {conflicts.map((c) => {
                  const isResolved = resolvedConflicts.has(c.id);

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50 ${isResolved ? 'line-through opacity-50 bg-slate-50' : ''}`}
                    >
                      <td className="px-4 py-2.5 font-mono font-semibold text-blue-700">{c.id}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800">{c.resource}</td>
                      <td className="px-4 py-2.5 text-slate-600">{c.demand}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-500">{c.time}</td>
                      <td className="px-4 py-2.5 text-slate-800 font-medium">{c.rec}</td>
                      <td className="px-4 py-2.5 text-right">
                        {isResolved ? (
                          <span className="bg-green-100 text-green-700 font-semibold text-[10px] px-2 py-0.5 rounded-full">
                            RESOLVED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkResolved(c.id)}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs px-2.5 py-1 rounded font-medium"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Constraint Summary Panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Constraint Validation Summary & Production Readiness
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center">
                <p className="text-xs text-green-700 font-semibold uppercase">Satisfied</p>
                <p className="text-2xl font-semibold text-green-800 mt-1">19</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-center">
                <p className="text-xs text-amber-700 font-semibold uppercase">Warnings</p>
                <p className="text-2xl font-semibold text-amber-800 mt-1">3</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-center">
                <p className="text-xs text-red-700 font-semibold uppercase">Critical Issues</p>
                <p className="text-2xl font-semibold text-red-800 mt-1">2</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase">Total Checked</p>
                <p className="text-2xl font-semibold text-slate-800 mt-1">24</p>
              </div>
            </div>

            {/* Readiness Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Production Readiness Score</span>
                <span>79%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-3 rounded-full w-[79%]" />
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                79% Production Ready — 2 critical issues (Assembly Fixture & Test Bench capacity) must be resolved before production launch.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSelectStep('quality')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              Proceed to Quality Planning
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
