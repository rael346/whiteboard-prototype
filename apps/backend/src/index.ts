import express from "express";
import { Server as SocketServer } from "socket.io";

const PORT = 4000;
const app = express();
const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.get("/helloworld", (req, res) => {
  res.send("Hello World");
});

const io = new SocketServer(server);

io.on("connection", socket => {
  console.log("Made socket connection");

  socket.on("hello from client", data => {
    console.log(data);
    io.emit("hello from server");
  });
});
