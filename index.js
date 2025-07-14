const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { initDatabase } = require('./config/database');
const { loadCommands } = require('./handlers/commandHandler');
const { registerSlashCommands } = require('./handlers/slashCommandHandler');
const fs = require('fs');
const path = require('path');

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Create collections for commands
client.commands = new Collection();
client.slashCommands = new Collection();

// Load event handlers
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Initialize database and start bot
async function startBot() {
    try {
        await initDatabase();
        await loadCommands(client);
        
        const token = process.env.DISCORD_BOT_TOKEN;
        if (!token) {
            throw new Error('DISCORD_BOT_TOKEN is required');
        }
        
        await client.login(token);
        
        // Register slash commands after bot is ready
        client.once('ready', async () => {
            await registerSlashCommands(client);
        });
    } catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
}

startBot();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Bot shutting down...');
    client.destroy();
    process.exit(0);
});
