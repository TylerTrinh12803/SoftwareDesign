import React, { useState, useEffect } from "react";
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
        availability: []
    });

    const today = new Date().toISOString().split("T")[0];
    const states = ["AL", "AK", "AZ", "CA", "FL", "NY", "TX", "WA"];
    
    const volunteerSkills = [
        "Event Planning", "Community Outreach", "Fundraising", 
        "Public Speaking", "Teaching", "Disaster Relief", "Social Media Marketing", 
        "Medical Assistance", "Animal Care", "Food Distribution"
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillChange = (e) => {
        const selectedSkill = e.target.value;
        if (selectedSkill && !formData.skills?.includes(selectedSkill)) {
            setFormData({ ...formData, skills: [...formData.skills, selectedSkill] });
        }
    };

    const handleDeleteSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const [selectedDate, setSelectedDate] = useState('');
    const [isEditing, setIsEditing] = useState(true); // Add editing state
    const [submittedData, setSubmittedData] = useState(null); // Store submitted data
    const [formErrors, setFormErrors] = useState({}); // Add state for form errors

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        if (newDate && !formData.availability.includes(newDate)) {
            setFormData({ ...formData, availability: [...formData.availability, newDate] });
            setSelectedDate(''); // Reset input after adding
        }
    };

    const handleDeleteDate = (dateToRemove) => {
        setFormData({
            ...formData,
            availability: formData.availability.filter(date => date !== dateToRemove)
        });
    };

    const handleSubmit = async (e) => { //make async
        e.preventDefault(); //prevent default

        const errors = {}; // Initialize errors object

        // Validation logic
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
            errors.availability = "At least one availability is required";
        }

        setFormErrors(errors); // Set errors state

        if (Object.keys(errors).length === 0) { //only runs if no errors.
            try {
                const response = await fetch('http://localhost:3360/api/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                
                if (response.ok) {
                    const data = await response.json(); // Get response data
                    if (data.errors) { // Check for validation errors from server
                        setFormErrors(data.errors);
                    } else {
                        setSubmittedData(formData);
                        setIsEditing(false);
                    }
                } else {
                    console.error('Failed to submit profile');
                }
            } catch (error) {
                console.error('Error submitting profile:', error);
            }
        };
    };

    const handleEditClick = () => {
        setIsEditing(true); // Switch back to editable view
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3360/api/profile');
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setSubmittedData(data);
                        setFormData(data);
                        setIsEditing(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile(); // Fetch profile on component mount
    },);

    return (
        <div className="profile-management-page">
            <div className="profile-management-form">
                <h2>Profile Management Form</h2>
                
                {isEditing ? ( // Conditionally render form or submitted data
                    <form onSubmit={handleSubmit}>
                        {/* ... (form inputs) ... */}
                        {/* full name and zip code */}
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

                        {/* Address 1 & Address 2 */}
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

                        {/* City & State */}
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
                            </div>
                        </div>

                        {/* Volunteer Skills Dropdown */}
                        <div className="form-group">
                            <label>Volunteer Skills</label>
                            <select className="wide-dropdown" onChange={handleSkillChange} value="">
                                <option value="" disabled>Select a skill</option>
                                {volunteerSkills.map(skill => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </select>
                            <div className="skills-tags">
                                {formData.skills.map((skill) => (
                                    <div key={skill} className="skill-tag">
                                        {skill}
                                        <button type="button" onClick={() => handleDeleteSkill(skill)}>
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="form-group">
                            <label>Preferences</label>
                            <textarea name="preferences" value={formData.preferences} onChange={handleInputChange}></textarea>
                        </div>
                        
                        {/* Availability (Multi-Date Selection) */} 
                        <div className="form-group">
                            <label>Availability</label> 
                            <div className="availability-input">
                                <input type="date" 
                                    value={selectedDate} 
                                    onChange={handleDateChange} 
                                    min={today} />
                            </div>
                            <div className="availability-tags">
                                {formData.availability.map((date) => (
                                    <div key={date} className="availability-tag">
                                        {date}
                                        <button type="button" onClick={() => handleDeleteDate(date)}>
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Display errors */}
                        {formErrors.fullName && <p className="error">{formErrors.fullName}</p>}
                        {formErrors.zipCode && <p className="error">{formErrors.zipCode}</p>}
                        {formErrors.address1 && <p className="error">{formErrors.address1}</p>}
                        {formErrors.city && <p className="error">{formErrors.city}</p>}
                        {formErrors.state && <p className="error">{formErrors.state}</p>}
                        {formErrors.availability && <p className="error">{formErrors.availability}</p>}

                        <button type="submit">Save Profile</button>
                    </form>
                ) : (
                    <div>
                        <h3>Submitted Profile Information</h3>
                        <p>Full Name: {submittedData.fullName}</p>
                        <p>Address: {submittedData?.address1}, {submittedData?.address2}</p>
                        <p>City: {submittedData.city}</p>
                        <p>State: {submittedData.state}</p>
                        <p>Zip Code: {submittedData.zipCode}</p>
                        <p>Skills: {submittedData?.skills?.join(', ')}</p>
                        <p>Preferences: {submittedData.preferences}</p>
                        <p>Availability: {submittedData?.availability?.join(', ')}</p>
                        <button type="button" onClick={handleEditClick}>
                            Edit Profile
                        </button>
                        {formErrors.state && <p className="error">{formErrors.state}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
