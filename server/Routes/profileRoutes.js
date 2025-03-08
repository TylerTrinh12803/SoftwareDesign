// profileRoutes.js
import express from "express";
const router = express.Router();

let savedProfile = null; // In-memory storage for the profile

// Function to validate a date string in YYYY-MM-DD format
function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

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
    availability,
  } = profile;
  const errors = {};

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
    "AL",
    "AK",
    "AZ",
    "CA",
    "FL",
    "NY",
    "TX",
    "WA",
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
      if (typeof skill !== "string") {
        errors[`skills[${index}]`] = "Each skill must be a string.";
      }
    });
  }

  // Preferences validation (optional)
  if (preferences && typeof preferences !== "string") {
    errors.preferences = "Preferences must be a string.";
  }

  // Availability validation
  if (!Array.isArray(availability) || availability.length === 0) {
    errors.availability = "At least one availability date is required.";
  } else {
    availability.forEach((date, index) => {
      if (typeof date !== "string" || !isValidDate(date)) {
        errors[`availability[${index}]`] =
          "Invalid date format. Please use YYYY-MM-DD.";
      }
    });
  }

  if (Object.keys(errors).length > 0) {
    return errors; // Return errors immediately
  }

  // No errors
  return null;
}

// Function to save the profile
function saveProfile(profile) {
    savedProfile = profile;
}

// POST /profile: Save or update the profile data
router.post("/", (req, res) => {
  const profile = req.body;
  const errors = validateProfile(profile);

  if (errors) {
    return res.status(400).json({ errors }); // Send validation errors
  }

  saveProfile(profile);
  res.status(200).json({ message: "Profile saved successfully" });
});

// GET /profile: Retrieve the profile data
router.get("/", (req, res) => {
  if (savedProfile) {
    res.json(savedProfile);
  } else {
    res.status(404).json({ message: "Profile not found" });
  }
});

export default router;
export { savedProfile, saveProfile }; // Export saveProfile