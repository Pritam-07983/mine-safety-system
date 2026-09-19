const mongoose = require("mongoose");

const helmetSchema = new mongoose.Schema(
    {
        helmetId: {
            type: String,
            required: true,
            unique: true
        },

        minerName: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["SAFE", "WARNING", "CRITICAL", "OFFLINE"],
            default: "OFFLINE"
        },

        battery: {
            type: Number,
            default: 100
        },

        lastSeen: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Helmet = mongoose.model("Helmet", helmetSchema);

module.exports = Helmet;