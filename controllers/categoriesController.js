const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");
const { validateId, errMsgs } = require("../utils/validationUtils");

exports.getCategories = async (req, res) => {
  const categories = await db.getAllCategories();
  res.render("getCategories", { categories });
};

exports.getEditCategory = async (req, res) => {
  const category = await db.getCategory(req.params.id);
  if (!category) return res.status(404).send("Category not found");
  res.render("editCategory", { errors: [], category });
};

const validateCategory = [
  body("weight")
    .trim()
    .isAlpha("en-US", { ignore: " " })
    .withMessage(`Weight ${errMsgs.alphaErr}`),
  body("ply")
    .trim()
    .exists()
    .withMessage("Required field.")
    .matches(/^\d+\s*-\s*\d+$/)
    .withMessage(errMsgs.intRangeErr),
  body("needle_size")
    .trim()
    .matches(/^\d{1,2}(\.\d{1,2})?(\s*-\s*\d{1,2}(\.\d{1,2})?)?$/)
    .withMessage(errMsgs.numRangeErr),
  body("hook_size")
    .trim()
    .matches(/^\d{1,2}(\.\d{1,2})?(\s*-\s*\d{1,2}(\.\d{1,2})?)?$/)
    .withMessage(errMsgs.numRangeErr),
  body("gauge")
    .trim()
    .matches(/^\d+\s*-\s*\d+$/)
    .withMessage(errMsgs.intRangeErr),
];

exports.editCategory = [
  validateId,
  ...validateCategory,
  async (req, res) => {
    const { id, ...data } = matchedData(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("editCategory", {
        errors: errors.array(),
        category: { ...req.body, id },
      });
    }

    const rowCount = await db.editCategory(id, data);
    if (rowCount === 0) {
      return res.status(404).send("Yarn not found.");
    }
    res.redirect("/categories");
  },
];

exports.searchCategories = async (req, res) => {};

exports.addCategory = async (req, res) => {};

exports.deleteCategory = async (req, res) => {};
