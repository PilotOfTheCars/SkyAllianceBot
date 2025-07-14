const { EmbedBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embeds');
const { hasAdminPermission } = require('../utils/permissions');
const { User, Airline, Hub, Codeshare, Application, News } = require('../models/schema');
const config = require('../config/bot');

const adminCommands = {
    addxp: {
        name: 'addxp',
        description: 'Add XP to a user',
        usage: '!addxp <@user> <amount>',
        adminOnly: true,
        execute: async (message, args) => {
            if (!hasAdminPermission(message.member)) {
                return await message.reply('❌ You need administrator permissions to use this command.');
            }
            
            const targetUser = message.mentions.users.first();
            const amount = parseInt(args[1]);
            
            if (!targetUser || isNaN(amount)) {
                const embed = createEmbed()
                    .setTitle('❌ Invalid Usage')
                    .setDescription('Please mention a user and specify an XP amount.')
                    .addFields({
                        name: 'Usage',
                        value: '`!addxp @user 100`',
                        inline: false
                    })
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
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
            
            await message.reply({ embeds: [embed] });
        }
    },

    approve: {
        name: 'approve',
        description: 'Approve an application',
        usage: '!approve <application_id>',
        adminOnly: true,
        execute: async (message, args) => {
            if (!hasAdminPermission(message.member)) {
                return await message.reply('❌ You need administrator permissions to use this command.');
            }
            
            const applicationId = parseInt(args[0]);
            if (isNaN(applicationId)) {
                const embed = createEmbed()
                    .setTitle('❌ Invalid Usage')
                    .setDescription('Please provide a valid application ID.')
                    .addFields({
                        name: 'Usage',
                        value: '`!approve 1`',
                        inline: false
                    })
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const application = await Application.updateStatus(applicationId, 'approved', message.author.id);
            
            if (!application) {
                const embed = createEmbed()
                    .setTitle('❌ Application Not Found')
                    .setDescription(`No application found with ID ${applicationId}.`)
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
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
            
            await message.reply({ embeds: [embed] });
        }
    },

    reject: {
        name: 'reject',
        description: 'Reject an application',
        usage: '!reject <application_id>',
        adminOnly: true,
        execute: async (message, args) => {
            if (!hasAdminPermission(message.member)) {
                return await message.reply('❌ You need administrator permissions to use this command.');
            }
            
            const applicationId = parseInt(args[0]);
            if (isNaN(applicationId)) {
                const embed = createEmbed()
                    .setTitle('❌ Invalid Usage')
                    .setDescription('Please provide a valid application ID.')
                    .addFields({
                        name: 'Usage',
                        value: '`!reject 1`',
                        inline: false
                    })
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const application = await Application.updateStatus(applicationId, 'rejected', message.author.id);
            
            if (!application) {
                const embed = createEmbed()
                    .setTitle('❌ Application Not Found')
                    .setDescription(`No application found with ID ${applicationId}.`)
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
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
            
            await message.reply({ embeds: [embed] });
        }
    },

    kick: {
        name: 'kick',
        description: 'Remove a member from the alliance',
        usage: '!kick <@user>',
        adminOnly: true,
        execute: async (message, args) => {
            if (!hasAdminPermission(message.member)) {
                return await message.reply('❌ You need administrator permissions to use this command.');
            }
            
            const targetUser = message.mentions.users.first();
            if (!targetUser) {
                const embed = createEmbed()
                    .setTitle('❌ Invalid Usage')
                    .setDescription('Please mention a user to remove.')
                    .addFields({
                        name: 'Usage',
                        value: '`!kick @user`',
                        inline: false
                    })
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const user = await User.findById(targetUser.id);
            if (!user) {
                const embed = createEmbed()
                    .setTitle('❌ User Not Found')
                    .setDescription(`${targetUser.username} is not registered in the alliance.`)
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
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
            
            await message.reply({ embeds: [embed] });
        }
    },

    announce: {
        name: 'announce',
        description: 'Make an alliance announcement',
        usage: '!announce <message>',
        adminOnly: true,
        execute: async (message, args) => {
            if (!hasAdminPermission(message.member)) {
                return await message.reply('❌ You need administrator permissions to use this command.');
            }
            
            if (!args.length) {
                const embed = createEmbed()
                    .setTitle('❌ Invalid Usage')
                    .setDescription('Please provide an announcement message.')
                    .addFields({
                        name: 'Usage',
                        value: '`!announce Welcome to Star Alliance!`',
                        inline: false
                    })
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const announcement = args.join(' ');
            
            // Create news entry
            await News.create({
                title: 'Alliance Announcement',
                content: announcement,
                author: message.author.username
            });
            
            const embed = createEmbed()
                .setTitle('📢 OFFICIAL STAR ALLIANCE ANNOUNCEMENT')
                .setDescription(announcement)
                .addFields(
                    {
                        name: '👤 Announced by',
                        value: message.author.username,
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
                        value: 'Star Alliance Administration',
                        inline: true
                    }
                )
                .setColor('#3B82F6')
                .setThumbnail(config.logos.main)
                .setFooter({ text: 'Sky Alliance • Official Communication • The World\'s Leading Virtual Airline Alliance' });
            
            // Send to specific announcement channel
            const announcementChannel = message.guild.channels.cache.get('1394220009001193595');
            
            if (announcementChannel) {
                await announcementChannel.send({ 
                    content: '@everyone', 
                    embeds: [embed] 
                });
                await message.reply('✅ Official announcement posted successfully!');
            } else {
                await message.reply('❌ Could not find the official announcement channel. Please check channel permissions.');
            }
        }
    },

    setairline: {
        name: 'setairline',
        description: 'Set user airline',
        usage: '!setairline <@user> <airline_id>',
        adminOnly: true,
        execute: async (message, args) => {
            if (!hasAdminPermission(message.member)) {
                return await message.reply('❌ You need administrator permissions to use this command.');
            }
            
            const targetUser = message.mentions.users.first();
            const airlineId = args[1];
            
            if (!targetUser || !airlineId) {
                const embed = createEmbed()
                    .setTitle('❌ Invalid Usage')
                    .setDescription('Please mention a user and provide an airline ID.')
                    .addFields({
                        name: 'Usage',
                        value: '`!setairline @user airline-id`',
                        inline: false
                    })
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
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
                
                return await message.reply({ embeds: [embed] });
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
            
            await message.reply({ embeds: [embed] });
        }
    },

    sethub: {
        name: 'sethub',
        description: 'Add a hub airport',
        usage: '!sethub <iata_code> <name> <city> <country>',
        adminOnly: true,
        execute: async (message, args) => {
            if (!hasAdminPermission(message.member)) {
                return await message.reply('❌ You need administrator permissions to use this command.');
            }
            
            if (args.length < 4) {
                const embed = createEmbed()
                    .setTitle('❌ Invalid Usage')
                    .setDescription('Please provide all required hub information.')
                    .addFields({
                        name: 'Usage',
                        value: '`!sethub JFK "John F Kennedy International" "New York" "United States"`',
                        inline: false
                    })
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const iataCode = args[0].toUpperCase();
            const name = args.slice(1).join(' ').replace(/"/g, '');
            const parts = name.split(' ');
            const city = parts[parts.length - 2];
            const country = parts[parts.length - 1];
            const airportName = parts.slice(0, parts.length - 2).join(' ');
            
            const existingHub = await Hub.findByCode(iataCode);
            if (existingHub) {
                const embed = createEmbed()
                    .setTitle('❌ Hub Already Exists')
                    .setDescription(`A hub with code ${iataCode} already exists.`)
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const hub = await Hub.create({
                iata_code: iataCode,
                name: airportName,
                city: city,
                country: country
            });
            
            const embed = createEmbed()
                .setTitle('✅ Hub Added')
                .setDescription(`Successfully added ${airportName} as an alliance hub`)
                .addFields(
                    {
                        name: 'Code',
                        value: iataCode,
                        inline: true
                    },
                    {
                        name: 'Location',
                        value: `${city}, ${country}`,
                        inline: true
                    },
                    {
                        name: 'Name',
                        value: airportName,
                        inline: false
                    }
                )
                .setColor('#10B981');
            
            await message.reply({ embeds: [embed] });
        }
    },

    addcodeshare: {
        name: 'addcodeshare',
        description: 'Add a codeshare route',
        usage: '!addcodeshare <flight_number> <airline_id> <departure> <arrival> [description]',
        adminOnly: true,
        execute: async (message, args) => {
            if (!hasAdminPermission(message.member)) {
                return await message.reply('❌ You need administrator permissions to use this command.');
            }
            
            if (args.length < 4) {
                const embed = createEmbed()
                    .setTitle('❌ Invalid Usage')
                    .setDescription('Please provide all required codeshare information.')
                    .addFields({
                        name: 'Usage',
                        value: '`!addcodeshare SA123 united-airlines JFK LAX "Daily service"`',
                        inline: false
                    })
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const flightNumber = args[0].toUpperCase();
            const airlineId = args[1];
            const departure = args[2].toUpperCase();
            const arrival = args[3].toUpperCase();
            const description = args.slice(4).join(' ') || null;
            
            const airline = await Airline.findById(airlineId);
            if (!airline) {
                const embed = createEmbed()
                    .setTitle('❌ Airline Not Found')
                    .setDescription(`No airline found with ID "${airlineId}".`)
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const existingCodeshare = await Codeshare.findByFlight(flightNumber);
            if (existingCodeshare) {
                const embed = createEmbed()
                    .setTitle('❌ Flight Already Exists')
                    .setDescription(`A codeshare with flight number ${flightNumber} already exists.`)
                    .setColor('#EF4444');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const codeshare = await Codeshare.create({
                flight_number: flightNumber,
                airline_id: airlineId,
                departure_airport: departure,
                arrival_airport: arrival,
                route_description: description
            });
            
            const embed = createEmbed()
                .setTitle('✅ Codeshare Added')
                .setDescription(`Successfully added codeshare flight ${flightNumber}`)
                .addFields(
                    {
                        name: 'Flight',
                        value: flightNumber,
                        inline: true
                    },
                    {
                        name: 'Airline',
                        value: airline.name,
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
            
            await message.reply({ embeds: [embed] });
        }
    }
};

module.exports = adminCommands;
