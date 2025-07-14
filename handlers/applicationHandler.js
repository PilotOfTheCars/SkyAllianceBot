const { Application } = require('../models/schema');
const { createEmbed } = require('../utils/embeds');

class ApplicationHandler {
    static async createApplication(userId, applicationData) {
        try {
            const application = await Application.create({
                user_id: userId,
                airline_name: applicationData.airlineName,
                iata_code: applicationData.iataCode,
                icao_code: applicationData.icaoCode,
                description: applicationData.description
            });
            
            return { success: true, application };
        } catch (error) {
            console.error('Error creating application:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async getPendingApplications() {
        try {
            const applications = await Application.findPending();
            return applications;
        } catch (error) {
            console.error('Error fetching pending applications:', error);
            return [];
        }
    }
    
    static async approveApplication(applicationId, adminId) {
        try {
            const application = await Application.updateStatus(applicationId, 'approved', adminId);
            return { success: true, application };
        } catch (error) {
            console.error('Error approving application:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async rejectApplication(applicationId, adminId) {
        try {
            const application = await Application.updateStatus(applicationId, 'rejected', adminId);
            return { success: true, application };
        } catch (error) {
            console.error('Error rejecting application:', error);
            return { success: false, error: error.message };
        }
    }
    
    static createApplicationEmbed(application) {
        return createEmbed()
            .setTitle('📝 New Alliance Application')
            .setDescription('A new airline has applied to join Sky Alliance')
            .addFields(
                {
                    name: 'Airline Name',
                    value: application.airline_name,
                    inline: true
                },
                {
                    name: 'IATA Code',
                    value: application.iata_code || 'Not specified',
                    inline: true
                },
                {
                    name: 'ICAO Code',
                    value: application.icao_code || 'Not specified',
                    inline: true
                },
                {
                    name: 'Description',
                    value: application.description || 'No description provided',
                    inline: false
                },
                {
                    name: 'Application ID',
                    value: application.id.toString(),
                    inline: true
                },
                {
                    name: 'Submitted',
                    value: new Date(application.submitted_at).toLocaleString(),
                    inline: true
                }
            )
            .setFooter({ text: 'Use !approve or !reject with the application ID' });
    }
}

module.exports = ApplicationHandler;
