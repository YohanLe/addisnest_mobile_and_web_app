const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
// Use our fixed property routes with MongoDB ID endpoint implementation
const propertyRoutes = require('./propertyRoutes-mongo-id-fix');
const propertySubmitRoute = require('./propertySubmitRoute');
const conversationRoutes = require('./conversationRoutes');
const messageRoutes = require('./messageRoutes');
const notificationRoutes = require('./notificationRoutes');
const paymentRoutes = require('./paymentRoutes');
const connectionTestRoutes = require('./connectionTestRoutes');
const mediaRoutes = require('./mediaRoutes');
const agentRoutes = require('./agentRoutes');

module.exports = {
  agentRoutes,
  userRoutes,
  authRoutes,
  propertyRoutes,
  propertySubmitRoute,
  conversationRoutes,
  messageRoutes,
  notificationRoutes,
  paymentRoutes,
  connectionTestRoutes,
  mediaRoutes
};
