# 🏢 Sureim's Hostel Management - Room Inventory System

A professional, full-stack **Hostel Management Room Inventory Web Application** built with **Node.js, Express, MySQL**, responsive **CSS animations**, and professional campus imagery featuring **dropdown selectors** for every data entry field, search module, and navigation.

---

## 📁 Project Structure

```text
hostelproject/
├── app.js             # Main Express backend server with complete CRUD endpoints
├── app7a-0.js         # Academic alias for the server (matches lab naming)
├── package.json       # Project dependencies (express, mysql2)
├── database.sql       # MySQL schema and initial sample hostel rooms data
├── README.md          # Setup and user documentation
└── public/            # Frontend static files served by Express
    ├── index.html     # Dashboard Home with live stats, hero showcase image & quick dropdown jump
    ├── list.html      # List all rooms with badges, 4 dropdown filters & sorting
    ├── listone.html   # Search single room with room image, live dropdown selector & preview card
    ├── insert.html    # Insert new room with dropdowns for all attributes
    ├── update.html    # Update room with dropdown room picker & auto-population
    ├── delete.html    # Delete room with dropdown room picker & confirmation card
    └── style.css      # Premium UI stylesheet with responsive sidebar, micro-animations & selects
```

---

## 🏷️ Fields Included

Every room record strictly maintains all required fields:

| Field Name | Type | Description | Dropdown Support |
| :--- | :--- | :--- | :--- |
| **Room ID** | `INT` | Unique primary key ID (e.g., `101`, `201`) | Direct entry + dynamic dropdown selection in Search/Update/Delete |
| **Room Number** | `VARCHAR(20)` | Display room number (e.g., `101`, `202`, `A-101`) | Dropdown quick picker + custom input |
| **Block Name** | `VARCHAR(50)` | Hostel block or wing name | **Dropdown**: Block A - Boys Hostel, Block B - Girls Hostel, Block C - Freshers Wing, Block D - Senior Wing, Block E - PG Wing, International Hostel Block, Main Campus Block |
| **Capacity of Room** | `INT` | Maximum student capacity (beds) | **Dropdown**: 1 Bed (Single Occupancy), 2 Beds (Double Sharing), 3 Beds (Triple Sharing), 4 Beds (Four Sharing), 5 Beds (Dormitory), 6 Beds (Dormitory) |
| **No. of Occupied** | `INT` | Current student count | **Dropdown**: 0 to 6 students (with auto capacity boundary check) |
| **Status (Vacancy Yes/No)** | `VARCHAR(20)` | Room vacancy indicator | **Dropdown**: `Vacant (Yes)` / `Occupied (No)` (with smart occupancy auto-sync) |

---

## 🎯 Dropdowns Implemented Across the System

1. **Navigation Dropdown** (Top bar and sidebar on every page):
   - Jump directly between Home, List, Search, Insert, Update, and Delete from anywhere.
2. **Data Entry Dropdowns** (`insert.html` & `update.html`):
   - Block Name dropdown
   - Capacity of Room dropdown
   - No. of Occupied dropdown
   - Status (Vacancy Yes/No) dropdown
3. **Filter & Sort Dropdowns** (`list.html`):
   - Filter by Block Name dropdown
   - Filter by Status (Vacancy Yes/No) dropdown
   - Filter by Capacity dropdown
   - Sort By dropdown (Room ID, Room Number, Capacity, Occupancy)
4. **Target Room Selection Dropdowns** (`listone.html`, `update.html`, `delete.html`):
   - Dynamically loaded from database so you never need to type IDs manually.

---

## 🚀 Quick Start Guide

### Step 1: Start the Server
Open PowerShell or Command Prompt in the `hostelproject` folder:
```powershell
node app.js
```
*(Or `node app7a-0.js`)*

> **Automatic Database Setup**: When started, the server connects to your local MySQL (`user: "root", password: "root"`), automatically creates `hostel_db` and the `rooms` table, and seeds sample data! If MySQL is offline, it smoothly uses the in-memory fallback.

### Step 2: Open in Web Browser
Go to:
**[http://localhost:3000](http://localhost:3000)** *(or `http://localhost:3001` if port 3000 is occupied)*

---

## 📡 API Endpoints

- `GET /rooms` — List all rooms (JSON)
- `GET /rooms/:id` — Get single room details
- `POST /rooms` — Insert a new room
- `PUT /rooms/:id` — Update room details
- `DELETE /rooms/:id` — Delete a room record
- `GET /stats` — Room count, total vacancies, occupancy stats
