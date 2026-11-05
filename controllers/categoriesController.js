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

const ranges = {
  ply: {
    label: "Ply",
    rule: (c, label) =>
      c.isInt({ min: 0 }).withMessage(`${label} ${errMsgs.intErr}`),
  },
  needle: {
    label: "Needle size",
    rule: (c, label) =>
      c
        .matches(/^\d+(\.\d{1,2})?$/)
        .withMessage(`${label} ${errMsgs.floatErr}`),
  },
  hook: {
    label: "Hook size",
    rule: (c, label) =>
      c
        .matches(/^\d+(\.\d{1,2})?$/)
        .withMessage(`${label} ${errMsgs.floatErr}`),
  },
  gauge: {
    label: "Gauge",
    rule: (c, label) =>
      c.isInt({ min: 0 }).withMessage(`${label} ${errMsgs.intErr}`),
  },
};

const rangeValidators = Object.entries(ranges).flatMap(
  ([base, { label, rule }]) => {
    const lowerChain = body(`${base}_lower`)
      .optional({ values: "falsy" })
      .trim();
    const upperChain = body(`${base}_upper`)
      .optional({ values: "falsy" })
      .trim();

    const isBlank = (v) => v == null || String(v).trim() === "";

    return [
      rule(lowerChain, label),
      rule(upperChain, label)
        .bail()
        .custom((value, { req }) => {
          const lowerRaw = req.body[`${base}_lower`];

          if (isBlank(lowerRaw)) {
            throw new Error(`${label} ${errMsgs.missingLowerBoundErr}`);
          }

          const lower = Number(lowerRaw);
          if (Number.isNaN(lower)) return true;

          if (Number(value) < lower) {
            throw new Error(`${label} upper bound ${errMsgs.upperBoundErr}`);
          }
          return true;
        }),
    ];
  },
);

const validateCategory = [
  body("weight")
    .trim()
    .isAlpha("en-US", { ignore: " " })
    .withMessage(`Weight ${errMsgs.alphaErr}`),
  body("alt_names")
    .optional({ values: "falsy" })
    .trim()
    .customSanitizer((v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ...rangeValidators,
];

exports.editCategory = [
  validateId,
  ...validateCategory,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("editCategory", {
        errors: errors.array(),
        category: { ...req.body, id: req.params.id },
      });
    }

    const { id, ...raw } = matchedData(req, { includeOptionals: true });
    const data = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, v === "" ? null : v]),
    );

    console.log(data);

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
