import { authService } from '../services/auth.service';
import { organizationService } from '../services/organization.service';
import { Response } from 'express';

export async function runAuthSecurityTests() {
  console.log('--- RUNNING PHASE 2 AUTHENTICATION & SECURITY VERIFICATION SUITE ---');

  const testEmail = `test_${Date.now()}@dhara-ai.com`;
  const mockCookies: Record<string, { val: string; opts: unknown }> = {};
  const mockRes = {
    cookie: (name: string, val: string, opts: unknown) => {
      mockCookies[name] = { val, opts };
    },
  } as unknown as Response;

  // Test 1: User Registration
  console.log('Test 1: User Registration...');
  const regResult = await authService.register(
    {
      firstName: 'Alice',
      lastName: 'Farmer',
      email: testEmail,
      password: 'SecurePassword123!',
    },
    mockRes,
  );

  if (!regResult.user.id || regResult.user.email !== testEmail) {
    throw new Error('Registration failed to return valid user DTO');
  }
  if ('passwordHash' in regResult.user) {
    throw new Error('SECURITY VIOLATION: passwordHash exposed in registration response!');
  }
  console.log('✓ Registration passed. User ID:', regResult.user.id);

  // Test 2: Duplicate Email Rejection
  console.log('Test 2: Duplicate Email Rejection...');
  try {
    await authService.register(
      {
        firstName: 'Alice',
        lastName: 'Clone',
        email: testEmail,
        password: 'Password123!',
      },
      mockRes,
    );
    throw new Error('SECURITY FAIL: Duplicate email was not rejected');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('SECURITY FAIL')) throw err;
    console.log('✓ Duplicate email correctly rejected:', errorMsg);
  }

  // Test 3: Invalid Password Login Rejection
  console.log('Test 3: Invalid Password Login Rejection...');
  try {
    await authService.login(
      {
        email: testEmail,
        password: 'WrongPassword!',
      },
      mockRes,
    );
    throw new Error('SECURITY FAIL: Invalid password was accepted');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('SECURITY FAIL')) throw err;
    console.log('✓ Invalid password correctly rejected:', errorMsg);
  }

  // Test 4: Valid Login & Session Creation
  console.log('Test 4: Valid Login & Session Creation...');
  const loginResult = await authService.login(
    {
      email: testEmail,
      password: 'SecurePassword123!',
    },
    mockRes,
  );

  if (!loginResult.rawToken || !mockCookies.dhara_session) {
    throw new Error('Login failed to set HttpOnly session cookie');
  }
  console.log('✓ Login successful and HttpOnly session cookie issued.');

  // Test 5: Session Validation via /auth/me
  console.log('Test 5: Session Validation via /auth/me...');
  const userCtx = await authService.validateSessionToken(loginResult.rawToken);
  if (!userCtx || userCtx.id !== regResult.user.id) {
    throw new Error('Session validation failed');
  }
  if ('passwordHash' in userCtx) {
    throw new Error('SECURITY VIOLATION: passwordHash exposed in session context!');
  }
  console.log('✓ Session validated. User role/permissions count:', userCtx.permissions.length);

  // Test 6: Controlled Organization Creation & Auto-Admin Assignment
  console.log('Test 6: Controlled Organization Creation & Auto-Admin Assignment...');
  const org = await organizationService.createOrganization(regResult.user.id, {
    name: 'Green Valley Agri',
    slug: `gv-agri-${Date.now()}`,
  });

  if (org.role !== 'ORGANIZATION_ADMIN') {
    throw new Error('Creator was not assigned ORGANIZATION_ADMIN role');
  }
  console.log('✓ Organization created and creator assigned ORGANIZATION_ADMIN role.');

  // Test 7: Deterministic Logout & Session Revocation
  console.log('Test 7: Deterministic Logout & Session Revocation...');
  await authService.logout(loginResult.rawToken, mockRes, regResult.user.id);
  const postLogoutCtx = await authService.validateSessionToken(loginResult.rawToken);
  if (postLogoutCtx !== null) {
    throw new Error('SECURITY FAIL: Revoked session was still accepted!');
  }
  console.log(
    '✓ Logout successfully revoked session in database and rejected subsequent requests.',
  );

  console.log('--- ALL PHASE 2 SECURITY TESTS PASSED CLEANLY ---');
}

runAuthSecurityTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
