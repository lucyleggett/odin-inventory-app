const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");
const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getCategories);
categoriesRouter.get("/search", categoriesController.searchCategories);
categoriesRouter.get("/add", categoriesController.getAddCategory);
categoriesRouter.post("/add", categoriesController.addCategory);
categoriesRouter.post("/:id/delete", categoriesController.deleteCategory);
categoriesRouter.get("/:id/edit", categoriesController.getEditCategory);
categoriesRouter.post("/:id/edit", categoriesController.editCategory);

module.exports = categoriesRouter;
