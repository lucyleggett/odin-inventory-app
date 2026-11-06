const { Router } = require("express");
const yarnsController = require("../controllers/yarnsController");
const yarnsRouter = Router();

yarnsRouter.get("/", yarnsController.getYarns);
yarnsRouter.get("/search", yarnsController.searchYarns);
yarnsRouter.get("/add", yarnsController.getAddYarn);
yarnsRouter.post("/add", yarnsController.addYarn);
yarnsRouter.post("/:id/delete", yarnsController.deleteYarn);
yarnsRouter.get("/:id/edit", yarnsController.getEditYarn);
yarnsRouter.post("/:id/edit", yarnsController.editYarn);

module.exports = yarnsRouter;