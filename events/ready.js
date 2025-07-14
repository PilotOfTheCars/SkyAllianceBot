const { User } = require('../models/schema');
const config = require('../config/bot');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Sky Alliance Bot is ready! Logged in as ${client.user.tag}`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Monitoring ${client.users.cache.size} users`);
        
        // Set bot activity
        client.user.setActivity('Sky Alliance Operations', { type: 'WATCHING' });
        
        // Log some statistics
        try {
            const allUsers = await User.getLeaderboard(1000);
            console.log(`🏆 ${allUsers.length} registered alliance members`);
        } catch (error) {
            console.error('Error fetching user statistics:', error);
        }
        
        console.log('🛩️ Sky Alliance Bot fully initialized!');
    }
};
