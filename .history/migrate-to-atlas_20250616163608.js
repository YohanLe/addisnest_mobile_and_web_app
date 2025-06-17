const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Create exports directory if it doesn't exist
const exportDir = path.join(__dirname, 'db-exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir);
}

// Connect to the local MongoDB
async function exportCollections() {
  try {
    // Connect to local MongoDB
    const localUri = 'mongodb://localhost:27017/addisnest';
    const client = new MongoClient(localUri);
    await client.connect();
    console.log('Connected to local MongoDB');

    const db = client.db('addisnest');
    
    // Get list of collections to export
    const collections = [
      'users',
      'properties',
      'conversations',
      'messages',
      'notifications',
      'payments'
    ];

    // Export each collection
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        
        if (documents.length > 0) {
          const filePath = path.join(exportDir, `${collectionName}.json`);
          fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
          console.log(`Exported ${documents.length} documents from ${collectionName} to ${filePath}`);
        } else {
          console.log(`No documents found in ${collectionName} collection`);
        }
      } catch (err) {
        console.log(`Error exporting collection ${collectionName}: ${err.message}`);
      }
    }

    await client.close();
    console.log('\nExport process completed');
    console.log(`\nCollections exported to: ${exportDir}`);
    console.log('\nNext steps:');
    console.log('1. Import the exported JSON files to MongoDB Atlas using MongoDB Compass');
    console.log('2. Update your .env file with the MongoDB Atlas connection string');
    console.log('3. Test the connection and verify your data');
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

