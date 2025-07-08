export default {
  async afterUpdate(event: any) {
    const updatedTask = event.result;
    const io = (global as any).strapi.io;

    if (io) {
      io.emit('task:updated', updatedTask);
    }
  },
  // src/api/closed-task/content-types/closed-task/lifecycles.ts
  // async afterCreate(event) {
  //   const io = (global as any).strapi.io;
  //   if (io) {
  //     io.emit('task:closed', event.result); // Optional event
  //   }
  // },



//   async afterCreate(event: any) {
//     const io = (global as any).strapi.io;
//     if (io) {
//       console.log('🔔 Emitting task:created');
//       io.emit('task:created', event.result); // Should happen only once
//     }
//   },


  async afterDelete(event: any) {
    const io = (global as any).strapi.io;
    if (io) {
      io.emit('task:deleted', event.result);
    }
  },
};
