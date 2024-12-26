const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

app.use(bodyParser.json());
app.use(cors());

// Add charger endpoint
app.post("/api/add-charger", async (req, res) => {
  const { brand, model, employeeId, chargerType, watts, dateOfIssue } =
    req.body;

  if (
    !brand ||
    !model ||
    !employeeId ||
    !chargerType ||
    !watts ||
    !dateOfIssue
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO chargers (brand, model, employee_id, charger_type, watts, date_of_issue) VALUES (?, ?, ?, ?, ?, ?)",
      [brand, model, employeeId, chargerType, watts, dateOfIssue]
    );
    res
      .status(201)
      .json({
        success: true,
        data: {
          id: result.insertId,
          brand,
          model,
          employeeId,
          chargerType,
          watts,
          dateOfIssue,
        },
      });
  } catch (err) {
    console.error("Error adding charger:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get paginated list of chargers endpoint
app.get("/api/chargers", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query("SELECT * FROM chargers LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS count FROM chargers"
    );
    const total = countResult[0].count;
    res.json({ data: rows, total, page, limit });
  } catch (err) {
    console.error("Error fetching chargers:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get charger by ID endpoint
app.get("/api/charger/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM chargers WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Charger not found" });
    }
  } catch (err) {
    console.error("Error fetching charger:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update charger by ID endpoint
app.put("/api/charger/:id", async (req, res) => {
  const { id } = req.params;
  const { brand, model, chargerType, watts, dateOfIssue } = req.body;

  if (!brand || !model || !chargerType || !watts || !dateOfIssue) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE chargers SET brand = ?, model = ?, charger_type = ?, watts = ?, date_of_issue = ? WHERE id = ?",
      [brand, model, chargerType, watts, dateOfIssue, id]
    );
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Charger updated" });
    } else {
      res.status(404).json({ success: false, message: "Charger not found" });
    }
  } catch (err) {
    console.error("Error updating charger:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Fetch chargers by employee ID endpoint
app.get("/api/chargers/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM chargers WHERE employee_id = ?",
      [employeeId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching chargers by employee ID:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Transfer chargers to new employee endpoint
app.put("/api/transfer-chargers", async (req, res) => {
  const { chargerIds, newEmployeeId } = req.body;

  if (!chargerIds || chargerIds.length === 0 || !newEmployeeId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Charger IDs and new employee ID are required",
      });
  }

  try {
    const [result] = await db.query(
      "UPDATE chargers SET employee_id = ? WHERE id IN (?)",
      [newEmployeeId, chargerIds]
    );
    res.json({
      success: true,
      message: `${result.affectedRows} charger(s) transferred`,
    });
  } catch (err) {
    console.error("Error transferring chargers:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete charger by ID endpoint
app.delete("/api/charger/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM chargers WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Charger deleted" });
    } else {
      res.status(404).json({ success: false, message: "Charger not found" });
    }
  } catch (err) {
    console.error("Error deleting charger:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete SIM by ID endpoint
app.delete("/api/sim/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM sims WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "SIM deleted" });
    } else {
      res.status(404).json({ success: false, message: "SIM not found" });
    }
  } catch (err) {
    console.error("Error deleting SIM:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update SIM by ID endpoint
app.put("/api/updatesim/:id", async (req, res) => {
  const { id } = req.params;
  const { employee_id, mobile_number, operator, purchase_date, status } =
    req.body;

  if (
    !employee_id ||
    !mobile_number ||
    !operator ||
    !purchase_date ||
    !status
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All fields except otherOperator are required",
      });
  }

  try {
    console.log(id);
    const [result] = await db.query(
      "UPDATE sims SET employee_id = ?, mobile_number = ?, operator = ?, purchase_date = ?, status = ? WHERE id = ?",
      [employee_id, mobile_number, operator, purchase_date, status, id]
    );
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "SIM updated" });
    } else {
      res.status(404).json({ success: false, message: "SIM not found" });
    }
  } catch (err) {
    console.error("Error updating SIM:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Add SIM endpoint
app.post("/api/add-sim", async (req, res) => {
  const {
    employeeId,
    mobileNumber,
    operator,
    otherOperator,
    purchaseDate,
    status,
  } = req.body;

  if (!employeeId || !mobileNumber || !operator || !purchaseDate || !status) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All fields except otherOperator are required",
      });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO sims (employee_id, mobile_number, operator, other_operator, purchase_date, status) VALUES (?, ?, ?, ?, ?, ?)",
      [
        employeeId,
        mobileNumber,
        operator,
        otherOperator,
        purchaseDate,
        JSON.stringify(status),
      ]
    );
    res
      .status(201)
      .json({
        success: true,
        data: {
          id: result.insertId,
          employeeId,
          mobileNumber,
          operator,
          otherOperator,
          purchaseDate,
          status,
        },
      });
  } catch (err) {
    console.error("Error adding SIM:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get paginated list of SIMs endpoint
app.get("/api/sims", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query("SELECT * FROM sims LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    const [countResult] = await db.query("SELECT COUNT(*) AS count FROM sims");
    const total = countResult[0].count;
    res.json({ data: rows, total, page, limit });
  } catch (err) {
    console.error("Error fetching SIMs:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get SIM by ID endpoint
app.get("/api/sim/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM sims WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(404).json({ success: false, message: "SIM not found" });
    }
  } catch (err) {
    console.error("Error fetching SIM details:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Transfer SIMs to new employee endpoint
app.put("/api/transfer-sims", async (req, res) => {
  console.log("Transfer SIMs request received:", req.body);
  const { simIds, newEmployeeId } = req.body;

  if (!simIds || simIds.length === 0 || !newEmployeeId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "SIM IDs and new employee ID are required",
      });
  }

  try {
    const [result] = await db.query(
      "UPDATE sims SET employee_id = ? WHERE id IN (?)",
      [newEmployeeId, simIds]
    );
    res.json({
      success: true,
      message: `${result.affectedRows} SIM(s) transferred`,
    });
  } catch (err) {
    console.error("Error transferring SIMs:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Fetch SIM details by Employee ID
app.get("/api/sims/by-employee/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM sims WHERE employee_id = ?", [
      employeeId,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "SIM not found for the provided Employee ID",
        });
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching SIM details by Employee ID:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
