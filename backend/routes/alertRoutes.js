const express = require("express");

const {
    getAllAlerts,
    getActiveAlerts,
    resolveAlert,
    resolveHelmetAlerts,
} = require("../controllers/alertController");

const router = express.Router();

router.get("/", getAllAlerts);
router.get("/active", getActiveAlerts);
router.patch("/:id/resolve", resolveAlert);
router.patch(
    "/helmet/:helmetId/resolve",
    resolveHelmetAlerts
);

module.exports = router;