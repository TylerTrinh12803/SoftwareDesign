import React from "react";
import "../style/History.css"; // Import CSS file

const mockData = [
  { eventName: "Community Clean-up", date: "2024-01-15", location: "Central Park", status: "Attended" },
  { eventName: "Food Drive", date: "2024-02-10", location: "Local Shelter", status: "Missed" },
  { eventName: "Animal Shelter Assistance", date: "2024-03-05", location: "City Animal Shelter", status: "Upcoming" }
];

function History() {
  return (
    <div className="container">
      <h2>Volunteer History</h2>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Participation Status</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((event, index) => (
            <tr key={index}>
              <td>{event.eventName}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
              <td>{event.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;