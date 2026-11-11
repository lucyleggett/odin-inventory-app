const db = require("../db/queries");

exports.viewIndex = async (req, res) => {
  const categories = await db.getAllCategories();
  const yarns = await db.getAllYarns();

  res.render("index", { categories, yarns });
};
