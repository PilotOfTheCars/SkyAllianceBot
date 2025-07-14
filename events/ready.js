const { User } = require('../models/schema');
const config = require('../config/bot');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Star Alliance Bot is ready! Logged in as ${client.user.tag}`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Monitoring ${client.users.cache.size} users`);
        
        // Set bot activity
        client.user.setActivity('Star Alliance Operations', { type: 'WATCHING' });
        
        // Log some statistics
        try {
            const allUsers = await User.getLeaderboard(1000);
            console.log(`🏆 ${allUsers.length} registered alliance members`);
        } catch (error) {
            console.error('Error fetching user statistics:', error);
        }
        
        console.log('🛩️ Star Alliance Bot fully initialized!');
    }
};
