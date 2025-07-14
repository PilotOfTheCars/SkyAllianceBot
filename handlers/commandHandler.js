const fs = require('fs');
const path = require('path');

// Load all command files
async function loadCommands(client) {
    const commandFolders = fs.readdirSync('./commands');
    
    for (const folder of commandFolders) {
        const commandPath = path.join('./commands', folder);
        
        if (fs.statSync(commandPath).isFile() && folder.endsWith('.js')) {
            const commands = require(`../${commandPath}`);
            
            for (const [name, command] of Object.entries(commands)) {
                client.commands.set(command.name, command);
                console.log(`Loaded command: ${command.name}`);
            }
        }
    }
    
    console.log(`Loaded ${client.commands.size} commands total.`);
}

module.exports = { loadCommands };
