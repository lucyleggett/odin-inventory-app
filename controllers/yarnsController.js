const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");
const { validateId, errMsgs } = require("../utils/validationUtils");

const validateYarn = [
  body("weight")
    .trim()
    .isAlpha("en-US", { ignore: " " })
    .withMessage(`Weight ${errMsgs.alphaErr}`),
  body("name")
    .trim()
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage(`Name ${errMsgs.alphaNumericErr}`),
  body("brand")
    .trim()
    .optional({ values: "falsy" })
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage(`Brand ${errMsgs.alphaNumericErr}`),
  body("color")
    .trim()
    .optional({ values: "falsy" })
    .isAlpha("en-US", { ignore: " " })
    .withMessage(`Color ${errMsgs.alphaErr}`),
  body("shade_code")
    .trim()
    .optional({ values: "falsy" })
    .isNumeric()
    .withMessage(`Shade code ${errMsgs.numericErr}`),
  body("dye_lot").trim().optional({ values: "falsy" }),
  body("quantity")
    .trim()
    .optional({ values: "falsy" })
    .isInt()
    .withMessage(`Quantity ${errMsgs.integerErr}`),
  body("materials").trim().optional({ values: "falsy" }),
  body("net_weight")
    .trim()
    .optional({ values: "falsy" })
    .isInt()
    .withMessage(`Net weight ${errMsgs.integerErr}`),
  body("length_meters")
    .trim()
    .optional({ values: "falsy" })
    .isInt()
    .withMessage(`Length ${errMsgs.integerErr}`),
  body("rec_needle")
    .trim()
    .optional({ values: "falsy" })
    .isDecimal()
    .withMessage(`Needle size ${errMsgs.decimalErr}`),
  body("rec_hook")
    .trim()
    .optional({ values: "falsy" })
    .isDecimal()
    .withMessage(`Hook size ${errMsgs.decimalErr}`),
];

exports.getYarns = async (req, res) => {
  const yarns = await db.getAllYarns();
  res.render("getYarns", { yarns });
};

exports.getAddYarn = async (req, res) => {
  const categories = await db.getAllCategories();

  res.render("addEditYarn", {
    title: "Add yarn",
    errors: [],
    yarn: {},
    categories,
    action: "/yarns/add",
    submitLabel: "Add yarn",
  });
};

exports.addYarn = [
  validateYarn,
  async (req, res) => {
    try {
      const categories = await db.getAllCategories();

      const render = (status, errors) =>
        res.status(status).render("addEditYarn", {
          title: "Add yarn",
          errors,
          yarn: { ...req.body },
          categories,
          action: "/yarns/add",
          submitLabel: "Add yarn",
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

      try {
        await db.addYarn(data);
        return res.redirect("/yarns");
      } catch (err) {
        if (err.code === "NO_CATEGORY") {
          return render(400, [
            { msg: "That yarn weight doesn't exist. Choose an existing one." },
          ]);
        }
        throw err;
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send("Something went wrong while adding the yarn. Please try again.");
    }
  },
];

exports.searchYarns = async (req, res) => {};

exports.getEditYarn = async (req, res) => {
  const yarn = await db.getYarn(req.params.id);
  if (!yarn) return res.status(404).send("Yarn not found");
  const categories = await db.getAllCategories();
  res.render("addEditYarn", {
    title: "Edit yarn",
    errors: [],
    yarn,
    categories,
    action: `/yarns/${req.params.id}/edit`,
    submitLabel: "Save changes",
  });
};

exports.editYarn = [
  validateId,
  ...validateYarn,
  async (req, res) => {
    const { id, ...data } = matchedData(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await db.getAllCategories();
      return res.status(400).render("addEditYarn", {
        title: "Edit yarn",
        errors: errors.array(),
        yarn: { ...req.body, id },
        categories,
        action: `/yarns/${req.params.id}/edit`,
        submitLabel: "Save changes",
      });
    }

    const rowCount = await db.editYarn(id, data);
    if (rowCount === 0) {
      return res.status(404).send("Yarn not found.");
    }
    res.redirect("/yarns");
  },
];

exports.deleteYarn = async (req, res) => {
  const rowCount = await db.deleteYarn(req.params.id);
  if (rowCount === 0) return res.status(404).send("Yarn not found");
  res.redirect("/yarns");
};
