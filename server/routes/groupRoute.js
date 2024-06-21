const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const {
  createGroupChat,
  getGroupChats,
  groupInfo,
  updateGroupProfile,
  addUsers,
  removeUser,
  makeAdmin,
  leaveGroup,
} = require("../controllers/groupController");
const router = express.Router();

router.post("/create", requireAuth, createGroupChat);
router.put("/updateGroupProfile", requireAuth, updateGroupProfile);
router.get("/get", requireAuth, getGroupChats);
router.get("/groupInfo/:id", requireAuth, groupInfo);
router.put("/addUsers", requireAuth, addUsers);
router.put("/removeUser", requireAuth, removeUser);
router.put("/makeAdmin", requireAuth, makeAdmin);
router.put("/leaveGroup", requireAuth, leaveGroup);

module.exports = router;
