import React from "react";
import "../style/History.css"; // Import CSS file


const mockData = [
  { 
    eventName: "Community Clean-up", 
    eventDescription: "A local park clean-up effort.", 
    location: "Central Park", 
    requiredSkills: "Teamwork, Physical Stamina", 
    urgency: "High", 
    eventDate: "2024-01-15", 
    status: "Attended" 
  },
  { 
    eventName: "Food Drive", 
    eventDescription: "Sorting and distributing food donations.", 
    location: "Local Shelter", 
    requiredSkills: "Organization, Communication", 
    urgency: "Medium", 
    eventDate: "2024-02-10", 
    status: "Missed" 
  },
  { 
    eventName: "Animal Shelter Assistance", 
    eventDescription: "Helping care for rescued animals.", 
    location: "City Animal Shelter", 
    requiredSkills: "Animal Care, Patience", 
    urgency: "Low", 
    eventDate: "2024-03-05", 
    status: "Upcoming" 
  }
];

function History() {
  return (
    <div className="history-page">
    <div className="container">
      <h2>Volunteer History</h2>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Event Description</th>
            <th>Location</th>
            <th>Required Skills</th>
            <th>Urgency</th>
            <th>Event Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((event, index) => (
            <tr key={index}>
              <td>{event.eventName}</td>
              <td>{event.eventDescription}</td>
              <td>{event.location}</td>
              <td>{event.requiredSkills}</td>
              <td>{event.urgency}</td>
              <td>{event.eventDate}</td>
              <td>{event.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default History;