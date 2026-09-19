const Alert = require("../models/Alert");

const checkAlerts = async (data, minerName) => {
    const alerts = [];

    // =========================
    // Gas Sensor
    // =========================
    if (data.gas > 50) {
        alerts.push({
            helmetId: data.helmetId,
            minerName,
            type: "HIGH_GAS",
            message: `High gas level detected: ${data.gas}`,
            severity: data.gas > 80 ? "CRITICAL" : "WARNING"
        });
    }


    // =========================
    // Flame Sensor
    // =========================
    if (data.flameDetected === true) {
        alerts.push({
            helmetId: data.helmetId,
            minerName,
            type: "FLAME_DETECTED",
            message: "Flame detected near the miner",
            severity: "EMERGENCY"
        });
    }


    // =========================
    // Humidity Sensor
    // =========================
    if (data.humidity > 80) {
        alerts.push({
            helmetId: data.helmetId,
            minerName,
            type: "HIGH_HUMIDITY",
            message: `High humidity detected: ${data.humidity}%`,
            severity: data.humidity > 90 ? "CRITICAL" : "WARNING"
        });
    }


    // =========================
    // Existing Alerts
    // =========================

    // High CO
    if (data.co > 50) {
        alerts.push({
            helmetId: data.helmetId,
            minerName,
            type: "HIGH_CO",
            message: `High CO level detected: ${data.co} ppm`,
            severity: data.co > 100 ? "CRITICAL" : "WARNING"
        });
    }


    // High CH4
    if (data.ch4 > 1) {
        alerts.push({
            helmetId: data.helmetId,
            minerName,
            type: "HIGH_CH4",
            message: `High methane level detected: ${data.ch4}%`,
            severity: data.ch4 > 2 ? "CRITICAL" : "WARNING"
        });
    }


    // Low O2
    if (data.o2 < 19.5) {
        alerts.push({
            helmetId: data.helmetId,
            minerName,
            type: "LOW_O2",
            message: `Low oxygen level detected: ${data.o2}%`,
            severity: data.o2 < 18 ? "CRITICAL" : "WARNING"
        });
    }


    // High temperature
    if (data.temperature > 45) {
        alerts.push({
            helmetId: data.helmetId,
            minerName,
            type: "HIGH_TEMPERATURE",
            message: `High temperature detected: ${data.temperature}°C`,
            severity: data.temperature > 55 ? "CRITICAL" : "WARNING"
        });
    }


    // Fall detection
    if (data.fallDetected === true) {
        alerts.push({
            helmetId: data.helmetId,
            minerName,
            type: "FALL_DETECTED",
            message: "Possible miner fall detected",
            severity: "EMERGENCY"
        });
    }


    // =========================
    // Save Alerts
    // =========================

    if (alerts.length > 0) {
        await Alert.insertMany(alerts);
    }

    return alerts;
};

module.exports = checkAlerts;