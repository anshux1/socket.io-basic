import { createServer } from "http"
import express, { Request, Response } from "express"
import { Server } from "socket.io";
import cors from "cors";
import { handleConnection } from "@/socket";

const app = express()

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World")
})

io.on("connection", handleConnection(io))

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
