-- Hostel Management System Database Script
-- Compatible with MySQL 5.7+ and MySQL 8.0+

CREATE DATABASE IF NOT EXISTS hostel_db;
USE hostel_db;

-- Drop table if exists for fresh setup
DROP TABLE IF EXISTS rooms;

-- Create rooms table
CREATE TABLE rooms (
    room_id INT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    block_name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    no_of_occupied INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL
);

-- Insert Sample Hostel Rooms Data
INSERT INTO rooms (room_id, room_number, block_name, capacity, no_of_occupied, status) VALUES
(101, '101', 'Block A - Boys Hostel', 2, 0, 'Vacant (Yes)'),
(102, '102', 'Block A - Boys Hostel', 2, 2, 'Occupied (No)'),
(103, '103', 'Block A - Boys Hostel', 1, 0, 'Vacant (Yes)'),
(201, '201', 'Block B - Girls Hostel', 2, 1, 'Occupied (No)'),
(202, '202', 'Block B - Girls Hostel', 3, 3, 'Occupied (No)'),
(203, '203', 'Block B - Girls Hostel', 2, 0, 'Vacant (Yes)'),
(301, '301', 'Block C - Freshers Wing', 4, 0, 'Vacant (Yes)'),
(302, '302', 'Block C - Freshers Wing', 2, 2, 'Occupied (No)'),
(303, '303', 'Block C - Freshers Wing', 1, 0, 'Vacant (Yes)'),
(401, '401', 'Block D - Senior Wing', 4, 0, 'Vacant (Yes)'),
(402, '402', 'Block D - Senior Wing', 6, 5, 'Occupied (No)'),
(501, '501', 'Block E - PG Wing', 1, 1, 'Occupied (No)');

-- Check records
SELECT * FROM rooms;
