const { createEmbed } = require('../utils/embeds');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;
        
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing slash command ${interaction.commandName}:`, error);
            
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
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error('Error sending error message:', replyError);
            }
        }
    }
};