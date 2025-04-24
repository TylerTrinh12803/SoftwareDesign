import React, { useState, useEffect } from "react";
import "../style/Reports.css";

function Reports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("event_date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [dateOrder, setDateOrder] = useState("desc"); // "desc" = most recent first

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3360/reports");
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
    setLoading(false);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };  

  const generatePDF = async () => {
    const response = await fetch("http://localhost:3360/reports/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sortedFilteredData),
    });
  
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  };
  
  const generateCSV = async () => {
    const response = await fetch("http://localhost:3360/reports/csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sortedFilteredData),
    });
  
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  
  
  const processedData = [...reportData]
  .filter((entry) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "None") return !entry.participated;
    return entry.participated === statusFilter;
  })
  .sort((a, b) => {
    if (sortField === "event_date") {
      const dateA = new Date(a.event_date);
      const dateB = new Date(b.event_date);
      return dateOrder === "desc" ? dateB - dateA : dateA - dateB;
    }

    const fieldA = (a[sortField] || "").toLowerCase();
    const fieldB = (b[sortField] || "").toLowerCase();
    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

const filteredData = processedData.map(entry => ({
  full_name: entry.full_name || "None",
  email: entry.email || "None",
  event_name: entry.event_name || "None",
  participated: entry.participated || "None",
  event_date: entry.event_date || "None"
}));
const sortedFilteredData = [...reportData]
  .filter((entry) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "None") return entry.participated === "None";
    return entry.participated === statusFilter;
  })
  .sort((a, b) => {
    if (sortField === "event_date") {
      const dateA = new Date(a.event_date || "1970-01-01");
      const dateB = new Date(b.event_date || "1970-01-01");
      return dateOrder === "desc" ? dateB - dateA : dateA - dateB;
    } else {
      const aField = (a[sortField] || "").toLowerCase();
      const bField = (b[sortField] || "").toLowerCase();
      if (aField < bField) return sortOrder === "asc" ? -1 : 1;
      if (aField > bField) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  return (
    <div className="report-page">
    <div className="report-container">
      <h2>Volunteer and Event Reports</h2>
      <div className="report-actions">
        <button onClick={generatePDF}>Generate PDF</button>
        <button onClick={generateCSV}>Download CSV</button>
      </div>
      <div className="sort-controls">
    </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        
        <table className="report-table">
          <thead>
  <tr>
    <th onClick={() => toggleSort("full_name")} style={{ cursor: "pointer" }}>
      Volunteer {sortField === "full_name" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
    </th>
    <th onClick={() => toggleSort("email")} style={{ cursor: "pointer" }}>
      Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
    </th>
    <th onClick={() => toggleSort("event_name")} style={{ cursor: "pointer" }}>
      Event {sortField === "event_name" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
    </th>
    <th>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">All Status</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Attended">Attended</option>
        <option value="Missed">Missed</option>
        <option value="None">None</option>
      </select>
    </th>
    <th onClick={() => toggleSort("event_date")} style={{ cursor: "pointer" }}>
      Date {sortField === "event_date" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
    </th>
  </tr>
</thead>

          <tbody>
          {[...reportData]
            .filter((entry) => {
                if (statusFilter === "all") return true;
                //if (statusFilter === "None") return !entry.event_name; // no event = never participated
                return entry.participated === statusFilter;
            })
            .sort((a, b) => {
                // First: sort by selected field (name, email, event)
                const fieldA = a[sortField]?.toLowerCase() || "";
                const fieldB = b[sortField]?.toLowerCase() || "";
              
                if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
                if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
              
                // If sortField values are equal, break tie using date
                const dateA = new Date(a.event_date);
                const dateB = new Date(b.event_date);
                return dateOrder === "desc" ? dateB - dateA : dateA - dateB;
              })
              
            .map((entry, idx) => (
                <tr key={idx}>
                <td>{entry.full_name}</td>
                <td>{entry.email}</td>
                <td>{entry.event_name}</td>
                <td>{entry.participated || "None"}</td>
                <td>{entry.event_date}</td>
                </tr>
            ))}

          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}

export default Reports;
