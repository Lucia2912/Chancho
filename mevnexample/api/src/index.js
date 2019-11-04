const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');
let json = require('../../environments/env.json');
const mongoose = require('mongoose');
const config = require('./DB.js');
const userRoute = require('./routes/user.route');
const chatRoute = require('./routes/chat.route');
const roomRoute = require('./routes/room.route');
let whitelist = [];
let corsOptions = {
  origin: function (origin, callback) {
      callback(null, true)
  }
 }
app.use(cors(corsOptions));
const salaRoute = require('./routes/sala.route');
app.use(express.urlencoded({extended: false}));
app.use(express.json());



mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.use('/user', userRoute);
app.use('/chat', chatRoute);
app.use('/room', roomRoute);
app.use('/sala', salaRoute);
let server = app.listen(json.PORTBACKEND, json.IPBACKEND,  function(){
  console.log('Servidor en puerto:',json.PORTBACKEND);
});


//let io = require('socket.io')(server,{ origins: '*:*'});
//io.set('origins', '*:*');
//io.origins('*:*');
let io = require("socket.io")(server, {
  handlePreflightRequest: (req, res) => {
      const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
      };
      res.writeHead(200, headers);
      res.end();
  }
});

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


let salas = [];


io.sockets.on('connection', function (socket) {

console.log('ON');

socket.on('CrearPartida', function(data){
  let existe = false;
  for(let i = 0; i<salas.length; i++){

    if(salas[i].idSala == data){
existe = true;
    }

  }
  if(!existe){
  socket.join(data);
 
   io.sockets.in(data).emit('mensaje', 'esta es la sala '+data);
   salas.push({idSala:data, cartaJugador1:[], cartaJugador2:[], cartaJugador3:[],cartaJugador4:[], idJugador:0, cuatroJugMovieron:0, idMiembros:[]});
    socket.idSala = data;
  }else{
    socket.join(data);
    socket.idSala = data;
  }
    

});
socket.emit("welcome", "probando");

socket.on('save-message', function (data) {
  console.log(data);
  io.sockets.emit('new-message', { message: data });
});

socket.on('getIdJugador', function(socket){
  

  console.log("jugador "+socket);
 
  for(let i = 0; i<salas.length; i++){
    if(salas[i].idSala == this.idSala){
      if(!salas[i].idMiembros.includes(socket)){
  
 let idJugadore = salas[i].idJugador;

  if(idJugadore <= 3){
    // probar con io.sockets.in(salas[i].idSala).emit("idJugador", idJugadore);
  //io.sockets.emit("idJugador", idJugadore);
  io.sockets.in(salas[i].idSala).emit("idJugador", idJugadore);
  idJugadore++;
  salas[i].idJugador = idJugadore;
  }
  salas[i].idMiembros.push(socket);
} else {
  io.sockets.in(salas[i].idSala).emit("idJugador", salas[i].idMiembros.indexOf(socket));
  console.log("Ya tiene lugar en la partida en el lugar "+salas[i].idMiembros.indexOf(socket));
}
}

}
});

let manoActual = [ases, dos, tres, cuatro];
    socket.on('tieneId', function(idSala){
  //	io.sockets.emit('cartasJugador',manoActual);
  console.log(idSala);
  io.sockets.in(idSala).emit('cartasJugador', manoActual, idSala);
    });



    socket.on('moverCarta', function(data){

      console.log("id de sala en mover carta "+data.idSala);

      for(let i = 0; i<salas.length; i++){
        if(salas[i].idSala == data.idSala){

      

    	if(data.idJugador == 0){
    		salas[i].cartaJugador1 = [data.palo, data.valor];
    	}else if(data.idJugador == 1){
        salas[i].cartaJugador2 = [data.palo, data.valor];
    	}else if(data.idJugador == 2){
    		salas[i].cartaJugador3 = [data.palo, data.valor];
    	}else if(data.idJugador == 3){	
    		salas[i].cartaJugador4 = [data.palo, data.valor];
    	}


    	salas[i].cuatroJugMovieron++;
    	if(salas[i].cuatroJugMovieron == 4){
    		let cartasAMover = [salas[i].cartaJugador1,salas[i].cartaJugador2, salas[i].cartaJugador3, salas[i].cartaJugador4];
        io.sockets.in(salas[i].idSala).emit('cambiarDeLugarCarta',cartasAMover);
       
        salas[i].cuatroJugMovieron = 0;
			console.log("Se emitio una vez");
      }
      

    }
  }
    });
});