const express = require("express");
const {
  updateProfile,
  addFriend,
  blockFriend,
  removeBlockedFriend,
} = require("../controllers/userController");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.post("/update", requireAuth, updateProfile);
router.post("/addFriend", addFriend);
router.post("/blockFriend", blockFriend);
router.post("/removeBlockedFriend", removeBlockedFriend);

module.exports = router;
