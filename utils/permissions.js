const config = require('../config/bot');

// Check if user has admin permissions
function hasAdminPermission(member) {
    if (!member) return false;
    
    // Check if user has administrator permission
    if (member.permissions.has('Administrator')) return true;
    
    // Check if user has the Sky Alliance Admin role
    const adminRole = member.roles.cache.find(role => role.name === config.roles.admin);
    if (adminRole) return true;
    
    // Check if user has manage guild permission
    if (member.permissions.has('ManageGuild')) return true;
    
    return false;
}

// Check if user has member permissions
function hasMemberPermission(member) {
    if (!member) return false;
    
    // Admins always have member permissions
    if (hasAdminPermission(member)) return true;
    
    // Check if user has the Sky Alliance Member role
    const memberRole = member.roles.cache.find(role => role.name === config.roles.member);
    if (memberRole) return true;
    
    // Check if user has the Sky Alliance Pilot role
    const pilotRole = member.roles.cache.find(role => role.name === config.roles.pilot);
    if (pilotRole) return true;
    
    return false;
}

// Check if user is alliance member
function isAllianceMember(member) {
    return hasMemberPermission(member);
}

// Get user's highest role in the alliance
function getUserAllianceRole(member) {
    if (!member) return null;
    
    if (hasAdminPermission(member)) return 'admin';
    if (hasMemberPermission(member)) return 'member';
    
    return null;
}

module.exports = {
    hasAdminPermission,
    hasMemberPermission,
    isAllianceMember,
    getUserAllianceRole
};
