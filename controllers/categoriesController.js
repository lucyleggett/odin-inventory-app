const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");

exports.getCategories = async (req, res) => {
  const categories = await db.getAllCategories();
  res.render("getCategories", { categories });
};

exports.searchCategories = async (req, res) => {};

exports.addCategory = async (req, res) => {};

exports.editCategory = async (req, res) => {};

exports.deleteCategory = async (req, res) => {};
