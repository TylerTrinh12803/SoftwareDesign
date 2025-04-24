import express from "express";
import db from "../config/db.js";
import PDFDocument from "pdfkit";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";

const router = express.Router();

// Fetch raw report data (for frontend)
router.get("/reports", async (req, res) => {
  try {
    const [data] = await db.query(`
(
    SELECT 
        COALESCE(up.full_name, 'None') AS full_name,
        u.email,
        e.event_name,
        e.event_date,
        COALESCE(h.participated, 'None') AS participated
    FROM events e
    LEFT JOIN history_table h ON e.event_id = h.event_id
    LEFT JOIN users u ON h.user_id = u.user_id
    LEFT JOIN user_profile up ON u.user_id = up.user_id
    )
    UNION ALL
    (
    SELECT 
        COALESCE(up.full_name, 'None') AS full_name,
        u.email,
        'None' AS event_name,
        'None' AS event_date,
        'None' AS participated
    FROM users u
    LEFT JOIN user_profile up ON u.user_id = up.user_id
    WHERE u.user_id NOT IN (SELECT user_id FROM history_table)
    )
    ORDER BY event_date;

    `);
    res.json(data);
  } catch (error) {
    console.error("Report fetch error:", error);
    res.status(500).json({ message: "Error fetching report data" });
  }
});

router.post("/reports/pdf", (req, res) => {
    const data = req.body;
    const doc = new PDFDocument();
  
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
  
    doc.fontSize(18).text("Volunteer and Event Report", { align: "center" }).moveDown();
    doc.fontSize(12);
    data.forEach((row) => {
      doc.text(`Name: ${row.full_name}, Email: ${row.email}, Event: ${row.event_name}, Date: ${row.event_date}, Status: ${row.participated}`).moveDown(0.5);
    });
  
    doc.end();
  });
  
  router.post("/reports/csv", async (req, res) => {
    const data = req.body;
    const filePath = "./report.csv";
  
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "full_name", title: "Full Name" },
        { id: "email", title: "Email" },
        { id: "event_name", title: "Event" },
        { id: "event_date", title: "Date" },
        { id: "participated", title: "Status" },
      ],
    });
  
    await csvWriter.writeRecords(data);
    res.download(filePath, "report.csv", () => fs.unlinkSync(filePath));
  });
  
export default router;
