const express = require("express");
const router = express.Router();
const dessincontroller = require("../controllers/dessincontroller");

router.get("/", dessincontroller.index);
router.get("/new", dessincontroller.newForm);
router.post("/", dessincontroller.create);

router.get("/:id", dessincontroller.show);
router.post("/:id/delete", dessincontroller.destroy);

module.exports = router;
