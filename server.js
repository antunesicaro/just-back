const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const twilio = require("twilio");

const PORT = process.env.PORT || 5002;
const app = express();
const server = http.createServer(app);

app.use(cors());

let connectedUsers = [];
let rooms = [];

// create route to check if room exists
app.get("/api/room-exists/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = rooms.find((room) => room.id === roomId);

  if (room) {
    // send reponse that room exists
    if (room.connectedUsers.length > 2) {
      return res.send({ roomExists: true, full: true });
    } else {
      return res.send({ roomExists: true, full: false });
    }
  } else {
    // send response that room does not exists
    return res.send({ roomExists: false });
  }
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on('connection',(socket) => {
  console.log(`usuario tu se conectou com o servidor socket hein, olha o id : ${socket.id}`)

  socket.on('create-new-room',(data) => { //fica escutando aqui o evento create-new-room, quando escuta lá, ou seja, o cliente emit(emite) aqui vai ser escutado e manipulo os dadis (data) do cliente q é o wss.js
    createNewRoomHandler(data,socket)
  })
})

const createNewRoomHandler = (data,socket) => {
  console.log('host ta criando a sala')
  const {identity} = data;

  const roomId = uuidv4();

  // criar novo usuario
  const newUser = {
    identity,
    id:uuidv4(),
    socketId: socket.id,
    roomId:roomId
  }

  //push no user para ir para usarioconectado q é o array conectedusers
  connectedUsers = [...connectedUsers,newUser];

  //cria nova sala
  const newRoom = {
    id:roomId,
    connectedUsers: [newUser]
  }

  // entra na sala do socketio pra conectar só numa sala em especifico
  //logica aqui do socket
}

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
