import React, { useState } from "react";
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
        if (selectedSkill && !formData.skills.includes(selectedSkill)) {
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

    return (
        <div className="profile-management-page">
        <div className="profile-management-form">
            <h2>Profile Management Form</h2>
            
            <form>
                {/* Full Name & Zip Code */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="zipCode">Zip Code</label>
                        <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                    </div>
                </div>

                {/* Address 1 & Address 2 */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="address1">Address 1</label>
                        <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} />
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

                <button type="submit">Save Profile</button>
            </form>
        </div>
        </div>
    );
};

export default Profile;
