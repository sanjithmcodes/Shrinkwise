const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const lossEventsController = require("../controllers/lossEvents");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, lossEventsController.getLossEvent);

router.post("/createLossEvent", upload.single("file"), lossEventsController.createLossEvent);

router.put("/favouriteLossEvent", lossEventsController.favouriteLossEvent);

router.delete("/deleteLossEvent/:id", lossEventsController.deleteLossEvent);

module.exports = router;