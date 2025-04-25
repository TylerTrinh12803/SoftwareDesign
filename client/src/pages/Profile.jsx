// Client-side (React)
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
        skills: [],
        preferences: '',
        availability: [], // Now stores selected days of the week
        userID: localStorage.getItem('userId') || '' // Get userId from localStorage
    });
    const [availableSkills, setAvailableSkills] = useState([]);
    const [isEditing, setIsEditing] = useState(true);
    const [submittedData, setSubmittedData] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const states = ["AL", "AK", "AZ", "CA", "FL", "NY", "TX", "WA"];
    const fetchSkills = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3360/api/profile/skills"); // make sure your route matches
            if (response.ok) {
                const data = await response.json();
                setAvailableSkills(data); // Save the skills to state
            } else {
                console.error("Failed to fetch skills");
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
        }
    }, []);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillChange = (e) => {
        const selectedSkillId = parseInt(e.target.value, 10);
        if (selectedSkillId && !formData.skills.includes(selectedSkillId)) {
            setFormData({ ...formData, skills: [...formData.skills, selectedSkillId] });
        }
    };
    

    const handleDeleteSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleAvailabilityChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({
                ...formData,
                availability: [...(formData.availability || []), value],
            });
        } else {
            setFormData({
                ...formData,
                availability: formData.availability.filter((day) => day !== value),
            });
        }
    };

    // useCallback to memoize the fetchProfile function for efficiency
    const fetchProfile = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        console.log("Fetching profile with userId:", userId);
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
        } else {
            console.log('User ID not found. Please log in.');
            // Optionally redirect to the login page
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

        if (!formData.userID) {
            errors.userID = "User ID is missing. Please log in again.";
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            const formDataToSend = { ...formData, userID: parseInt(formData.userID, 10) };
            console.log("Sending formData:", formDataToSend);

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
                    if (data.errors) {
                        setFormErrors(data.errors);
                    } else {
                        setSubmittedData(formDataToSend); // Update submittedData with the updated form
                        setIsEditing(false);
                        fetchProfile(); // <------------------ Call fetchProfile after successful update
                    }
                } else {
                    console.error('Failed to submit profile');
                }
            } catch (error) {
                console.error('Error submitting profile:', error);
            }
        }
    };

    const handleEditClick = () => { // <------------------ Define handleEditClick here
        setIsEditing(true);
    };

    useEffect(() => {
        fetchProfile(); 
        fetchSkills(); // Fetch available skills
    }, [fetchProfile, fetchSkills]);
    
    return (
        <div className="profile-management-page">
            <div className="profile-management-form">
                <h2>Profile Management Form</h2>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                                {formErrors.fullName && <p className="error">{formErrors.fullName}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="zipCode">Zip Code</label>
                                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                                {formErrors.zipCode && <p className="error">{formErrors.zipCode}</p>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="address1">Address 1</label>
                                <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} />
                                {formErrors.address1 && <p className="error">{formErrors.address1}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="address2">Address 2</label>
                                <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
                                {formErrors.city && <p className="error">{formErrors.city}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <select name="state" value={formData.state} onChange={handleInputChange}>
                                    <option value="">Select a state</option>
                                    {states.map(state => <option key={state} value={state}>{state}</option>)}
                                </select>
                                {formErrors.state && <p className="error">{formErrors.state}</p>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Volunteer Skills</label>
                            <select className="wide-dropdown" onChange={handleSkillChange} value="">
                                <option value="" disabled>Select a skill</option>
                                {availableSkills.map(skill => (
                                    <option key={skill.skill_id} value={skill.skill_id}>
                                        {skill.skill_name}
                                    </option>
                                ))}
                            </select>
                            <div className="skills-tags">
                                {formData.skills.map((skillId) => {
                                    const skill = availableSkills.find(s => s.skill_id === skillId);
                                    return (
                                        <div key={skillId} className="skill-tag">
                                            {skill ? skill.skill_name : "Unknown Skill"}
                                            <button type="button" onClick={() => handleDeleteSkill(skillId)}>
                                                &times;
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Preferences</label>
                            <textarea name="preferences" value={formData.preferences} onChange={handleInputChange}></textarea>
                        </div>

                        {/* Availability (Multiple Checkbox Selection) */}
                        <div className="form-group">
                            <label>Availability</label>
                            <div className="availability-checkboxes">
                                {daysOfWeek.map(day => (
                                    <div key={day}>
                                        <input
                                            type="checkbox"
                                            id={`availability-${day.toLowerCase()}`}
                                            name="availability"
                                            value={day}
                                            checked={formData.availability?.includes(day)}
                                            onChange={handleAvailabilityChange}
                                        />
                                        <label htmlFor={`availability-${day.toLowerCase()}`}>{day}</label>
                                    </div>
                                ))}
                            </div>
                            {formErrors.availability && <p className="error">{formErrors.availability}</p>}
                        </div>

                        <button type="submit">Save Profile</button>
                    </form>
                ) : (
                    <div>
                        <h3>Submitted Profile Information</h3>
                        <p>Full Name: {submittedData?.full_name}</p>
                        <p>Address: {submittedData?.address_1}{submittedData?.address_2 ? `, ${submittedData.address_2}` : ''}</p>
                        <p>City: {submittedData?.city}</p>
                        <p>State: {submittedData?.state_code}</p>
                        <p>Zip Code: {submittedData?.zip_code}</p>
                        <p>Skills: {
                            submittedData?.skills?.map(skillId => {
                                const skill = availableSkills.find(s => s.skill_id === skillId);
                                return skill ? skill.skill_name : 'Unknown Skill';
                            }).join(', ')
                        }</p>
                        <p>Preferences: {submittedData?.preferences}</p>
                        <p>Availability: {submittedData?.availability?.join(', ')}</p>
                        <button type="button" onClick={handleEditClick}> {/* Call handleEditClick */}
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;