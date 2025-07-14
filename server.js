const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Simple redirect endpoint for Discord OAuth
app.get('/auth/discord/callback', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sky Alliance Bot - Authorization</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #2c3e50; color: white; }
                .container { max-width: 600px; margin: 0 auto; }
                h1 { color: #3498db; }
                .success { background: #27ae60; padding: 20px; border-radius: 10px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🛩️ Sky Alliance Bot</h1>
                <div class="success">
                    <h2>Authorization Successful!</h2>
                    <p>The Sky Alliance Discord bot has been successfully authorized.</p>
                    <p>You can now close this window and return to Discord.</p>
                </div>
                <p><em>The World's Leading Virtual Airline Alliance in GeoFS</em></p>
            </div>
        </body>
        </html>
    `);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Sky Alliance Bot' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sky Alliance Bot</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #2c3e50; color: white; }
                .container { max-width: 600px; margin: 0 auto; }
                h1 { color: #3498db; }
                .info { background: #34495e; padding: 20px; border-radius: 10px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🛩️ Sky Alliance Discord Bot</h1>
                <div class="info">
                    <h2>Bot Status: Online</h2>
                    <p>The Sky Alliance Discord bot is running and ready to serve your virtual airline alliance.</p>
                </div>
                <p><em>The World's Leading Virtual Airline Alliance in GeoFS</em></p>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Sky Alliance Bot web server running on port ${port}`);
});

module.exports = app;