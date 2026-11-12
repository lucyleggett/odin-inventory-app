const { Router } = require("express");
const yarnsController = require("../controllers/yarnsController");
const yarnsRouter = Router();
const { confirmPassword } = require("../utils/validationUtils");

yarnsRouter.get("/", yarnsController.getYarns);
yarnsRouter.get("/add", yarnsController.getAddYarn);
yarnsRouter.post("/add", yarnsController.addYarn);
yarnsRouter.post("/:id/delete", confirmPassword, yarnsController.deleteYarn);
yarnsRouter.get("/:id/edit", yarnsController.getEditYarn);
yarnsRouter.post("/:id/edit", confirmPassword, yarnsController.editYarn);

module.exports = yarnsRouter;
