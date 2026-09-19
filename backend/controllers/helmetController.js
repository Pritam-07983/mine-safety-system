const Helmet = require("../models/Helmet");

// Add a new helmet
const addHelmet = async (req, res) => {
    try {
        const { helmetId, minerName } = req.body;

        const existingHelmet = await Helmet.findOne({ helmetId });

        if (existingHelmet) {
            return res.status(400).json({
                message: "Helmet already exists"
            });
        }

        const helmet = await Helmet.create({
            helmetId,
            minerName,
            status: "OFFLINE",
            battery: 100
        });

        res.status(201).json({
            message: "Helmet added successfully",
            helmet
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add helmet",
            error: error.message
        });
    }
};


// Get all helmets
const getAllHelmets = async (req, res) => {
    try {
        const helmets = await Helmet.find().sort({ createdAt: -1 });

        res.status(200).json(helmets);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch helmets",
            error: error.message
        });
    }
};


// Get helmet by ID
const getHelmetById = async (req, res) => {
    try {
        const helmet = await Helmet.findOne({
            helmetId: req.params.helmetId
        });

        if (!helmet) {
            return res.status(404).json({
                message: "Helmet not found"
            });
        }

        res.status(200).json(helmet);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch helmet",
            error: error.message
        });
    }
};


module.exports = {
    addHelmet,
    getAllHelmets,
    getHelmetById
};