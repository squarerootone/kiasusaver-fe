import { component$, useSignal, useTask$ } from "@builder.io/qwik";

export interface PackageTier {
  amount: number;
  interest_rate: number;
  note: string;
}

export interface Package {
  id: string;
  bank_id: string;
  bank_name: string;
  name: string;
  description: string;
  url: string;
  conditions: string;
  effective_from: string;
  effective_until: string | null;
  tiers: PackageTier[];
  status: "published" | "archived" | "draft";
}

export interface PackageListProps {
  packages: Package[];
}

export const PackageList = component$<PackageListProps>(({ packages }) => {
  const search = useSignal("");
  const bankFilter = useSignal("");
  const statusFilter = useSignal("");
  const asOfDate = useSignal("");

  // Filtered packages
  const filtered = useSignal<Package[]>(packages);

  useTask$(({ track }) => {
    track(() => search.value);
    track(() => bankFilter.value);
    track(() => statusFilter.value);
    track(() => asOfDate.value);
    filtered.value = packages.filter((pkg) => {
      // Fuzzy search by name/description
      const q = search.value.toLowerCase();
      const matchesSearch =
        !q ||
        pkg.name.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q);
      // Bank filter
      const matchesBank = !bankFilter.value || pkg.bank_name === bankFilter.value;
      // Status filter
      const matchesStatus = !statusFilter.value || pkg.status === statusFilter.value;
      // As of date filter
      const matchesDate =
        !asOfDate.value ||
        (pkg.effective_from <= asOfDate.value &&
          (!pkg.effective_until || asOfDate.value <= pkg.effective_until));
      return matchesSearch && matchesBank && matchesStatus && matchesDate;
    });
  });

  // Get unique banks for filter
  const banks = Array.from(new Set(packages.map((p) => p.bank_name)));

  return (
    <div class="package-list-container">
      <div class="filters">
        <input
          type="text"
          placeholder="Search by name or description"
          value={search.value}
          onInput$={(e) => (search.value = (e.target as HTMLInputElement).value)}
        />
        <select value={bankFilter.value} onChange$={(e) => (bankFilter.value = (e.target as HTMLSelectElement).value)}>
          <option value="">All Banks</option>
          {banks.map((b) => (
            <option value={b} key={b}>{b}</option>
          ))}
        </select>
        <select value={statusFilter.value} onChange$={(e) => (statusFilter.value = (e.target as HTMLSelectElement).value)}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
          <option value="draft">Draft</option>
        </select>
        <input
          type="date"
          value={asOfDate.value}
          onInput$={(e) => (asOfDate.value = (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="package-list">
        {filtered.value.length === 0 && <div class="no-results">No packages found.</div>}
        {filtered.value.map((pkg) => (
          <div class="package-card" key={pkg.id}>
            <div class="package-header">
              <span class="bank-name">{pkg.bank_name}</span>
              <a class="package-name" href={pkg.url} target="_blank" rel="noopener noreferrer">
                {pkg.name}
              </a>
              <span class={`status status-${pkg.status}`}>{pkg.status}</span>
            </div>
            <div class="package-desc">{pkg.description}</div>
            <div class="package-conditions">Conditions: {pkg.conditions}</div>
            <div class="package-dates">
              <span>Effective: {pkg.effective_from}</span>
              <span>
                {pkg.effective_until ? `Until: ${pkg.effective_until}` : "(Ongoing)"}
              </span>
            </div>
            <div class="package-tiers">
              <table>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Interest Rate</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.tiers.map((tier, i) => (
                    <tr key={i}>
                      <td>${tier.amount.toLocaleString()}</td>
                      <td>{(tier.interest_rate * 100).toFixed(2)}%</td>
                      <td>{tier.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .package-list-container { max-width: 900px; margin: 2rem auto; padding: 1rem; }
        .filters { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .filters input, .filters select { padding: 0.5rem; border-radius: 6px; border: 1px solid #ccc; }
        .package-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .package-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 1.5rem; }
        .package-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
        .bank-name { font-weight: bold; color: #2a5d9f; }
        .package-name { font-size: 1.2rem; font-weight: bold; color: #1a237e; text-decoration: none; }
        .package-name:hover { text-decoration: underline; }
        .status { padding: 0.2em 0.7em; border-radius: 8px; font-size: 0.9em; margin-left: auto; }
        .status-published { background: #e0f7fa; color: #00796b; }
        .status-archived { background: #fbe9e7; color: #d84315; }
        .status-draft { background: #fffde7; color: #fbc02d; }
        .package-desc { margin-bottom: 0.5rem; color: #333; }
        .package-conditions { font-size: 0.95em; color: #666; margin-bottom: 0.5rem; }
        .package-dates { font-size: 0.9em; color: #888; display: flex; gap: 1.5em; margin-bottom: 0.5rem; }
        .package-tiers table { width: 100%; border-collapse: collapse; }
        .package-tiers th, .package-tiers td { padding: 0.4em 0.7em; border-bottom: 1px solid #eee; text-align: left; }
        .package-tiers th { background: #f5f5f5; }
        .no-results { text-align: center; color: #888; margin: 2rem 0; }
      `}</style>
    </div>
  );
});
