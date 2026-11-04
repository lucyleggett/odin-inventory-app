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

//CATEGORIES table
async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

module.exports = {
  getAllYarns,
  getAllCategories,
};
