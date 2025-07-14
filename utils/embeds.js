const { EmbedBuilder } = require('discord.js');
const config = require('../config/bot');

// Create a standardized embed with Star Alliance branding
function createEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTimestamp()
        .setFooter({ 
            text: 'Star Alliance • The World\'s Leading Virtual Airline Alliance',
            iconURL: config.logos.star
        });
}

// Create success embed
function createSuccessEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.success)
        .setTimestamp()
        .setFooter({ 
            text: 'Star Alliance • Success',
            iconURL: config.logos.star
        });
}

// Create error embed
function createErrorEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.error)
        .setTimestamp()
        .setFooter({ 
            text: 'Star Alliance • Error',
            iconURL: config.logos.star
        });
}

// Create warning embed
function createWarningEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.warning)
        .setTimestamp()
        .setFooter({ 
            text: 'Star Alliance • Warning',
            iconURL: config.logos.star
        });
}

// Create info embed
function createInfoEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.info)
        .setTimestamp()
        .setFooter({ 
            text: 'Star Alliance • Information',
            iconURL: config.logos.star
        });
}

// Create announcement embed
function createAnnouncementEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTimestamp()
        .setThumbnail(config.logos.main)
        .setFooter({ 
            text: 'Star Alliance • Official Announcement',
            iconURL: config.logos.star
        });
}

// Create XP embed
function createXPEmbed() {
    return new EmbedBuilder()
        .setColor('#FFD700')
        .setTimestamp()
        .setFooter({ 
            text: 'Star Alliance • XP System',
            iconURL: config.logos.star
        });
}

module.exports = {
    createEmbed,
    createSuccessEmbed,
    createErrorEmbed,
    createWarningEmbed,
    createInfoEmbed,
    createAnnouncementEmbed,
    createXPEmbed
};
