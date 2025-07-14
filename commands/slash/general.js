const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { User, Airline, Hub, Codeshare, Event, News } = require('../../models/schema');
const { airlines } = require('../../data/airlines');
const { hubs } = require('../../data/hubs');

const slashGeneralCommands = [
    {
        data: new SlashCommandBuilder()
            .setName('help')
            .setDescription('Display all available commands'),
        async execute(interaction) {
            const embed = createEmbed()
                .setTitle('🛩️ Star Alliance Commands')
                .setDescription('The World\'s Leading Virtual Airline Alliance in GeoFS')
                .addFields(
                    {
                        name: '📋 General Commands',
                        value: '`/help` - Show this help menu\n`/info` - Alliance information\n`/apply` - Apply to join the alliance\n`/rules` - View alliance rules\n`/airlines` - List member airlines\n`/members` - Show alliance members\n`/hubs` - List alliance hubs\n`/events` - Upcoming events\n`/livery` - Star Alliance livery info\n`/codeshares` - View codeshare routes\n`/flight` - Flight information\n`/news` - Latest alliance news\n`/mission` - Current alliance mission',
                        inline: true
                    },
                    {
                        name: '🏆 XP System',
                        value: '`/xp` - Check your XP\n`/profile` - View user profile\n`/leaderboard` - Top members',
                        inline: true
                    },
                    {
                        name: '👑 Admin Commands',
                        value: '`/addxp` - Add XP to user\n`/approve` - Approve application\n`/reject` - Reject application\n`/kick` - Remove member\n`/announce` - Make announcement\n`/setairline` - Set user airline\n`/sethub` - Add hub\n`/addcodeshare` - Add codeshare',
                        inline: true
                    }
                )
                .setFooter({ text: 'Star Alliance • The World\'s Leading Virtual Airline Alliance' });
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('info')
            .setDescription('Display Star Alliance information'),
        async execute(interaction) {
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
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('apply')
            .setDescription('Apply to join Star Alliance'),
        async execute(interaction) {
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
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('rules')
            .setDescription('Display alliance rules'),
        async execute(interaction) {
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
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('airlines')
            .setDescription('List member airlines'),
        async execute(interaction) {
            const memberAirlines = await Airline.getAll();
            
            if (memberAirlines.length === 0) {
                // Show default airlines from data file
                const defaultAirlines = Object.values(airlines).slice(0, 10);
                const embed = createEmbed()
                    .setTitle('✈️ Sky Alliance Member Airlines')
                    .setDescription('Our prestigious member carriers around the world');
                
                defaultAirlines.forEach(airline => {
                    embed.addFields({
                        name: `${airline.name} (${airline.iata})`,
                        value: `**Hub:** ${airline.hub}\n**Description:** ${airline.description}`,
                        inline: true
                    });
                });
                
                embed.setFooter({ text: `${Object.keys(airlines).length} total airlines available` });
                return await interaction.reply({ embeds: [embed] });
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
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('members')
            .setDescription('Show alliance members'),
        async execute(interaction) {
            const members = await User.getLeaderboard(50);
            
            if (members.length === 0) {
                const embed = createEmbed()
                    .setTitle('👥 Alliance Members')
                    .setDescription('No members registered yet.')
                    .setColor('#F59E0B');
                
                return await interaction.reply({ embeds: [embed] });
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
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('hubs')
            .setDescription('List alliance hubs'),
        async execute(interaction) {
            const allianceHubs = await Hub.getAll();
            
            const embed = createEmbed()
                .setTitle('🏢 Star Alliance Hubs')
                .setDescription('Our shared international airport hubs worldwide');
            
            if (allianceHubs.length === 0) {
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
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('events')
            .setDescription('Show upcoming events'),
        async execute(interaction) {
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
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('livery')
            .setDescription('Star Alliance livery information'),
        async execute(interaction) {
            const embed = createEmbed()
                .setTitle('🎨 Star Alliance Livery Program')
                .setDescription('One aircraft from each member airline painted in official Star Alliance livery')
                .addFields(
                    {
                        name: '✈️ Livery Requirements',
                        value: '• Official Star Alliance color scheme\n• Alliance logo placement\n• Member airline identification\n• Professional appearance standards',
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
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('codeshares')
            .setDescription('View codeshare routes'),
        async execute(interaction) {
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
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('flight')
            .setDescription('Flight information lookup')
            .addStringOption(option =>
                option.setName('query')
                    .setDescription('Flight number or route to search for')
                    .setRequired(true)),
        async execute(interaction) {
            const query = interaction.options.getString('query');
            
            const embed = createEmbed()
                .setTitle('✈️ Flight Search')
                .setDescription(`Searching for: "${query}"`)
                .addFields({
                    name: 'Search Results',
                    value: 'Flight search functionality will be implemented as codeshare data becomes available.',
                    inline: false
                })
                .setFooter({ text: 'Use /codeshares to view available routes' });
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('news')
            .setDescription('Latest alliance news'),
        async execute(interaction) {
            const latestNews = await News.getLatest(5);
            
            const embed = createEmbed()
                .setTitle('📰 Star Alliance News')
                .setDescription('Latest updates and announcements');
            
            if (latestNews.length === 0) {
                embed.addFields({
                    name: 'No News Available',
                    value: 'Check back later for alliance updates and announcements!',
                    inline: false
                });
            } else {
                latestNews.forEach(news => {
                    const publishDate = new Date(news.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    embed.addFields({
                        name: news.title,
                        value: `${news.content}\n\n*Published by ${news.author} on ${publishDate}*`,
                        inline: false
                    });
                });
            }
            
            embed.setFooter({ text: 'Stay updated with Star Alliance developments' });
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('mission')
            .setDescription('Current alliance mission'),
        async execute(interaction) {
            const embed = createEmbed()
                .setTitle('🎯 Star Alliance Mission')
                .setDescription('Our current objectives and goals')
                .addFields(
                    {
                        name: '🌍 Primary Mission',
                        value: 'To unite GeoFS\'s most authentic airlines under a single alliance that promotes global reach, shared standards, and true realism in virtual aviation.',
                        inline: false
                    },
                    {
                        name: '🎯 Current Objectives',
                        value: '• Expand alliance membership with quality airlines\n• Develop codeshare network between members\n• Host regular events and airshows\n• Maintain professional standards across all operations\n• Foster cooperation and friendship among pilots',
                        inline: false
                    },
                    {
                        name: '📈 Growth Goals',
                        value: '• Establish presence in all major global regions\n• Create comprehensive training programs\n• Build alliance-wide communication networks\n• Develop specialized flight operations',
                        inline: false
                    }
                )
                .setFooter({ text: 'Together we fly further' });
            
            await interaction.reply({ embeds: [embed] });
        }
    }
];

module.exports = slashGeneralCommands;