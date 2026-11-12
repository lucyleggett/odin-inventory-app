const { param } = require("express-validator");
const crypto = require("crypto");

const validateId = param("id").isInt({ min: 1 }).toInt();

const errMsgs = {
  alphaErr: "must only contain letters",
  alphaNumericErr: "must only contain letters and numbers",
  numericErr: "must only contain numbers",
  integerErr: "must be a whole number",
  decimalErr: "must be in the format x.xx",
  intErr: "must be a whole number greater than zero",
  floatErr: "must be a positive number with up to 2 decimal places",
  upperBoundErr: "must be a number greater than its lower bound",
  missingLowerBoundErr: "range must have a lower bound",
};

const hash = (s) => crypto.createHash("sha256").update(String(s)).digest();

confirmPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res
      .status(400)
      .json({ message: "Password confirmation is required." });
  }

  if (
    !crypto.timingSafeEqual(hash(password), hash(process.env.ADMIN_PASSWORD))
  ) {
    return res
      .status(401)
      .json({ message: "Incorrect password. Please try again." });
  }
  next();
};

module.exports = { validateId, errMsgs, confirmPassword };
