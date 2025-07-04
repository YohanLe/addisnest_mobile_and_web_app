const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection URI
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MongoDB URI not found in environment variables');
  process.exit(1);
}

// Create a new MongoClient
const client = new MongoClient(uri);

// Sample partnership requests data
const samplePartnershipRequests = [
  {
    companyName: 'Abyssinia Real Estate',
    contactName: 'Dawit Bekele',
    email: 'dawit@abyssiniarealestate.com',
    phone: '+251911234567',
    partnershipType: 'advertising',
    message: 'We would like to advertise our new properties on your platform. Please contact us to discuss partnership opportunities.',
    status: 'not revised',
    createdAt: new Date('2025-06-15T10:30:00'),
    updatedAt: new Date('2025-06-15T10:30:00')
  },
  {
    companyName: 'Habesha Home Builders',
    contactName: 'Sara Tadesse',
    email: 'sara@habeshabuilders.com',
    phone: '+251922345678',
    partnershipType: 'corporate',
    message: 'Our company is interested in a corporate partnership to list all our new developments on AddisNest. We have over 50 properties to list.',
    status: 'not revised',
    createdAt: new Date('2025-06-18T14:15:00'),
    updatedAt: new Date('2025-06-18T14:15:00')
  },
  {
    companyName: 'Addis Home Inspection Services',
    contactName: 'Yonas Haile',
    email: 'yonas@addisinspection.com',
    phone: '+251933456789',
    partnershipType: 'service',
    message: 'We provide professional home inspection services and would like to partner with AddisNest to offer discounted services to your users.',
    status: 'not revised',
    createdAt: new Date('2025-06-20T09:45:00'),
    updatedAt: new Date('2025-06-20T09:45:00')
  },
  {
    companyName: 'Ethiopian Mortgage Bank',
    contactName: 'Hiwot Mengistu',
    email: 'hiwot@ethiomortgage.com',
    phone: '+251944567890',
    partnershipType: 'corporate',
    message: 'We would like to explore a partnership to provide mortgage services to AddisNest users. We can offer special rates for properties listed on your platform.',
    status: 'not revised',
    createdAt: new Date('2025-06-22T11:20:00'),
    updatedAt: new Date('2025-06-22T11:20:00')
  },
  {
    companyName: 'Addis Interior Design',
    contactName: 'Meron Alemu',
    email: 'meron@addisinterior.com',
    phone: '+251955678901',
    partnershipType: 'service',
    message: 'Our interior design firm would like to partner with AddisNest to offer design consultations for new property buyers. We can provide virtual staging services for property listings as well.',
    status: 'not revised',
    createdAt: new Date('2025-06-25T13:10:00'),
    updatedAt: new Date('2025-06-25T13:10:00')
  },
  {
    companyName: 'Ethio Property Management',
    contactName: 'Abel Kebede',
    email: 'abel@ethiopropmgmt.com',
    phone: '+251966789012',
    partnershipType: 'service',
    message: 'We specialize in property management services for landlords. We would like to partner with AddisNest to offer our services to property owners who list on your platform.',
    status: 'not revised',
    createdAt: new Date('2025-06-28T15:30:00'),
    updatedAt: new Date('2025-06-28T15:30:00')
  },
  {
    companyName: 'Addis Photography',
    contactName: 'Tigist Solomon',
    email: 'tigist@addisphotography.com',
    phone: '+251977890123',
    partnershipType: 'service',
    message: 'We offer professional real estate photography services. We would like to partner with AddisNest to provide photography packages for property listings.',
    status: 'not revised',
    createdAt: new Date('2025-07-01T10:00:00'),
    updatedAt: new Date('2025-07-01T10:00:00')
  }
];

async function seedPartnershipRequests() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Get the database name from the connection string
    const dbName = uri.split('/').pop().split('?')[0];
    console.log(`Using database: ${dbName}`);

    // Get the database and collection
    const db = client.db(dbName);
    const collection = db.collection('partnershiprequests');

    // Check if collection exists
    const collections = await db.listCollections({ name: 'partnershiprequests' }).toArray();
    if (collections.length === 0) {
      console.error('The partnershiprequests collection does not exist. Please create it first.');
      return;
    }

    // Check if collection already has data
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`The partnershiprequests collection already has ${count} documents.`);
      const shouldContinue = process.argv.includes('--force');
      if (!shouldContinue) {
        console.log('Use --force flag to add seed data anyway.');
        return;
      }
      console.log('Force flag detected. Adding seed data anyway.');
    }

    // Insert the sample data
    const result = await collection.insertMany(samplePartnershipRequests);
    console.log(`${result.insertedCount} partnership requests inserted successfully.`);

    // Display the inserted documents
    console.log('\nInserted partnership requests:');
    const insertedDocs = await collection.find({ _id: { $in: Object.values(result.insertedIds) } }).toArray();
    insertedDocs.forEach((doc, index) => {
      console.log(`\n${index + 1}. ${doc.companyName} (${doc.partnershipType})`);
      console.log(`   Contact: ${doc.contactName}, ${doc.email}`);
      console.log(`   Status: ${doc.status}`);
      console.log(`   Created: ${doc.createdAt.toISOString()}`);
    });

    console.log('\nSeed data inserted successfully!');
  } catch (error) {
    console.error('Error seeding partnership requests:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedPartnershipRequests();
