const express = require("express");
const {
  signup,
  login,
  search,
  logout,
} = require("../controllers/userController");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.post("/user/login", login);
router.post("/user/signup", signup);
router.get("/user?search=gagan", requireAuth, search);
router.get("/user/logout", logout);
module.exports = router;
