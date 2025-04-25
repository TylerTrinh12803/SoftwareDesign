import express from "express";
import db from "../config/db.js"; // Import the database connection
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Helper function to validate string fields
function validateString(value, fieldName) {
    if (typeof value !== "string" || value.trim().length === 0) {
        return `${fieldName} is required and must be a string.`;
    }
    return null; // No error
}

// Function to validate the entire profile object
function validateProfile(profile) {
    const {
        fullName,
        address1,
        address2,
        city,
        state,
        zipCode,
        skills,
        preferences,
        availability, // Now an array of days
        userID,
    } = profile;
    const errors = {};

    if (!userID || typeof userID !== 'number') {
        errors.userID = "userID is required and must be a number.";
    }

    // Full Name validation
    if (typeof fullName !== "string" || fullName.trim().length === 0) {
        errors.fullName = "Full Name is required and must be a string.";
    } else if (fullName.trim().length > 50) {
        errors.fullName = "Full Name must be 50 characters or less.";
    }

    // Address 1 validation
    const address1Error = validateString(address1, "Address 1");
    if (address1Error) {
        errors.address1 = address1Error;
    }

    // Address 2 validation (optional)
    if (address2) {
        const address2Error = validateString(address2, "Address 2");
        if (address2Error) {
            errors.address2 = address2Error;
        }
    }

    // City validation
    const cityError = validateString(city, "City");
    if (cityError) {
        errors.city = cityError;
    }

    // State validation
    const validStates = [
        "AL", "AK", "AZ", "CA", "FL", "NY", "TX", "WA"
    ]; // Add more states as needed
    if (typeof state !== "string" || !validStates.includes(state)) {
        errors.state = "Invalid state selection.";
    }

    // Zip Code validation
    if (typeof zipCode !== "string" || zipCode.trim().length === 0) {
        errors.zipCode = "Zip Code is required and must be a string.";
    } else if (!/^\d{5}(?:[- ]?\d{4})?$/.test(zipCode)) {
        errors.zipCode = "Invalid Zip Code format.";
    }

    // Skills validation
    if (!Array.isArray(skills)) {
        errors.skills = "Skills must be an array.";
    } else {
        skills.forEach((skill, index) => {
            if (typeof skill !== "number") {
                errors[`skills[${index}]`] = "Each skill must be a number (skill ID).";
            }
        });        
    }

    // Preferences validation (optional)
    if (preferences && typeof preferences !== "string") {
        errors.preferences = "Preferences must be a string.";
    }

    // Availability validation (now checking for days of the week)
    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (!Array.isArray(availability) || availability.length === 0) {
        errors.availability = "At least one day of availability is required.";
    } else {
        availability.forEach((day, index) => {
            if (typeof day !== "string" || !validDays.includes(day)) {
                errors[`availability[${index}]`] = "Invalid day of the week.";
            }
        });
    }

    if (Object.keys(errors).length > 0) {
        return errors; // Return errors immediately
    }

    // No errors
    return null;
}

// POST /profile: Save or update the profile data
router.post("/", async (req, res) => {
    const profile = req.body;
    const errors = validateProfile(profile); // Validate profile before saving

    if (errors) {
        return res.status(400).json({ errors });
    }

    const {
        fullName,
        address1,
        address2,
        city,
        state,
        zipCode,
        skills,
        preferences,
        availability, 
        userID,
    } = profile;

    try {
        await db.execute(
            `REPLACE INTO user_profile (user_id, full_name, address_1, address_2, city, state_code, zip_code, skills, preferences, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userID,
                fullName,
                address1,
                address2,
                city,
                state,
                zipCode,
                skills,
                preferences,
                availability,
            ]
        );
        res.status(200).json({ message: "Profile saved successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Failed to save profile" });
    }
});

// GET /profile: Retrieve the profile data
router.get("/", async (req, res) => {
    const userID = req.query.userID;
    const parsedUserID = parseInt(userID, 10);

    if (!userID || isNaN(parsedUserID)) {
        return res.status(400).json({ message: "userID is required and must be a number." });
    }

    try {
        const [rows] = await db.execute(
            `SELECT full_name, address_1, address_2, city, state_code, zip_code, skills, preferences, availability FROM user_profile WHERE user_id = ?`,
            [parsedUserID]
        );

        if (rows.length > 0) {
            const profile = rows[0];
            res.json(profile); // Send the profile object directly
        } else {
            res.status(404).json({ message: "Profile not found" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Failed to retrieve profile" });
    }
});

router.get("/skills", async (req, res) => {
    try {
        const [skills] = await db.query("SELECT * FROM skills");
        res.json(skills);
    } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).json({ message: "Error fetching skills" });
    }
});

export default router;