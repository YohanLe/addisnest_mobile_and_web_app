const { BaseController, ErrorResponse } = require('./baseController');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Register a new user
  // @route   POST /api/users/register
  // @access  Public
  register = this.asyncHandler(async (req, res) => {
    try {
      const { 
        firstName, 
        lastName, 
        email, 
        password, 
        phone, 
        role,
        regionalState,
        licenseNumber,
        agency,
        experience,
        specialization
      } = req.body;

      console.log('Registration attempt:', req.body);

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return this.sendError(res, new ErrorResponse('User already exists', 400));
      }

      // Prepare user data
      const userData = {
        firstName,
        lastName,
        email,
        password,
        phone,
        role: role || 'user'
      };

      // Add agent-specific fields if role is agent
      if (role === 'agent' || role === 'AGENT') {
        userData.role = 'agent';
        userData.experience = experience ? parseInt(experience) : 0;
        
        // Add address with state if provided
        if (regionalState) {
          userData.address = { state: regionalState };
        }
        
        // Add licenseNumber and agency if provided
        if (licenseNumber) userData.licenseNumber = licenseNumber;
        if (agency) userData.agency = agency;
        
        // Add specialization if provided
        if (specialization && Array.isArray(specialization)) {
          userData.specialization = specialization;
        }
      }

      // Create the user
      const user = await User.create(userData);

      // Generate token
      const token = this.generateToken(user._id);

      console.log(`User registered successfully: ${email}`);

      this.sendResponse(res, {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token
      }, 201);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return this.sendError(res, new ErrorResponse(messages.join(', '), 400));
      }
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return this.sendError(res, new ErrorResponse('Email is already in use', 400));
      }
      
      // Send the error to the error handling middleware
      return this.sendError(res, new ErrorResponse('Error registering user', 500));
    }
  });

  // @desc    Register a new agent
  // @route   POST /api/users/register-agent
  // @access  Public
  registerAgent = this.asyncHandler(async (req, res) => {
    try {
      const { 
        fullName, 
        email, 
        phone, 
        password, 
        confirmPassword,
        experience,
        state
      } = req.body;

      console.log('Agent registration attempt:', req.body);

      // Basic validation
      if (password !== confirmPassword) {
        return this.sendError(res, new ErrorResponse('Passwords do not match', 400));
      }

      // Split fullName into firstName and lastName
      let firstName = fullName, lastName = '';
      if (fullName && fullName.includes(' ')) {
        const nameParts = fullName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return this.sendError(res, new ErrorResponse('Email already registered', 400));
      }

      // Create the agent
      const agent = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        role: 'agent',
        experience: experience ? parseInt(experience) : 0,
        address: {
          state: state
        }
      });

      // Generate token
      const token = this.generateToken(agent._id);

      console.log(`Agent registered successfully: ${email}`);

      this.sendResponse(res, {
        _id: agent._id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        role: agent.role,
        token
      }, 201);
    } catch (error) {
      console.error('Agent registration error:', error);
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return this.sendError(res, new ErrorResponse(messages.join(', '), 400));
      }
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return this.sendError(res, new ErrorResponse('Email is already in use', 400));
      }
      
      // Send the error to the error handling middleware
      return this.sendError(res, new ErrorResponse('Error registering agent', 500));
    }
  });

  // @desc    Login user
  // @route   POST /api/users/login
  // @access  Public
  login = this.asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return this.sendError(res, new ErrorResponse('Email not registered. Please check your email or sign up.', 401));
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return this.sendError(res, new ErrorResponse('The password you entered is incorrect. Please try again.', 401));
    }

    // Generate token
    const token = this.generateToken(user._id);

    console.log(`Successful login for: ${email}`);

    this.sendResponse(res, {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token
    });
  });
  
  // @desc    Admin Login
  // @route   POST /api/auth/admin-login
  // @access  Public
  adminLogin = this.asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log('Admin login attempt for email:', email);

    // Hardcoded admin check for development/testing
    // This allows login with the documented credentials even if the database seed hasn't run
    if (email === 'admin@addisnest.com' && password === 'Admin@123') {
      console.log('Using hardcoded admin credentials for development');
      
      // Create a temporary admin user object
      const adminUser = {
        _id: 'admin-user-id',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@addisnest.com',
        role: 'admin'
      };
      
      // Generate token with extended expiry for admin (30 days)
      const token = this.generateToken(adminUser._id, '30d');
      
      console.log(`Successful admin login for: ${email} (hardcoded)`);
      
      return this.sendResponse(res, {
        ...adminUser,
        token
      });
    }

    // Regular database check for admin users
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return this.sendError(res, new ErrorResponse('Email not registered. Please check your email.', 401));
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return this.sendError(res, new ErrorResponse('The password you entered is incorrect. Please try again.', 401));
    }

    // Check if user is an admin
    if (user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse('Access denied. This account does not have administrator privileges.', 403));
    }

    // Generate token with extended expiry for admin (30 days)
    const token = this.generateToken(user._id, '30d');

    console.log(`Successful admin login for: ${email}`);

    this.sendResponse(res, {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token
    });
  });

  // @desc    Get user profile
  // @route   GET /api/users/profile
  // @access  Private
  getProfile = this.asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }
    
    this.sendResponse(res, user);
  });

  // @desc    Update user profile
  // @route   PUT /api/users/profile
  // @access  Private
  updateProfile = this.asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }

    // Update user fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Update address if provided
    if (req.body.address) {
      user.address = {
        ...user.address,
        ...req.body.address
      };
    }

    const updatedUser = await user.save();

    this.sendResponse(res, {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      address: updatedUser.address
    });
  });

  // @desc    Get all users (admin only)
  // @route   GET /api/users
  // @access  Private/Admin
  getAllUsers = this.asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    this.sendResponse(res, users);
  });

  // @desc    Get all agents with filtering
  // @route   GET /api/agents/list
  // @access  Public
  getAllAgents = this.asyncHandler(async (req, res) => {
    console.log('getAllAgents called with query:', req.query);
    const {
      region,
      specialty,
      language,
      rating,
      verifiedOnly,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { role: { $in: ['agent', 'AGENT'] } };

    if (region) {
      // Convert hyphenated region to regex pattern that can match spaces
      const regionPattern = region.replace(/-/g, '[ -]');
      
      // Support both new field structure and legacy field structure
      query.$or = [
        { 'address.state': { $regex: regionPattern, $options: 'i' } },
        { region: { $regex: regionPattern, $options: 'i' } }
      ];
    }
    if (specialty) {
      // Support both field names
      query.$or = query.$or || [];
      query.$or.push(
        { specialties: { $in: [specialty] } },
        { specialization: { $in: [specialty] } }
      );
    }
    if (language) {
      // Support both field names
      query.$or = query.$or || [];
      query.$or.push(
        { languagesSpoken: { $in: [language] } },
        { languages: { $in: [language] } }
      );
    }
    if (rating) {
      query.averageRating = { $gte: Number(rating) };
    }
    if (verifiedOnly === 'true') {
      query.isVerified = true;
    }

    console.log('Constructed query:', query);

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const agents = await User.find(query)
      .select('-password -otp -otpExpire')
      .skip(skip)
      .limit(limitNumber);

    console.log('Found agents:', agents.length);

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNumber);

    this.sendResponse(res, {
      data: {
        agents,
        totalCount,
        currentPage: pageNumber,
        totalPages,
      },
    });
  });

  // @desc    Get user by ID (admin only)
  // @route   GET /api/users/:id
  // @access  Private/Admin
  getUserById = this.asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }
    
    this.sendResponse(res, user);
  });

  // @desc    Update user (admin only)
  // @route   PUT /api/users/:id
  // @access  Private/Admin
  updateUser = this.asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'password') {
        user[key] = req.body[key];
      }
    });
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    this.sendResponse(res, {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role
    });
  });

  // @desc    Delete user (admin only)
  // @route   DELETE /api/users/:id
  // @access  Private/Admin
  deleteUser = this.asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }
    
    await user.remove();
    
    this.sendResponse(res, { message: 'User removed' });
  });

  // @desc    Request OTP for login
  // @route   POST /api/auth/request-otp
  // @access  Public
  requestOTP = this.asyncHandler(async (req, res) => {
    const { email } = req.body;
    const emailService = require('../utils/emailService');

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry (10 minutes)
    const otpExpire = new Date();
    otpExpire.setMinutes(otpExpire.getMinutes() + 10);
    
    // Save OTP to user record
    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    console.log(`OTP generated for ${email}: ${otp}`);

    try {
      // Send OTP via email
      await emailService.sendOTPEmail(email, otp, user.firstName);
      console.log(`OTP email sent to ${email}`);
      
      // Response without exposing the OTP
      this.sendResponse(res, {
        message: 'OTP sent successfully to your email'
      });
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      
      // For development environments or if email fails, still return the OTP
      this.sendResponse(res, {
        message: 'OTP generated but email sending failed. Using fallback.',
        otp: otp // For testing only
      });
    }
  });

  // @desc    Verify OTP and login
  // @route   POST /api/auth/verify-otp
  // @access  Public
  verifyOTP = this.asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // Check if user exists
    const user = await User.findOne({ 
      email,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return this.sendError(res, new ErrorResponse('Invalid or expired OTP', 401));
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return this.sendError(res, new ErrorResponse('Invalid OTP', 401));
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    // Generate token
    const token = this.generateToken(user._id);

    console.log(`User logged in via OTP: ${email}`);

    this.sendResponse(res, {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token
    });
  });

  // Generate JWT
  generateToken(userId, expiresIn = '30d') {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: expiresIn
    });
  }
}

module.exports = new UserController();
