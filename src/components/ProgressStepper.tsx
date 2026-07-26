import React from 'react';
import { Check } from 'lucide-react';
import { StepId } from '../types';

interface ProgressStepperProps {
  currentStep: StepId;
  completedSteps?: Set<StepId>;
  onSelectStep: (step: StepId) => void;
}

interface StepMeta {
  id: StepId;
  num: number;
  label: string;
}

const PROCESS_STEPS: StepMeta[] = [
  { id: 'upload', num: 1, label: 'Upload' },
  { id: 'cad', num: 2, label: 'CAD' },
  { id: 'classify', num: 3, label: 'Classify' },
  { id: 'mbom', num: 4, label: 'mBOM' },
  { id: 'routing', num: 5, label: 'Routing' },
  { id: 'balance', num: 6, label: 'Balance' },
  { id: 'constraints', num: 7, label: 'Constraints' },
  { id: 'quality', num: 8, label: 'Quality' },
  { id: 'variants', num: 9, label: 'Variants' },
  { id: 'insights', num: 10, label: 'Insights' },
  { id: 'sync', num: 11, label: 'Sync' },
  { id: 'approve', num: 12, label: 'Approve' },
  { id: 'versions', num: 13, label: 'Versions' },
  { id: 'export', num: 14, label: 'Export' },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  completedSteps = new Set(),
  onSelectStep,
}) => {
  // If currentStep is 'dashboard', don't show process stepper or keep it compact
  if (currentStep === 'dashboard') {
    return null;
  }

  return (
    <div className="fixed top-14 left-64 right-0 bg-white border-b border-slate-200 py-2.5 px-6 z-10 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[980px] max-w-7xl mx-auto">
        {PROCESS_STEPS.map((step, idx) => {
          const isCompleted = completedSteps?.has(step.id) ?? false;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <button
                onClick={() => onSelectStep(step.id)}
                className="flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-100 ring-offset-1'
                      : 'border border-slate-300 text-slate-500 bg-slate-50 group-hover:border-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <span>{step.num}</span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium mt-1 transition-colors ${
                    isCurrent
                      ? 'text-blue-600 font-semibold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Connecting Line */}
              {idx < PROCESS_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-1 mb-4 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
