import { Input } from "@/components/ui/input"
import { useSocket, useSendMessages, useSocketEvent } from "@/hooks/useSocket"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface SendMessageData {
  message: string;
  receiverId: string;
}

interface PrivateMessage {
  message: string;
  senderId: string;
}


export const UserCard = () => {
  const socket = useSocket("http://localhost:3000")
  const [value, setValue] = useState("")
  const [receiverId, setReceiverId] = useState<string>("")
  const [roomName, setRoomName] = useState<string>("")
  const [messages, setMessages] = useState<PrivateMessage[]>([])
  const [userId, setUserId] = useState<string | undefined>("")
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log("Connected to server", socket.id);
        setUserId(socket.id);
      };
      const handleDisconnect = () => {
        console.log("Disconnected from server");
      };
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      // Cleanup event listeners on component unmount
      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    }
  }, [socket]);

  useSocketEvent<PrivateMessage>(socket, "received-message", (data) => {
    console.log(data);
    setMessages((prev) => [...prev, data]);
  })

  const sendBroadCastMessage = useSendMessages<string>(socket);
  const sendPrivateMessage = useSendMessages<SendMessageData>(socket);
  const joinRoom = useSendMessages<string>(socket);
  const handleSendMessage = () => {
    receiverId.length ? sendPrivateMessage("send-message", { message: value, receiverId }) : sendBroadCastMessage("message", value)
    setValue("")
    setReceiverId("")
  }

  const joinRoomHandler = () => {
    joinRoom("join-room", roomName)
  }

  return (
    <div className="h-full p-3 border rounded space-y-3">
      <h1 className="text-xl">Id : <span className="text-muted-foreground text-lg">{userId}</span></h1>
      <div className="flex gap-3">
        <Input
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button onClick={joinRoomHandler}>Join</Button>
      </div>
      <div className="flex gap-3">
        <Input
          placeholder="Message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Input
          placeholder="Receiver Id"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
      <div>{messages.map((item, index) => (
        <p key={index}>{item.senderId} : {item.message}</p>
      ))}</div>
    </div>
  )
}
