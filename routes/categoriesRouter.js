const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");
const categoriesRouter = Router();
const { confirmPassword } = require("../utils/validationUtils");

categoriesRouter.get("/", categoriesController.getCategories);
categoriesRouter.get("/add", categoriesController.getAddCategory);
categoriesRouter.post("/add", categoriesController.addCategory);
categoriesRouter.post(
  "/:id/delete",
  confirmPassword,
  categoriesController.deleteCategory,
);
categoriesRouter.get("/:id/edit", categoriesController.getEditCategory);
categoriesRouter.post(
  "/:id/edit",
  confirmPassword,
  categoriesController.editCategory,
);

module.exports = categoriesRouter;
