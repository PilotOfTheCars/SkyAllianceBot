const { EmbedBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embeds');
const { User } = require('../models/schema');
const config = require('../config/bot');

const xpCommands = {
    xp: {
        name: 'xp',
        description: 'Check your XP and level',
        usage: '!xp',
        execute: async (message, args) => {
            const userId = message.author.id;
            let user = await User.findById(userId);
            
            if (!user) {
                user = await User.create({
                    id: userId,
                    username: message.author.username,
                    discriminator: message.author.discriminator
                });
            }
            
            const nextLevelXP = user.level * config.xp.levelMultiplier;
            const currentLevelXP = (user.level - 1) * config.xp.levelMultiplier;
            const progressXP = user.xp - currentLevelXP;
            const neededXP = nextLevelXP - user.xp;
            
            const embed = createEmbed()
                .setTitle('🏆 Your Sky Alliance Profile')
                .setDescription(`${message.author.username}'s progress in the alliance`)
                .addFields(
                    {
                        name: '📊 Statistics',
                        value: `**Level:** ${user.level}\n**Total XP:** ${user.xp}\n**Next Level:** ${neededXP} XP needed`,
                        inline: true
                    },
                    {
                        name: '✈️ Airline',
                        value: user.airline_id || 'Not assigned',
                        inline: true
                    },
                    {
                        name: '📈 Progress',
                        value: `${progressXP}/${nextLevelXP - currentLevelXP} XP\n${'█'.repeat(Math.floor((progressXP / (nextLevelXP - currentLevelXP)) * 10))}${'░'.repeat(10 - Math.floor((progressXP / (nextLevelXP - currentLevelXP)) * 10))}`,
                        inline: false
                    }
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter({ text: 'Keep flying to earn more XP!' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    profile: {
        name: 'profile',
        description: 'View user profile',
        usage: '!profile [@user]',
        execute: async (message, args) => {
            const target = message.mentions.users.first() || message.author;
            const userId = target.id;
            
            let user = await User.findById(userId);
            
            if (!user) {
                if (target.id === message.author.id) {
                    user = await User.create({
                        id: userId,
                        username: target.username,
                        discriminator: target.discriminator
                    });
                } else {
                    const embed = createEmbed()
                        .setTitle('❌ User Not Found')
                        .setDescription(`${target.username} is not registered in the Sky Alliance system.`)
                        .setColor('#EF4444');
                    
                    return await message.reply({ embeds: [embed] });
                }
            }
            
            const joinDate = new Date(user.joined_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const nextLevelXP = user.level * config.xp.levelMultiplier;
            const currentLevelXP = (user.level - 1) * config.xp.levelMultiplier;
            const progressXP = user.xp - currentLevelXP;
            
            const embed = createEmbed()
                .setTitle(`✈️ ${user.username}'s Profile`)
                .setDescription('Sky Alliance member profile')
                .addFields(
                    {
                        name: '📊 Statistics',
                        value: `**Level:** ${user.level}\n**Total XP:** ${user.xp}\n**Joined:** ${joinDate}`,
                        inline: true
                    },
                    {
                        name: '🏢 Airline',
                        value: user.airline_id || 'Not assigned',
                        inline: true
                    },
                    {
                        name: '📈 Level Progress',
                        value: `${progressXP}/${nextLevelXP - currentLevelXP} XP\n${'█'.repeat(Math.floor((progressXP / (nextLevelXP - currentLevelXP)) * 10))}${'░'.repeat(10 - Math.floor((progressXP / (nextLevelXP - currentLevelXP)) * 10))}`,
                        inline: false
                    }
                )
                .setThumbnail(target.displayAvatarURL())
                .setFooter({ text: 'Sky Alliance Member Profile' });
            
            await message.reply({ embeds: [embed] });
        }
    },

    leaderboard: {
        name: 'leaderboard',
        description: 'View XP leaderboard',
        usage: '!leaderboard',
        execute: async (message, args) => {
            const topUsers = await User.getLeaderboard(15);
            
            if (topUsers.length === 0) {
                const embed = createEmbed()
                    .setTitle('🏆 Sky Alliance Leaderboard')
                    .setDescription('No members registered yet.')
                    .setColor('#F59E0B');
                
                return await message.reply({ embeds: [embed] });
            }
            
            const embed = createEmbed()
                .setTitle('🏆 Sky Alliance Leaderboard')
                .setDescription('Top pilots in the alliance ranked by XP');
            
            const leaderboardText = topUsers.map((user, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                const airline = user.airline_id ? ` (${user.airline_id})` : '';
                return `${medal} **${user.username}**${airline}\n    Level ${user.level} • ${user.xp} XP`;
            }).join('\n\n');
            
            embed.addFields({
                name: 'Top Alliance Members',
                value: leaderboardText,
                inline: false
            });
            
            // Find current user's position
            const currentUser = await User.findById(message.author.id);
            if (currentUser) {
                const allUsers = await User.getLeaderboard(1000);
                const userPosition = allUsers.findIndex(u => u.id === message.author.id) + 1;
                
                embed.addFields({
                    name: 'Your Position',
                    value: `You are ranked #${userPosition} with ${currentUser.xp} XP`,
                    inline: false
                });
            }
            
            embed.setFooter({ text: `${topUsers.length} members ranked` });
            
            await message.reply({ embeds: [embed] });
        }
    }
};

module.exports = xpCommands;
