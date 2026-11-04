const { param } = require("express-validator");

const validateId = param("id").isInt({ min: 1 }).toInt();

const errMsgs = {
  alphaErr: "must only contain letters.",
  alphaNumericErr: "must only contain letters and numbers.",
  numericErr: "must only contain numbers.",
  integerErr: "must be a whole number.",
  decimalErr: "must be in the format x.xx",
  intRangeErr: "must be in the format 'x - x' or 'xx - xx' (e.g., 10 - 20)",
  numRangeErr: "must be in the format 'xx.xx - xx.xx' (e.g., 2.25 - 3.5)",
};

module.exports = { validateId, errMsgs };
