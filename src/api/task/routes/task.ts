// 'use strict';

// module.exports = {
//   routes: [
//     {
//       method: 'GET',
//       path: '/tasks/me',
//       handler: 'task.findMine',
//       config: {
//         auth: { required: true },
//       },
//     },
//     {
//       method: 'POST',
//       path: '/tasks',
//       handler: 'task.create',
//       config: {
//         auth: { required: true },
//       },
//     },
//        {
//       method: 'PUT',
//       path: '/tasks/:id',
//       handler: 'task.update',
//       config: {
//         auth: { required: true },
//       },
//     },
// {
//   method: 'DELETE',
//   path: '/tasks/:id',
//   handler: 'task.delete',
//   config: {
//     auth: { required: true },
//   },
// },
//  {
//       method: 'PUT',
//       path: '/tasks/:id/position',
//       handler: 'task.updatePosition',
//       config: {
//         auth: { required: true },
//       },
//     },

//      {
//       method: 'POST',
//       path: '/tasks/:id/close',
//       handler: 'task.closeTask',
//       config: {
//         auth: { required: true },
//       },
//     },
    
//   ],
// };


// src/api/task/routes/task.ts

export default {
  routes: [
    {
      method: 'GET',
      path: '/tasks/me',
      handler: 'task.findMine',
      config: {
        auth: { required: true },
      },
    },
    {
      method: 'POST',
      path: '/tasks',
      handler: 'task.create',
      config: {
        auth: { required: true },
      },
    },
    {
      method: 'PUT',
      path: '/tasks/:id',
      handler: 'task.update',
      config: {
        auth: { required: true },
      },
    },
    {
      method: 'DELETE',
      path: '/tasks/:id',
      handler: 'task.delete',
      config: {
        auth: { required: true },
      },
    },
    {
      method: 'PUT',
      path: '/tasks/:id/position',
      handler: 'task.updatePosition',
      config: {
        auth: { required: true },
      },
    },
{
      method: 'POST',
      path: '/tasks/:id/finalize',
      handler: 'task.finalizeTask',
      config: {
        auth: { required: true },
      },
    },
  ],
};
