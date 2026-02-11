const express = require("express");
const router = express.Router();
const homepagecontroller = require("../controllers/homepagecontroller");

router.get("/", homepagecontroller.home);

module.exports = router;
