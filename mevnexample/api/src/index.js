const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');
const postRoute = require('./routes/post.route');
const userRoute = require('./routes/user.route');
const chatRoute = require('./routes/chat.route');
const roomRoute = require('./routes/room.route');


app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.use('/posts', postRoute);
app.use('/user', userRoute);
app.use('/chat', chatRoute);
app.use('/room', roomRoute);
let server = app.listen(PORT, function(){
  console.log('Servidor en puerto:',PORT);
});


let io = require('socket.io')(server);


let mazito = [0,13,26,39,1,14,27,40,2,15,28,41,3,16,29,42];

function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
mezclar(mazito);
mezclar(mazito);

let ases = mazito.splice(0,4);
let dos = mazito.splice(0,4);
let tres = mazito.splice(0,4);
let cuatro = mazito.splice(0,4);

let idJugador = 0;

let losCuatroMovieronCartas = 0;
let cartaJugador1 = [];
let cartaJugador2 = [];
let cartaJugador3 = [];
let cartaJugador4 = [];



io.sockets.on('connection', function (socket) {


socket.emit("welcome", "probando");

socket.on('getIdJugador', function(socket){
  if(idJugador <= 3){
    
  io.sockets.emit("idJugador", idJugador);
  idJugador++;
  }
});

let manoActual = [ases, dos, tres, cuatro];
    socket.on('tieneId', function(socket){
		io.sockets.emit('cartasJugador',manoActual);
    });



    socket.on('moverCarta', function(data){

    	if(data.idJugador == 0){
    		cartaJugador1 = [data.palo, data.valor];
    	}else if(data.idJugador == 1){
    		cartaJugador2 = [data.palo, data.valor];
    	}else if(data.idJugador == 2){
    		cartaJugador3 = [data.palo, data.valor];
    	}else if(data.idJugador == 3){	
    		cartaJugador4 = [data.palo, data.valor];
    	}


    	losCuatroMovieronCartas++;
    	if(losCuatroMovieronCartas == 4){
    		let cartasAMover = [cartaJugador1,cartaJugador2, cartaJugador3, cartaJugador4];
    		io.sockets.emit('cambiarDeLugarCarta',cartasAMover);
    		losCuatroMovieronCartas = 0;
    	}
    });
});

io.on('connectionChat', function (socket) {
  console.log('User connected');
  socket.on('disconnectChat', function() {
    console.log('User disconnected');
  });
  socket.on('save-message', function (data) {
    console.log(data);
    io.emit('new-message', { message: data });
  });
});