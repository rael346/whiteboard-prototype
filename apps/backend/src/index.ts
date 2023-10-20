import express from "express";
import { Socket, Server as SocketServer } from "socket.io";
import * as z from "zod";
import {
  addMember,
  addRoom,
  getAdmin,
  getMembers,
  getRoom,
  hasRoom,
} from "./data/rooms";

const PORT = 4000;
const app = express();
const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.get("/helloworld", (req, res) => {
  res.send("Hello World");
});

const io = new SocketServer(server);

const joinRoomSchema = z.object({
  name: z
    .string()
    .min(2, "Username must contain at least 2 characters")
    .max(50, "Username must not contain more than 50 characters"),
  roomId: z
    .string()
    .trim()
    .length(21, "Room ID must contain exactly 21 characters"),
});

type JoinRoomData = z.infer<typeof joinRoomSchema>;

function validateJoinRoomData(socket: Socket, joinRoomData: JoinRoomData) {
  try {
    return joinRoomSchema.parse(joinRoomData);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      socket.emit("invalid-data", {
        message:
          "The entities you provided are not correct and cannot be processed.",
      });
    }
  }
}

io.on("connection", socket => {
  socket.on("create-room", (joinRoomData: JoinRoomData) => {
    const validatedData = validateJoinRoomData(socket, joinRoomData);
    if (!validatedData) return;

    const { roomId, name } = validatedData;

    if (hasRoom(roomId)) {
      socket.emit("room-exists", {
        message: `Room with ID ${roomId} already exists, please join the room instead.`,
      });
      return;
    }

    const user = {
      socketID: socket.id,
      name,
    };

    socket.join(roomId);
    addRoom(roomId);
    addMember(roomId, user);

    const members = getMembers(roomId);
    const admin = getAdmin(roomId);

    socket.emit("room-joined", { user, roomId, admin, members });
    socket.to(roomId).emit("update-members", members);
    socket.to(roomId).emit("send-notification", {
      title: "New member arrived!",
      message: `${name} joined the party.`,
    });
  });

  socket.on("join-room", (joinRoomData: JoinRoomData) => {
    const validatedData = validateJoinRoomData(socket, joinRoomData);
    if (!validatedData) return;

    const { roomId, name } = validatedData;
    if (!hasRoom(roomId)) {
      socket.emit("room-not-found", {
        message: `Room with ID ${roomId} doesn't exist, please create a new room instead.`,
      });
    }

    const user = {
      socketID: socket.id,
      name,
    };

    socket.join(roomId);
    addMember(roomId, user);
    const members = getMembers(roomId);
    const admin = getAdmin(roomId);

    socket.emit("room-joined", { user, roomId, admin, members });
    socket.to(roomId).emit("update-members", members);
    socket.to(roomId).emit("send-notification", {
      title: "New member arrived!",
      message: `${name} joined the party.`,
    });
  });
});
