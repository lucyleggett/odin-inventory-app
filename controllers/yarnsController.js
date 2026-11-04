const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");

exports.getYarns = async (req, res) => {
  const yarns = await db.getAllYarns();
  res.render("yarns", { yarns });
};

exports.searchYarns = async (req, res) => {};

exports.addYarn = async (req, res) => {};

exports.updateYarn = async (req, res) => {};

exports.deleteYarn = async (req, res) => {};
