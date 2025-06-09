import type { RequestHandler } from '@builder.io/qwik-city';
import type { PlatformCloudflarePages } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import { mockPackages } from '../../../mocks/packages.mock';
import { getMockScenario } from '../../../utils/mock-mode';

export const onGet: RequestHandler<PlatformCloudflarePages> = async ({ platform, request, json }) => {
  // Use reusable pattern for mock scenario
  const mockScenario = getMockScenario(platform, request, 'PACKAGES');
  if (mockScenario) {
    const data = mockPackages[mockScenario] || mockPackages.default;
    json(200, data);
    return;
  }

  const db = platform?.env?.DB;
  if (!db) {
    json(500, { error: 'Database not available' });
    return;
  }

  // Query all packages with bank name joined
  const sql = `
    SELECT 
      p.id, p.bank_id, b.name as bank_name, p.name, p.description, p.url, p.conditions, 
      p.effective_from, p.effective_until, p.tiers_json, p.status
    FROM packages p
    JOIN banks b ON p.bank_id = b.id
    WHERE p.status != 'archived'
    ORDER BY b.name, p.name
  `;
  try {
  const result = await db.prepare(sql).all();
  const rows = result.results || [];

  // Parse tiers_json for each package
  const packages = rows.map((row: any) => ({
    ...row,
    tiers: JSON.parse(row.tiers_json),
    effective_until: row.effective_until || null,
  }));

  json(200, packages);
  } catch {
    json(500, { error: 'Failed to fetch packages' });
  }

};
