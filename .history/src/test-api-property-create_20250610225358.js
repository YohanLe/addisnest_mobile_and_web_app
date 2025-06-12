const axios = require('axios');

const propertyData = {
    title: "Test Property from script",
    description: "This is a test property created from a script.",
    propertyType: "House",
    offeringType: "For Sale",
    status: "active",
    paymentStatus: "none",
    price: 5000000,
    area: 150,
    bedrooms: 3,
    bathrooms: 2,
    features: {},
    address: {
        street: "123 Test Street",
        city: "Addis Ababa",
        state: "Addis Ababa City Administration",
        country: "Ethiopia"
    },
    images: [],
    isPremium: false,
    isVerified: false,
    promotionType: "None",
    views: 0,
    likes: 0,
    amenities: [],
    furnishingStatus: "Unfurnished"
};

const token = "YOUR_JWT_TOKEN"; // Replace with a valid JWT token

axios.post('http://localhost:7000/api/properties', propertyData, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
.then(response => {
    console.log('Property created successfully:', response.data);
})
.catch(error => {
    console.error('Error creating property:', error.response ? error.response.data : error.message);
});
