const express = require("express");
const {
  signup,
  login,
  logout,
  changePassword,
} = require("../controllers/authController");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.put("/changePassword", requireAuth, changePassword);

module.exports = router;
