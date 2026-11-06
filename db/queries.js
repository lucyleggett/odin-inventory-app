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
  const materials = removeCommas(data.materials || "");

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
  const newId = await pool.query(
    `INSERT INTO categories (weight, alt_names, 
    ply_lower, ply_upper, needle_lower, needle_upper, 
    hook_lower, hook_upper, gauge_lower, gauge_upper)
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

  return newId;
}

module.exports = {
  getAllYarns,
  getYarn,
  editYarn,
  deleteYarn,
  getAllCategories,
  getCategory,
  editCategory,
  addCategory,
};
