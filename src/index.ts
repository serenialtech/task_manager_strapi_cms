// // // // import type { Core } from '@strapi/strapi';

// // // export default {
// // //   /**
// // //    * An asynchronous register function that runs before
// // //    * your application is initialized.
// // //    *
// // //    * This gives you an opportunity to extend code.
// // //    */
// // //   register(/* { strapi }: { strapi: Core.Strapi } */) {},

// // //   /**
// // //    * An asynchronous bootstrap function that runs before
// // //    * your application gets started.
// // //    *
// // //    * This gives you an opportunity to set up your data model,
// // //    * run jobs, or perform some special logic.
// // //    */
// // //   bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
// // // };

// // // ./src/index.ts
// // import { Server } from 'socket.io';

// // export default {
// //   register() {},

// //   bootstrap({ strapi }) {
// //     const io = new Server(strapi.server.httpServer, {
// //       cors: {
// //         origin: '*',
// //       },
// //     });

// //     strapi.io = io;

// //     io.on('connection', (socket) => {
// //       console.log('✅ WebSocket connected:', socket.id);

// //       socket.on('disconnect', () => {
// //         console.log('❌ WebSocket disconnected:', socket.id);
// //       });
// //     });
// //   },
// // };
// import { Server } from 'socket.io';
// import type { Socket } from 'socket.io';
// import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

// interface SocketWithUserId extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
//   userId?: number;
// }

// export default {
//   register({ strapi }: { strapi: any }) {
//     const httpServer = strapi.server.httpServer;

//     if (!httpServer) {
//       console.error('❌ No HTTP server found to bind Socket.IO');
//       return;
//     }

//     const io = new Server(httpServer, {
//       cors: {
//         origin: '*',
//         methods: ['GET', 'POST'],
//       },
//     });

//     // Attach to Strapi global
//     strapi.io = io;

//     // ✅ Authenticate user via token
//     io.use(async (socket: SocketWithUserId, next) => {
//       try {
//         const token = socket.handshake.query.token as string;
//         if (!token) return next(new Error('No token provided'));

//         const jwtService = strapi.plugins['users-permissions'].services.jwt;
//         const decoded = await jwtService.getToken(token);

//         if (!decoded || !decoded.id) {
//           return next(new Error('Invalid token'));
//         }

//         socket.userId = decoded.id;
//         next();
//       } catch (err) {
//         console.error('❌ Socket auth failed:', err);
//         next(new Error('Authentication error'));
//       }
//     });

//     // ✅ On socket connect
//     io.on('connection', (socket: SocketWithUserId) => {
//       console.log(`✅ Socket connected: ${socket.id} (userId: ${socket.userId})`);

//       socket.on('disconnect', () => {
//         console.log(`❌ Socket disconnected: ${socket.id}`);
//       });
//     });
//   },

//   bootstrap() {},
// };
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export default {
  register({ strapi }) {
    const httpServer = strapi.server.httpServer;

    const io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    strapi.io = io;

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.query.token as string;
        if (!token) return next(new Error('No token provided'));

        const decoded = await strapi
          .plugin('users-permissions')
          .service('jwt')
          .verify(token);

        if (!decoded || !decoded.id) return next(new Error('Invalid token'));

        // ✅ Attach userId here
        (socket as any).userId = decoded.id;

        return next();
      } catch (err) {
        console.error('❌ Socket auth failed:', err);
        return next(new Error('Authentication failed'));
      }
    });

    io.on('connection', (socket) => {
      console.log(`✅ Socket connected: ${socket.id} (userId: ${(socket as any).userId})`);

      socket.on('disconnect', () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
      });
    });
  },

  bootstrap() {},
};
