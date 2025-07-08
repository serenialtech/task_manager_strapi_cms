// const { createStrapi } = require('@strapi/strapi');
// const http = require('http');
// const { Server } = require('socket.io');

// async function start() {
//   const strapi = await createStrapi().load();

//   const httpServer = http.createServer(strapi.server.app);

//   const io = new Server(httpServer, {
//     cors: {
//       origin: '*', // Allow all origins for development
//     },
//   });

//   // Make WebSocket available globally in Strapi
//   global.strapi = strapi;
//   global.strapi.io = io;

//   io.on('connection', (socket) => {
//     console.log('✅ WebSocket connected:', socket.id);

//     socket.on('disconnect', () => {
//       console.log('❌ WebSocket disconnected:', socket.id);
//     });
//   });

//   await strapi.start();

//   const port = process.env.PORT || 1337;
//   httpServer.listen(port, () => {
//     console.log(`🚀 Strapi + WebSocket running at http://localhost:${port}`);
//   });
// }

// start();
// server.js

// const { createStrapi } = require('@strapi/strapi');
// const http = require('http');
// const { Server } = require('socket.io');

// async function start() {
//   const strapi = await createStrapi().load();

//   const httpServer = http.createServer(strapi.server.app);
//   const io = new Server(httpServer, {
//     cors: { origin: '*' },
//   });

//   strapi.io = io; // ✅ Attach Socket.IO to strapi instance

//   io.on('connection', (socket) => {
//     console.log('✅ WebSocket connected:', socket.id);

//     socket.on('disconnect', () => {
//       console.log('❌ WebSocket disconnected:', socket.id);
//     });
//   });

//   await strapi.start();

//   const port = process.env.PORT || 1337;
//   const host = '0.0.0.0';

//   httpServer.listen(port, host, () => {
//     console.log(`🚀 Strapi + WebSocket running at http://192.168.29.239:${port}`);
//   });
// }

// start();


// const jwt = require('jsonwebtoken');
// const SECRET = process.env.JWT_SECRET;

// io.on('connection', (socket) => {
//   const token = socket.handshake.query.token;
//   if (token) {
//     try {
//       const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET);
//       socket.userId = decoded.id;
//       console.log(`✅ Socket for user ${socket.userId}`);
//     } catch (e) {
//       console.warn('⚠️ Socket JWT invalid:', e.message);
//       socket.disconnect(true);
//     }
//   } else {
//     console.warn('⚠️ No JWT in socket handshake, disconnecting');
//     socket.disconnect(true);
//   }
// });
io.use((socket, next) => {
  const token = socket.handshake.query.token;

  if (token) {
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET);
      socket.userId = decoded.id;
      console.log(`✅ Authenticated socket for user ${socket.userId}`);

      next();
    } catch (err) {
      console.warn('⚠️ Invalid JWT:', err.message);
      next(new Error('Unauthorized'));
    }
  } else {
    console.warn('⚠️ No token provided');
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 User ${socket.userId} connected with socket ID ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Socket ${socket.id} for user ${socket.userId} disconnected`);
  });
});
