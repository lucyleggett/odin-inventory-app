const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");
const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getCategories);
categoriesRouter.get("/search", categoriesController.searchCategories);
categoriesRouter.post("/add", categoriesController.addCategory);
categoriesRouter.post("/:id/delete", categoriesController.deleteCategory);
categoriesRouter.post("/:id/edit", categoriesController.editCategory);

module.exports = categoriesRouter;
