const { param } = require("express-validator");

const validateId = param("id").isInt({ min: 1 }).toInt();

const errMsgs = {
  alphaErr: "must only contain letters.",
  alphaNumericErr: "must only contain letters and numbers.",
  numericErr: "must only contain numbers.",
  integerErr: "must be a whole number.",
  decimalErr: "must be in the format x.xx",
  intErr: "must be a whole number greater than zero.",
  floatErr: "must be a positive number with up to 2 decimal places.",
  upperBoundErr: "must be a number greater than its lower bound.",
  missingLowerBoundErr: "range must have a lower bound."
};

module.exports = { validateId, errMsgs };
