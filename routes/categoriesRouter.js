const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");
const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getCategories);
categoriesRouter.get("/search", categoriesController.searchCategories);
categoriesRouter.post("/add", categoriesController.addCategory);
categoriesRouter.post("/delete", categoriesController.deleteCategory);
categoriesRouter.post("/update", categoriesController.updateCategory);

module.exports = categoriesRouter;
