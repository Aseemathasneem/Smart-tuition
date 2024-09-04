import { Server } from 'socket.io';

let io;

const initializeSocket = (server) => {
  io = new Server(server); 

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join room
    socket.on('join', (userId) => {
      console.log(`User ${userId} joined room: ${userId}`);
      socket.join(userId);
    });

    // Leave room
    socket.on('leave', (userId) => {
      console.log(`User ${userId} left room: ${userId}`);
      socket.leave(userId);
    });

   

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export { initializeSocket, io };
