const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const { sendMessage, getChat } = require("../controllers/messageController");
const router = express.Router();

router.post("/send/:id", requireAuth, sendMessage);
router.post("/send", requireAuth, sendMessage);
router.get("/:id", requireAuth, getChat);

module.exports = router;
