const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
    {
        helmetId: {
            type: String,
            required: true
        },

        gas: {
            type: Number,
            default: 0
        },

        flameDetected: {
            type: Boolean,
            default: false
        },

        humidity: {
            type: Number,
            default: 0
        },

        // Existing fields এখনই থাকবে
        temperature: {
            type: Number,
            required: true
        },

        co: {
            type: Number,
            required: true
        },

        ch4: {
            type: Number,
            required: true
        },

        o2: {
            type: Number,
            required: true
        },

        heartRate: {
            type: Number,
            required: true
        },

        spo2: {
            type: Number,
            required: true
        },

        fallDetected: {
            type: Boolean,
            default: false
        },

        timestamp: {
            type: Date,
            default: Date.now
        }
    }
);

const SensorData = mongoose.model("SensorData", sensorDataSchema);

module.exports = SensorData;