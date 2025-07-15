const { createEmbed } = require('../utils/embeds');
const { airlines } = require('../data/airlines');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Handle modal submissions
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'alliance_application') {
                const airlineName = interaction.fields.getTextInputValue('airline_name');
                const airlineCode = interaction.fields.getTextInputValue('airline_code');
                const hub = interaction.fields.getTextInputValue('hub');
                const experience = interaction.fields.getTextInputValue('experience');
                const contact = interaction.fields.getTextInputValue('contact');

                // Generate application code
                const applicationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

                // Store application in database (you can expand this)
                const applicationData = {
                    code: applicationCode,
                    userId: interaction.user.id,
                    username: interaction.user.username,
                    airlineName,
                    airlineCode,
                    hub,
                    experience,
                    contact,
                    status: 'pending',
                    submittedAt: new Date().toISOString()
                };

                // For now, we'll store in memory. You can add database storage later
                if (!global.applications) global.applications = new Map();
                global.applications.set(applicationCode, applicationData);

                const embed = createEmbed()
                    .setTitle('✅ Application Submitted')
                    .setDescription(`Your application has been submitted successfully!`)
                    .addFields(
                        { name: 'Application Code', value: `\`${applicationCode}\``, inline: true },
                        { name: 'Status', value: 'Pending Review', inline: true },
                        { name: 'Airline Name', value: airlineName, inline: true },
                        { name: 'Airline Code', value: airlineCode, inline: true },
                        { name: 'Hub', value: hub, inline: true },
                        { name: 'Contact', value: contact, inline: true }
                    )
                    .setFooter({ text: 'Save your application code to check status later' });

                await interaction.reply({ embeds: [embed], ephemeral: true });

                // Send notification to admins (optional)
                const adminEmbed = createEmbed()
                    .setTitle('🆕 New Alliance Application')
                    .setDescription(`${interaction.user.username} has submitted an application`)
                    .addFields(
                        { name: 'Application Code', value: `\`${applicationCode}\``, inline: true },
                        { name: 'Applicant', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Airline Name', value: airlineName, inline: true },
                        { name: 'Airline Code', value: airlineCode, inline: true },
                        { name: 'Hub', value: hub, inline: true },
                        { name: 'Experience', value: experience.length > 100 ? experience.substring(0, 100) + '...' : experience, inline: false }
                    )
                    .setColor('#F59E0B');

                // Try to send to applications channel
                const applicationsChannel = interaction.guild.channels.cache.find(ch => ch.name === 'applications');
                if (applicationsChannel) {
                    await applicationsChannel.send({ embeds: [adminEmbed] });
                }
            }
        }

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