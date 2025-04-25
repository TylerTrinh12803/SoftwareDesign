import React, { useEffect, useState } from "react";
import "../style/History.css"; // Adjust path if needed


function History({ userId }) {
  const [history, setHistory] = useState([]);


  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3360/history/${parseInt(userId)}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched history:", data);
        setHistory(data);
      })
      .catch(err => {
        console.error("Failed to fetch history:", err);
      });
  }, [userId]);

  

  // Function to refresh history data (after leaving or joining an event)
  const refreshHistory = () => {
    fetch(`http://localhost:3360/history/${userId}`)
      .then(res => res.json())
      .then(data => setHistory(data));
  };


  // Handle leaving an event
  const leaveEvent = (eventId) => {
    fetch(`http://localhost:3360/unmatch-volunteer/${eventId}/${userId}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Left the event.");
        refreshHistory(); // Refresh the table
      })
      .catch(err => {
        console.error("Error leaving event:", err);
        alert("Could not leave the event.");
      });
  };


  return (
    <div className="history-page">
      <div className="container">
        <h2>Volunteer History</h2>
        {history.length === 0 ? (
          <p>You haven't joined any events yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Description</th>
                <th>Location</th>
                <th>Urgency</th>
                <th>Event Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((event, index) => (
                <tr key={index}>
                  <td>{event.event_name}</td>
                  <td>{event.description}</td>
                  <td>{event.location}</td>
                  <td>{event.urgency}</td>
                  <td>{event.event_date}</td>
                  <td>{event.status}</td>
                  <td>
                    {event.status === "Upcoming" && (
                      <button onClick={() => leaveEvent(event.event_id)}>
                        Leave Event
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


export default History;