import { farmService } from '../services/farm.service';
import { fieldService } from '../services/field.service';
import { zoneService } from '../services/zone.service';
import { cropService } from '../services/crop.service';
import { dashboardService } from '../services/dashboard.service';
import { authService } from '../services/auth.service';
import { organizationService } from '../services/organization.service';
import { Response } from 'express';

export async function runFarmHierarchyTests() {
  console.log('--- RUNNING PHASE 3 AGRICULTURAL HIERARCHY & SECURITY VERIFICATION SUITE ---');

  const mockRes = { cookie: () => {} } as unknown as Response;

  // Setup Org A & User A (Org Admin)
  const userA = await authService.register(
    {
      firstName: 'Farmer',
      lastName: 'Alice',
      email: `alice_${Date.now()}@farm-a.com`,
      password: 'Password123!',
    },
    mockRes,
  );
  const orgA = await organizationService.createOrganization(userA.user.id, {
    name: 'Farm A Org',
    slug: `org-a-${Date.now()}`,
  });

  // Setup Org B & User B
  const userB = await authService.register(
    {
      firstName: 'Farmer',
      lastName: 'Bob',
      email: `bob_${Date.now()}@farm-b.com`,
      password: 'Password123!',
    },
    mockRes,
  );
  const orgB = await organizationService.createOrganization(userB.user.id, {
    name: 'Farm B Org',
    slug: `org-b-${Date.now()}`,
  });

  // Test 1: Create Farm in Org A
  console.log('Test 1: Create Farm in Org A...');
  const farmA = await farmService.createFarm(orgA.id, userA.user.id, {
    organizationId: orgA.id,
    name: 'Green Field Valley',
    description: 'Primary organic wheat farm',
    locationName: 'Punjab Sector 4',
    latitude: 30.7333,
    longitude: 76.7794,
    area: 50,
    areaUnit: 'hectares',
  });
  if (!farmA.id || farmA.organizationId !== orgA.id) {
    throw new Error('Farm creation failed');
  }
  console.log('✓ Farm created cleanly. ID:', farmA.id);

  // Test 2: Create Field in Farm A
  console.log('Test 2: Create Field in Farm A...');
  const fieldA = await fieldService.createField(farmA.id, userA.user.id, orgA.id, {
    name: 'North Wheat Block',
    area: 10,
    areaUnit: 'hectares',
    soilType: 'Loam',
    latitude: 30.735,
    longitude: 76.78,
  });
  if (!fieldA.id || fieldA.farmId !== farmA.id) {
    throw new Error('Field creation failed');
  }
  console.log('✓ Field created cleanly under Farm A. ID:', fieldA.id);

  // Test 3: Zone Area Constraint Check (zone.area <= field.area)
  console.log('Test 3: Zone Area Constraint Check...');
  try {
    await zoneService.createZone(fieldA.id, userA.user.id, orgA.id, {
      name: 'Illegal Over-Sized Zone',
      area: 15, // Exceeds field area of 10
      irrigationType: 'DRIP',
    });
    throw new Error('SECURITY FAIL: Over-sized zone area was not rejected');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('SECURITY FAIL')) throw err;
    console.log('✓ Zone area exceeding field area correctly rejected:', errorMsg);
  }

  // Create valid zone
  const zoneA = await zoneService.createZone(fieldA.id, userA.user.id, orgA.id, {
    name: 'Drip Zone 1',
    area: 5, // Valid <= 10
    irrigationType: 'DRIP',
  });
  console.log('✓ Valid Zone created cleanly. ID:', zoneA.id);

  // Test 4: Crop Cycle Creation
  console.log('Test 4: Crop Cycle Creation...');
  const crops = await cropService.getAllCrops();
  if (crops.length === 0) throw new Error('Crop catalog empty');

  const cycleA = await cropService.createCropCycle(fieldA.id, userA.user.id, orgA.id, {
    cropId: crops[0].id,
    zoneId: zoneA.id,
    seasonName: 'Rabi 2026',
    growthStage: 'VEGETATIVE',
  });
  if (!cycleA.id) throw new Error('CropCycle creation failed');
  console.log('✓ CropCycle created cleanly. Crop:', cycleA.cropName);

  // Test 5: Multi-Tenant Organization Isolation (User B trying to access Org A Farm)
  console.log('Test 5: Multi-Tenant Isolation Verification...');
  try {
    await farmService.getFarmById(farmA.id);
    await fieldService.getFieldsForFarm(farmA.id, orgB.id); // User B org context
    throw new Error('SECURITY FAIL: Cross-tenant access was allowed!');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('SECURITY FAIL')) throw err;
    console.log('✓ Cross-tenant access correctly blocked:', errorMsg);
  }

  // Test 6: Dashboard Metrics Calculation from Real DB Records
  console.log('Test 6: Real DB Dashboard Metrics Calculation...');
  const metrics = await dashboardService.getMetrics(orgA.id);
  if (
    metrics.totalFarms !== 1 ||
    metrics.totalFields !== 1 ||
    metrics.totalZones !== 1 ||
    metrics.activeCropCycles !== 1
  ) {
    throw new Error(`Metrics calculation mismatch: ${JSON.stringify(metrics)}`);
  }
  console.log('✓ Dashboard metrics accurately aggregated from DB:', metrics);

  // Test 7: Soft-Delete Archive Strategy
  console.log('Test 7: Archive Strategy Verification...');
  const archivedFarm = await farmService.archiveFarm(farmA.id, userA.user.id, orgA.id);
  if (archivedFarm.status !== 'ARCHIVED') {
    throw new Error('Archive strategy failed to set ARCHIVED status');
  }
  console.log('✓ Farm non-destructive archiving verified.');

  console.log('--- ALL PHASE 3 AGRICULTURAL HIERARCHY TESTS PASSED CLEANLY ---');
}

runFarmHierarchyTests().catch((err) => {
  console.error('Phase 3 Test Suite Failed:', err);
  process.exit(1);
});
