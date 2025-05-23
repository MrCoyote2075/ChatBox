const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = 1247;

app.use(express.static(path.join(__dirname, "../client/public")));
app.use(express.static(path.join(__dirname, "../client/src")));

io.on("connection", (socket) => {
    let uname;
    socket.on("user-entry", (username) => {
        uname = username;
        socket.broadcast.emit("User-Update", true, username);
    });

    socket.on("send-message", (message) => {
        socket.broadcast.emit("receive-message", uname, message);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("User-Update", false, uname);
    });
});

server.listen(PORT, () => {
    console.log(`Server is Running at : http://localhost:${PORT}`);
});
