const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  propertyType: {
    type: String,
    required: [true, 'Please specify property type'],
    enum: [
      'House',
      'Apartment',
      'Commercial',
      'Land',
      'Villa',
      'Condo',
      'Townhouse',
      'Other'
    ]
  },
  offeringType: {
    type: String,
    required: [true, 'Please specify if the property is for sale or rent'],
    enum: ['For Sale', 'For Rent']
  },
  status: {
    type: String,
    required: [true, 'Please specify property status'],
    enum: ['For Sale', 'For Rent', 'Sold', 'Rented', 'Pending', 'pending_payment', 'active']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'none'],
    default: 'none'
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  area: {
    type: Number,
    required: [true, 'Please add property area in sq ft']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please add number of bedrooms']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please add number of bathrooms']
  },
  features: {
    parking: Boolean,
    airConditioning: Boolean,
    heating: Boolean,
    pool: Boolean,
    balcony: Boolean,
    gym: Boolean,
    security: Boolean,
    fireplace: Boolean,
    garden: Boolean,
    furnished: Boolean,
    'parking-space': Boolean,
    garage: Boolean,
    'garden-yard': Boolean,
    'balcony-terrace': Boolean,
    elevator: Boolean,
    internet: Boolean,
    electricity: Boolean,
    'water-supply': Boolean,
    'backup-generator': Boolean,
    'solar-panels': Boolean,
    laundry: Boolean,
    'air-conditioning': Boolean,
    'heating-system': Boolean,
    'ceiling-fans': Boolean,
    'equipped-kitchen': Boolean,
    'kitchen-appliances': Boolean,
    storage: Boolean,
    '24-7-security': Boolean,
    'cctv-surveillance': Boolean,
    'security-alarm': Boolean,
    'gated-community': Boolean,
    'intercom-system': Boolean,
    'security-guard': Boolean,
    'cleaning-service': Boolean,
    'maid-room': Boolean,
    'guest-room': Boolean,
    'home-office': Boolean,
    'built-in-wardrobes': Boolean,
    'dining-area': Boolean,
    'pantry-storage': Boolean,
    'rooftop-access': Boolean,
    courtyard: Boolean,
    'covered-parking': Boolean,
    'bbq-area': Boolean,
    'wheelchair-accessible': Boolean,
    'gym-fitness-center': Boolean,
    'swimming-pool': Boolean,
    playground: Boolean,
    'sports-facilities': Boolean,
    clubhouse: Boolean,
    'near-transport': Boolean,
    'near-shopping': Boolean,
    'near-schools': Boolean,
    'near-healthcare': Boolean,
    'near-mosque': Boolean,
    'near-church': Boolean
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    country: {
      type: String,
      required: [true, 'Please add a country']
    },
    // zipCode field is not used/required anymore
    zipCode: {
      type: String,
      required: false
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    }
  },
  images: [
    {
      url: String,
      caption: String
    }
  ],
  yearBuilt: Number,
  isPremium: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  promotionType: {
    type: String,
    enum: ['Basic', 'VIP', 'Diamond', 'None'],
    default: 'None'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for all messages related to this property
PropertySchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'property',
  justOne: false
});

module.exports = mongoose.model('Property', PropertySchema);
