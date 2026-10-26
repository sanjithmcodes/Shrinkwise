const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const lossEventsController = require("../controllers/lossEvents");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.post("/createLossEvent", ensureAuth, upload.single("file"), lossEventsController.createLossEvent);

router.delete("/deleteLossEvent/:id", ensureAuth, lossEventsController.deleteLossEvent);

module.exports = router;