const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { hasAdminPermission } = require('../../utils/permissions');
const { User, Airline, Hub, Codeshare, Application, News } = require('../../models/schema');
const config = require('../../config/bot');

const slashAdminCommands = [
    {
        data: new SlashCommandBuilder()
            .setName('addxp')
            .setDescription('Add XP to a user')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('User to add XP to')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('amount')
                    .setDescription('Amount of XP to add')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }
            
            const targetUser = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');
            
            let user = await User.findById(targetUser.id);
            if (!user) {
                user = await User.create({
                    id: targetUser.id,
                    username: targetUser.username,
                    discriminator: targetUser.discriminator
                });
            }
            
            const newXP = Math.max(0, user.xp + amount);
            const updatedUser = await User.updateXP(targetUser.id, newXP);
            
            const embed = createEmbed()
                .setTitle('✅ XP Updated')
                .setDescription(`Successfully ${amount >= 0 ? 'added' : 'removed'} ${Math.abs(amount)} XP`)
                .addFields(
                    {
                        name: 'User',
                        value: targetUser.username,
                        inline: true
                    },
                    {
                        name: 'New XP',
                        value: `${updatedUser.xp} XP`,
                        inline: true
                    },
                    {
                        name: 'New Level',
                        value: `Level ${updatedUser.level}`,
                        inline: true
                    }
                )
                .setColor('#10B981');
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('approve')
            .setDescription('Approve an application')
            .addIntegerOption(option =>
                option.setName('application_id')
                    .setDescription('Application ID to approve')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }
            
            const applicationId = interaction.options.getInteger('application_id');
            
            const application = await Application.updateStatus(applicationId, 'approved', interaction.user.id);
            
            if (!application) {
                const embed = createEmbed()
                    .setTitle('❌ Application Not Found')
                    .setDescription(`No application found with ID ${applicationId}.`)
                    .setColor('#EF4444');
                
                return await interaction.reply({ embeds: [embed] });
            }
            
            // Create airline entry
            const airlineId = application.airline_name.toLowerCase().replace(/\s+/g, '-');
            await Airline.create({
                id: airlineId,
                name: application.airline_name,
                iata_code: application.iata_code,
                icao_code: application.icao_code,
                description: application.description
            });
            
            // Assign airline to user
            await User.setAirline(application.user_id, airlineId);
            
            const embed = createEmbed()
                .setTitle('✅ Application Approved')
                .setDescription(`Successfully approved application for ${application.airline_name}`)
                .addFields(
                    {
                        name: 'Airline',
                        value: application.airline_name,
                        inline: true
                    },
                    {
                        name: 'Codes',
                        value: `${application.iata_code || 'N/A'} / ${application.icao_code || 'N/A'}`,
                        inline: true
                    },
                    {
                        name: 'Status',
                        value: 'Approved and airline created',
                        inline: true
                    }
                )
                .setColor('#10B981');
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('reject')
            .setDescription('Reject an application')
            .addIntegerOption(option =>
                option.setName('application_id')
                    .setDescription('Application ID to reject')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }
            
            const applicationId = interaction.options.getInteger('application_id');
            
            const application = await Application.updateStatus(applicationId, 'rejected', interaction.user.id);
            
            if (!application) {
                const embed = createEmbed()
                    .setTitle('❌ Application Not Found')
                    .setDescription(`No application found with ID ${applicationId}.`)
                    .setColor('#EF4444');
                
                return await interaction.reply({ embeds: [embed] });
            }
            
            const embed = createEmbed()
                .setTitle('❌ Application Rejected')
                .setDescription(`Application for ${application.airline_name} has been rejected.`)
                .addFields({
                    name: 'Airline',
                    value: application.airline_name,
                    inline: true
                })
                .setColor('#EF4444');
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('kick')
            .setDescription('Remove a member from the alliance')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('User to remove')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }
            
            const targetUser = interaction.options.getUser('user');
            
            const user = await User.findById(targetUser.id);
            if (!user) {
                const embed = createEmbed()
                    .setTitle('❌ User Not Found')
                    .setDescription(`${targetUser.username} is not registered in the alliance.`)
                    .setColor('#EF4444');
                
                return await interaction.reply({ embeds: [embed] });
            }
            
            // Remove user's airline assignment
            await User.setAirline(targetUser.id, null);
            
            const embed = createEmbed()
                .setTitle('✅ Member Removed')
                .setDescription(`${targetUser.username} has been removed from the alliance.`)
                .addFields({
                    name: 'Former Airline',
                    value: user.airline_id || 'None',
                    inline: true
                })
                .setColor('#EF4444');
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('announce')
            .setDescription('Make an alliance announcement')
            .addStringOption(option =>
                option.setName('message')
                    .setDescription('Announcement message')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }
            
            const announcement = interaction.options.getString('message');
            
            // Create news entry
            await News.create({
                title: 'Alliance Announcement',
                content: announcement,
                author: interaction.user.username
            });
            
            const embed = createEmbed()
                .setTitle('📢 Sky Alliance Announcement')
                .setDescription(announcement)
                .addFields({
                    name: 'Announced by',
                    value: interaction.user.username,
                    inline: true
                })
                .setFooter({ text: 'Sky Alliance • Official Announcement' });
            
            // Try to send to announcements channel
            const announcementChannel = interaction.guild.channels.cache.find(
                channel => channel.name === config.channels.announcements
            );
            
            if (announcementChannel) {
                await announcementChannel.send({ embeds: [embed] });
                await interaction.reply({ content: '✅ Announcement posted successfully!', ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('setairline')
            .setDescription('Set user airline')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('User to assign airline to')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('airline_id')
                    .setDescription('Airline ID to assign')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }
            
            const targetUser = interaction.options.getUser('user');
            const airlineId = interaction.options.getString('airline_id');
            
            let user = await User.findById(targetUser.id);
            if (!user) {
                user = await User.create({
                    id: targetUser.id,
                    username: targetUser.username,
                    discriminator: targetUser.discriminator
                });
            }
            
            const airline = await Airline.findById(airlineId);
            if (!airline) {
                const embed = createEmbed()
                    .setTitle('❌ Airline Not Found')
                    .setDescription(`No airline found with ID "${airlineId}".`)
                    .setColor('#EF4444');
                
                return await interaction.reply({ embeds: [embed] });
            }
            
            await User.setAirline(targetUser.id, airlineId);
            
            const embed = createEmbed()
                .setTitle('✅ Airline Assigned')
                .setDescription(`Successfully assigned ${targetUser.username} to ${airline.name}`)
                .addFields(
                    {
                        name: 'User',
                        value: targetUser.username,
                        inline: true
                    },
                    {
                        name: 'Airline',
                        value: airline.name,
                        inline: true
                    },
                    {
                        name: 'Codes',
                        value: `${airline.iata_code || 'N/A'} / ${airline.icao_code || 'N/A'}`,
                        inline: true
                    }
                )
                .setColor('#10B981');
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('sethub')
            .setDescription('Add a hub airport')
            .addStringOption(option =>
                option.setName('iata_code')
                    .setDescription('IATA code (e.g., JFK)')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('Airport name')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('city')
                    .setDescription('City')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('country')
                    .setDescription('Country')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('icao_code')
                    .setDescription('ICAO code (optional)')
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }
            
            const iataCode = interaction.options.getString('iata_code').toUpperCase();
            const name = interaction.options.getString('name');
            const city = interaction.options.getString('city');
            const country = interaction.options.getString('country');
            const icaoCode = interaction.options.getString('icao_code')?.toUpperCase();
            
            try {
                const hub = await Hub.create({
                    iata_code: iataCode,
                    icao_code: icaoCode,
                    name: name,
                    city: city,
                    country: country
                });
                
                const embed = createEmbed()
                    .setTitle('✅ Hub Added')
                    .setDescription(`Successfully added ${name} as a Sky Alliance hub`)
                    .addFields(
                        {
                            name: 'Airport',
                            value: `${name} (${iataCode})`,
                            inline: true
                        },
                        {
                            name: 'Location',
                            value: `${city}, ${country}`,
                            inline: true
                        },
                        {
                            name: 'ICAO Code',
                            value: icaoCode || 'Not specified',
                            inline: true
                        }
                    )
                    .setColor('#10B981');
                
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                const embed = createEmbed()
                    .setTitle('❌ Error Adding Hub')
                    .setDescription(`Failed to add hub: ${error.message}`)
                    .setColor('#EF4444');
                
                await interaction.reply({ embeds: [embed] });
            }
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('addcodeshare')
            .setDescription('Add a codeshare route')
            .addStringOption(option =>
                option.setName('flight_number')
                    .setDescription('Flight number (e.g., SK1234)')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('airline_id')
                    .setDescription('Airline ID')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('departure')
                    .setDescription('Departure airport code')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('arrival')
                    .setDescription('Arrival airport code')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('description')
                    .setDescription('Route description (optional)')
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }
            
            const flightNumber = interaction.options.getString('flight_number').toUpperCase();
            const airlineId = interaction.options.getString('airline_id');
            const departure = interaction.options.getString('departure').toUpperCase();
            const arrival = interaction.options.getString('arrival').toUpperCase();
            const description = interaction.options.getString('description');
            
            const airline = await Airline.findById(airlineId);
            if (!airline) {
                const embed = createEmbed()
                    .setTitle('❌ Airline Not Found')
                    .setDescription(`No airline found with ID "${airlineId}".`)
                    .setColor('#EF4444');
                
                return await interaction.reply({ embeds: [embed] });
            }
            
            try {
                const codeshare = await Codeshare.create({
                    flight_number: flightNumber,
                    airline_id: airlineId,
                    departure_airport: departure,
                    arrival_airport: arrival,
                    route_description: description
                });
                
                const embed = createEmbed()
                    .setTitle('✅ Codeshare Added')
                    .setDescription(`Successfully added codeshare route ${flightNumber}`)
                    .addFields(
                        {
                            name: 'Flight',
                            value: `${flightNumber} (${airline.name})`,
                            inline: true
                        },
                        {
                            name: 'Route',
                            value: `${departure} → ${arrival}`,
                            inline: true
                        },
                        {
                            name: 'Description',
                            value: description || 'No description provided',
                            inline: false
                        }
                    )
                    .setColor('#10B981');
                
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                const embed = createEmbed()
                    .setTitle('❌ Error Adding Codeshare')
                    .setDescription(`Failed to add codeshare: ${error.message}`)
                    .setColor('#EF4444');
                
                await interaction.reply({ embeds: [embed] });
            }
        }
    }
];

module.exports = slashAdminCommands;