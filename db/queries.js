const pool = require("./pool");

//YARNS table
async function getAllYarns() {
  const { rows } = await pool.query(
    `SELECT y.*, c.weight
    FROM yarns y JOIN categories c ON c.id = y.weight_id
    ORDER BY y.name, y.quantity;`,
  );
  return rows;
}

async function getYarn(id) {
  const { rows } = await pool.query(
    `SELECT y.*, c.weight
     FROM yarns y
     JOIN categories c ON c.id = y.weight_id
     WHERE y.id = $1`,
    [id],
  );
  return rows[0];
}

async function editYarn(id, data) {
  const materials = data.materials
    ? data.materials
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  const { rowCount } = await pool.query(
    `UPDATE yarns
    SET 
    weight_id = (SELECT id FROM categories WHERE weight = $1),
    name = $2, brand = $3, color = $4, dye_lot = $5, shade_code = $6,
    quantity = $7, materials = $8, net_weight = $9, 
    length_meters = $10, rec_needle = $11, rec_hook = $12
    WHERE id=$13`,
    [
      data.weight,
      data.name,
      data.brand,
      data.color,
      data.dye_lot || null,
      data.shade_code || null,
      data.quantity,
      materials,
      data.net_weight || null,
      data.length_meters || null,
      data.rec_needle || null,
      data.rec_hook || null,
      id,
    ],
  );

  return rowCount;
}

async function deleteYarn(id) {
  const { rowCount } = await pool.query("DELETE FROM yarns WHERE id = $1", [
    id,
  ]);
  return rowCount;
}

async function addYarn(data) {
  const materials = data.materials
    ? data.materials
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  const { rows } = await pool.query(
    `INSERT INTO yarns (
       weight_id, name, brand, color, dye_lot, shade_code, quantity,
       materials, net_weight, length_meters, rec_needle, rec_hook
     )
     SELECT
       id, $2, $3, $4, $5, $6, COALESCE($7, 1), $8, $9, $10, $11, $12
     FROM categories
     WHERE LOWER(weight) = LOWER($1)
     RETURNING id`,
    [
      data.weight,
      data.name,
      data.brand || null,
      data.color || null,
      data.dye_lot || null,
      data.shade_code || null,
      data.quantity ?? null,
      materials,
      data.net_weight ?? null,
      data.length_meters ?? null,
      data.rec_needle ?? null,
      data.rec_hook ?? null,
    ],
  );

  if (rows.length === 0) {
    const err = new Error(`No category found for weight "${data.weight}"`);
    err.code = "NO_CATEGORY";
    throw err;
  }

  return rows[0].id;
}

//CATEGORIES table
async function getAllCategories() {
  const { rows } = await pool.query(`
    SELECT id, weight, alt_names,
       ply_lower, ply_upper, needle_lower, needle_upper,
       hook_lower, hook_upper, gauge_lower, gauge_upper
    FROM categories
    ORDER BY ply_lower;`);
  return rows;
}

async function getCategory(id) {
  const { rows } = await pool.query(
    `SELECT id, weight, alt_names,
       ply_lower, ply_upper, needle_lower, needle_upper,
       hook_lower, hook_upper, gauge_lower, gauge_upper
    FROM categories
     WHERE id = $1`,
    [id],
  );
  return rows[0];
}

async function editCategory(id, data) {
  const { rowCount } = await pool.query(
    `UPDATE categories
    SET 
    weight = $1, alt_names = $2, ply_lower = $3,
    ply_upper = $4, needle_lower = $5, needle_upper = $6,
    hook_lower = $7, hook_upper = $8, gauge_lower = $9, 
    gauge_upper = $10

    WHERE id=$11`,
    [
      data.weight,
      data.alt_names,
      data.ply_lower,
      data.ply_upper,
      data.needle_lower,
      data.needle_upper,
      data.hook_lower,
      data.hook_upper,
      data.gauge_lower,
      data.gauge_upper,
      id,
    ],
  );

  return rowCount;
}

async function addCategory(data) {
  const { rows } = await pool.query(
    `INSERT INTO categories (
    weight, alt_names, ply_lower, ply_upper, needle_lower, 
    needle_upper, hook_lower, hook_upper, gauge_lower, 
    gauge_upper
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id`,
    [
      data.weight,
      data.alt_names,
      data.ply_lower,
      data.ply_upper,
      data.needle_lower,
      data.needle_upper,
      data.hook_lower,
      data.hook_upper,
      data.gauge_lower,
      data.gauge_upper,
    ],
  );

  return rows[0].id;
}

async function deleteCategory(id) {
  const { rowCount } = await pool.query(
    `DELETE FROM categories
        WHERE id = $1`,
    [id],
  );
  return rowCount;
}

module.exports = {
  getAllYarns,
  getYarn,
  editYarn,
  deleteYarn,
  addYarn,
  getAllCategories,
  getCategory,
  editCategory,
  addCategory,
  deleteCategory,
};
