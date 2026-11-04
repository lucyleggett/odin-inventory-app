const pool = require("./pool");

//YARNS table
async function getAllYarns() {
  const { rows } = await pool.query(
    `SELECT y.*, c.weight
    FROM yarns y JOIN categories c ON c.id = y.weight_id
    ORDER BY y.brand, y.name;`,
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
  const materials = (data.materials || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

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

//CATEGORIES table
async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

module.exports = {
  getAllYarns,
  getYarn,
  editYarn,
  getAllCategories,
};
