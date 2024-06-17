const express = require("express");
const {
  signup,
  login,
  logout,
  changePassword,
  forgotPassword,
  verifyEmail,
  resetPassword,
} = require("../controllers/authController");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.get("/verify", verifyEmail);
router.put("/changePassword", requireAuth, changePassword);
router.post("/resetPassword", resetPassword);

module.exports = router;
