const { EmbedBuilder } = require('discord.js');
const config = require('../config/bot');

// Create a standardized embed with Sky Alliance branding
function createEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTimestamp()
        .setFooter({ 
            text: 'Sky Alliance • The World\'s Leading Virtual Airline Alliance',
            iconURL: config.logos.star
        });
}

// Create success embed
function createSuccessEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.success)
        .setTimestamp()
        .setFooter({ 
            text: 'Sky Alliance • Success',
            iconURL: config.logos.star
        });
}

// Create error embed
function createErrorEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.error)
        .setTimestamp()
        .setFooter({ 
            text: 'Sky Alliance • Error',
            iconURL: config.logos.star
        });
}

// Create warning embed
function createWarningEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.warning)
        .setTimestamp()
        .setFooter({ 
            text: 'Sky Alliance • Warning',
            iconURL: config.logos.star
        });
}

// Create info embed
function createInfoEmbed() {
    return new EmbedBuilder()
        .setColor(config.colors.info)
        .setTimestamp()
        .setFooter({ 
            text: 'Sky Alliance • Information',
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
            text: 'Sky Alliance • Official Announcement',
            iconURL: config.logos.star
        });
}

// Create XP embed
function createXPEmbed() {
    return new EmbedBuilder()
        .setColor('#FFD700')
        .setTimestamp()
        .setFooter({ 
            text: 'Sky Alliance • XP System',
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
