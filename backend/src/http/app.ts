import express from 'express';
import { Server } from "socket.io";
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server);

type UserRoom = {
  socket_id: string;
  room: string;
  name: string;
};

type Messages = {
  id: string;
  date: Date;
  message: string;
  room: string;
  username: string;
};

const users_room: UserRoom[] = [];
const messages: Messages[] = [];

io.on('connection', socket => {

  socket.on('users_room', (user_room: UserRoom, callback) => {
    socket.join(user_room.room);
    const userInRoom = users_room.find(user => user.name === user_room.name && user.room === user_room.room)

    if(userInRoom) {
      userInRoom.socket_id = socket.id
    } else {
      users_room.push({
        name: user_room.name,
        room: user_room.room,
        socket_id: socket.id,
      });
    }

    const messagesRoom = sendAllMessagesRoom(user_room.room);
    callback(messagesRoom);

    console.log(user_room.room)
  });
  
  socket.on('message', (message: Messages) => {
    messages.push(message);
    io.to(message.room).emit('message', message);
  });

});

const sendAllMessagesRoom = (room: string) => {
  const messagesRoom = messages.filter(message => message.room === room);
  return messagesRoom;
}

export { server };

