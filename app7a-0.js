// ==========================================================
// SUREIM'S HOSTEL MANAGEMENT SYSTEM - SERVER BACKEND
// ==========================================================
/*
EXECUTION INSTRUCTIONS:
1. Initialize & install dependencies:
   > npm install express mysql2
   (or npm install express mysql8)

2. Run Server:
   > node app.js

3. Open in Browser:
   http://localhost:3000
*/

const express = require("express");
const app = express();

app.use(express.json());
// Serve static HTML/CSS/JS files from public folder
app.use(express.static("public"));

// Dynamically support mysql2, mysql8, or mysql
let mysql;
try {
    mysql = require("mysql2");
} catch (e1) {
    try {
        mysql = require("mysql8");
    } catch (e2) {
        try {
            mysql = require("mysql");
        } catch (e3) {
            console.warn("⚠️ MySQL module not yet installed. Run: npm install mysql2");
        }
    }
}

// In-memory fallback dataset so app works immediately even before MySQL is set up
let inMemoryRooms = [
    { room_id: 101, room_number: "101", block_name: "Block A - Boys Hostel", capacity: 2, no_of_occupied: 0, status: "Vacant (Yes)" },
    { room_id: 102, room_number: "102", block_name: "Block A - Boys Hostel", capacity: 2, no_of_occupied: 2, status: "Occupied (No)" },
    { room_id: 103, room_number: "103", block_name: "Block A - Boys Hostel", capacity: 1, no_of_occupied: 0, status: "Vacant (Yes)" },
    { room_id: 201, room_number: "201", block_name: "Block B - Girls Hostel", capacity: 2, no_of_occupied: 1, status: "Occupied (No)" },
    { room_id: 202, room_number: "202", block_name: "Block B - Girls Hostel", capacity: 3, no_of_occupied: 3, status: "Occupied (No)" },
    { room_id: 203, room_number: "203", block_name: "Block B - Girls Hostel", capacity: 2, no_of_occupied: 0, status: "Vacant (Yes)" },
    { room_id: 301, room_number: "301", block_name: "Block C - Freshers Wing", capacity: 4, no_of_occupied: 0, status: "Vacant (Yes)" },
    { room_id: 302, room_number: "302", block_name: "Block C - Freshers Wing", capacity: 2, no_of_occupied: 2, status: "Occupied (No)" },
    { room_id: 303, room_number: "303", block_name: "Block C - Freshers Wing", capacity: 1, no_of_occupied: 0, status: "Vacant (Yes)" },
    { room_id: 401, room_number: "401", block_name: "Block D - Senior Wing", capacity: 4, no_of_occupied: 0, status: "Vacant (Yes)" },
    { room_id: 402, room_number: "402", block_name: "Block D - Senior Wing", capacity: 6, no_of_occupied: 5, status: "Occupied (No)" },
    { room_id: 501, room_number: "501", block_name: "Block E - PG Wing", capacity: 1, no_of_occupied: 1, status: "Occupied (No)" }
];

let db = null;
let useDatabase = false;

// Attempt database connection with automatic database creation
if (mysql) {
    const dbConfig = {
        host: "localhost",
        user: "root",
        password: "root" // Change if your MySQL password is empty or different
    };
    const dbName = "hostel_db";

    // 1. Connect to MySQL server without database first to ensure database exists
    const initConn = mysql.createConnection(dbConfig);
    initConn.connect((err) => {
        if (err) {
            console.log("ℹ️ MySQL not connected (" + err.message + "). Using local storage fallback.");
            useDatabase = false;
        } else {
            // Auto create database if it doesn't exist
            initConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (dbErr) => {
                initConn.end();
                if (dbErr) {
                    console.log("ℹ️ MySQL db creation error: " + dbErr.message);
                    useDatabase = false;
                    return;
                }

                // 2. Connect directly to hostel_db
                db = mysql.createConnection({
                    ...dbConfig,
                    database: dbName
                });

                db.connect((cErr) => {
                    if (cErr) {
                        console.log("ℹ️ MySQL connect error: " + cErr.message);
                        useDatabase = false;
                    } else {
                        console.log(`✅ Successfully connected to MySQL database '${dbName}'!`);
                        useDatabase = true;

                        // Auto-create table if it doesn't exist
                        const createTableSql = `
                            CREATE TABLE IF NOT EXISTS rooms (
                                room_id INT PRIMARY KEY,
                                room_number VARCHAR(20) NOT NULL,
                                block_name VARCHAR(50) NOT NULL,
                                capacity INT NOT NULL,
                                no_of_occupied INT NOT NULL DEFAULT 0,
                                status VARCHAR(20) NOT NULL
                            )
                        `;
                        db.query(createTableSql, (tErr) => {
                            if (tErr) console.error("Table init error:", tErr.message);
                            else {
                                // Seed initial data if table is empty
                                db.query("SELECT COUNT(*) AS count FROM rooms", (countErr, rows) => {
                                    if (!countErr && rows[0].count === 0) {
                                        const seedSql = "INSERT INTO rooms (room_id, room_number, block_name, capacity, no_of_occupied, status) VALUES ?";
                                        const seedValues = inMemoryRooms.map(r => [r.room_id, r.room_number, r.block_name, r.capacity, r.no_of_occupied, r.status]);
                                        db.query(seedSql, [seedValues], () => {
                                            console.log(`✅ Sample hostel rooms inserted into MySQL '${dbName}'.`);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });
}

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. GET ALL ROOMS
app.get("/rooms", (req, res) => {
    if (useDatabase) {
        db.query("SELECT * FROM rooms ORDER BY room_id ASC", (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result);
        });
    } else {
        res.json(inMemoryRooms);
    }
});

// 2. GET DETAILS OF ONE ROOM (BY ROOM_ID)
app.get("/rooms/:id", (req, res) => {
    const roomId = parseInt(req.params.id);
    if (useDatabase) {
        db.query("SELECT * FROM rooms WHERE room_id = ?", [roomId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result);
        });
    } else {
        const found = inMemoryRooms.filter(r => r.room_id === roomId);
        res.json(found);
    }
});

// 3. INSERT NEW ROOM
app.post("/rooms", (req, res) => {
    const { room_id, room_number, block_name, capacity, no_of_occupied, status } = req.body;

    if (!room_id || !room_number || !block_name) {
        return res.status(400).send("Please provide Room ID, Room Number, and Block Name.");
    }

    const roomIdNum = parseInt(room_id);
    const capNum = parseInt(capacity) || 1;
    const occNum = parseInt(no_of_occupied) || 0;

    if (useDatabase) {
        db.query(
            "INSERT INTO rooms (room_id, room_number, block_name, capacity, no_of_occupied, status) VALUES (?, ?, ?, ?, ?, ?)",
            [roomIdNum, room_number, block_name, capNum, occNum, status],
            (err) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).send("Room ID already exists! Please use a unique Room ID.");
                    }
                    return res.status(500).send(err.message);
                }
                res.send("Hostel Room Inserted Successfully");
            }
        );
    } else {
        if (inMemoryRooms.some(r => r.room_id === roomIdNum)) {
            return res.status(400).send("Room ID already exists! Please use a unique Room ID.");
        }
        inMemoryRooms.push({
            room_id: roomIdNum,
            room_number: String(room_number),
            block_name: String(block_name),
            capacity: capNum,
            no_of_occupied: occNum,
            status: String(status)
        });
        res.send("Hostel Room Inserted Successfully");
    }
});

// 4. UPDATE ROOM DETAILS
app.put("/rooms/:id", (req, res) => {
    const roomId = parseInt(req.params.id);
    const { room_number, block_name, capacity, no_of_occupied, status } = req.body;

    const capNum = parseInt(capacity) || 1;
    const occNum = parseInt(no_of_occupied) || 0;

    if (useDatabase) {
        db.query(
            "UPDATE rooms SET room_number=?, block_name=?, capacity=?, no_of_occupied=?, status=? WHERE room_id=?",
            [room_number, block_name, capNum, occNum, status, roomId],
            (err, result) => {
                if (err) return res.status(500).send(err.message);
                if (result.affectedRows === 0) {
                    return res.status(404).send("Hostel Room NOT found to update");
                }
                res.send("Hostel Room Updated Successfully");
            }
        );
    } else {
        const index = inMemoryRooms.findIndex(r => r.room_id === roomId);
        if (index === -1) {
            return res.status(404).send("Hostel Room NOT found to update");
        }
        inMemoryRooms[index] = {
            ...inMemoryRooms[index],
            room_number: String(room_number),
            block_name: String(block_name),
            capacity: capNum,
            no_of_occupied: occNum,
            status: String(status)
        };
        res.send("Hostel Room Updated Successfully");
    }
});

// 5. DELETE ROOM DETAILS
app.delete("/rooms/:id", (req, res) => {
    const roomId = parseInt(req.params.id);

    if (useDatabase) {
        db.query("DELETE FROM rooms WHERE room_id=?", [roomId], (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0) {
                return res.status(404).send("Hostel Room NOT found to delete");
            }
            res.send("Hostel Room Deleted Successfully");
        });
    } else {
        const prevLen = inMemoryRooms.length;
        inMemoryRooms = inMemoryRooms.filter(r => r.room_id !== roomId);
        if (inMemoryRooms.length === prevLen) {
            return res.status(404).send("Hostel Room NOT found to delete");
        }
        res.send("Hostel Room Deleted Successfully");
    }
});

// 6. GET STATS (Dashboard KPIs)
app.get("/stats", (req, res) => {
    const computeStats = (roomsList) => {
        const total = roomsList.length;
        const vacant = roomsList.filter(r => r.status.toLowerCase().includes("vacant") || r.status.toLowerCase().includes("yes")).length;
        const occupied = total - vacant;
        const totalCap = roomsList.reduce((acc, r) => acc + (parseInt(r.capacity) || 0), 0);
        const totalOcc = roomsList.reduce((acc, r) => acc + (parseInt(r.no_of_occupied) || 0), 0);
        return {
            totalRooms: total,
            vacantRooms: vacant,
            occupiedRooms: occupied,
            totalCapacity: totalCap,
            totalOccupied: totalOcc
        };
    };

    if (useDatabase) {
        db.query("SELECT * FROM rooms", (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(computeStats(rows));
        });
    } else {
        res.json(computeStats(inMemoryRooms));
    }
});

// Start Server on Port 3000 (with auto fallback to 3001 if 3000 is busy)
const DEFAULT_PORT = process.env.PORT || 3000;
const server = app.listen(DEFAULT_PORT, () => {
    console.log(`🏢 Sureim's Hostel Management Server running at http://localhost:${DEFAULT_PORT}`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        const FALLBACK_PORT = 3001;
        console.log(`⚠️ Port ${DEFAULT_PORT} is in use. Automatically running on http://localhost:${FALLBACK_PORT}`);
        app.listen(FALLBACK_PORT, () => {
            console.log(`🏢 Sureim's Hostel Management Server running at http://localhost:${FALLBACK_PORT}`);
        });
    } else {
        console.error("Server error:", err);
    }
});
