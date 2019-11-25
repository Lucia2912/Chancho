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



function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


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
   let mazito = [0,13,26,39,1,14,27,40,2,15,28,41,3,16,29,42];
   mezclar(mazito);
   mezclar(mazito);
   
   let ases = mazito.splice(0,4);
   let dos = mazito.splice(0,4);
   let tres = mazito.splice(0,4);
   let cuatro = mazito.splice(0,4);
   let manoActual = [ases, dos, tres, cuatro];
   salas.push({idSala:data, manoActualSala:manoActual, conteoChancho:0, primeroCantarChancho:0, tieneChanchoJug1:[], tieneChanchoJug2:[], tieneChanchoJug3:[], tieneChanchoJug4:[], cartaJugador1:[], cartaJugador2:[], cartaJugador3:[],cartaJugador4:[], idJugador:0, cuatroJugMovieron:0, idMiembros:[], nombreMiembros:[]});
    socket.idSala = data;
  }else{
    socket.join(data);
    socket.idSala = data;
  }
    

});



socket.emit("welcome", "probando");

socket.on('save-message', function (data) {
 
  io.sockets.emit('new-message', { message: data });
});

socket.on('getIdJugador', function(socket, nickname){
  


 
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
  salas[i].nombreMiembros.push(nickname);
  }
  salas[i].idMiembros.push(socket);
    } else {
		//aca habria que mandar una var diciendo que este jugador ya jugo, para repartir bien, de vuelta
  io.sockets.in(salas[i].idSala).emit("idJugador", salas[i].idMiembros.indexOf(socket));
 
}
}

}
});


    socket.on('tieneId', function(idSala){
  //	io.sockets.emit('cartasJugador',manoActual);

  for(let i = 0; i<salas.length; i++){
    if(salas[i].idSala == idSala){
      io.sockets.in(idSala).emit('cartasJugador', salas[i].manoActualSala, idSala);
    }
  }
 
    });


    socket.on('cantaChancho', function(data){



      let arregloChancho = ['C','H','A','N','C','H','O'];

      for(let i = 0; i<salas.length; i++){
        if(salas[i].idSala == data.idSala){

          salas[i].conteoChancho++;
          if(salas[i].conteoChancho == 4){

          if(data.idJugador == 0){
            salas[i].tieneChanchoJug1.push(arregloChancho[salas[i].tieneChanchoJug1.length]);
          }else if(data.idJugador == 1){
            salas[i].tieneChanchoJug2.push(arregloChancho[salas[i].tieneChanchoJug2.length]);
          }else if(data.idJugador == 2){
            salas[i].tieneChanchoJug3.push(arregloChancho[salas[i].tieneChanchoJug3.length]);
          }else if(data.idJugador == 3){
            salas[i].tieneChanchoJug4.push(arregloChancho[salas[i].tieneChanchoJug4.length]);
          }
          salas[i].conteoChancho = 0;
          let mazardo = [0,13,26,39,1,14,27,40,2,15,28,41,3,16,29,42];
          mezclar(mazardo);
          mezclar(mazardo);
         
let unaMano = mazardo.splice(0,4);
let dosMano = mazardo.splice(0,4);
let tresMano = mazardo.splice(0,4);
let cuatroMano = mazardo.splice(0,4);
let manoActuale = [unaMano, dosMano, tresMano, cuatroMano];

let chanchero1 = salas[i].tieneChanchoJug1;
let chanchero2 = salas[i].tieneChanchoJug2;
let chanchero3 = salas[i].tieneChanchoJug3;
let chanchero4 = salas[i].tieneChanchoJug4;

if(chanchero1.length == 7 || chanchero2.length == 7 || chanchero3.length == 7 || chanchero4.length == 7){
  if(chanchero1.length == 7){
    let ganador = salas[i].idMiembros[0];
    io.sockets.in(data.idSala).emit("finalizoPartida", ganador);
  }
  if(chanchero2.length == 7){
    let ganador = salas[i].idMiembros[1];
    io.sockets.in(data.idSala).emit("finalizoPartida", ganador);
  }
  if(chanchero3.length == 7){
    let ganador = salas[i].idMiembros[2];
    io.sockets.in(data.idSala).emit("finalizoPartida", ganador);
  }
  if(chanchero4.length == 7){
    let ganador = salas[i].idMiembros[4];
    io.sockets.in(data.idSala).emit("finalizoPartida", ganador);
  }

}else{

let todosChanchos = [salas[i].tieneChanchoJug1, salas[i].tieneChanchoJug2, salas[i].tieneChanchoJug3, salas[i].tieneChanchoJug4]
console.log(salas);
salas[i].primeroCantarChancho = 0;
io.sockets.in(data.idSala).emit('setearTodoACero');
  io.sockets.in(data.idSala).emit('repartirDespuesChancho', manoActuale, todosChanchos, salas[i].nombreMiembros);
      
        }
        }

        }
      }

      

    });



    socket.on('mostraElBotonChancho', function(idSala){


      for(let i = 0; i<salas.length; i++){
        if(salas[i].idSala == idSala){

          if(salas[i].primeroCantarChancho == 0){
          io.sockets.in(idSala).emit('botonChanchoMostrado');
          salas[i].primeroCantarChancho = 1;
        }
        }
      }
    
    });

    socket.on('alguienCantoChancho', function(idSala){

      for(let i = 0; i<salas.length; i++){
        if(salas[i].idSala == idSala){

          io.sockets.in(idSala).emit('hayChanchoCantado', salas[i].primeroCantarChancho);
        }
      }

    });



    socket.on('moverCarta', function(data){

     

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