const { createEmbed } = require('../utils/embeds');
const { airlines } = require('../data/airlines');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);

                const errorMessage = {
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }

        // Handle button interactions
        if (interaction.isButton()) {
            if (interaction.customId === 'airlines_page_2') {
                const allAirlines = Object.values(airlines);
                const embed = createEmbed()
                    .setTitle('✈️ Star Alliance Member Airlines (Page 2/2)')
                    .setDescription('Our prestigious member carriers around the world');

                // Show remaining airlines (26th airline and any others)
                const page2Airlines = allAirlines.slice(25);

                page2Airlines.forEach(airline => {
                    embed.addFields({
                        name: `${airline.name} (${airline.iata})`,
                        value: `**Hub:** ${airline.hub}\n**Description:** ${airline.description}`,
                        inline: true
                    });
                });

                embed.setFooter({ text: `Showing ${page2Airlines.length} of ${allAirlines.length} total airlines available` });

                // Add Page 1 button to go back
                const page1Button = new ButtonBuilder()
                    .setCustomId('airlines_page_1')
                    .setLabel('← Page 1')
                    .setStyle(ButtonStyle.Secondary);

                const row = new ActionRowBuilder()
                    .addComponents(page1Button);

                await interaction.update({ embeds: [embed], components: [row] });
            }

            if (interaction.customId === 'airlines_page_1') {
                const allAirlines = Object.values(airlines);
                const embed = createEmbed()
                    .setTitle('✈️ Star Alliance Member Airlines (Page 1/2)')
                    .setDescription('Our prestigious member carriers around the world');

                // Show first 25 airlines
                const page1Airlines = allAirlines.slice(0, 25);

                page1Airlines.forEach(airline => {
                    embed.addFields({
                        name: `${airline.name} (${airline.iata})`,
                        value: `**Hub:** ${airline.hub}\n**Description:** ${airline.description}`,
                        inline: true
                    });
                });

                embed.setFooter({ text: `Showing 25 of ${allAirlines.length} total airlines available` });

                // Add Page 2 button
                const page2Button = new ButtonBuilder()
                    .setCustomId('airlines_page_2')
                    .setLabel('Page 2 →')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder()
                    .addComponents(page2Button);

                await interaction.update({ embeds: [embed], components: [row] });
            }
        }
    },
};