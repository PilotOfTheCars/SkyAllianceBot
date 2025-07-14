const config = {
    prefix: '!',
    colors: {
        primary: '#3B82F6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#6B7280'
    },
    roles: {
        admin: 'Sky Alliance Admin',
        member: 'Sky Alliance Member',
        pilot: 'Sky Alliance Pilot'
    },
    channels: {
        applications: 'applications',
        announcements: 'announcements',
        general: 'general'
    },
    xp: {
        messageXp: 5,
        eventXp: 50,
        flightXp: 100,
        levelMultiplier: 100
    },
    logos: {
        main: 'https://cdn.discordapp.com/attachments/your-channel/skyalliance-logo.png',
        star: 'https://cdn.discordapp.com/attachments/your-channel/skyalliance-star.png'
    }
};

module.exports = config;
