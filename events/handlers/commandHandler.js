const fs = require('fs');
const path = require('path');

// Load all command files
async function loadCommands(client) {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const commands = require(`../../commands/${file}`);

        // Handle both array and object exports
        const commandArray = Array.isArray(commands) ? commands : Object.values(commands);

        for (const command of commandArray) {
            client.commands.set(command.name, command);
            console.log(`Loaded command: ${command.name}`);
        }
    }

    console.log(`Loaded ${client.commands.size} commands total.`);
}

module.exports = { loadCommands };