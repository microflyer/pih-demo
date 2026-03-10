import type { ProjectLinkLocation } from '@/entity-types/project-link-location'

export const projectLinkLocations: ProjectLinkLocation[] = [
  // proj-001: NOMURA Digital Transformation - Japan, China
  { id: 'pll-001', project_id: 'proj-001', location_id: 'loc-002' },
  { id: 'pll-002', project_id: 'proj-001', location_id: 'loc-001' },

  // proj-002: Coca Cola Bottlers Japan - Japan, Thailand
  { id: 'pll-003', project_id: 'proj-002', location_id: 'loc-002' },
  { id: 'pll-004', project_id: 'proj-002', location_id: 'loc-005' },

  // proj-003: Consumer Goods Analytics PoC - United States, China
  { id: 'pll-005', project_id: 'proj-003', location_id: 'loc-004' },
  { id: 'pll-006', project_id: 'proj-003', location_id: 'loc-001' },

  // proj-004: BUPA Healthcare Integration - Hong Kong, United Kingdom (using loc-008 as Hong Kong)
  { id: 'pll-007', project_id: 'proj-004', location_id: 'loc-008' },

  // proj-005: Amazon Software Platform - United States, China
  { id: 'pll-008', project_id: 'proj-005', location_id: 'loc-004' },
  { id: 'pll-009', project_id: 'proj-005', location_id: 'loc-001' },
  { id: 'pll-010', project_id: 'proj-005', location_id: 'loc-003' },

  // proj-006: Lifesciences Regulatory Reporting - Korea
  { id: 'pll-011', project_id: 'proj-006', location_id: 'loc-003' },

  // proj-007: Manufacturing 3M - China, Japan, Korea
  { id: 'pll-012', project_id: 'proj-007', location_id: 'loc-001' },
  { id: 'pll-013', project_id: 'proj-007', location_id: 'loc-002' },
  { id: 'pll-014', project_id: 'proj-007', location_id: 'loc-003' },

  // proj-008: McDonald's Retail Analytics - Japan
  { id: 'pll-015', project_id: 'proj-008', location_id: 'loc-002' },
]
