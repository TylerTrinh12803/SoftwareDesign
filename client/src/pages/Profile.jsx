import React, { useState, useEffect, useCallback } from "react";
import "../style/Profile.css";

const Profile = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        skills: [],  // Store selected skill IDs
        preferences: '',
        availability: [], // Store selected days of the week
        userID: localStorage.getItem('userId') || ''
    });

    const [availableSkills, setAvailableSkills] = useState([]);  // To store fetched skills from the database
    const [isEditing, setIsEditing] = useState(true);
    const [submittedData, setSubmittedData] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const states = ["AL", "AK", "AZ", "CA", "FL", "NY", "TX", "WA"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillChange = (e) => {
        const selectedSkillId = parseInt(e.target.value);
        if (selectedSkillId && !formData.skills.includes(selectedSkillId)) {
            setFormData({ ...formData, skills: [...formData.skills, selectedSkillId] });
        }
    };

    const handleDeleteSkill = (skillId) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(id => id !== skillId)
        });
    };

    const handleAvailabilityChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({
                ...formData,
                availability: [...formData.availability, value],
            });
        } else {
            setFormData({
                ...formData,
                availability: formData.availability.filter(day => day !== value),
            });
        }
    };

    const fetchSkills = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3360/api/skills");
            if (response.ok) {
                const data = await response.json();
                setAvailableSkills(data);
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
        }
    }, []);

    const fetchProfile = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                const response = await fetch(`http://localhost:3360/api/profile?userID=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setSubmittedData(data);
                        setFormData({
                            fullName: data.full_name || '',
                            address1: data.address_1 || '',
                            address2: data.address_2 || '',
                            city: data.city || '',
                            state: data.state_code || '',
                            zipCode: data.zip_code || '',
                            skills: data.skills || [],
                            preferences: data.preferences || '',
                            availability: data.availability || [],
                            userID: localStorage.getItem('userId') || ''
                        });
                        setIsEditing(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        if (!formData.fullName.trim()) {
            errors.fullName = "Full Name is required";
        }

        if (!formData.zipCode.trim()) {
            errors.zipCode = "Zip Code is required";
        } else if (!/^\d{5}(?:[- ]?\d{4})?$/.test(formData.zipCode)) {
            errors.zipCode = "Invalid Zip Code";
        }

        if (!formData.address1.trim()) {
            errors.address1 = "Address 1 is required";
        }

        if (!formData.city.trim()) {
            errors.city = "City is required";
        }

        if (!formData.state.trim()) {
            errors.state = "State is required";
        }

        if (formData.availability.length === 0) {
            errors.availability = "At least one day of availability is required";
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            const formDataToSend = { ...formData, userID: parseInt(formData.userID, 10) };
            try {
                const response = await fetch('http://localhost:3360/api/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataToSend),
                });

                if (response.ok) {
                    const data = await response.json();
                    setSubmittedData(formDataToSend);
                    setIsEditing(false);
                    fetchProfile(); // Fetch updated profile after submit
                }
            } catch (error) {
                console.error('Error submitting profile:', error);
            }
        }
    };

    useEffect(() => {
        fetchProfile(); // Fetch profile data on initial component mount
        fetchSkills();  // Fetch available skills on initial component mount
    }, [fetchProfile, fetchSkills]);

    return (
        <div className="profile-management-page">
            <div className="profile-management-form">
                <h2>Profile Management Form</h2>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        {/* Profile fields */}
                        <div className="form-group">
                            <label>Volunteer Skills</label>
                            <select className="wide-dropdown" onChange={handleSkillChange}>
                                <option value="" disabled>Select a skill</option>
                                {availableSkills.map(skill => (
                                    <option key={skill.skill_id} value={skill.skill_id}>
                                        {skill.skill_name}
                                    </option>
                                ))}
                            </select>
                            <div className="skills-tags">
                                {formData.skills.map(skillId => {
                                    const skill = availableSkills.find(s => s.skill_id === skillId);
                                    return (
                                        <div key={skillId} className="skill-tag">
                                            {skill?.skill_name}
                                            <button type="button" onClick={() => handleDeleteSkill(skillId)}>
                                                &times;
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Other profile fields */}
                        <button type="submit">Save Profile</button>
                    </form>
                ) : (
                    <div>
                        <h3>Submitted Profile Information</h3>
                        <p>Full Name: {submittedData?.full_name}</p>
                        {/* Display other profile info */}
                        <button type="button" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
