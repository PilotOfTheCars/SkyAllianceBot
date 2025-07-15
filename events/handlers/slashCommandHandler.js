const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load all slash command files
async function loadSlashCommands(client) {
    const slashCommands = [];
    const commandFolders = fs.readdirSync('./commands/slash');
    
    for (const folder of commandFolders) {
        const commandPath = path.join('./commands/slash', folder);
        
        if (fs.statSync(commandPath).isFile() && folder.endsWith('.js')) {
            const commands = require(`../${commandPath}`);
            
            // Handle both array and object exports
            const commandArray = Array.isArray(commands) ? commands : Object.values(commands);
            
            for (const command of commandArray) {
                client.slashCommands.set(command.data.name, command);
                slashCommands.push(command.data.toJSON());
                console.log(`Loaded slash command: ${command.data.name}`);
            }
        }
    }
    
    console.log(`Loaded ${client.slashCommands.size} slash commands total.`);
    return slashCommands;
}

// Register slash commands with Discord
async function registerSlashCommands(client) {
    try {
        const slashCommands = await loadSlashCommands(client);
        
        if (slashCommands.length === 0) {
            console.log('No slash commands to register.');
            return;
        }
        
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
        
        console.log('Started refreshing application (/) commands.');
        
        // Register commands globally (takes up to 1 hour to propagate)
        // For faster development, you can register for a specific guild:
        // await rest.put(Routes.applicationGuildCommands(client.user.id, 'YOUR_GUILD_ID'), { body: slashCommands });
        
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: slashCommands }
        );
        
        console.log(`Successfully reloaded ${slashCommands.length} application (/) commands.`);
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
}

module.exports = { loadSlashCommands, registerSlashCommands };