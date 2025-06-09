import type { Package } from "../components/PackageList";

export const mockPackages: Record<string, Package[]> = {
  default: [
    {
      id: "uob-one",
      bank_id: "uob",
      bank_name: "UOB",
      name: "UOB One",
      description: "Earn bonus interest when you credit salary, spend on card, and pay 3 bills.",
      url: "https://www.uob.com.sg/personal/save/uob-one-account.page",
      conditions: "salary,card,bill",
      effective_from: "2023-11-01",
      effective_until: "2025-06-30",
      tiers: [
        { amount: 15000, interest_rate: 0.015, note: "Base + bonus for first $15k if all conditions met" },
        { amount: 15000, interest_rate: 0.03, note: "Next $15k with conditions met" },
        { amount: 45000, interest_rate: 0.0385, note: "Next $45k with conditions met" },
      ],
      status: "published",
    },
    {
      id: "uob-stash",
      bank_id: "uob",
      bank_name: "UOB",
      name: "UOB Stash",
      description: "Earn higher interest by maintaining or increasing your balance.",
      url: "https://www.uob.com.sg/personal/save/stash-account.page",
      conditions: "no-conditions",
      effective_from: "2023-01-01",
      effective_until: null,
      tiers: [
        { amount: 10000, interest_rate: 0.01, note: "First $10k base interest" },
        { amount: 25000, interest_rate: 0.03, note: "Next $25k if balance maintained" },
        { amount: 15000, interest_rate: 0.005, note: "Next $15k, lower rate" },
      ],
      status: "published",
    },
  ],
  // Add more scenarios as needed, e.g. "error": [], "empty": [], etc.
};
