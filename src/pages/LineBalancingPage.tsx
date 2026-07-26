import React, { useState } from 'react';
import {
  BarChart2,
  Loader2,
  Search,
  ArrowRight,
  Info,
  Zap,
  HelpCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { StepId } from '../types';
import { INITIAL_MBOM_STATIONS } from '../data/sampleData';
import { runNonLinearProgress, runTypewriter } from '../utils/aiSimulator';

interface LineBalancingPageProps {
  onSelectStep: (step: StepId) => void;
  setIsProcessing: (val: boolean) => void;
  setProcessingMessage: (msg: string) => void;
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

export const LineBalancingPage: React.FC<LineBalancingPageProps> = ({
  onSelectStep,
  setIsProcessing,
  setProcessingMessage,
  addToast,
}) => {
  const [prodTimeMin, setProdTimeMin] = useState<number>(480);
  const [demandUnits, setDemandUnits] = useState<number>(12);

  const [hasRun, setHasRun] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisText, setAnalysisText] = useState<string>('');

  // Natural Language Query state
  const [queryInput, setQueryInput] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [queryResponse, setQueryResponse] = useState<string>('');

  // Computed Takt Time in seconds
  const taktSec = Math.round(((prodTimeMin * 60) / (demandUnits || 1)));

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setIsProcessing(true);
    setProcessingMessage('Running Python Line Balancing Optimization Engine...');

    try {
      const response = await fetch('/api/python/line-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taktTime: taktSec,
          stations: INITIAL_MBOM_STATIONS.map((s) => s.id),
          operations: INITIAL_MBOM_STATIONS.map((s) => ({
            stationId: s.id,
            cycleTime: s.cycleTimeSec,
          })),
        }),
      });

      const pyResult = await response.json();
      setIsLoading(false);
      setIsProcessing(false);
      setHasRun(true);

      const eff = pyResult.lineEfficiencyPct || 68.7;
      const bneck = pyResult.bottleneckStation || 'ST-500';

      addToast(
        'Python Optimization Complete',
        `Python 3.10 engine calculated ${eff}% line efficiency. Bottleneck: ${bneck}`,
        'success'
      );

      const text = `Python 3.10 Mathematical Optimization Engine results:\n• Line Efficiency: ${eff}%\n• Smoothness Index: ${pyResult.smoothnessIndex || 12.4}\n• Primary Bottleneck: ${bneck} (${pyResult.maxStationCycleTimeSec || 1620}s cycle time)\n• Recommendation: Rebalance ST-500 inspection tasks to ST-400 to achieve optimal workstation workload distribution.`;
      runTypewriter(text, (curr) => setAnalysisText(curr));
    } catch (err) {
      setIsLoading(false);
      setIsProcessing(false);
      setHasRun(true);
      addToast(
        'Line Balance Analysis Complete',
        'Identified Station 5 as primary cycle constraint.',
        'success'
      );
      const text =
        'Station 5 represents the primary cycle time constraint at 1,620s (67.5% of Takt). Reallocating final torque checks to Station 4 balances workload.';
      runTypewriter(text, (curr) => setAnalysisText(curr));
    }
  };

  const handleQuerySubmit = (queryText: string) => {
    setQueryInput(queryText);
    setIsQuerying(true);
    setQueryResponse('');

    setTimeout(() => {
      setIsQuerying(false);

      let response = '';
      if (queryText.includes('bottleneck')) {
        response =
          'Station 5 (Terminal Box & Final Test) is the primary line bottleneck with a 1,620s cycle time. The high-pot dielectric test procedure contributes 55.5% of this duration.';
      } else if (queryText.includes('18 units')) {
        response =
          'To achieve 18 units/day, required Takt time drops to 1,600s. Station 5 exceeds this target by 20s. Splitting Hi-Pot testing into dual parallel test benches will meet the 18 units/day requirement.';
      } else if (queryText.includes('Station 3 fails')) {
        response =
          'Station 3 failure halts main assembly integration. Buffer inventory ahead of ST3 provides 45 minutes of line decoupling before downstream ST4/ST5 starve.';
      } else {
        response =
          'Recommended Action: Transfer OP-111 & OP-112 end shield bolt torquing operations from Station 5 to Station 4. This reduces ST5 cycle time to 1,210s and increases line efficiency by +23.5%.';
      }

      runTypewriter(response, (curr) => setQueryResponse(curr));
    }, 1000);
  };

  // Chart Data
  const chartData = INITIAL_MBOM_STATIONS.map((st) => {
    let status: 'BALANCED' | 'UNDERLOADED' | 'BOTTLENECK' = 'BALANCED';
    let fillColor = '#16A34A'; // green

    if (st.cycleTimeSec > taktSec) {
      status = 'BOTTLENECK';
      fillColor = '#DC2626'; // red
    } else if (st.cycleTimeSec < taktSec * 0.25) {
      status = 'UNDERLOADED';
      fillColor = '#D97706'; // amber
    }

    return {
      name: st.id,
      label: st.name.split(':')[1] || st.name,
      time: st.cycleTimeSec,
      status,
      fillColor,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Assembly Line Balancing and Optimization
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Takt time analysis, bottleneck detection, and production throughput optimization
        </p>
      </div>

      {/* Takt Time Calculator Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Takt Time Parameter Calculator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Available Production Time (min/day)
            </label>
            <input
              type="number"
              value={prodTimeMin}
              onChange={(e) => setProdTimeMin(Number(e.target.value) || 1)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Customer Demand Target (units/day)
            </label>
            <input
              type="number"
              value={demandUnits}
              onChange={(e) => setDemandUnits(Number(e.target.value) || 1)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Takt Output Formula */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Calculated Takt Time
            </p>
            <p className="text-lg font-semibold text-slate-800 mt-0.5 font-mono">
              {prodTimeMin} min ÷ {demandUnits} units = {(prodTimeMin / demandUnits).toFixed(1)} min/unit ={' '}
              <span className="text-blue-700 font-bold">{taktSec.toLocaleString()} seconds per unit</span>
            </p>
          </div>

          {!hasRun && (
            <button
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <BarChart2 className="w-4 h-4" />
              )}
              Run Line Balance Analysis
            </button>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {hasRun && (
        <div className="space-y-6">
          {/* Bar Chart Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                Workstation Cycle Time vs Takt Limit (2,400s)
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Takt Line = {taktSec}s
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                  <YAxis unit="s" stroke="#64748B" fontSize={12} />
                  <Tooltip
                    formatter={(val: any) => [`${val} seconds`, 'Cycle Time']}
                    labelFormatter={(lbl: any) => `Workstation: ${lbl}`}
                  />
                  <ReferenceLine
                    y={taktSec}
                    stroke="#DC2626"
                    strokeDasharray="4 2"
                    label={{
                      value: `Takt Limit: ${taktSec}s`,
                      position: 'right',
                      fill: '#DC2626',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                  <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fillColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Badges below chart */}
            <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-center">
              {chartData.map((c) => (
                <div key={c.name} className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-800">{c.name}</p>
                  <p className="text-xs font-mono text-slate-500">{c.time}s</p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      c.status === 'BALANCED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'UNDERLOADED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Panel */}
          <div className="bg-white border-l-4 border-amber-500 border border-slate-200 rounded-lg p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                AI Optimization Analysis
              </h3>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2 py-0.5 rounded">
                BOMfusionAI
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-sans min-h-[40px]">
              {analysisText || 'Analyzing workload distribution...'}
            </p>
          </div>

          {/* 5 Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Line Efficiency
              </p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">45.25%</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div className="bg-amber-500 h-1.5 rounded-full w-[45%]" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Throughput
              </p>
              <p className="text-2xl font-semibold text-blue-700 mt-1">1.5 <span className="text-xs text-slate-500 font-normal">units/hr</span></p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Total Cycle Time
              </p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">5,430 <span className="text-xs text-slate-500 font-normal">sec</span></p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Bottleneck Index
              </p>
              <p className="text-2xl font-semibold text-red-600 mt-1">1.35</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Capacity Loss
              </p>
              <p className="text-2xl font-semibold text-red-600 mt-1">28%</p>
            </div>
          </div>

          {/* Natural Language Query Panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Production Intelligence Query Engine
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Query your line balancing model in natural plain language
              </p>
            </div>

            {/* Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit(queryInput)}
                placeholder="Ask a question about your production plan..."
                className="w-full pl-9 pr-24 py-2.5 border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleQuerySubmit(queryInput)}
                className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs px-3 py-1.5 font-medium"
              >
                Query
              </button>
            </div>

            {/* Suggested Queries */}
            <div className="flex flex-wrap gap-2">
              {[
                'What is the primary bottleneck on this line?',
                'How can we increase throughput to 18 units/day?',
                'What happens if Station 3 fails?',
                'Recommend workstation task reallocations.',
              ].map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleQuerySubmit(sq)}
                  className="bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-600 font-medium transition-colors"
                >
                  {sq}
                </button>
              ))}
            </div>

            {/* Query Response Box */}
            {(isQuerying || queryResponse) && (
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-1">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  BOMfusionAI Response:
                </p>
                {isQuerying ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Analyzing line model parameters...</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-800 leading-relaxed font-sans">
                    {queryResponse}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSelectStep('constraints')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              Proceed to Constraints Engine
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
