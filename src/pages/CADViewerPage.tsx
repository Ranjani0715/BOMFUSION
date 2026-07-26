import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  Info,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { ComponentItem, CategoryType } from '../types';
import { SAMPLE_COMPONENTS } from '../data/sampleData';
import { CADCanvas } from '../components/CADCanvas';

interface CADViewerPageProps {
  components?: ComponentItem[];
}

export const CADViewerPage: React.FC<CADViewerPageProps> = ({
  components = SAMPLE_COMPONENTS,
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>('EMA-001');
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [resetCameraTrigger, setResetCameraTrigger] = useState<number>(0);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['EMA-001', 'EMA-002', 'EMA-006'])
  );

  const selectedPart = components.find((c) => c.id === selectedPartId) || components[0];

  const getCategoryColorClass = (cat?: CategoryType) => {
    switch (cat) {
      case 'Manufactured':
        return 'bg-blue-500';
      case 'Purchased':
        return 'bg-purple-500';
      case 'Fastener':
        return 'bg-amber-500';
      case 'Consumable':
        return 'bg-orange-500';
      case 'Floor Stock':
        return 'bg-slate-400';
      default:
        return 'bg-blue-500';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Material weight analysis
  const materialWeights: Record<string, number> = {};
  components.forEach((c) => {
    materialWeights[c.material] = (materialWeights[c.material] || 0) + c.weightKg * c.qty;
  });
  const maxMatWeight = Math.max(...Object.values(materialWeights));

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          CAD Assembly Structure Viewer
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Engineering assembly hierarchy and 3D component visualization
        </p>
      </div>

      {/* Two Panels Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT PANEL — Assembly Structure (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col h-[680px]">
          {/* Header & Toolbar */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-800">
                Engineering BOM Tree
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                25 Parts
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setExpandedNodes(new Set(['EMA-001', 'EMA-002', 'EMA-004', 'EMA-006']))}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded text-xs font-medium"
              >
                Fit
              </button>
              <button
                onClick={() => setExpandedNodes(new Set())}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded text-xs font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Tree View */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {components.map((part) => {
              const isSelected = selectedPartId === part.id;
              const indentClass =
                part.level === 'L1' ? 'ml-0' : part.level === 'L2' ? 'ml-4' : 'ml-8';

              return (
                <div
                  key={part.id}
                  onClick={() => setSelectedPartId(part.id)}
                  className={`relative flex items-center gap-2 p-2 rounded-md border text-xs cursor-pointer transition-all ${indentClass} ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-2xs font-medium'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Category Color Bar */}
                  <div
                    className={`w-1 h-6 rounded-full shrink-0 ${getCategoryColorClass(
                      part.category
                    )}`}
                  />

                  {/* Part Number Badge */}
                  <span className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60 shrink-0">
                    {part.id}
                  </span>

                  {/* Part Name */}
                  <span className="text-slate-800 truncate flex-1">{part.name}</span>

                  {/* Qty Badge */}
                  {part.qty > 1 && (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0">
                      x{part.qty}
                    </span>
                  )}

                  {/* Category Dot */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${getCategoryColorClass(
                      part.category
                    )}`}
                    title={part.category}
                  />
                </div>
              );
            })}
          </div>

          {/* Selected Part Detail Footer */}
          {selectedPart && (
            <div className="p-3.5 border-t border-slate-200 bg-slate-50/80 rounded-b-lg text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="font-mono font-semibold text-blue-700">{selectedPart.id}</span>
                <span className="font-semibold text-slate-800">{selectedPart.name}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-medium">
                  {selectedPart.category || 'Manufactured'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400">Material:</span> {selectedPart.material}
                </div>
                <div>
                  <span className="text-slate-400">Weight:</span> {selectedPart.weightKg} kg
                </div>
                <div>
                  <span className="text-slate-400">Dimensions:</span> {selectedPart.dimensions}
                </div>
                <div>
                  <span className="text-slate-400">Revision:</span> {selectedPart.revision}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — 3D Component Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col h-[680px]">
          {/* Header & Controls */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-lg">
            <h3 className="text-sm font-semibold text-slate-800">
              3D Assembly Simulation
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExploded(!isExploded)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isExploded
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isExploded ? 'Assembly View' : 'Exploded View'}
              </button>
              <button
                onClick={() => {
                  setSelectedPartId(null);
                  setResetCameraTrigger((prev) => prev + 1);
                }}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Camera
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="flex-1 relative bg-slate-50/50">
            <CADCanvas
              isExploded={isExploded}
              selectedPartId={selectedPartId}
              components={components}
              onSelectPart={(id) => setSelectedPartId(id)}
              onResetCameraTrigger={resetCameraTrigger}
            />

            {/* Orbit Instructions Overlay */}
            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-xs border border-slate-200 rounded px-2.5 py-1 text-[11px] text-slate-500 font-mono pointer-events-none">
              Drag to Orbit • Scroll to Zoom
            </div>
          </div>

          {/* Bottom Material Analytics Bar */}
          <div className="p-3.5 border-t border-slate-200 bg-white rounded-b-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Total Assembly Weight: 28.52 kg</span>
              <span>Heaviest: Motor Frame (12.5 kg)</span>
              <span>Lightest: Circlip (0.01 kg)</span>
              <span>Materials: 9 Types</span>
            </div>

            {/* Material Weight Horizontal Bars */}
            <div className="space-y-1 pt-1">
              {Object.entries(materialWeights).slice(0, 4).map(([mat, wt], idx) => {
                const percent = Math.round((wt / maxMatWeight) * 100);
                const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-amber-600'];
                return (
                  <div key={mat} className="flex items-center gap-2 text-[11px]">
                    <span className="w-28 text-slate-600 font-medium truncate">{mat}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${colors[idx % colors.length]} h-2 rounded-full`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-slate-500">
                      {wt.toFixed(1)} kg
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
