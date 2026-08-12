import {
  RegisterRequest,
  LoginRequest,
  CreateOrganizationRequest,
  AuthenticatedUserContext,
  UserDTO,
  OrganizationDTO,
  FarmDTO,
  FieldDTO,
  ZoneDTO,
  CropDTO,
  CropCycleDTO,
  DashboardMetricsDTO,
  CreateFarmRequest,
  UpdateFarmRequest,
  CreateFieldRequest,
  UpdateFieldRequest,
  CreateZoneRequest,
  UpdateZoneRequest,
  CreateCropCycleRequest,
} from '@dhara/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Includes HttpOnly session cookie
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const error = data.error || {};
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return data.data;
}

export const apiClient = {
  // Auth API
  register: (payload: RegisterRequest) =>
    fetchApi<UserDTO>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginRequest) =>
    fetchApi<UserDTO>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    fetchApi<{ message: string }>('/api/v1/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () => fetchApi<AuthenticatedUserContext>('/api/v1/auth/me'),

  // Organization API
  createOrganization: (payload: CreateOrganizationRequest) =>
    fetchApi<OrganizationDTO>('/api/v1/orgs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMyOrganizations: () => fetchApi<OrganizationDTO[]>('/api/v1/orgs/my-orgs'),

  // Farm API
  getFarms: (organizationId?: string) =>
    fetchApi<FarmDTO[]>(
      `/api/v1/farms${organizationId ? `?organizationId=${organizationId}` : ''}`,
    ),

  getFarmById: (farmId: string) => fetchApi<FarmDTO>(`/api/v1/farms/${farmId}`),

  createFarm: (payload: CreateFarmRequest) =>
    fetchApi<FarmDTO>('/api/v1/farms', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateFarm: (farmId: string, payload: UpdateFarmRequest) =>
    fetchApi<FarmDTO>(`/api/v1/farms/${farmId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  archiveFarm: (farmId: string) =>
    fetchApi<FarmDTO>(`/api/v1/farms/${farmId}`, {
      method: 'DELETE',
    }),

  // Field API
  getFieldsForFarm: (farmId: string) => fetchApi<FieldDTO[]>(`/api/v1/fields/farm/${farmId}`),

  getFieldById: (fieldId: string) => fetchApi<FieldDTO>(`/api/v1/fields/${fieldId}`),

  createField: (farmId: string, payload: CreateFieldRequest) =>
    fetchApi<FieldDTO>(`/api/v1/fields/farm/${farmId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateField: (fieldId: string, payload: UpdateFieldRequest) =>
    fetchApi<FieldDTO>(`/api/v1/fields/${fieldId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  archiveField: (fieldId: string) =>
    fetchApi<FieldDTO>(`/api/v1/fields/${fieldId}`, {
      method: 'DELETE',
    }),

  // Zone API
  getZonesForField: (fieldId: string) => fetchApi<ZoneDTO[]>(`/api/v1/zones/field/${fieldId}`),

  getZoneById: (zoneId: string) => fetchApi<ZoneDTO>(`/api/v1/zones/${zoneId}`),

  createZone: (fieldId: string, payload: CreateZoneRequest) =>
    fetchApi<ZoneDTO>(`/api/v1/zones/field/${fieldId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateZone: (zoneId: string, payload: UpdateZoneRequest) =>
    fetchApi<ZoneDTO>(`/api/v1/zones/${zoneId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  archiveZone: (zoneId: string) =>
    fetchApi<ZoneDTO>(`/api/v1/zones/${zoneId}`, {
      method: 'DELETE',
    }),

  // Crop API
  getCrops: () => fetchApi<CropDTO[]>('/api/v1/crops'),

  getCropCyclesForField: (fieldId: string) =>
    fetchApi<CropCycleDTO[]>(`/api/v1/crops/field/${fieldId}/cycles`),

  createCropCycle: (fieldId: string, payload: CreateCropCycleRequest) =>
    fetchApi<CropCycleDTO>(`/api/v1/crops/field/${fieldId}/cycles`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Dashboard Metrics API
  getDashboardMetrics: (organizationId?: string) =>
    fetchApi<DashboardMetricsDTO>(
      `/api/v1/dashboard/metrics${organizationId ? `?organizationId=${organizationId}` : ''}`,
    ),

  // Health check
  getHealth: () =>
    fetchApi<{ success: boolean; service: string; status: 'healthy' | 'degraded' | 'unhealthy' }>(
      '/api/health',
    ),
};

export const healthApi = {
  checkHealth: () => apiClient.getHealth(),
};
