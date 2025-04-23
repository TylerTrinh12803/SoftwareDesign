import mysql from "mysql2/promise";

const pool = await mysql.createConnection({
  host: "software-design.cdms64i00kbh.us-east-2.rds.amazonaws.com",
  port: 3306, // MySQL server port
  user: "admin",
  password: "Softwaredesign123!",
  database: "volunteer",
});

export default pool;