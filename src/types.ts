export type StepIdType =
  | 'dashboard'
  | 'upload'
  | 'cad'
  | 'classify'
  | 'mbom'
  | 'routing'
  | 'balance'
  | 'constraints'
  | 'quality'
  | 'variants'
  | 'insights'
  | 'sync'
  | 'approve'
  | 'versions'
  | 'export'
  | 'erp'
  | 'analytics'
  | 'audit';

export const StepId = {
  DASHBOARD: 'dashboard' as StepIdType,
  UPLOAD: 'upload' as StepIdType,
  CAD: 'cad' as StepIdType,
  CLASSIFY: 'classify' as StepIdType,
  MBOM: 'mbom' as StepIdType,
  ROUTING: 'routing' as StepIdType,
  BALANCE: 'balance' as StepIdType,
  CONSTRAINTS: 'constraints' as StepIdType,
  QUALITY: 'quality' as StepIdType,
  VARIANTS: 'variants' as StepIdType,
  INSIGHTS: 'insights' as StepIdType,
  SYNC: 'sync' as StepIdType,
  APPROVE: 'approve' as StepIdType,
  VERSIONS: 'versions' as StepIdType,
  EXPORT: 'export' as StepIdType,
  ERP: 'erp' as StepIdType,
  ANALYTICS: 'analytics' as StepIdType,
  AUDIT: 'audit' as StepIdType,
};

export type StepId = StepIdType;

export type CategoryType =
  | 'Manufactured'
  | 'Purchased'
  | 'Fastener'
  | 'Consumable'
  | 'Floor Stock';

export interface ComponentItem {
  id: string; // e.g. EMA-001
  name: string;
  qty: number;
  level: string; // L1, L2, L3
  material: string;
  uom: string; // EA, LT, KG
  revision: string;
  description: string;
  weightKg: number;
  dimensions: string;
  category?: CategoryType;
  confidence?: number;
  rationale?: string;
  isOverridden?: boolean;
}

export interface MBOMStation {
  id: string; // ST-1, ST-2, etc.
  number: number;
  name: string;
  cycleTimeSec: number;
  components: ComponentItem[];
  subAssemblies?: { id: string; name: string; targetStation: string }[];
  operationsList: string[];
}

export interface RoutingOperation {
  id: string; // OP-101
  name: string;
  stationId: string;
  stationName: string;
  machine: string;
  cycleTimeSec: number;
  dependsOn: string; // '-' or OP-101
  skill: string;
  rationale: string;
  isModified?: boolean;
}

export interface ConstraintItem {
  id: string;
  description: string;
  components?: string;
  status: 'SATISFIED' | 'WARNING' | 'CRITICAL' | 'NOT AVAILABLE' | 'LOW STOCK' | 'AVAILABLE';
  details?: string;
  resource?: string;
  conflictingDemand?: string;
  timeframe?: string;
  resolution?: string;
  isResolved?: boolean;
}

export interface QualityCheckpoint {
  id: string; // INS-101
  stage: 'INCOMING' | 'SUB-ASSEMBLY' | 'IN-PROCESS' | 'FINAL';
  activity: string;
  method: string;
  criteria: string;
  responsible: string;
  status: 'Pass' | 'Fail' | 'Hold' | 'Pending';
  ncrId?: string;
}

export interface NCRReport {
  id: string; // NCR-2024-001
  checkpointId: string;
  failedActivity: string;
  defectDescription: string;
  disposition: 'Under Review' | 'Rework' | 'Scrap' | 'Return to Vendor';
  assignedTo: string;
  targetDate: string;
  status: 'OPEN' | 'RESOLVED';
}

export interface VariantDelta {
  partId: string;
  name: string;
  status: 'SAME' | 'MODIFIED' | 'ADDED' | 'REMOVED';
  details: string;
  qty: number;
  material: string;
  stdVal?: string;
  heVal?: string;
  exVal?: string;
}

export interface ComponentRisk {
  id: string;
  name: string;
  supplyRisk: number; // 1-5
  leadTimeRisk: number; // 1-5
  costRisk: number; // 1-5
  overallRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
}

export interface PredictiveAlert {
  id: string;
  title: string;
  body: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  acknowledged?: boolean;
}

export interface AIDecision {
  id: string;
  type: string;
  confidence: number;
  recommendation: string;
  rationale: string;
  status: 'PENDING' | 'APPROVED' | 'MODIFIED' | 'REJECTED';
  modifiedText?: string;
  reviewedAt?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  stepName: string;
  summary: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export type ActivityItem = ActivityLog;

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
