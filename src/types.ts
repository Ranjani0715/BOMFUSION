export enum PartCategory {
  MANUFACTURED = 'Manufactured',
  PURCHASED = 'Purchased',
  FASTENER = 'Fastener',
  CONSUMABLE = 'Consumable',
  FLOOR_STOCK = 'Floor Stock'
}

export interface BOMComponent {
  id: string;
  partNumber: string;
  name: string;
  quantity: number;
  level: number;
  material: string;
  uom: string;
  revision: string;
  description: string;
  weight?: number; // kg
  dimensions?: string;
  category?: PartCategory;
  confidence?: number;
  rationale?: string;
}

export interface StationAssignment {
  stationId: number;
  stationName: string;
  components: BOMComponent[];
  cycleTime: number;
  operations: string[];
}

export interface RoutingOperation {
  id: string;
  name: string;
  stationId: number;
  machine: string;
  cycleTime: number;
  dependsOn?: string;
  skillRequired: string;
  rationale?: string;
}

export enum AppStep {
  DASHBOARD = 'Dashboard',
  UPLOAD = 'Upload',
  CAD = 'CAD',
  CLASSIFY = 'Classify',
  MBOM = 'mBOM',
  ROUTING = 'Routing',
  BALANCE = 'Balance',
  CONSTRAINTS = 'Constraints',
  QUALITY = 'Quality',
  VARIANTS = 'Variants',
  INSIGHTS = 'Insights',
  SYNC = 'Sync',
  APPROVE = 'Approve',
  VERSIONS = 'Versions',
  EXPORT = 'Export'
}

export interface AppState {
  currentStep: AppStep;
  components: BOMComponent[];
  isProjectLoaded: boolean;
  classificationDone: boolean;
  mBomGenerated: boolean;
  routingDone: boolean;
  isProcessing: boolean;
  approvals: Record<string, boolean>;
}
