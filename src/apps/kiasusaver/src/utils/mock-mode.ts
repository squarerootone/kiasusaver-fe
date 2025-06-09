
/**
 * Returns the mock scenario string if mock mode is enabled for this request.
 * Checks for env var (USE_MOCK_<SCENARIO>) or x-mock header.
 * Usage: const scenario = getMockScenario(platform, request, 'PACKAGES');
 */
export function getMockScenario(
  platform: any,
  request: Request,
  envKey: string
): string | undefined {
  // Env var: USE_MOCK_PACKAGES, USE_MOCK_USERS, etc.
  const envVar = `USE_MOCK_${envKey}`;
  // const envMock = (platform.env?.[envVar] ?? process.env[envVar]) as string | undefined;
  const envMock = 'default'
  const headerMock = request.headers.get('x-mock');
  return envMock || headerMock || undefined;
}
