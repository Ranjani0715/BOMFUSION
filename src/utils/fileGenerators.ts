import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ComponentItem, MBOMStation, RoutingOperation, QualityCheckpoint } from '../types';

export function downloadFile(content: string | Blob, fileName: string, mimeType: string) {
  if (content instanceof Blob) {
    saveAs(content, fileName);
  } else {
    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, fileName);
  }
}

export function generateEBOMCSV(components: ComponentItem[]): string {
  const headers = ['Part Number', 'Part Name', 'Qty', 'Level', 'Material', 'UoM', 'Revision', 'Description', 'Weight (kg)', 'Dimensions'];
  const rows = components.map((c) => [
    c.id,
    `"${c.name}"`,
    c.qty,
    c.level,
    c.material,
    c.uom,
    c.revision,
    `"${c.description}"`,
    c.weightKg,
    c.dimensions,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function generateEBOMJSON(components: ComponentItem[]): string {
  return JSON.stringify(
    {
      project: 'EMA-2024',
      assemblyName: 'Electric Motor Assembly',
      totalComponents: components.length,
      components,
    },
    null,
    2
  );
}

export function generateEBOMXML(components: ComponentItem[]): string {
  const itemsXml = components
    .map(
      (c) => `  <Component>
    <PartNumber>${c.id}</PartNumber>
    <Name>${c.name}</Name>
    <Quantity>${c.qty}</Quantity>
    <Level>${c.level}</Level>
    <Material>${c.material}</Material>
    <UnitOfMeasure>${c.uom}</UnitOfMeasure>
    <Revision>${c.revision}</Revision>
    <Description>${c.description}</Description>
    <WeightKg>${c.weightKg}</WeightKg>
    <Dimensions>${c.dimensions}</Dimensions>
  </Component>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<EngineeringBOM project="EMA-2024" name="Electric Motor Assembly">
${itemsXml}
</EngineeringBOM>`;
}

export function generateEBOMTXT(components: ComponentItem[]): string {
  const lines = [
    '================================================================================',
    'BOMfusionAI — ENGINEERING BILL OF MATERIALS REPORT',
    'Project: EMA-2024 | Electric Motor Assembly',
    'Generated: ' + new Date().toISOString(),
    '================================================================================',
    '',
    'PART NO    LEVEL  QTY  UOM  REV  WEIGHT(KG)  MATERIAL         PART NAME',
    '--------------------------------------------------------------------------------',
  ];

  components.forEach((c) => {
    const line = `${c.id.padEnd(10)} ${c.level.padEnd(6)} ${String(c.qty).padEnd(4)} ${c.uom.padEnd(4)} ${c.revision.padEnd(4)} ${String(c.weightKg).padEnd(11)} ${c.material.padEnd(16)} ${c.name}`;
    lines.push(line);
  });

  lines.push('--------------------------------------------------------------------------------');
  lines.push(`TOTAL COMPONENTS: ${components.length}`);
  lines.push('================================================================================');

  return lines.join('\n');
}

export function generateCADBOMTXT(components: ComponentItem[]): string {
  const lines = [
    '# CAD ASSEMBLY HIERARCHY STRUCTURE FILE',
    '# SOURCE: PTC WINDCHILL / SIEMENS NX CAD EXPORT',
    '# PROJECT: EMA-2024 ELECTRIC MOTOR ASSEMBLY',
    '# --------------------------------------------------------------------------------',
    'ASSEMBLY: EMA-2024 [Electric Motor Assembly]',
  ];

  components.forEach((c) => {
    const indent = c.level === 'L1' ? '  ' : c.level === 'L2' ? '    ' : '      ';
    lines.push(`${indent}CHILD: ${c.id} | NAME: ${c.name} | QTY: ${c.qty} | MAT: ${c.material} | DIM: ${c.dimensions}`);
  });

  return lines.join('\n');
}

export function downloadXLSXBOM(
  components: ComponentItem[],
  filename: string,
  stations?: MBOMStation[],
  routings?: RoutingOperation[],
  quality?: QualityCheckpoint[]
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Components
  const compData = components.map((c) => ({
    'Part Number': c.id,
    'Component Name': c.name,
    Quantity: c.qty,
    Level: c.level,
    Material: c.material,
    UoM: c.uom,
    Revision: c.revision,
    Description: c.description,
    'Weight (kg)': c.weightKg,
    Dimensions: c.dimensions,
    Category: c.category || 'N/A',
  }));
  const wsComps = XLSX.utils.json_to_sheet(compData);
  XLSX.utils.book_append_sheet(wb, wsComps, 'mBOM Components');

  if (stations) {
    const stationData: any[] = [];
    stations.forEach((st) => {
      st.components.forEach((c) => {
        stationData.push({
          'Station ID': st.id,
          'Station Name': st.name,
          'Cycle Time (s)': st.cycleTimeSec,
          'Part Number': c.id,
          'Part Name': c.name,
          Quantity: c.qty,
          Category: c.category,
        });
      });
    });
    const wsStations = XLSX.utils.json_to_sheet(stationData);
    XLSX.utils.book_append_sheet(wb, wsStations, 'Workstations');
  }

  if (routings) {
    const routingData = routings.map((r) => ({
      'Operation ID': r.id,
      'Operation Name': r.name,
      Station: r.stationId,
      Machine: r.machine,
      'Cycle Time (s)': r.cycleTimeSec,
      'Depends On': r.dependsOn,
      'Skill Level': r.skill,
      'AI Rationale': r.rationale,
    }));
    const wsRouting = XLSX.utils.json_to_sheet(routingData);
    XLSX.utils.book_append_sheet(wb, wsRouting, 'Routing Plan');
  }

  if (quality) {
    const qualityData = quality.map((q) => ({
      'Inspection ID': q.id,
      Stage: q.stage,
      Activity: q.activity,
      Method: q.method,
      Criteria: q.criteria,
      Responsible: q.responsible,
      Status: q.status,
    }));
    const wsQuality = XLSX.utils.json_to_sheet(qualityData);
    XLSX.utils.book_append_sheet(wb, wsQuality, 'Quality Inspection Plan');
  }

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, filename);
}

export async function downloadZipBundle(
  components: ComponentItem[],
  stations: MBOMStation[] = [],
  routings: RoutingOperation[] = [],
  quality: QualityCheckpoint[] = []
) {
  const zip = new JSZip();

  // Excel file
  const wb = XLSX.utils.book_new();
  const compData = components.map((c) => ({
    'Part Number': c.id,
    'Component Name': c.name,
    Quantity: c.qty,
    Level: c.level,
    Material: c.material,
    UoM: c.uom,
    Revision: c.revision,
    Category: c.category || 'N/A',
  }));
  const wsComps = XLSX.utils.json_to_sheet(compData);
  XLSX.utils.book_append_sheet(wb, wsComps, 'mBOM');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  zip.file('EMA-2024-mBOM-Package.xlsx', excelBuffer);

  // CSV
  zip.file('EMA-2024-Components.csv', generateEBOMCSV(components));

  // JSON
  zip.file('EMA-2024-Full-Manufacturing-Package.json', generateEBOMJSON(components));

  // XML
  zip.file('EMA-2024-eBOM.xml', generateEBOMXML(components));

  // Routing TXT
  let routingTxt = 'EMA-2024 MANUFACTURING ROUTING SEQUENCE\n=========================================\n';
  routings.forEach((r) => {
    routingTxt += `[${r.id}] ${r.name}\nStation: ${r.stationName} | Machine: ${r.machine} | Time: ${r.cycleTimeSec}s | Skill: ${r.skill}\nRationale: ${r.rationale}\n-----------------------------------------\n`;
  });
  zip.file('EMA-2024-Routing-Plan.txt', routingTxt);

  // Audit trail TXT
  const auditTxt = `BOMfusionAI AUDIT TRAIL LOG
Project: EMA-2024 Electric Motor Assembly
Exported: ${new Date().toISOString()}
--------------------------------------------------
[2026-07-26 08:00:12] SYSTEM: Initialized project EMA-2024.
[2026-07-26 08:02:45] USER: Ingested engineering eBOM (25 components).
[2026-07-26 08:05:10] AI: Component classification executed with 96.4% confidence.
[2026-07-26 08:08:22] AI: Station decomposition generated 5 assembly stations.
[2026-07-26 08:12:00] ENGINEER: Approved all 5 AI manufacturing recommendations.
[2026-07-26 08:15:00] SYSTEM: Version 3.0 Released to Production.
`;
  zip.file('Audit-Trail-Log.txt', auditTxt);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'EMA-2024-Complete-Production-Bundle.zip');
}
