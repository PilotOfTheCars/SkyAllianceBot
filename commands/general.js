const { EmbedBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embeds');
const { User, Airline, Hub, Codeshare, Event, News } = require('../models/schema');
const { airlines } = require('../data/airlines');
const { hubs } = require('../data/hubs');

const generalCommands = {
    help: {
        name: 'help',
        description: 'Display all available commands',
        usage: '!help',
        execute: async (message, args) => {
            const embed = createEmbed()
                .setTitle('🛩️ Star Alliance Commands')
                .setDescription('The World\'s Leading Virtual Airline Alliance in GeoFS')
                .addFields(
                    {
                        name: '📋 General Commands',
                        value: '`!help` - Show this help menu\n`!info` - Alliance information\n`!apply` - Apply to join the alliance\n`!rules` - View alliance rules\n`!airlines` - List member airlines\n`!members` - Show alliance members\n`!hubs` - List alliance hubs\n`!events` - Upcoming events\n`!livery` - Star Alliance livery info\n`!codeshares` - View codeshare routes\n`!flight [route]` - Flight information\n`!news` - Latest alliance news\n`!mission` - Current alliance mission',
                        inline: true
                    },
                    {
                        name: '🏆 XP System',
                        value: '`!xp` - Check your XP\n`!profile [@user]` - View user profile\n`!leaderboard` - Top members',
                        inline: true
                    },
                    {
                        name: '👑 Admin Commands',
                        value: '`!addxp <@user> <amount>` - Add XP\n`!approve <id>` - Approve application\n`!reject <id>` - Reject application\n`!kick <@user>` - Remove member\n`!announce <message>` - Make announcement\n`!setairline <@user> <airline>` - Set user airline\n`!sethub <code> <name>` - Add hub\n`!addcodeshare <flight> <route>` - Add codeshare',
                        inline: true
                    }
                )
                .setFooter({ text: 'Star Alliance • The World\'s Leading Virtual Airline Alliance' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    info: {
        name: 'info',
        description: 'Display Star Alliance information',
        usage: '!info',
        execute: async (message, args) => {
            const embed = createEmbed()
                .setTitle('🌐 Star Alliance')
                .setDescription('The World\'s Leading Virtual Airline Alliance in GeoFS')
                .addFields(
                    {
                        name: '✈️ About Us',
                        value: 'Star Alliance is a global partnership of the most professional and realistic virtual airlines in GeoFS. Modeled after the real-world Star Alliance, we bring together diverse carriers from around the globe to offer a seamless, interconnected aviation experience.',
                        inline: false
                    },
                    {
                        name: '🌍 Our Mission',
                        value: 'To unite GeoFS\'s most authentic airlines under a single alliance that promotes global reach, shared standards, and true realism in virtual aviation.',
                        inline: false
                    },
                    {
                        name: '🏢 What We Offer',
                        value: '• Alliance-Wide Codeshares\n• Star Alliance Livery Program\n• Joint Events & Airshows\n• Star XP Program\n• Shared Hubs & Virtual Lounges\n• Professional Standards',
                        inline: false
                    }
                )
                .setFooter({ text: 'Founded by aviation leaders within the GeoFS community' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    apply: {
        name: 'apply',
        description: 'Apply to join Star Alliance',
        usage: '!apply',
        execute: async (message, args) => {
            const embed = createEmbed()
                .setTitle('📝 Apply to Star Alliance')
                .setDescription('Ready to join the world\'s most prestigious virtual airline alliance?')
                .addFields(
                    {
                        name: '📋 Application Requirements',
                        value: '• Professional airline name and branding\n• Valid IATA/ICAO codes (if applicable)\n• Commitment to realistic operations\n• Active participation in alliance events\n• Adherence to Star Alliance standards',
                        inline: false
                    },
                    {
                        name: '📬 How to Apply',
                        value: 'Send a direct message to any Star Alliance administrator with:\n• Your airline name\n• IATA/ICAO codes\n• Brief description of your airline\n• Why you want to join Star Alliance',
                        inline: false
                    }
                )
                .setFooter({ text: 'Applications are reviewed by our admin team' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    rules: {
        name: 'rules',
        description: 'Display alliance rules',
        usage: '!rules',
        execute: async (message, args) => {
            const embed = createEmbed()
                .setTitle('📜 Star Alliance Rules')
                .setDescription('Professional standards for all member airlines')
                .addFields(
                    {
                        name: '✈️ Flight Operations',
                        value: '• Maintain realistic flight procedures\n• Use proper aviation terminology\n• Follow real-world routes and schedules\n• Respect other aircraft and ATC',
                        inline: false
                    },
                    {
                        name: '🏢 Airline Standards',
                        value: '• Professional airline branding\n• Realistic liveries and fleet\n• Active participation in events\n• Cooperation with other members',
                        inline: false
                    },
                    {
                        name: '💬 Communication',
                        value: '• Respectful interaction with all members\n• Use designated channels appropriately\n• Report issues to administrators\n• Follow Discord community guidelines',
                        inline: false
                    }
                )
                .setFooter({ text: 'Violations may result in removal from the alliance' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    airlines: {
        name: 'airlines',
        description: 'List member airlines',
        usage: '!airlines',
        execute: async (message, args) => {
            const memberAirlines = await Airline.getAll();
            
            if (memberAirlines.length === 0) {
                // Show all airlines from data file
                const allAirlines = Object.values(airlines);
                const embed = createEmbed()
                    .setTitle('✈️ Star Alliance Member Airlines')
                    .setDescription('Our prestigious member carriers around the world');
                
                allAirlines.forEach(airline => {
                    embed.addFields({
                        name: `${airline.name} (${airline.iata})`,
                        value: `**Hub:** ${airline.hub}\n**Description:** ${airline.description}`,
                        inline: true
                    });
                });
                
                embed.setFooter({ text: `${Object.keys(airlines).length} total airlines available` });
                return await message.reply({ embeds: [embed] });
            }
            
            const embed = createEmbed()
                .setTitle('✈️ Sky Alliance Member Airlines')
                .setDescription('Our prestigious member carriers around the world');
            
            memberAirlines.forEach(airline => {
                embed.addFields({
                    name: `${airline.name} (${airline.iata_code || 'N/A'})`,
                    value: `**Hub:** ${airline.hub_airport || 'Not specified'}\n**Description:** ${airline.description || 'No description available'}`,
                    inline: true
                });
            });
            
            embed.setFooter({ text: `${memberAirlines.length} member airlines` });
            
            await message.reply({ embeds: [embed] });
        }
    },

    members: {
        name: 'members',
        description: 'Show alliance members',
        usage: '!members',
        execute: async (message, args) => {
            const members = await User.getLeaderboard(50);
            
            if (members.length === 0) {
                const embed = createEmbed()
                    .setTitle('👥 Alliance Members')
                    .setDescription('No members registered yet.')
                    .setColor('#F59E0B');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const embed = createEmbed()
                .setTitle('👥 Star Alliance Members')
                .setDescription('Our dedicated pilots and crew members');
            
            const memberList = members.slice(0, 20).map((member, index) => {
                const airline = member.airline_id ? ` (${member.airline_id})` : '';
                return `${index + 1}. ${member.username}${airline} - Level ${member.level}`;
            }).join('\n');
            
            embed.addFields({
                name: 'Active Members',
                value: memberList || 'No members found',
                inline: false
            });
            
            embed.setFooter({ text: `${members.length} total members` });
            
            await message.reply({ embeds: [embed] });
        }
    },

    hubs: {
        name: 'hubs',
        description: 'List alliance hubs',
        usage: '!hubs',
        execute: async (message, args) => {
            const allianceHubs = await Hub.getAll();
            
            const embed = createEmbed()
                .setTitle('🏢 Star Alliance Hubs')
                .setDescription('Our shared international airport hubs worldwide');
            
            if (allianceHubs.length === 0) {
                // Show default hubs from data file
                const defaultHubs = Object.values(hubs).slice(0, 8);
                const hubList = defaultHubs.map(hub => 
                    `**${hub.iata}** - ${hub.name}\n${hub.city}, ${hub.country}`
                ).join('\n\n');
                
                embed.addFields({
                    name: 'Primary Hubs',
                    value: hubList,
                    inline: false
                });
            } else {
                const hubList = allianceHubs.map(hub => 
                    `**${hub.iata_code}** - ${hub.name}\n${hub.city}, ${hub.country}`
                ).join('\n\n');
                
                embed.addFields({
                    name: 'Alliance Hubs',
                    value: hubList,
                    inline: false
                });
            }
            
            embed.setFooter({ text: 'Experience shared lounges and joint operations' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    events: {
        name: 'events',
        description: 'Show upcoming events',
        usage: '!events',
        execute: async (message, args) => {
            const upcomingEvents = await Event.getUpcoming();
            
            const embed = createEmbed()
                .setTitle('📅 Upcoming Events')
                .setDescription('Join us for alliance-wide events and airshows');
            
            if (upcomingEvents.length === 0) {
                embed.addFields({
                    name: 'No Upcoming Events',
                    value: 'Check back later for new events and group flights!',
                    inline: false
                });
            } else {
                upcomingEvents.forEach(event => {
                    const eventDate = new Date(event.date_time).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    embed.addFields({
                        name: event.title,
                        value: `**Date:** ${eventDate}\n**Location:** ${event.location}\n**Details:** ${event.description}`,
                        inline: false
                    });
                });
            }
            
            embed.setFooter({ text: 'Regular events include airshows and group flights' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    livery: {
        name: 'livery',
        description: 'Sky Alliance livery information',
        usage: '!livery',
        execute: async (message, args) => {
            const embed = createEmbed()
                .setTitle('🎨 Sky Alliance Livery Program')
                .setDescription('One aircraft from each member airline painted in official Sky Alliance livery')
                .addFields(
                    {
                        name: '✈️ Livery Requirements',
                        value: '• Official Sky Alliance color scheme\n• Alliance logo placement\n• Member airline identification\n• Professional appearance standards',
                        inline: false
                    },
                    {
                        name: '🏆 Benefits',
                        value: '• Represents alliance strength\n• Enhanced visual identity\n• Special event participation\n• Alliance promotion opportunities',
                        inline: false
                    },
                    {
                        name: '📋 Application Process',
                        value: 'Contact alliance administrators to register your livery aircraft and receive design specifications.',
                        inline: false
                    }
                )
                .setFooter({ text: 'Showcase your alliance membership with pride' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    codeshares: {
        name: 'codeshares',
        description: 'View codeshare routes',
        usage: '!codeshares',
        execute: async (message, args) => {
            const codeshares = await Codeshare.getAll();
            
            const embed = createEmbed()
                .setTitle('🤝 Alliance Codeshares')
                .setDescription('Shared flights between member airlines');
            
            if (codeshares.length === 0) {
                embed.addFields({
                    name: 'No Codeshares Available',
                    value: 'Codeshare routes will be added as member airlines coordinate flights.',
                    inline: false
                });
            } else {
                const codeshareList = codeshares.slice(0, 10).map(cs => 
                    `**${cs.flight_number}** (${cs.airline_iata})\n${cs.departure_airport} → ${cs.arrival_airport}\n${cs.route_description || 'No description'}`
                ).join('\n\n');
                
                embed.addFields({
                    name: 'Active Codeshares',
                    value: codeshareList,
                    inline: false
                });
            }
            
            embed.setFooter({ text: 'Realistic flight numbers and routes' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    flight: {
        name: 'flight',
        description: 'Flight information lookup',
        usage: '!flight [route]',
        execute: async (message, args) => {
            if (!args.length) {
                const embed = createEmbed()
                    .setTitle('✈️ Flight Information')
                    .setDescription('Please provide a flight number or route to search for.')
                    .addFields({
                        name: 'Usage Examples',
                        value: '`!flight SA123`\n`!flight JFK-LAX`\n`!flight United`',
                        inline: false
                    })
                    .setColor('#F59E0B');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const query = args.join(' ').toUpperCase();
            const codeshare = await Codeshare.findByFlight(query);
            
            if (codeshare) {
                const embed = createEmbed()
                    .setTitle(`✈️ Flight ${codeshare.flight_number}`)
                    .setDescription('Alliance codeshare flight information')
                    .addFields(
                        {
                            name: 'Route',
                            value: `${codeshare.departure_airport} → ${codeshare.arrival_airport}`,
                            inline: true
                        },
                        {
                            name: 'Operator',
                            value: codeshare.airline_name,
                            inline: true
                        },
                        {
                            name: 'Description',
                            value: codeshare.route_description || 'No additional information',
                            inline: false
                        }
                    )
                    .setFooter({ text: 'Star Alliance Codeshare' });
                
                await message.reply({ embeds: [embed] });
            } else {
                const embed = createEmbed()
                    .setTitle('❌ Flight Not Found')
                    .setDescription(`No codeshare flight found for "${query}".`)
                    .addFields({
                        name: 'Suggestions',
                        value: '• Check the flight number spelling\n• Use `!codeshares` to see all available flights\n• Contact your airline for non-codeshare flights',
                        inline: false
                    })
                    .setColor('#EF4444');
                
                await message.reply({ embeds: [embed] });
            }
        }
    },

    news: {
        name: 'news',
        description: 'Latest alliance news',
        usage: '!news',
        execute: async (message, args) => {
            const latestNews = await News.getLatest();
            
            const embed = createEmbed()
                .setTitle('📰 Alliance News')
                .setDescription('Latest updates from Star Alliance');
            
            if (latestNews.length === 0) {
                embed.addFields({
                    name: 'No News Available',
                    value: 'Check back later for alliance updates and announcements.',
                    inline: false
                });
            } else {
                latestNews.forEach(article => {
                    const publishDate = new Date(article.published_at).toLocaleDateString();
                    embed.addFields({
                        name: article.title,
                        value: `${article.content.substring(0, 200)}${article.content.length > 200 ? '...' : ''}\n\n*Published by ${article.author} on ${publishDate}*`,
                        inline: false
                    });
                });
            }
            
            embed.setFooter({ text: 'Stay updated with alliance developments' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    mission: {
        name: 'mission',
        description: 'Current alliance mission',
        usage: '!mission',
        execute: async (message, args) => {
            const embed = createEmbed()
                .setTitle('🎯 Star Alliance Mission')
                .setDescription('Our commitment to virtual aviation excellence')
                .addFields(
                    {
                        name: '🌍 Global Unity',
                        value: 'Unite GeoFS\'s most authentic airlines under a single alliance that promotes global reach, shared standards, and true realism in virtual aviation.',
                        inline: false
                    },
                    {
                        name: '✈️ Operational Excellence',
                        value: 'Maintain the highest standards of professional flight operations, realistic procedures, and authentic airline management.',
                        inline: false
                    },
                    {
                        name: '🤝 Collaboration',
                        value: 'Foster cooperation between member airlines through codeshares, joint events, and shared resources.',
                        inline: false
                    },
                    {
                        name: '🏆 Innovation',
                        value: 'Lead the virtual aviation community in developing new standards, technologies, and experiences.',
                        inline: false
                    }
                )
                .setFooter({ text: 'Together we fly higher' });
            
            await message.reply({ embeds: [embed] });
        }
    }
};

module.exports = generalCommands;
