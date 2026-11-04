const { Router } = require("express");
const yarnsController = require("../controllers/yarnsController");
const yarnsRouter = Router();

yarnsRouter.get("/", yarnsController.getYarns);
yarnsRouter.get("/search", yarnsController.searchYarns);
yarnsRouter.post("/add", yarnsController.addYarn);
yarnsRouter.post("/delete", yarnsController.deleteYarn);
yarnsRouter.post("/update", yarnsController.updateYarn);

module.exports = yarnsRouter;