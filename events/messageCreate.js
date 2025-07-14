const { User } = require('../models/schema');
const config = require('../config/bot');
const { createEmbed } = require('../utils/embeds');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore bot messages
        if (message.author.bot) return;
        
        // Handle XP gain for regular messages
        if (!message.content.startsWith(config.prefix)) {
            await handleXPGain(message);
            return;
        }
        
        // Parse command
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        // Get command from client
        const command = client.commands.get(commandName);
        if (!command) return;
        
        // Execute command
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            
            const errorEmbed = createEmbed()
                .setTitle('❌ Command Error')
                .setDescription('An error occurred while executing this command.')
                .addFields({
                    name: 'Error Details',
                    value: error.message || 'Unknown error',
                    inline: false
                })
                .setColor('#EF4444');
            
            try {
                await message.reply({ embeds: [errorEmbed] });
            } catch (replyError) {
                console.error('Error sending error message:', replyError);
            }
        }
    }
};

// Handle XP gain from regular messages
async function handleXPGain(message) {
    try {
        const userId = message.author.id;
        let user = await User.findById(userId);
        
        // Create user if doesn't exist
        if (!user) {
            user = await User.create({
                id: userId,
                username: message.author.username,
                discriminator: message.author.discriminator
            });
        }
        
        // Add XP (simple cooldown - could be improved)
        const currentTime = Date.now();
        const lastXPGain = user.last_xp_gain || 0;
        const cooldownTime = 60000; // 1 minute cooldown
        
        if (currentTime - lastXPGain >= cooldownTime) {
            const xpGain = config.xp.messageXp;
            const newXP = user.xp + xpGain;
            const oldLevel = user.level;
            
            await User.updateXP(userId, newXP);
            
            // Check for level up
            const newLevel = Math.floor(newXP / config.xp.levelMultiplier) + 1;
            if (newLevel > oldLevel) {
                const levelUpEmbed = createEmbed()
                    .setTitle('🎉 Level Up!')
                    .setDescription(`Congratulations ${message.author.username}! You've reached level ${newLevel}!`)
                    .addFields(
                        {
                            name: 'New Level',
                            value: newLevel.toString(),
                            inline: true
                        },
                        {
                            name: 'Total XP',
                            value: newXP.toString(),
                            inline: true
                        }
                    )
                    .setColor('#FFD700')
                    .setThumbnail(message.author.displayAvatarURL());
                
                try {
                    await message.reply({ embeds: [levelUpEmbed] });
                } catch (error) {
                    console.error('Error sending level up message:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error handling XP gain:', error);
    }
}
