import React, { useState } from 'react';
import {
  FileText,
  Filter,
  Search,
  Download,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  User,
  Cpu,
} from 'lucide-react';
import { ActivityItem } from '../types';
import { downloadFile } from '../utils/fileGenerators';

interface AuditLogPageProps {
  activities: ActivityItem[];
}

export const AuditLogPage: React.FC<AuditLogPageProps> = ({ activities }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.stepName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || act.type.toUpperCase() === filterType;

    return matchesSearch && matchesType;
  });

  const handleExportAudit = () => {
    const csvRows = ['Timestamp,Step Name,Type,Summary'];
    activities.forEach((act) => {
      csvRows.push(`"${act.timestamp}","${act.stepName}","${act.type}","${act.summary}"`);
    });

    downloadFile(csvRows.join('\n'), 'BOMfusionAI-Audit-Log.csv', 'text/csv');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Complete Process Audit Log
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Traceable, immutable record of all human and AI activities across the BOM transformation lifecycle
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export Audit Log (CSV)
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter activity log entries..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Activity Trail ({filtered.length} entries)
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Project: EMA-2024
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5 w-32">Timestamp</th>
                <th className="px-3 py-2.5 w-36">Step Name</th>
                <th className="px-3 py-2.5">Action Summary</th>
                <th className="px-3 py-2.5 w-24">Type</th>
                <th className="px-3 py-2.5 w-28">Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((act) => {
                let badgeStyle = 'bg-slate-100 text-slate-700';
                if (act.type === 'success') badgeStyle = 'bg-emerald-100 text-emerald-800';
                else if (act.type === 'warning') badgeStyle = 'bg-amber-100 text-amber-800';
                else if (act.type === 'error') badgeStyle = 'bg-red-100 text-red-800';

                const isAI = act.summary.toLowerCase().includes('ai') || act.summary.toLowerCase().includes('categorized') || act.summary.toLowerCase().includes('generated');

                return (
                  <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5 font-mono text-slate-500">{act.timestamp}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">{act.stepName}</td>
                    <td className="px-3 py-2.5 text-slate-700 font-medium">{act.summary}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${badgeStyle}`}>
                        {act.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 flex items-center gap-1">
                      {isAI ? (
                        <>
                          <Cpu className="w-3.5 h-3.5 text-blue-600" />
                          <span>AI Engine</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5 text-slate-600" />
                          <span>User / Eng</span>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
