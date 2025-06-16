// Script to update or create a test agent with specific regional state
// Run with: node update-agent-with-region.js

require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./src/models');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

async function createOrUpdateTestAgent() {
  try {
    // Check if test agent exists
    let agent = await User.findOne({ email: 'test.agent@addisnest.com' });
    
    if (agent) {
      console.log('Updating existing test agent...');
      
      // Update agent with specific regional state
      agent.address = agent.address || {};
      agent.address.state = 'Addis Ababa City Administration';
      agent.region = 'Addis Ababa City Administration';  // For legacy support
      
      // Add other required fields if missing
      agent.role = 'agent';
      agent.isVerified = true;
      agent.specialties = agent.specialties || ['Residential', 'Commercial'];
      agent.languagesSpoken = agent.languagesSpoken || ['Amharic', 'English'];
      agent.averageRating = agent.averageRating || 4.5;
      agent.experience = agent.experience || 5;
      
      await agent.save();
    } else {
      console.log('Creating new test agent...');
      
      // Create new test agent
      agent = await User.create({
        firstName: 'Test',
        lastName: 'Agent',
        email: 'test.agent@addisnest.com',
        password: 'password123',
        phone: '+251912345678',
        role: 'agent',
        isVerified: true,
        address: {
          state: 'Addis Ababa City Administration'
        },
        region: 'Addis Ababa City Administration',  // For legacy support
        specialties: ['Residential', 'Commercial'],
        languagesSpoken: ['Amharic', 'English'],
        averageRating: 4.5,
        experience: 5
      });
    }
    
    console.log('Test agent updated/created successfully:', agent);
  } catch (error) {
    console.error('Error updating/creating test agent:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

createOrUpdateTestAgent();
