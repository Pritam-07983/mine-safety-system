const Helmet = require("../models/Helmet");
const Alert = require("../models/Alert");

const getDashboardData = async (req, res) => {
    try {
        const totalHelmets = await Helmet.countDocuments();

        const safeHelmets = await Helmet.countDocuments({
            status: "SAFE"
        });

        const warningHelmets = await Helmet.countDocuments({
            status: "WARNING"
        });

        const criticalHelmets = await Helmet.countDocuments({
            status: "CRITICAL"
        });

        const offlineHelmets = await Helmet.countDocuments({
            status: "OFFLINE"
        });

        const activeAlerts = await Alert.countDocuments({
            resolved: false
        });

        const totalAlerts = await Alert.countDocuments();

        res.status(200).json({
            totalHelmets,
            safeHelmets,
            warningHelmets,
            criticalHelmets,
            offlineHelmets,
            activeAlerts,
            totalAlerts
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardData
};