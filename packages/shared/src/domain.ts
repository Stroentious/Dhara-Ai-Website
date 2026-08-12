/**
 * Domain Hierarchy & Entity Contracts for Dhara AI Phase 3
 */

export type FarmStatus = 'ACTIVE' | 'ARCHIVED';
export type FieldStatus = 'ACTIVE' | 'ARCHIVED';
export type ZoneStatus = 'ACTIVE' | 'ARCHIVED';
export type IrrigationType = 'DRIP' | 'SPRINKLER' | 'FLOOD' | 'OTHER';
export type CropCycleStatus = 'PLANNED' | 'ACTIVE' | 'HARVESTED' | 'CANCELLED';

export interface FarmDTO {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string | null;
  locationName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  area?: number | null;
  areaUnit: string;
  status: FarmStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FieldDTO {
  id: string;
  farmId: string;
  name: string;
  description?: string | null;
  area?: number | null;
  areaUnit: string;
  soilType?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: FieldStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ZoneDTO {
  id: string;
  fieldId: string;
  name: string;
  description?: string | null;
  area?: number | null;
  areaUnit: string;
  irrigationType: IrrigationType;
  status: ZoneStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CropDTO {
  id: string;
  name: string;
  scientificName?: string | null;
  category?: string | null;
  description?: string | null;
  createdAt: string;
}

export interface CropCycleDTO {
  id: string;
  fieldId: string;
  zoneId?: string | null;
  cropId: string;
  cropName?: string;
  seasonName?: string | null;
  sowingDate?: string | null;
  expectedHarvestDate?: string | null;
  growthStage?: string | null;
  status: CropCycleStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetricsDTO {
  totalFarms: number;
  totalFields: number;
  totalZones: number;
  activeCropCycles: number;
  organizationName?: string;
}

export interface CreateFarmRequest {
  organizationId: string;
  name: string;
  slug?: string;
  description?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  areaUnit?: string;
}

export interface UpdateFarmRequest {
  name?: string;
  description?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  areaUnit?: string;
  status?: FarmStatus;
}

export interface CreateFieldRequest {
  name: string;
  description?: string;
  area?: number;
  areaUnit?: string;
  soilType?: string;
  latitude?: number;
  longitude?: number;
  initialCropId?: string;
}

export interface UpdateFieldRequest {
  name?: string;
  description?: string;
  area?: number;
  areaUnit?: string;
  soilType?: string;
  latitude?: number;
  longitude?: number;
  status?: FieldStatus;
}

export interface CreateZoneRequest {
  name: string;
  description?: string;
  area?: number;
  areaUnit?: string;
  irrigationType?: IrrigationType;
}

export interface UpdateZoneRequest {
  name?: string;
  description?: string;
  area?: number;
  areaUnit?: string;
  irrigationType?: IrrigationType;
  status?: ZoneStatus;
}

export interface CreateCropCycleRequest {
  cropId: string;
  zoneId?: string;
  seasonName?: string;
  sowingDate?: string;
  expectedHarvestDate?: string;
  growthStage?: string;
  notes?: string;
}
