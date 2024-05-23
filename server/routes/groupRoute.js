const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const {
  createGroupChat,
  updateGroup,
} = require("../controllers/groupController");
const router = express.Router();

router.post("/create", requireAuth, createGroupChat);
router.put("/update", requireAuth, updateGroup);

module.exports = router;
