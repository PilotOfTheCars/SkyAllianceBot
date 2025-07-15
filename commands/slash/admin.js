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
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('User to approve')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription('Reason for approval')
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            const { hasAdminPermission } = require('../../utils/permissions');

            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }

            const targetUser = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';

            // Find application by user ID
            if (global.applications) {
                for (const [code, app] of global.applications.entries()) {
                    if (app.userId === targetUser.id && app.status === 'pending') {
                        app.status = 'approved';
                        app.approvedBy = interaction.user.username;
                        app.approvedAt = new Date().toISOString();
                        app.reason = reason;
                        break;
                    }
                }
            }

            const embed = createEmbed()
                .setTitle('✅ Application Approved')
                .setDescription(`${targetUser.username}'s application has been approved!`)
                .addFields({
                    name: 'Reason',
                    value: reason,
                    inline: false
                })
                .setColor('#10B981');

            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('reject')
            .setDescription('Reject an application')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('User to reject')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription('Reason for rejection')
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            const { hasAdminPermission } = require('../../utils/permissions');

            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }

            const targetUser = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';

            // Find application by user ID
            if (global.applications) {
                for (const [code, app] of global.applications.entries()) {
                    if (app.userId === targetUser.id && app.status === 'pending') {
                        app.status = 'rejected';
                        app.rejectedBy = interaction.user.username;
                        app.rejectedAt = new Date().toISOString();
                        app.reason = reason;
                        break;
                    }
                }
            }

            const embed = createEmbed()
                .setTitle('❌ Application Rejected')
                .setDescription(`${targetUser.username}'s application has been rejected.`)
                .addFields({
                    name: 'Reason',
                    value: reason,
                    inline: false
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
                .setTitle('📢 OFFICIAL SKY ALLIANCE ANNOUNCEMENT')
                .setDescription(announcement)
                .addFields(
                    {
                        name: '👤 Announced by',
                        value: interaction.user.username,
                        inline: true
                    },
                    {
                        name: '📅 Date',
                        value: new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        inline: true
                    },
                    {
                        name: '🏢 Authority',
                        value: 'Sky Alliance Administration',
                        inline: true
                    }
                )
                .setColor('#3B82F6')
                .setThumbnail(config.logos.main)
                .setFooter({ text: 'Sky Alliance • Official Communication • The World\'s Leading Virtual Airline Alliance' });

            // Send to specific announcement channel
            const announcementChannel = interaction.guild.channels.cache.get('1394220009001193595');

            if (announcementChannel) {
                await announcementChannel.send({ 
                    content: '@everyone', 
                    embeds: [embed] 
                });
                await interaction.reply({ content: '✅ Official announcement posted successfully!', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Could not find the official announcement channel. Please check channel permissions.', ephemeral: true });
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
            .setName('viewapp')
            .setDescription('View an application by code')
            .addStringOption(option =>
                option.setName('code')
                    .setDescription('Application code')
                    .setRequired(true)
            ),
        async execute(interaction) {
            const { hasAdminPermission } = require('../../utils/permissions');

            if (!hasAdminPermission(interaction.member)) {
                return await interaction.reply({ content: '❌ You need administrator permissions to use this command.', ephemeral: true });
            }

            const code = interaction.options.getString('code').toUpperCase();

            if (!global.applications || !global.applications.has(code)) {
                return await interaction.reply({ content: '❌ Application not found.', ephemeral: true });
            }

            const app = global.applications.get(code);
            const embed = createEmbed()
                .setTitle(`📋 Application ${code}`)
                .setDescription(`Application details for review`)
                .addFields(
                    { name: 'Applicant', value: `<@${app.userId}> (${app.username})`, inline: true },
                    { name: 'Status', value: app.status, inline: true },
                    { name: 'Submitted', value: new Date(app.submittedAt).toLocaleDateString(), inline: true },
                    { name: 'Airline Name', value: app.airlineName, inline: true },
                    { name: 'Airline Code', value: app.airlineCode, inline: true },
                    { name: 'Hub', value: app.hub, inline: true },
                    { name: 'Contact', value: app.contact, inline: false },
                    { name: 'Experience', value: app.experience, inline: false }
                )
                .setColor(app.status === 'pending' ? '#F59E0B' : app.status === 'approved' ? '#10B981' : '#EF4444');

            await interaction.reply({ embeds: [embed] });
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