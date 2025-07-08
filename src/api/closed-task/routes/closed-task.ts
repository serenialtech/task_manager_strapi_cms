// /**
//  * closed-task router
//  */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::closed-task.closed-task');

export default {
  routes: [
    {
      method: 'POST',
      path: '/closed-tasks',
      handler: 'closed-task.create',
      config: {
        auth: { required: true },
      },
    },
    {
      method: 'GET',
      path: '/closed-tasks/me',
      handler: 'closed-task.find',
      config: {
        auth: { required: true },
      },
    },
  ],
};
