const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const { sendMessage } = require("../controllers/messageController");
const router = express.Router();

router.post("/send/:id", requireAuth, sendMessage);

module.exports = router;
