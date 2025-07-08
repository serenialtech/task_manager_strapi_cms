// // 'use strict';
// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::task.task', ({ strapi }) => ({
//   async create(ctx) {
//     const user = ctx.state.user;
//     if (!user) return ctx.unauthorized('User not authenticated');

//     const { data } = ctx.request.body;

//     try {
//       const createdTask = await strapi.entityService.create('api::task.task', {
//         data: {
//           ...data,
//           users_permissions_user: user.id,
//         },
//       });

//       return { data: createdTask };
//     } catch (err) {
//       console.error('❌ Task creation error:', err);
//       return ctx.badRequest('Failed to create task');
//     }
//   },

//   async findMine(ctx) {
//     const user = ctx.state.user;
//     if (!user) return ctx.unauthorized('User not authenticated');

//     const tasks = await strapi.entityService.findMany('api::task.task', {
//       filters: { users_permissions_user: user.id },
//       populate: '*',
//     });

//     return { data: tasks };
//   },

//   async update(ctx) {
//     const user = ctx.state.user;
//     if (!user) return ctx.unauthorized('User not authenticated');

//     const { id } = ctx.params;
//     const { data } = ctx.request.body;

//     try {
//       const updated = await strapi.entityService.update('api::task.task', id, {
//         data,
//       });

//       return { data: updated };
//     } catch (err) {
//       console.error('❌ Task update error:', err);
//       return ctx.badRequest('Failed to update task');
//     }
//   },

// async delete(ctx) {
//   const user = ctx.state.user;
//   if (!user) return ctx.unauthorized('User not authenticated');

//   const { id } = ctx.params;

//   try {
//     // Find the task and verify ownership
//     const task = await strapi.entityService.findOne('api::task.task', id, {
//       populate: ['users_permissions_user'],
//     });

//     if (!task || task.users_permissions_user?.id !== user.id) {
//       return ctx.forbidden('You are not allowed to delete this task');
//     }

//     // Proceed to delete
//     await strapi.entityService.delete('api::task.task', id);
//     return { message: 'Task deleted successfully' };
//   } catch (err) {
//     console.error('❌ Task delete error:', err);
//     return ctx.badRequest('Failed to delete task');
//   }
// },
// async updatePosition(ctx) {
//     const user = ctx.state.user;
//     if (!user) return ctx.unauthorized('User not authenticated');

//     const { id } = ctx.params;
//     const { data } = ctx.request.body;

//     try {
//       const updated = await strapi.entityService.update('api::task.task', id, {
//         data: {
//           position: data.position,
//         },
//       });

//       return { data: updated };
//     } catch (err) {
//       console.error('❌ Failed to update position:', err);
//       return ctx.badRequest('Failed to update task position');
//     }
//   },

// }));


'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::task.task', ({ strapi }) => ({
  // async create(ctx) {
  //   const user = ctx.state.user;
  //   if (!user) return ctx.unauthorized('User not authenticated');

  //   const { data } = ctx.request.body;

  //   try {
  //     const createdTask = await strapi.entityService.create('api::task.task', {
  //       data: {
  //         ...data,
  //         users_permissions_user: user.id,
  //       },
  //       populate: '*',
  //     });

  //     if (strapi.io) strapi.io.emit('task:created', createdTask);

  //     return { data: createdTask };
  //   } catch (err) {
  //     console.error('❌ Task creation error:', err);
  //     return ctx.badRequest('Failed to create task');
  //   }
  // },
// async create(ctx) {
//   const user = ctx.state.user;
//   if (!user) return ctx.unauthorized('User not authenticated');

//   const { data } = ctx.request.body;

//   try {
//     // Create the task and attach user
//     await strapi.entityService.create('api::task.task', {
//       data: {
//         ...data,
//         users_permissions_user: user.id,
//       },
//     });

//     // Immediately fetch full task list for user
//     const allTasks = await strapi.entityService.findMany('api::task.task', {
//       filters: { users_permissions_user: user.id },
//       populate: '*',
//       sort: ['position:asc'], // optional
//     });

//     // Emit full updated list
//     if (strapi.io) {
//       strapi.io.emit('task:reordered', allTasks); // 🔁 Send full list
//     }

//     return { data: allTasks }; // return full list too (optional)
//   } catch (err) {
//     console.error('❌ Task creation error:', err);
//     return ctx.badRequest('Failed to create task');
//   }
// }
async create(ctx) {
  const user = ctx.state.user;
  if (!user) return ctx.unauthorized('User not authenticated');

  const { data } = ctx.request.body;

  try {
    // ✅ Create task with associated user
    await strapi.entityService.create('api::task.task', {
      data: {
        ...data,
        users_permissions_user: user.id,
      },
    });

    // ✅ Get the updated list of tasks for this user
    const allTasks = await strapi.entityService.findMany('api::task.task', {
      filters: { users_permissions_user: user.id },
      populate: '*',
      sort: ['position:asc'],
    });

    // ✅ Emit only to this user's sockets
    if (strapi.io) {
      let count = 0;
      strapi.io.sockets.sockets.forEach((socket) => {
        if (socket.userId === user.id) {
          socket.emit('task:reordered', allTasks);
          count++;
        }
      });
      console.log(`📤 Emitted task:reordered to ${count} socket(s) for user ${user.id}`);
    }

    return { data: allTasks };
  } catch (err) {
    console.error('❌ Task creation error:', err);
    return ctx.badRequest('Failed to create task');
  }
}
,
  async findMine(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('User not authenticated');

    const tasks = await strapi.entityService.findMany('api::task.task', {
      filters: { users_permissions_user: user.id },
      populate: '*',
    });

    return { data: tasks };
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('User not authenticated');

    const { id } = ctx.params;
    const { data } = ctx.request.body;

    try {
      const existingTask = await strapi.entityService.findOne('api::task.task', id, {
        populate: ['users_permissions_user'],
      });

      if (!existingTask || existingTask.users_permissions_user?.id !== user.id) {
        return ctx.forbidden('You are not allowed to update this task');
      }

      const updated = await strapi.entityService.update('api::task.task', id, {
        data,
        populate: '*',
      });

      if (updated && strapi.io){ strapi.io.emit('task:updated', updated);}else{}

      return { data: updated };
    } catch (err) {
      console.error('❌ Task update error:', err);
      return ctx.badRequest('Failed to update task');
    }
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('User not authenticated');

    const { id } = ctx.params;

    try {
      const task = await strapi.entityService.findOne('api::task.task', id, {
        populate: ['users_permissions_user'],
      });

      if (!task || task.users_permissions_user?.id !== user.id) {
        return ctx.forbidden('You are not allowed to delete this task');
      }

      await strapi.entityService.delete('api::task.task', id);

      if (strapi.io) strapi.io.emit('task:deleted', task);

      return { message: 'Task deleted successfully' };
    } catch (err) {
      console.error('❌ Task delete error:', err);
      return ctx.badRequest('Failed to delete task');
    }
  },

 
// async updatePosition(ctx) {
//   const user = ctx.state.user;
//   if (!user) return ctx.unauthorized('User not authenticated');

//   const { id } = ctx.params;
//   const { data } = ctx.request.body;

//   try {
//     // ✅ First, fetch the task with user relation
//     const task = await strapi.entityService.findOne('api::task.task', id, {
//       populate: ['users_permissions_user'],
//     });

//     // 🔒 Validate ownership
//     if (!task || task.users_permissions_user?.id !== user.id) {
//       return ctx.forbidden('You are not allowed to reorder this task');
//     }

//     // ✅ Proceed to update position
//     const updated = await strapi.entityService.update('api::task.task', id, {
//       data: {
//         position: data.position,
//       },
//       populate: '*',
//     });

//     // 📢 Emit updated task list to all clients
//     if (strapi.io) {
//       const allTasks = await strapi.entityService.findMany('api::task.task', {
//         filters: { users_permissions_user: user.id },
//         populate: '*',
//         sort: ['position:asc'],
//       });

//       strapi.io.emit('task:reordered', allTasks);
//     }

//     return { data: updated };
//   } catch (err) {
//     console.error('❌ Failed to update position:', err);
//     return ctx.badRequest('Failed to update task position');
//   }
// },


async updatePosition(ctx) {
  const user = ctx.state.user;
  if (!user) return ctx.unauthorized('User not authenticated');

  const { id } = ctx.params;
  const { data } = ctx.request.body;

  try {
    // ✅ Step 1: Fetch the task and validate ownership
    const task = await strapi.entityService.findOne('api::task.task', id, {
      populate: ['users_permissions_user'],
    });

    if (!task || task.users_permissions_user?.id !== user.id) {
      return ctx.forbidden('You are not allowed to reorder this task');
    }

    // ✅ Step 2: Update the task's position
    const updated = await strapi.entityService.update('api::task.task', id, {
      data: { position: data.position },
      populate: '*',
    });

    // ✅ Step 3: Fetch updated task list for this user
    const allTasks = await strapi.entityService.findMany('api::task.task', {
      filters: { users_permissions_user: user.id },
      populate: '*',
      sort: ['position:asc'],
    });

    // ✅ Step 4: Emit only to sockets of the current user
    if (strapi.io && strapi.io.sockets?.sockets) {
      let count = 0;
      strapi.io.sockets.sockets.forEach((socket) => {
        if ((socket.userId || (socket as any).userId) === user.id) {
          socket.emit('task:reordered', allTasks);
          count++;
        }
      });
      console.log(`🔁 Emitted task:reordered to ${count} socket(s) for user ${user.id}`);
    }

    return { data: updated };
  } catch (err) {
    console.error('❌ Failed to update position:', err);
    return ctx.badRequest('Failed to update task position');
  }
}
,
async finalizeTask(ctx) {
  const user = ctx.state.user;
  if (!user) return ctx.unauthorized('User not authenticated');

  const { id } = ctx.params;
  const { timeSpent } = ctx.request.body;

  try {
    const task = await strapi.entityService.findOne('api::task.task', id, {
      populate: ['users_permissions_user'],
    });

    if (!task || task.users_permissions_user?.id !== user.id) {
      return ctx.forbidden('You are not allowed to finalize this task');
    }

    const closedTask = await strapi.entityService.create('api::closed-task.closed-task', {
      data: {
        name: task.name,
        deadline: task.deadline,
        budget: task.budget,
        timeSpent: timeSpent ?? task.timeSpent,
        users_permissions_user: user.id,
      },
    });

    await strapi.entityService.delete('api::task.task', id);

    if (strapi.io) strapi.io.emit('task:deleted', task);

    return ctx.created({ data: closedTask });
  } catch (err) {
    console.error('❌ Failed to finalize task:', err);
    return ctx.badRequest('Failed to finalize task');
  }
}

// async closeTask(ctx) {
//   const user = ctx.state.user;
//   if (!user) return ctx.unauthorized('User not authenticated');

//   const { id } = ctx.params;
//   const { timeSpent } = ctx.request.body; // ✅ Get updated timeSpent from client

//   try {
//     const task = await strapi.entityService.findOne('api::task.task', id, {
//       populate: ['users_permissions_user'],
//     });

//     if (!task || task.users_permissions_user?.id !== user.id) {
//       return ctx.forbidden('You are not allowed to close this task');
//     }

//     // ✅ Create in closed-task
//     const closedTask = await strapi.entityService.create('api::closed-task.closed-task', {
//       data: {
//         name: task.name,
//         deadline: task.deadline,
//         budget: task.budget,
//         timeSpent: timeSpent ?? task.timeSpent, // ✅ Use client's value if present
//         users_permissions_user: user.id,
//       },
//     });

//     // ✅ Delete from task
//     await strapi.entityService.delete('api::task.task', id);

//     // ✅ Emit via WebSocket
//     if (strapi.io) strapi.io.emit('task:deleted', task);

//     return ctx.created({ data: closedTask });
//   } catch (err) {
//     console.error('❌ Failed to close task:', err);
//     return ctx.badRequest('Failed to close task');
//   }
// }



}));
