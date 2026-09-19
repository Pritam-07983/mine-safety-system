const Alert = require("../models/Alert");
const Helmet = require("../models/Helmet");

// Get all alerts
const getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find()
            .sort({ timestamp: -1 });

        res.status(200).json(alerts);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch alerts",
            error: error.message
        });
    }
};


// Get unresolved alerts
const getActiveAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({
            resolved: false
        }).sort({ timestamp: -1 });

        res.status(200).json(alerts);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch active alerts",
            error: error.message
        });
    }
};


// Resolve an alert
const resolveAlert = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            {
                resolved: true
            },
            {
                new: true
            }
        );

        if (!alert) {
            return res.status(404).json({
                message: "Alert not found"
            });
        }

        res.status(200).json({
            message: "Alert resolved successfully",
            alert
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to resolve alert",
            error: error.message
        });
    }
};

const resolveHelmetAlerts = async (req, res) => {
    try {
        const { helmetId } = req.params;

        // Resolve all active alerts for this helmet
        const result = await Alert.updateMany(
            {
                helmetId,
                resolved: false
            },
            {
                resolved: true
            }
        );

        // Set helmet status back to SAFE
        const helmet = await Helmet.findOneAndUpdate(
            { helmetId },
            {
                status: "SAFE",
                lastSeen: new Date()
            },
            {
                new: true
            }
        );

        if (!helmet) {
            return res.status(404).json({
                message: "Helmet not found"
            });
        }

        res.status(200).json({
            message: "Rescue completed successfully",
            resolvedCount: result.modifiedCount,
            helmetStatus: helmet.status
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to complete rescue",
            error: error.message
        });
    }
};


module.exports = {
    getAllAlerts,
    getActiveAlerts,
    resolveAlert,
    resolveHelmetAlerts
};