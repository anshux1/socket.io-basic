"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = void 0;
const handleConnection = (io) => (socket) => {
    console.log("User connected :", socket.id);
    socket.on("disconnect", () => hendleDisconnection(socket));
    socket.on("message", (data) => handleBroadcastMessaage(socket, data));
    socket.on("send-message", (data) => handleSendMessage(io, socket, data));
    socket.on("join-room", (roomName) => handleJoinRoom(socket, roomName));
};
exports.handleConnection = handleConnection;
const handleBroadcastMessaage = (socket, message) => {
    console.log("Message received broadcast :", message);
    const data = {
        senderId: socket.id,
        message: message
    };
    socket.broadcast.emit("received-message", data);
};
const handleSendMessage = (io, socket, data) => {
    console.log("Message received Private:", data);
    const dataToSend = {
        senderId: socket.id,
        message: data.message
    };
    io.to(data.receiverId).emit("received-message", dataToSend);
};
const handleJoinRoom = (socket, roomName) => {
    socket.join(roomName);
};
const hendleDisconnection = (socket) => console.log("A user disconnected :", socket.id);
//# sourceMappingURL=socket.js.map