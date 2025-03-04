import React, { useEffect, useState } from "react";
import "../style/History.css"; // Import CSS file

function History() {
  const [volunteerHistory, setVolunteerHistory] = useState([]);

  // Fetch data from backend API when component loads
  useEffect(() => {
    fetch("http://localhost:3360/api/volunteer-history") // Backend API URL
      .then((res) => res.json())
      .then((data) => setVolunteerHistory(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
            {volunteerHistory.length > 0 ? (
              volunteerHistory.map((event, index) => (
                <tr key={index}>
                  <td>{event.eventName}</td>
                  <td>{event.description}</td> {/* Backend uses "description" instead of "eventDescription" */}
                  <td>{event.location}</td>
                  <td>{event.requiredSkills}</td>
                  <td>{event.urgency}</td>
                  <td>{event.eventDate}</td>
                  <td>{event.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
