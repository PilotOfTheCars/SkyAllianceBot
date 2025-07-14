const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

// Initialize database connection
function initDatabase() {
    return new Promise((resolve, reject) => {
        const dbPath = path.join(__dirname, '..', 'skyalliance.db');
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Database connection error:', err);
                reject(err);
            } else {
                console.log('Connected to SQLite database');
                createTables().then(resolve).catch(reject);
            }
        });
    });
}

// Create database tables
function createTables() {
    return new Promise((resolve, reject) => {
        const tables = [
            // Users table for XP tracking
            `CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                discriminator TEXT,
                xp INTEGER DEFAULT 0,
                level INTEGER DEFAULT 1,
                airline_id TEXT,
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            
            // Airlines table
            `CREATE TABLE IF NOT EXISTS airlines (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                iata_code TEXT,
                icao_code TEXT,
                hub_airport TEXT,
                description TEXT,
                livery_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            
            // Hubs table
            `CREATE TABLE IF NOT EXISTS hubs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                iata_code TEXT UNIQUE NOT NULL,
                icao_code TEXT,
                name TEXT NOT NULL,
                city TEXT,
                country TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            
            // Codeshares table
            `CREATE TABLE IF NOT EXISTS codeshares (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                flight_number TEXT NOT NULL,
                airline_id TEXT NOT NULL,
                departure_airport TEXT NOT NULL,
                arrival_airport TEXT NOT NULL,
                route_description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (airline_id) REFERENCES airlines(id)
            )`,
            
            // Applications table
            `CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                airline_name TEXT NOT NULL,
                iata_code TEXT,
                icao_code TEXT,
                description TEXT,
                status TEXT DEFAULT 'pending',
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                processed_at DATETIME,
                processed_by TEXT
            )`,
            
            // Events table
            `CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                date_time DATETIME NOT NULL,
                location TEXT,
                created_by TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            
            // News table
            `CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                author TEXT NOT NULL,
                published_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];
        
        let completed = 0;
        tables.forEach(table => {
            db.run(table, (err) => {
                if (err) {
                    console.error('Table creation error:', err);
                    reject(err);
                } else {
                    completed++;
                    if (completed === tables.length) {
                        console.log('Database tables created successfully');
                        resolve();
                    }
                }
            });
        });
    });
}

// Database helper functions
const dbHelpers = {
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    },
    
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

module.exports = {
    initDatabase,
    db: dbHelpers
};
