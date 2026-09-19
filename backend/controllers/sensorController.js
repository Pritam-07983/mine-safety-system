const SensorData = require("../models/SensorData");
const Helmet = require("../models/Helmet");
const checkAlerts = require("../services/alertService");


const addSensorData = async (req, res) => {
    try {
        const {
            helmetId,

            gas,
            flameDetected,
            humidity,

            temperature,
            co,
            ch4,
            o2,
            heartRate,
            spo2,
            fallDetected
        } = req.body;

        // Check whether helmet exists
        const helmet = await Helmet.findOne({ helmetId });

        if (!helmet) {
            return res.status(404).json({
                message: "Helmet not found"
            });
        }

        // Save sensor data
        const sensorData = await SensorData.create({
            helmetId,

            gas,
            flameDetected,
            humidity,

            temperature,
            co,
            ch4,
            o2,
            heartRate,
            spo2,
            fallDetected
        });

        // Check for dangerous conditions
        const alerts = await checkAlerts(sensorData, helmet.minerName);

        // Determine helmet status
        let status = "SAFE";

        if (alerts.length > 0) {
            const hasEmergency = alerts.some(
                (alert) => alert.severity === "EMERGENCY"
            );

            const hasCritical = alerts.some(
                (alert) => alert.severity === "CRITICAL"
            );

            if (hasEmergency) {
                status = "CRITICAL";
            } else if (hasCritical) {
                status = "CRITICAL";
            } else {
                status = "WARNING";
            }
        }

        // Update helmet status
        await Helmet.findOneAndUpdate(
            { helmetId },
            {
                status,
                battery: helmet.battery,
                lastSeen: new Date()
            }
        );

        res.status(201).json({
            message: "Sensor data received successfully",
            sensorData,
            alerts,
            helmetStatus: status
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to save sensor data",
            error: error.message
        });
    }
};



const getSensorData = async (req, res) => {
    try {
        const data = await SensorData.find({
            helmetId: req.params.helmetId
        }).sort({ timestamp: -1 });

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch sensor data",
            error: error.message
        });
    }
};


module.exports = {
    addSensorData,
    getSensorData
};