import { BOMComponent, PartCategory, StationAssignment, RoutingOperation } from '../types';

export const MOTOR_COMPONENTS: BOMComponent[] = [
  { id: '1', partNumber: 'EMA-001', name: 'Motor Frame', quantity: 1, level: 1, material: 'Cast Iron', uom: 'EA', revision: 'R2', description: 'Main structural housing', weight: 12.5, dimensions: '350x280x220', category: PartCategory.MANUFACTURED, confidence: 98.5, rationale: 'Primary housing with complex geometry requiring multi-axis machining.' },
  { id: '2', partNumber: 'EMA-002', name: 'Stator Core', quantity: 1, level: 2, material: 'Silicon Steel', uom: 'EA', revision: 'R1', description: 'Magnetic stator assembly', weight: 4.2, dimensions: '240x240x180', category: PartCategory.MANUFACTURED, confidence: 96.2, rationale: 'Laminated core requiring precision pressing and stacking.' },
  { id: '3', partNumber: 'EMA-003', name: 'Stator Winding', quantity: 3, level: 2, material: 'Copper', uom: 'EA', revision: 'R1', description: 'Three phase winding coils', weight: 0.8, dimensions: '230x230x160', category: PartCategory.MANUFACTURED, confidence: 99.1, rationale: 'Custom winding pattern based on motor phase specification.' },
  { id: '4', partNumber: 'EMA-004', name: 'Rotor Core', quantity: 1, level: 2, material: 'Silicon Steel', uom: 'EA', revision: 'R1', description: 'Rotating magnetic core', weight: 2.1, dimensions: '220x220x170', category: PartCategory.MANUFACTURED, confidence: 95.8, rationale: 'Internal rotating assembly with interference fit requirements.' },
  { id: '5', partNumber: 'EMA-005', name: 'Rotor Bars', quantity: 24, level: 3, material: 'Aluminum', uom: 'EA', revision: 'R1', description: 'Conductor bars', weight: 0.05, dimensions: '165x8x8', category: PartCategory.MANUFACTURED, confidence: 94.5, rationale: 'Cast components integrated into rotor assembly.' },
  { id: '6', partNumber: 'EMA-006', name: 'Shaft', quantity: 1, level: 2, material: 'Alloy Steel', uom: 'EA', revision: 'R2', description: 'Main drive shaft', weight: 1.8, dimensions: '280x38x38', category: PartCategory.MANUFACTURED, confidence: 98.9, rationale: 'High-torque shaft requiring precision turning and heat treatment.' },
  { id: '7', partNumber: 'EMA-007', name: 'Bearing Drive End', quantity: 1, level: 3, material: 'Bearing Steel', uom: 'EA', revision: 'R1', description: 'Drive side bearing', weight: 0.3, dimensions: '80x35x21', category: PartCategory.PURCHASED, confidence: 99.8, rationale: 'Standard precision C3 clearance bearing from qualified supplier.' },
  { id: '8', partNumber: 'EMA-008', name: 'Bearing Non-Drive End', quantity: 1, level: 3, material: 'Bearing Steel', uom: 'EA', revision: 'R1', description: 'Non-drive bearing', weight: 0.3, dimensions: '80x35x21', category: PartCategory.PURCHASED, confidence: 99.8, rationale: 'Standard precision C3 clearance bearing from qualified supplier.' },
  { id: '9', partNumber: 'EMA-009', name: 'End Shield Drive', quantity: 1, level: 2, material: 'Aluminum', uom: 'EA', revision: 'R1', description: 'Drive end cover', weight: 1.2, dimensions: '280x280x40', category: PartCategory.MANUFACTURED, confidence: 97.4, rationale: 'Die-cast housing with precision bearing seat machining.' },
  { id: '10', partNumber: 'EMA-010', name: 'End Shield Non-Drive', quantity: 1, level: 2, material: 'Aluminum', uom: 'EA', revision: 'R1', description: 'Non-drive end cover', weight: 1.1, dimensions: '280x280x40', category: PartCategory.MANUFACTURED, confidence: 97.2, rationale: 'Die-cast housing with structural reinforcement for fan support.' },
  { id: '11', partNumber: 'EMA-011', name: 'Cooling Fan', quantity: 1, level: 2, material: 'Polypropylene', uom: 'EA', revision: 'R1', description: 'External cooling fan', weight: 0.4, dimensions: '260x260x60', category: PartCategory.PURCHASED, confidence: 99.5, rationale: 'Injection molded standard industrial fan component.' },
  { id: '12', partNumber: 'EMA-012', name: 'Fan Cover', quantity: 1, level: 2, material: 'Sheet Metal', uom: 'EA', revision: 'R1', description: 'Fan protection cover', weight: 0.6, dimensions: '280x280x70', category: PartCategory.MANUFACTURED, confidence: 96.8, rationale: 'Formed and punched sheet metal with ventilation pattern.' },
  { id: '13', partNumber: 'EMA-013', name: 'Terminal Box', quantity: 1, level: 2, material: 'Aluminum', uom: 'EA', revision: 'R1', description: 'Electrical connection box', weight: 0.9, dimensions: '120x100x80', category: PartCategory.MANUFACTURED, confidence: 97.8, rationale: 'Enclosure for electrical termination points.' },
  { id: '14', partNumber: 'EMA-014', name: 'Terminal Block', quantity: 1, level: 3, material: 'Ceramic', uom: 'EA', revision: 'R1', description: 'Wire connection block', weight: 0.2, dimensions: '80x40x30', category: PartCategory.PURCHASED, confidence: 99.2, rationale: 'High-temperature ceramic insulating block.' },
  { id: '15', partNumber: 'EMA-015', name: 'Cable Gland', quantity: 2, level: 3, material: 'Brass', uom: 'EA', revision: 'R1', description: 'Cable entry seals', weight: 0.1, dimensions: '25x25x20', category: PartCategory.PURCHASED, confidence: 99.7, rationale: 'IP68 rated brass cable glands.' },
  { id: '16', partNumber: 'EMA-016', name: 'Mounting Bolts', quantity: 8, level: 3, material: 'Alloy Steel', uom: 'EA', revision: 'R1', description: 'Frame mounting bolts', weight: 0.05, dimensions: 'M12x50', category: PartCategory.FASTENER, confidence: 99.9, rationale: 'Standard Grade 8.8 hex head fasteners.' },
  { id: '17', partNumber: 'EMA-017', name: 'Shaft Key', quantity: 1, level: 3, material: 'Alloy Steel', uom: 'EA', revision: 'R1', description: 'Shaft-coupling key', weight: 0.08, dimensions: '50x12x8', category: PartCategory.MANUFACTURED, confidence: 94.8, rationale: 'Machined parallel key for torque transmission.' },
  { id: '18', partNumber: 'EMA-018', name: 'Circlip', quantity: 4, level: 3, material: 'Spring Steel', uom: 'EA', revision: 'R1', description: 'Bearing retention clips', weight: 0.01, dimensions: '38x1.5', category: PartCategory.FASTENER, confidence: 99.8, rationale: 'Standard internal/external snap rings.' },
  { id: '19', partNumber: 'EMA-019', name: 'Grease Nipple', quantity: 2, level: 3, material: 'Steel', uom: 'EA', revision: 'R1', description: 'Bearing lubrication points', weight: 0.02, dimensions: 'M6x10', category: PartCategory.FASTENER, confidence: 99.7, rationale: 'Standard M6 hydraulic grease fittings.' },
  { id: '20', partNumber: 'EMA-020', name: 'Insulation Sleeve', quantity: 1, level: 3, material: 'Nomex', uom: 'EA', revision: 'R1', description: 'Winding insulation', weight: 0.15, dimensions: '240x240x180', category: PartCategory.CONSUMABLE, confidence: 92.4, rationale: 'Insulation material cut to size during assembly.' },
  { id: '21', partNumber: 'EMA-021', name: 'Name Plate', quantity: 1, level: 2, material: 'Stainless Steel', uom: 'EA', revision: 'R1', description: 'Motor rating plate', weight: 0.05, dimensions: '100x60x1', category: PartCategory.PURCHASED, confidence: 99.1, rationale: 'Etched stainless steel identification plate.' },
  { id: '22', partNumber: 'EMA-022', name: 'Paint Coat', quantity: 1, level: 2, material: 'Epoxy Paint', uom: 'LT', revision: 'R1', description: 'Protective surface coating', weight: 0.3, dimensions: 'SURFACE', category: PartCategory.CONSUMABLE, confidence: 91.8, rationale: 'Surface treatment applied post-assembly.' },
  { id: '23', partNumber: 'EMA-023', name: 'Packing Box', quantity: 1, level: 1, material: 'Cardboard', uom: 'EA', revision: 'R1', description: 'Shipping packaging', weight: 0.8, dimensions: '420x380x320', category: PartCategory.PURCHASED, confidence: 99.4, rationale: 'Validated shipping container for heavy industrial components.' },
  { id: '24', partNumber: 'EMA-024', name: 'Grease', quantity: 0.2, level: 3, material: 'Lithium Grease', uom: 'KG', revision: 'R1', description: 'Bearing lubrication compound', weight: 0.2, dimensions: 'BULK', category: PartCategory.CONSUMABLE, confidence: 92.5, rationale: 'Bulk lubrication material measured by weight.' },
  { id: '25', partNumber: 'EMA-025', name: 'Cable Tie', quantity: 10, level: 3, material: 'Nylon', uom: 'EA', revision: 'R1', description: 'Wire management ties', weight: 0.01, dimensions: '200x3.6', category: PartCategory.FLOOR_STOCK, confidence: 99.6, rationale: 'Low-cost high-volume wire management component.' }
];

export const STATIONS: StationAssignment[] = [
  {
    stationId: 1,
    stationName: 'Core Preparation',
    components: MOTOR_COMPONENTS.filter(p => ['EMA-002', 'EMA-003', 'EMA-020'].includes(p.partNumber)),
    cycleTime: 1350,
    operations: ['Stator Core Inspection', 'Insulation Installation', 'Coil Winding & Insertion', 'Intermediate Testing']
  },
  {
    stationId: 2,
    stationName: 'Rotor & Shaft Assembly',
    components: MOTOR_COMPONENTS.filter(p => ['EMA-004', 'EMA-005', 'EMA-006', 'EMA-017'].includes(p.partNumber)),
    cycleTime: 900,
    operations: ['Shaft Turning & Inspection', 'Rotor Core Press-Fit', 'Rotor Bar Insertion', 'Dynamic Balancing']
  },
  {
    stationId: 3,
    stationName: 'Sub-Assembly Integration',
    components: MOTOR_COMPONENTS.filter(p => ['EMA-001', 'EMA-007', 'EMA-008', 'EMA-009', 'EMA-010', 'EMA-018', 'EMA-019', 'EMA-024'].includes(p.partNumber)),
    cycleTime: 1260,
    operations: ['Frame Preparation', 'Bearing Installation', 'Core Insertion to Frame', 'End Shield Mounting']
  },
  {
    stationId: 4,
    stationName: 'Electrical & Secondary',
    components: MOTOR_COMPONENTS.filter(p => ['EMA-011', 'EMA-012', 'EMA-013', 'EMA-014', 'EMA-015', 'EMA-016', 'EMA-021', 'EMA-025'].includes(p.partNumber)),
    cycleTime: 300,
    operations: ['Fan Assembly', 'Terminal Box Installation', 'Block Wiring', 'Nameplate Riveting']
  },
  {
    stationId: 5,
    stationName: 'Final Test & Packing',
    components: MOTOR_COMPONENTS.filter(p => ['EMA-022', 'EMA-023'].includes(p.partNumber)),
    cycleTime: 1620,
    operations: ['Full Electrical Testing', 'Performance Validation', 'Surface Coating', 'Final Packaging']
  }
];

export const ROUTING_OPERATIONS: RoutingOperation[] = [
  { id: 'OP-101', name: 'Stator Core Prep', stationId: 1, machine: 'Visual Inspection Bench', cycleTime: 120, skillRequired: 'Assembler L1' },
  { id: 'OP-102', name: 'Insulation Wrap', stationId: 1, machine: 'Manual', cycleTime: 300, dependsOn: 'OP-101', skillRequired: 'Assembler L2' },
  { id: 'OP-103', name: 'Coil Insertion', stationId: 1, machine: 'Automated Winder', cycleTime: 780, dependsOn: 'OP-102', skillRequired: 'Machine Op L3' },
  { id: 'OP-104', name: 'Shaft Precision Turn', stationId: 2, machine: 'CNC Lathe', cycleTime: 360, skillRequired: 'Technician L3' },
  { id: 'OP-105', name: 'Rotor Stack', stationId: 2, machine: 'Hydraulic Press', cycleTime: 240, dependsOn: 'OP-104', skillRequired: 'Assembler L2' },
  { id: 'OP-106', name: 'Rotor Balancing', stationId: 2, machine: 'Dynamic Balancer', cycleTime: 300, dependsOn: 'OP-105', skillRequired: 'Technician L3' },
  { id: 'OP-107', name: 'Bearing Press', stationId: 3, machine: 'Pneumatic Press', cycleTime: 180, skillRequired: 'Assembler L2' },
  { id: 'OP-108', name: 'Stator-Frame Insertion', stationId: 3, machine: 'Hot-Fit Induction Oven', cycleTime: 420, dependsOn: 'OP-103', skillRequired: 'Assembler L3' },
  { id: 'OP-109', name: 'Rotor Insertion', stationId: 3, machine: 'Vertical Hoist', cycleTime: 300, dependsOn: 'OP-106,OP-108', skillRequired: 'Assembler L2' },
  { id: 'OP-110', name: 'End Shield Bolt', stationId: 3, machine: 'Torque Driver', cycleTime: 360, dependsOn: 'OP-109', skillRequired: 'Assembler L1' },
  { id: 'OP-111', name: 'Fan Mount', stationId: 4, machine: 'Manual', cycleTime: 120, dependsOn: 'OP-110', skillRequired: 'Assembler L1' },
  { id: 'OP-112', name: 'Terminal Box Install', stationId: 4, machine: 'Pneumatic Driver', cycleTime: 180, dependsOn: 'OP-110', skillRequired: 'Assembler L2' },
  { id: 'OP-113', name: 'No-Load Test', stationId: 5, machine: 'Motor Test Station', cycleTime: 600, dependsOn: 'OP-112', skillRequired: 'Quality Tech L3' },
  { id: 'OP-114', name: 'Full Load Validation', stationId: 5, machine: 'Dynamometer', cycleTime: 600, dependsOn: 'OP-113', skillRequired: 'Engineer L4' },
  { id: 'OP-115', name: 'Surface Coating', stationId: 5, machine: 'Spray Booth', cycleTime: 300, dependsOn: 'OP-114', skillRequired: 'Painter L2' },
  { id: 'OP-116', name: 'Final Packing', stationId: 5, machine: 'Packing Station', cycleTime: 120, dependsOn: 'OP-115', skillRequired: 'Loader L1' }
];
