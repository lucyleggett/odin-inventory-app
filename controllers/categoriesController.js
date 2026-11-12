const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");
const { validateId, errMsgs } = require("../utils/validationUtils");

exports.getCategories = async (req, res) => {
  const q = (req.query.q || "").trim();
  const categories = q
    ? await db.searchCategories(q)
    : await db.getAllCategories();
  res.render("getCategories", {
    categories,
    q,
    messageTitle: "",
    message: "",
    action: "/categories",
  });
};

exports.getEditCategory = async (req, res) => {
  const category = await db.getCategory(req.params.id);
  if (!category) return res.status(404).send("Category not found");
  res.render("addEditCategory", {
    title: "Edit category",
    errors: [],
    category,
    action: `/categories/${req.params.id}/edit`,
    submitLabel: "Save changes",
  });
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
      const { password, ...fields } = req.body;
      return res.status(400).render("addEditCategory", {
        title: "Edit category",
        errors: errors.array(),
        category: { ...fields, id: req.params.id },
        action: `/categories/${req.params.id}/edit`,
        submitLabel: "Save changes",
      });
    }

    const { id, ...raw } = matchedData(req, { includeOptionals: true });
    const data = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, v === "" ? null : v]),
    );

    const rowCount = await db.editCategory(id, data);
    if (rowCount === 0) {
      return res.status(404).send("Category not found.");
    }
    const categories = await db.getAllCategories();
    res.render("/categories", {
      categories,
      q: "",
      messageTitle: "Yay!",
      message: "Category updated successfully.",
      action: "/categories",
    });
  },
];

exports.getAddCategory = async (req, res) => {
  res.render("addEditCategory", {
    title: "Add category",
    errors: [],
    category: {},
    action: "/categories/add",
    submitLabel: "Add category",
  });
};

exports.addCategory = [
  validateCategory,
  async (req, res) => {
    try {
      const render = (status, errors) =>
        res.status(status).render("addEditCategory", {
          title: "Add category",
          errors,
          category: { ...req.body },
          action: "/categories/add",
          submitLabel: "Add category",
        });

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return render(400, errors.array());
      }

      const raw = matchedData(req, { includeOptionals: true });
      const data = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [
          k,
          v == null || v === "" ? null : v,
        ]),
      );

      console.log(data);

      try {
        await db.addCategory(data);
        return res.redirect("/categories");
      } catch (err) {
        if (err.code === "23505") {
          return render(400, [
            { msg: "A category with that weight already exists." },
          ]);
        }
        console.error(err);
        return render(500, [
          {
            msg: "Something went wrong while adding the category. Please try again.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send(
          "Something went wrong while adding the category. Please try again.",
        );
    }
  },
];

const DELETE_ERRORS = {
  23001: {
    status: 409,
    message:
      "This category is still being used by one or more yarns. Please reassign or delete them first.",
  },
  23503: {
    status: 409,
    message:
      "This category is still being used by one or more yarns. Please reassign or delete them first.",
  },
  "22P02": {
    status: 400,
    message: "Category id isn't valid.",
  },
};

async function renderList(res, status, message) {
  const categories = await db.getAllCategories();
  res.status(status).render("getCategories", {
    categories,
    q: "",
    messageTitle: "Oops!",
    message,
    action: "/categories",
  });
}

exports.deleteCategory = [
  validateId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return renderList(res, 400, errors.array()[0].msg);
    }

    const { id } = matchedData(req);

    try {
      const rowCount = await db.deleteCategory(id);
      if (rowCount === 0) {
        return renderList(
          res,
          404,
          "Category not found. It may have already been deleted.",
        );
      }
      const categories = await db.getAllCategories();
      res.render("getCategories", {
        categories,
        q: "",
        messageTitle: "Yay!",
        message: "Category deleted successfully.",
        action: "/categories",
      });
    } catch (err) {
      const known = DELETE_ERRORS[err.code];
      if (known) return renderList(res, known.status, known.message);
      throw err;
    }
  },
];
