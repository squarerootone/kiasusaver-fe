-- 002_seed.sql: Initial seed data

INSERT INTO banks (id, name) VALUES
  ('uob', 'UOB');

INSERT INTO packages (
  id, bank_id, name, description, url,
  conditions, effective_from, effective_until,
  tiers_json, status, created_by, updated_by
) VALUES (
  'uob-one',
  'uob',
  'UOB One',
  'Earn bonus interest when you credit salary, spend on card, and pay 3 bills.',
  'https://www.uob.com.sg/personal/save/uob-one-account.page',
  'salary,card,bill',
  '2023-11-01',
  NULL,
  '[
    { "amount": 15000, "interest_rate": 0.015, "note": "Base + bonus for first $15k if all conditions met" },
    { "amount": 15000, "interest_rate": 0.03, "note": "Next $15k with conditions met" },
    { "amount": 45000, "interest_rate": 0.0385, "note": "Next $45k with conditions met" }
  ]',
  'published',
  'system',
  'system'
);

INSERT INTO packages (
  id, bank_id, name, description, url,
  conditions, effective_from, effective_until,
  tiers_json, status, created_by, updated_by
) VALUES (
  'uob-stash',
  'uob',
  'UOB Stash',
  'Earn higher interest by maintaining or increasing your balance.',
  'https://www.uob.com.sg/personal/save/stash-account.page',
  'no-conditions',
  '2023-01-01',
  NULL,
  '[
    { "amount": 10000, "interest_rate": 0.01, "note": "First $10k base interest" },
    { "amount": 25000, "interest_rate": 0.03, "note": "Next $25k if balance maintained" },
    { "amount": 15000, "interest_rate": 0.005, "note": "Next $15k, lower rate" }
  ]',
  'published',
  'system',
  'system'
);

