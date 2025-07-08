// /**
//  * closed-task controller
//  */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::closed-task.closed-task');

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::closed-task.closed-task', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('User not authenticated');

    const { name, budget, deadline, timeSpent } = ctx.request.body;

    try {
      const closedTask = await strapi.entityService.create('api::closed-task.closed-task', {
        data: {
          name,
          budget,
          deadline,
          timeSpent,
          users_permissions_user: user.id,
        },
      });

      if ((strapi as any).io) {
        (strapi as any).io.emit('task:closed', closedTask);
      }

      return ctx.created({ data: closedTask });
    } catch (err) {
      console.error('❌ Error creating closed task:', err);
      return ctx.badRequest('Failed to create closed task');
    }
  },
   async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('User not authenticated');

    try {
      const tasks = await strapi.entityService.findMany('api::closed-task.closed-task', {
        filters: {
          users_permissions_user: user.id,
        },
        sort: { createdAt: 'desc' },
      });

      return ctx.send({ data: tasks });
    } catch (err) {
      console.error('❌ Error fetching closed tasks:', err);
      return ctx.badRequest('Failed to fetch closed tasks');
    }
  }, 

}));
