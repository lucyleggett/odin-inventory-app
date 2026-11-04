const pool = require("./pool");

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  weight TEXT NOT NULL UNIQUE,
  alt_names TEXT[],
  ply INT4RANGE,
  needle_size NUMRANGE,
  hook_size NUMRANGE,
  gauge INT4RANGE
);

INSERT INTO categories (weight, alt_names, ply, needle_size, hook_size, gauge)
VALUES
  ('lace', ARRAY['thread', 'cobweb'], int4range(1, 2, '[]'), numrange(1.5, 2.5, '[]'), numrange(2.25, 2.25, '[]'), int4range(33, 40, '[]')),
  ('fingering', ARRAY['super fine', 'sock', 'baby'], int4range(4, 4, '[]'), numrange(2.25, 3.25, '[]'), numrange(2.25, 3.5, '[]'), int4range(27, 32, '[]')),
  ('sport', ARRAY['fine', 'baby'], int4range(5, 5, '[]'), numrange(3.25, 3.75, '[]'), numrange(3.5, 4.5, '[]'), int4range(23, 26, '[]')),
  ('double knit', ARRAY['light worsted', 'dk'], int4range(8, 8, '[]'), numrange(3.75, 4.5, '[]'), numrange(4.5, 5.5, '[]'), int4range(21, 24, '[]')),
  ('aran', ARRAY['afghan', 'worsted'], int4range(10, 10, '[]'), numrange(4.5, 5.5, '[]'), numrange(5.5, 6.5, '[]'), int4range(16, 20, '[]')),
  ('chunky', ARRAY['bulky', 'craft', 'rug'], int4range(12, 14, '[]'), numrange(5.5, 8, '[]'), numrange(6.5, 9, '[]'), int4range(12, 15, '[]')),
  ('roving', ARRAY['super bulky'], int4range(16, 16, '[]'), numrange(8, 12.75, '[]'), numrange(9, 15, '[]'), int4range(7, 11, '[]')),
  ('jumbo', ARRAY[]::text[], int4range(20, NULL, '[)'), numrange(12.75, NULL), numrange(15, NULL), int4range(6, NULL))
ON CONFLICT (weight) DO NOTHING;

CREATE TABLE IF NOT EXISTS yarns (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  weight_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  brand TEXT,
  color TEXT,
  shade_code INT,
  dye_lot INT,
  quantity INT NOT NULL DEFAULT 1,
  materials TEXT[],
  net_weight INT,
  length_meters INT,
  rec_needle DECIMAL(4, 2),
  rec_hook DECIMAL(4, 2)
);

INSERT INTO yarns (weight_id, name, brand, color, shade_code, dye_lot, quantity, materials, net_weight, length_meters, rec_needle, rec_hook)
VALUES
((SELECT id FROM categories WHERE weight = 'double knit'), 'Special DK', 'Stylecraft', 'Cornish Blue', 1841, NULL, 8, ARRAY['acrylic'], 100, 295, 4, 4),
((SELECT id FROM categories WHERE weight = 'double knit'), 'Special DK', 'Stylecraft', 'Powder Pink', 1843, NULL, 8, ARRAY['acrylic'], 100, 295, 4, 4)
ON CONFLICT DO NOTHING;
`;

async function seed() {
  const client = await pool.connect();
  try {
    await client.query(SQL);
    const { rows } = await client.query("SELECT version()");
    console.log("Seeded. Postgres:", rows[0].version);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
