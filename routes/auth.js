const express = require("express");
const { login, register } = require("../controllers/auth");
const router = express.Router();


router.route("/register").post( register);
router.post("/login", login);

module.exports = router;