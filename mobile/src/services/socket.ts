import { io } from "socket.io-client";

const socket = io('http://10.0.0.104:3333', {
  autoConnect: false,
});

type Message = {
  date: Date;
  room: string;
  message: string;
  username: string;
};

const on = () => {
  if(socket.disconnected) {
    socket.connect();
  }
};

const off = () => {
  if(socket.connected) {
    socket.disconnect()
  }
};

const sendMessage = (message: Message) => {
  socket.emit('message', message);
};

export { on, off, sendMessage, socket }