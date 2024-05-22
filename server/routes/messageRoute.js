const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const { sendMessage, getMessage } = require("../controllers/messageController");
const router = express.Router();

router.post("/send/:id", requireAuth, sendMessage);
router.get("/:id", requireAuth, getMessage);

module.exports = router;
