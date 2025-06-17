const mockProperties = [
  {
    _id: "prop001",
    title: "Modern Downtown Apartment",
    description: "Stylish and contemporary apartment in the heart of downtown with stunning city views. This beautifully designed space features high ceilings, hardwood floors, and floor-to-ceiling windows.",
    price: 350000,
    propertyType: "apartment",
    status: "for-sale",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    isFeatured: true,
    yearBuilt: 2018,
    address: {
      street: "123 Main Street",
      city: "Addis Ababa",
      state: "Addis Ababa",
      zipCode: "1000",
      country: "Ethiopia",
      latitude: 9.0127,
      longitude: 38.7661
    },
    amenities: [
      "Air Conditioning",
      "Balcony",
      "Gym",
      "Pool",
      "Security System"
    ],
    images: [
      "https://picsum.photos/seed/apt1/900/600",
      "https://picsum.photos/seed/apt2/900/600",
      "https://picsum.photos/seed/apt3/900/600"
    ],
    createdAt: "2023-11-15T10:30:00Z",
    updatedAt: "2023-12-05T14:45:00Z",
    owner: "user001"
  },
  {
    _id: "prop002",
    title: "Luxury Villa with Pool",
    description: "Magnificent luxury villa with private pool and garden. This exquisite property offers spacious living areas, high-end finishes, and a stunning outdoor entertainment space.",
    price: 850000,
    propertyType: "house",
    status: "for-sale",
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    isFeatured: true,
    yearBuilt: 2015,
    address: {
      street: "45 Highland Avenue",
      city: "Addis Ababa",
      state: "Addis Ababa",
      zipCode: "1100",
      country: "Ethiopia",
      latitude: 9.0235,
      longitude: 38.7525
    },
    amenities: [
      "Swimming Pool",
      "Garden",
      "Home Theater",
      "Smart Home System",
      "Fireplace",
      "BBQ Area"
    ],
    images: [
      "https://picsum.photos/seed/villa1/900/600",
      "https://picsum.photos/seed/villa2/900/600",
      "https://picsum.photos/seed/villa3/900/600"
    ],
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-02-22T11:20:00Z",
    owner: "user002"
  },
  {
    _id: "prop003",
    title: "Cozy Studio Apartment",
    description: "Charming studio apartment perfect for singles or couples. Modern amenities in a convenient location close to restaurants, shops, and public transportation.",
    price: 120000,
    propertyType: "apartment",
    status: "for-sale",
    bedrooms: 0,
    bathrooms: 1,
    area: 500,
    isFeatured: false,
    yearBuilt: 2010,
    address: {
      street: "78 Urban Street",
      city: "Addis Ababa",
      state: "Addis Ababa",
      zipCode: "1200",
      country: "Ethiopia",
      latitude: 8.9935,
      longitude: 38.7910
    },
    amenities: [
      "Air Conditioning",
      "Laundry Facility",
      "Security Access",
      "Elevator"
    ],
    images: [
      "https://picsum.photos/seed/studio1/900/600",
      "https://picsum.photos/seed/studio2/900/600"
    ],
    createdAt: "2024-03-05T16:45:00Z",
    updatedAt: "2024-03-05T16:45:00Z",
    owner: "user003"
  },
  {
    _id: "prop004",
    title: "Family Home with Garden",
