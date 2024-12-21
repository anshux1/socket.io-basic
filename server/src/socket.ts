import { Socket, Server } from "socket.io";

interface SendMessageData {
  message: string;
  receiverId: string;
}

export const handleConnection = (io: Server) => (socket: Socket) => {
  console.log("User connected :", socket.id);

  socket.on("disconnect", () => hendleDisconnection(socket));

  socket.on("message", (data: string) => handleBroadcastMessaage(socket, data))
  socket.on("send-message", (data: SendMessageData) => handleSendMessage(io, socket, data))
  socket.on("join-room", (roomName: string) => handleJoinRoom(socket, roomName))
}

const handleBroadcastMessaage = (socket: Socket, message: string) => {
  console.log("Message received broadcast :", message);
  const data = {
    senderId: socket.id,
    message: message
  }
  socket.broadcast.emit("received-message", data);
}

const handleSendMessage = (io: Server, socket: Socket, data: SendMessageData) => {
  console.log("Message received Private:", data);
  const dataToSend = {
    senderId: socket.id,
    message: data.message
  }
  io.to(data.receiverId).emit("received-message", dataToSend);
}

const handleJoinRoom = (socket: Socket, roomName: string) => {
  socket.join(roomName);
}

const hendleDisconnection = (socket: Socket) => console.log("A user disconnected :", socket.id);
