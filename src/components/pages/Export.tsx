import React from 'react';
import { useApp } from '../../store/appStore';
import { Download, FileSpreadsheet, FileJson, Package, FileText, CheckCircle2, Factory, Database, Briefcase } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ExportPage() {
  const { state } = useApp();

  const EXPORT_FORMATS = [
    { id: 'xlsx', name: 'Excel Workbook', icon: FileSpreadsheet, color: 'bg-green-50 text-green-700 border-green-200', details: ['Full mBOM hierarchy', 'Routing operations', 'Job instructions', 'Quality checkpoints'] },
    { id: 'json', name: 'PLM Schema JSON', icon: FileJson, color: 'bg-blue-50 text-blue-700 border-blue-200', details: ['Machine-readable nested structure', 'ERP interface compatible', 'REST API payload ready'] },
    { id: 'csv', name: 'Flat CSV Package', icon: FileText, color: 'bg-slate-50 text-slate-700 border-slate-200', details: ['Legacy system compatible', 'UTF-8 encoded', 'Row-based sequence'] },
    { id: 'zip', name: 'Technical Data Package (TDP)', icon: Package, color: 'bg-purple-50 text-purple-700 border-purple-200', details: ['Combined mBOM + CAD data', 'Version control history', 'Quality certification logs'] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Export and ERP/MES Integration</h2>
        <p className="text-sm text-slate-500">Generate production-ready data packages in formats compatible with major ERP and MES platforms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPORT_FORMATS.map((fmt) => (
          <div key={fmt.id} className="card-base group cursor-pointer hover:border-blue-400 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-md", fmt.color.split(' ')[0])}>
                <fmt.icon className={cn("w-5 h-5", fmt.color.split(' ')[1])} />
              </div>
              <button className="text-slate-300 hover:text-blue-600 group-hover:text-blue-600 transition-colors">
                 <Download size={18} />
              </button>
            </div>
            <h3 className="text-base font-bold text-slate-800">{fmt.name}</h3>
            <ul className="mt-3 space-y-1.5">
               {fmt.details.map((detail, idx) => (
                 <li key={idx} className="text-[10px] text-slate-500 flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-slate-300" /> {detail}
                 </li>
               ))}
            </ul>
            <button className="btn-primary w-full mt-6 text-xs bg-slate-100 text-slate-700 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-none">
              Generate & Download
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-base">
           <h3 className="text-sm font-semibold text-slate-700 mb-6">ERP/MES Platform Compatibility</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               { name: 'SAP S/4HANA', status: 'Ready' },
               { name: 'Siemens Opcenter', status: 'Ready' },
               { name: 'PTC Windchill', status: 'In-Sync' },
               { name: 'Dassault DELMIA', status: 'Ready' },
               { name: 'Oracle Manufacturing Cloud', status: 'Ready' }
             ].map((sys, i) => (
               <div key={i} className="p-3 border border-slate-100 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Factory className="w-4 h-4 text-slate-400" />
                     <span className="text-xs font-bold text-slate-700">{sys.name}</span>
                  </div>
                  <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase">{sys.status}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="card-base bg-blue-50/50 border-blue-200">
           <h3 className="text-xs font-bold text-blue-700 uppercase mb-4">Export Package Summary</h3>
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Database className="w-5 h-5 text-blue-600" />
                 <div className="text-[11px] text-slate-600 leading-tight">
                    <p className="font-bold text-slate-800">25 Base Components</p>
                    <p>Verified mBOM v3.0 mapping</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Activity className="w-5 h-5 text-blue-600" />
                 <div className="text-[11px] text-slate-600 leading-tight">
                    <p className="font-bold text-slate-800">16 Operations</p>
                    <p>Final routing plan + cycle times</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Briefcase className="w-5 h-5 text-blue-600" />
                 <div className="text-[11px] text-slate-600 leading-tight">
                    <p className="font-bold text-slate-800">Quality Certificate</p>
                    <p>Audit trail of authorization items</p>
                 </div>
              </div>
              
              <div className="pt-4 border-t border-blue-100">
                 <div className="flex justify-between items-center bg-green-50 p-3 rounded-md border border-green-200">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={16} className="text-green-600" />
                       <span className="text-[11px] font-bold text-green-700">Audit Check Passed</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">HASH: 7F2d...9A</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

import { Activity } from 'lucide-react';
