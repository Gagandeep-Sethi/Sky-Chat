const express = require("express");
const {
  updateProfile,
  addFriend,
  blockFriend,
  removeBlockedFriend,
  removeFriend,
  getFriendList,
  getBlockedList,
  search,
} = require("../controllers/userController");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.post("/update", requireAuth, updateProfile);
router.post("/addFriend/:id", requireAuth, addFriend);
router.post("/removeFriend/:id", requireAuth, removeFriend);
router.post("/blockFriend/:id", requireAuth, blockFriend);
router.post("/removeBlockedFriend/:id", requireAuth, removeBlockedFriend);
router.get("/getFriends", requireAuth, getFriendList);
router.get("/getBlocked", requireAuth, getBlockedList);
router.get("/search", requireAuth, search);

module.exports = router;
