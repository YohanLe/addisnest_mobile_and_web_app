import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sample agent data (in a real app, this would come from an API)
const sampleAgents = [
  {
    id: 1,
    name: 'Abebe Kebede',
    profilePicture: '',
    region: 'Addis Ababa',
    rating: 4.8,
    experience: 5,
    phone: '+251 91 234 5678',
    specialties: ['Buying', 'Selling', 'Residential'],
    languages: ['Amharic', 'English'],
    bio: 'I am a professional real estate agent with 5 years of experience in Addis Ababa. I specialize in residential properties and have helped over 50 families find their dream homes.',
    email: 'abebe.kebede@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2025-1234',
    currentListings: 12,
    transactionsClosed: 45
  },
  {
    id: 2,
    name: 'Tigist Alemayehu',
    profilePicture: '',
    region: 'Adama',
    rating: 4.5,
    experience: 3,
    phone: '+251 92 345 6789',
    specialties: ['Renting', 'Commercial'],
    languages: ['Amharic', 'Afaan Oromo'],
    bio: 'As a real estate agent based in Adama, I focus on commercial properties and rental services. I have extensive knowledge of the local market and can help you find the perfect space for your business.',
    email: 'tigist.alemayehu@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2025-2345',
    currentListings: 8,
    transactionsClosed: 23
  },
  {
    id: 3,
    name: 'Dawit Haile',
    profilePicture: '',
    region: 'Bahir Dar',
    rating: 5.0,
    experience: 7,
    phone: '+251 93 456 7890',
    specialties: ['Luxury', 'Farmland', 'Investment'],
    languages: ['Amharic', 'English'],
    bio: 'With 7 years in real estate around Bahir Dar, I specialize in luxury properties and investment opportunities. I can help you find high-value properties with great ROI potential.',
    email: 'dawit.haile@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2024-3456',
    currentListings: 15,
    transactionsClosed: 62
  },
  {
    id: 4,
    name: 'Sara Tesfaye',
    profilePicture: '',
    region: 'Hawassa',
    rating: 4.2,
    experience: 2,
    phone: '+251 94 567 8901',
    specialties: ['Buying', 'Renting'],
    languages: ['Amharic', 'Sidama', 'English'],
    bio: 'I am a dedicated real estate agent serving the Hawassa area. I specialize in helping first-time buyers navigate the real estate market and find affordable homes.',
    email: 'sara.tesfaye@example.com',
    isVerified: false,
    licenseNumber: '',
    currentListings: 6,
    transactionsClosed: 15
  },
  {
    id: 5,
    name: 'Berhanu Tadesse',
    profilePicture: '',
    region: 'Addis Ababa',
    rating: 4.7,
    experience: 10,
    phone: '+251 95 678 9012',
    specialties: ['Commercial', 'Investment'],
    languages: ['Amharic', 'English', 'Tigrinya'],
    bio: 'With a decade of experience in Addis Ababa\'s real estate market, I specialize in commercial properties and investment opportunities. I have helped numerous businesses find their ideal locations and investors maximize their returns.',
    email: 'berhanu.tadesse@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2021-4567',
    currentListings: 20,
    transactionsClosed: 85
  },
  {
    id: 6,
    name: 'Hiwot Bekele',
    profilePicture: '',
    region: 'Dire Dawa',
    rating: 4.6,
    experience: 4,
    phone: '+251 96 789 0123',
    specialties: ['Residential', 'Selling'],
    languages: ['Amharic', 'Somali', 'English'],
    bio: 'Based in Dire Dawa, I help clients sell their properties at the best possible price. I provide comprehensive market analysis and marketing strategies to ensure quick and profitable sales.',
    email: 'hiwot.bekele@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2023-5678',
    currentListings: 10,
    transactionsClosed: 32
  },
  {
    id: 7,
    name: 'Yonas Asfaw',
    profilePicture: '',
    region: 'Mekelle',
    rating: 4.3,
    experience: 6,
    phone: '+251 97 890 1234',
    specialties: ['Buying', 'Farmland'],
    languages: ['Tigrinya', 'Amharic'],
    bio: 'I specialize in agricultural and farmland properties in the Tigray region. With 6 years of experience, I can help you find productive land with good water access and soil quality.',
    email: 'yonas.asfaw@example.com',
    isVerified: false,
    licenseNumber: '',
    currentListings: 8,
    transactionsClosed: 27
  },
  {
    id: 8,
    name: 'Meskerem Abera',
    profilePicture: '',
    region: 'Gondar',
    rating: 4.9,
    experience: 8,
    phone: '+251 98 901 2345',
    specialties: ['Luxury', 'Residential'],
    languages: ['Amharic', 'English'],
    bio: 'I am a top-rated real estate agent in Gondar with expertise in luxury and high-end residential properties. I provide personalized service to discerning clients looking for exceptional homes.',
    email: 'meskerem.abera@example.com',
    isVerified: true,
    licenseNumber: 'REA-ET-2022-6789',
    currentListings: 14,
    transactionsClosed: 56
  }
];

// In a real app, this would be an API call
export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(sampleAgents);
        }, 800);
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAgentById = createAsyncThunk(
  'agents/fetchAgentById',
  async (agentId, { rejectWithValue }) => {
    try {
      // Simulate API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const agent = sampleAgents.find(a => a.id === agentId);
          if (agent) {
            resolve(agent);
          } else {
            reject(new Error('Agent not found'));
          }
        }, 500);
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  agents: [],
  selectedAgent: null,
  filteredAgents: [],
  loading: false,
  error: null,
  filters: {
    region: '',
    specialty: '',
    language: '',
    minRating: '',
    verifiedOnly: false
  }
};

const AgentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      
      // Apply filters
      let results = [...state.agents];
      
      if (state.filters.region) {
        results = results.filter(agent => agent.region === state.filters.region);
      }
      
      if (state.filters.specialty) {
        results = results.filter(agent => 
          agent.specialties.includes(state.filters.specialty)
        );
      }
      
      if (state.filters.language) {
        results = results.filter(agent => 
          agent.languages.includes(state.filters.language)
        );
      }
      
      if (state.filters.minRating) {
        results = results.filter(agent => 
          agent.rating >= parseFloat(state.filters.minRating)
        );
      }
      
      if (state.filters.verifiedOnly) {
        results = results.filter(agent => agent.isVerified);
      }
      
      state.filteredAgents = results;
    },
    resetFilters: (state) => {
      state.filters = {
        region: '',
        specialty: '',
        language: '',
        minRating: '',
        verifiedOnly: false
      };
      state.filteredAgents = state.agents;
    },
    selectAgent: (state, action) => {
      state.selectedAgent = action.payload;
    },
    clearSelectedAgent: (state) => {
      state.selectedAgent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload;
        state.filteredAgents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAgentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAgent = action.payload;
      })
      .addCase(fetchAgentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, resetFilters, selectAgent, clearSelectedAgent } = AgentSlice.actions;

export default AgentSlice.reducer;
