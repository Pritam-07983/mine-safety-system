const express = require("express");

const {
    addHelmet,
    getAllHelmets,
    getHelmetById
} = require("../controllers/helmetController");

const router = express.Router();

router.post("/", addHelmet);
router.get("/", getAllHelmets);
router.get("/:helmetId", getHelmetById);

module.exports = router;