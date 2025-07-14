const { db } = require('../config/database');

class User {
    static async findById(id) {
        return await db.get('SELECT * FROM users WHERE id = ?', [id]);
    }
    
    static async findByUsername(username) {
        return await db.get('SELECT * FROM users WHERE username = ?', [username]);
    }
    
    static async create(userData) {
        const { id, username, discriminator, xp = 0, level = 1, airline_id = null } = userData;
        await db.run(
            'INSERT INTO users (id, username, discriminator, xp, level, airline_id) VALUES (?, ?, ?, ?, ?, ?)',
            [id, username, discriminator, xp, level, airline_id]
        );
        return await this.findById(id);
    }
    
    static async updateXP(id, xp) {
        const level = Math.floor(xp / 100) + 1;
        await db.run('UPDATE users SET xp = ?, level = ? WHERE id = ?', [xp, level, id]);
        return await this.findById(id);
    }
    
    static async setAirline(id, airlineId) {
        await db.run('UPDATE users SET airline_id = ? WHERE id = ?', [airlineId, id]);
        return await this.findById(id);
    }
    
    static async getLeaderboard(limit = 10) {
        return await db.all('SELECT * FROM users ORDER BY xp DESC LIMIT ?', [limit]);
    }
}

class Airline {
    static async findById(id) {
        return await db.get('SELECT * FROM airlines WHERE id = ?', [id]);
    }
    
    static async findByCode(code) {
        return await db.get('SELECT * FROM airlines WHERE iata_code = ? OR icao_code = ?', [code, code]);
    }
    
    static async create(airlineData) {
        const { id, name, iata_code, icao_code, hub_airport, description, livery_url } = airlineData;
        await db.run(
            'INSERT INTO airlines (id, name, iata_code, icao_code, hub_airport, description, livery_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, iata_code, icao_code, hub_airport, description, livery_url]
        );
        return await this.findById(id);
    }
    
    static async getAll() {
        return await db.all('SELECT * FROM airlines ORDER BY name');
    }
}

class Hub {
    static async findByCode(code) {
        return await db.get('SELECT * FROM hubs WHERE iata_code = ? OR icao_code = ?', [code, code]);
    }
    
    static async create(hubData) {
        const { iata_code, icao_code, name, city, country } = hubData;
        const result = await db.run(
            'INSERT INTO hubs (iata_code, icao_code, name, city, country) VALUES (?, ?, ?, ?, ?)',
            [iata_code, icao_code, name, city, country]
        );
        return await db.get('SELECT * FROM hubs WHERE id = ?', [result.id]);
    }
    
    static async getAll() {
        return await db.all('SELECT * FROM hubs ORDER BY iata_code');
    }
}

class Codeshare {
    static async findByFlight(flightNumber) {
        return await db.get('SELECT * FROM codeshares WHERE flight_number = ?', [flightNumber]);
    }
    
    static async create(codeshareData) {
        const { flight_number, airline_id, departure_airport, arrival_airport, route_description } = codeshareData;
        const result = await db.run(
            'INSERT INTO codeshares (flight_number, airline_id, departure_airport, arrival_airport, route_description) VALUES (?, ?, ?, ?, ?)',
            [flight_number, airline_id, departure_airport, arrival_airport, route_description]
        );
        return await db.get('SELECT * FROM codeshares WHERE id = ?', [result.id]);
    }
    
    static async getAll() {
        return await db.all(`
            SELECT c.*, a.name as airline_name, a.iata_code as airline_iata
            FROM codeshares c
            JOIN airlines a ON c.airline_id = a.id
            ORDER BY c.flight_number
        `);
    }
}

class Application {
    static async create(applicationData) {
        const { user_id, airline_name, iata_code, icao_code, description } = applicationData;
        const result = await db.run(
            'INSERT INTO applications (user_id, airline_name, iata_code, icao_code, description) VALUES (?, ?, ?, ?, ?)',
            [user_id, airline_name, iata_code, icao_code, description]
        );
        return await db.get('SELECT * FROM applications WHERE id = ?', [result.id]);
    }
    
    static async findPending() {
        return await db.all('SELECT * FROM applications WHERE status = "pending" ORDER BY submitted_at');
    }
    
    static async updateStatus(id, status, processedBy) {
        await db.run(
            'UPDATE applications SET status = ?, processed_by = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, processedBy, id]
        );
        return await db.get('SELECT * FROM applications WHERE id = ?', [id]);
    }
}

class Event {
    static async create(eventData) {
        const { title, description, date_time, location, created_by } = eventData;
        const result = await db.run(
            'INSERT INTO events (title, description, date_time, location, created_by) VALUES (?, ?, ?, ?, ?)',
            [title, description, date_time, location, created_by]
        );
        return await db.get('SELECT * FROM events WHERE id = ?', [result.id]);
    }
    
    static async getUpcoming() {
        return await db.all('SELECT * FROM events WHERE date_time > CURRENT_TIMESTAMP ORDER BY date_time LIMIT 5');
    }
}

class News {
    static async create(newsData) {
        const { title, content, author } = newsData;
        const result = await db.run(
            'INSERT INTO news (title, content, author) VALUES (?, ?, ?)',
            [title, content, author]
        );
        return await db.get('SELECT * FROM news WHERE id = ?', [result.id]);
    }
    
    static async getLatest(limit = 5) {
        return await db.all('SELECT * FROM news ORDER BY published_at DESC LIMIT ?', [limit]);
    }
}

module.exports = {
    User,
    Airline,
    Hub,
    Codeshare,
    Application,
    Event,
    News
};
