const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/addisnest')
  .then(async () => {
    console.log('Connected to MongoDB');
    const User = require('./src/models/User');
    
    // Update the agent with ID 6845436d504a2bf073a4a7e2
    const agentId = '6845436d504a2bf073a4a7e2'; // Yohan's agent ID
    
    const result = await User.updateOne(
      { _id: agentId },
      { 
        $set: {
          specialties: ['Buying', 'Selling', 'Residential'],
          languagesSpoken: ['Amharic', 'English'],
          averageRating: 4.5,
          region: 'Addis Ababa',
          isVerified: true
        }
      }
    );
    
    console.log('Update result:', result);
    
    // Fetch and display the updated agent
    const agent = await User.findById(agentId);
    console.log('Updated agent:', agent);
    
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
