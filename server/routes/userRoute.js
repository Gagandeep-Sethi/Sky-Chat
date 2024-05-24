const express = require("express");
const { updateProfile } = require("../controllers/userController");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.post("/update", requireAuth, updateProfile);

module.exports = router;
