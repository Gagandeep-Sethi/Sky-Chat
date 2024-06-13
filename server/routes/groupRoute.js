const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const {
  createGroupChat,
  updateGroup,
  getGroupChats,
} = require("../controllers/groupController");
const router = express.Router();

router.post("/create", requireAuth, createGroupChat);
router.put("/update", requireAuth, updateGroup);
router.get("/get", requireAuth, getGroupChats);

module.exports = router;
