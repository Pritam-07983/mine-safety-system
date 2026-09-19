const express = require("express");

const {
    addSensorData,
    getSensorData
} = require("../controllers/sensorController");

const router = express.Router();

router.post("/", addSensorData);
router.get("/:helmetId", getSensorData);

module.exports = router;