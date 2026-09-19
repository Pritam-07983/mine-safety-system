const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        helmetId: {
            type: String,
            required: true
        },

        minerName: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "HIGH_CO",
                "HIGH_CH4",
                "LOW_O2",
                "HIGH_TEMPERATURE",
                "FALL_DETECTED",
                "LOW_BATTERY",

                "HIGH_GAS",
                "FLAME_DETECTED",
                "HIGH_HUMIDITY"
            ],
            required: true
        },

        message: {
            type: String,
            required: true
        },

        severity: {
            type: String,
            enum: ["WARNING", "CRITICAL", "EMERGENCY"],
            required: true
        },

        resolved: {
            type: Boolean,
            default: false
        },

        timestamp: {
            type: Date,
            default: Date.now
        }
    }
);

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;