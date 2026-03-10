const express = require("express");
const router = express.Router();
const dessincontroller = require("../controllers/dessincontroller");

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

router.get("/", dessincontroller.index);
router.get("/new", dessincontroller.newForm);
router.post("/", upload.single("imageFile"), dessincontroller.create);

router.get("/:id", dessincontroller.show);
router.get("/:id/image", dessincontroller.image);
router.post("/:id/delete", dessincontroller.destroy);

module.exports = router;