const pool = require("./pool");

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  weight TEXT NOT NULL UNIQUE,
  alt_names TEXT[],
  ply_lower INT,
  ply_upper INT,
  needle_lower FLOAT,
  needle_upper FLOAT,
  hook_lower FLOAT,
  hook_upper FLOAT,
  gauge_lower INT,
  gauge_upper INT
);

INSERT INTO categories (weight, alt_names, ply_lower, ply_upper, needle_lower, needle_upper, hook_lower, hook_upper, gauge_lower, gauge_upper)
VALUES
  ('lace', ARRAY['thread', 'cobweb'], 1, 2, 1.5, 2.5, 2.25, 2.25, 33, 40),
  ('fingering', ARRAY['super fine', 'sock', 'baby'], 4, 4, 2.25, 3.25, 2.25, 3.5, 27, 32),
  ('sport', ARRAY['fine', 'baby'], 5, 5, 3.25, 3.75, 3.5, 4.5, 23, 26),
  ('double knit', ARRAY['light worsted', 'dk'], 8, 8, 3.75, 4.5, 4.5, 5.5, 21, 24),
  ('aran', ARRAY['afghan', 'worsted'], 10, 10, 4.5, 5.5, 5.5, 6.5, 16, 20),
  ('chunky', ARRAY['bulky', 'craft', 'rug'], 12, 14, 5.5, 8, 6.5, 9, 12, 15),
  ('roving', ARRAY['super bulky'], 16, 16, 8, 12.75, 9, 15, 7, 11),
  ('jumbo', ARRAY[]::text[], 20, NULL, 12.75, NULL, 15, NULL, 6, NULL)
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
((SELECT id FROM categories WHERE weight = 'double knit'), 'Special DK', 'Stylecraft', 'Powder Pink', 1843, NULL, 8, ARRAY['acrylic'], 100, 295, 4, 4),
((SELECT id FROM categories WHERE weight = 'double knit'), 'Karisma', 'Drops', 'Light Grey', 3, NULL, 6, ARRAY['wool'], 50, 100, 4, 3.5),
((SELECT id FROM categories WHERE weight = 'aran'), 'Nepal', 'Drops', 'Forest Green', 7240, 1203, 4, ARRAY['wool', 'alpaca'], 50, 75, 4.5, 4.5),
((SELECT id FROM categories WHERE weight = 'fingering'), 'Alpaca', 'Drops', 'Dark Brown', 5, NULL, 5, ARRAY['alpaca'], 50, 167, 3, 2.5),
((SELECT id FROM categories WHERE weight = 'double knit'), 'Felted Tweed DK', 'Rowan', 'Seaweed', 161, 5821, 3, ARRAY['wool', 'alpaca', 'viscose'], 50, 175, 3.75, 4),
((SELECT id FROM categories WHERE weight = 'chunky'), 'Big Value Chunky', 'King Cole', 'Mustard', 4172, NULL, 10, ARRAY['acrylic'], 100, 152, 6.5, 6),
((SELECT id FROM categories WHERE weight = 'chunky'), 'Wool-Ease Thick & Quick', 'Lion Brand', 'Fisherman', 99, NULL, 2, ARRAY['acrylic', 'wool'], 170, 77, 12.75, 9),
((SELECT id FROM categories WHERE weight = 'aran'), '220', 'Cascade', 'Heather Charcoal', 8400, 77231, 3, ARRAY['wool'], 100, 200, 4.5, 5.5),
((SELECT id FROM categories WHERE weight = 'double knit'), 'Cotton DK', 'Paintbox Yarns', 'Blush Pink', 418, NULL, 7, ARRAY['cotton'], 50, 125, 4, 3.5),
((SELECT id FROM categories WHERE weight = 'fingering'), 'Catona', 'Scheepjes', 'Sunflower', 208, NULL, 12, ARRAY['cotton'], 50, 125, 2.5, 2.5),
((SELECT id FROM categories WHERE weight = 'aran'), 'Special Aran', 'Stylecraft', 'Lipstick', 1246, NULL, 5, ARRAY['acrylic'], 100, 196, 5, 5.5)
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
