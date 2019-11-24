<template>

<div>
<div id="container"></div>
<button id="btnMover" @click="moverCarta">Mover</button>
<button id="btnChancho" @click="cantarChancho" style="display: none;">Tenes Chancho!</button>
<button style="display: none;" @click="apretaAlChancho" id="apretarChancho">Chancho!!</button>

<label id="timer"></label>


<div id="myModal" class="modal" style="display: none;">
  <div id="otroModal" class="modal-content">
    <span class="close">&times;</span>
  </div>
</div>

</div>


</template>

<script>
import EventBus from './EventBus';
import $ from 'jquery';
import jwtDecode from 'jwt-decode';
//let cardeame = require('../../node_modules/deck-of-cards/dist/deck.min.js');
import Deck from 'deck-of-cards/dist/deck';
import json from '../../environments/env.json';
import io from 'socket.io-client';

let cartaElegidosa;
let idJugadoroso;
let divoso;
let elQueCantoChancho = false;
let esteDeckardo;

let socketardo = io('localhost:4000');


function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function seleccionarCarta(alturita, posicionIzquierda){
 let misCartas = document.getElementsByClassName('face');

 

  for(let c = 0; c<misCartas.length; c++){
  
  misCartas[c].onclick = function(){


  let misCartas = document.getElementsByClassName('face');

  let pintameElBorde = true;
  let primerValor = misCartas[c].parentElement.style.transform.replace(/^\D+|\D.*$/g, "");
 
  //var ultimoValor = misCartas[c].parentElement.style.transform.replace(/.*\D(?=\d)|\D+$/g, "");
  //var ultimoValorcito = misCartas[c].parentElement.style.transform.replace(/([^\/,\s]+)(-?\D+$)/g, "");
 if(posicionIzquierda){
  primerValor = "-"+primerValor;

 }
  var ultimoValorcito = misCartas[c].parentElement.style.transform.replace(/.*\D(?=\W\d)|\D+$/g,"");

  //.*\D(?=-\d)|\D+$

  //falta convertir esto  a expresion regular bien que saque numeros negativos
 //var ultimoValor = ultimoValorcito.substring(0, ultimoValorcito.length - 1);

  let valorEntero = parseInt(ultimoValorcito,10);

  let convirtiendoNumero =Number(ultimoValorcito);


 
  if(convirtiendoNumero != alturita){

 
  valorEntero = alturita;
 pintameElBorde = false;
 }else{
  valorEntero = alturita - 20;
  //esto es para bajar las otras cartas cuando una está seleccionada
  for(let k = 0; k<misCartas.length; k++){
    let primerValorOtras = misCartas[k].parentElement.style.transform.replace(/^\D+|\D.*$/g, "");
    if(posicionIzquierda){
      primerValorOtras = "-"+primerValorOtras;
    }
        var ultimoValorOtras = misCartas[k].parentElement.style.transform.replace(/([^\/,\s]+)(-?\D+$)/g, "");
  let valorEnteroOtras = parseInt(ultimoValorOtras,10);
  if(valorEnteroOtras != alturita){
    valorEnteroOtras = alturita;
    misCartas[k].parentElement.style.transform = "translate("+primerValorOtras+"px,"+valorEnteroOtras.toString()+"px)";
    misCartas[k].parentElement.style.border = "";
  }
  }
 }

  misCartas[c].parentElement.style.transform = "translate("+primerValor+"px,"+valorEntero.toString()+"px)";
  if(pintameElBorde){
    misCartas[c].parentElement.style.border = "solid";
  }
    else{
misCartas[c].parentElement.style.border = "";
  }

/*
palos de las cartas (suit)
0 = picas
1 = corazones
2 = treboles
3 = diamantes

el atributo "rank" es el valor de la carta
*/
let paloABuscar;
let valorDeCarta;
let padre = misCartas[c].parentElement;
if(padre.classList.contains("hearts")){
 paloABuscar = 1;

}else if(padre.classList.contains("spades")){
paloABuscar = 0;
}else if(padre.classList.contains("clubs")){
paloABuscar = 2;
}else{
  paloABuscar = 3;
}


if(padre.classList.contains("rank1")){
valorDeCarta = 1;
}else if(padre.classList.contains("rank2")){
  valorDeCarta = 2;
}else if(padre.classList.contains("rank3")){
  valorDeCarta = 3;
}else{
  valorDeCarta = 4;
}


esteDeckardo.cards.forEach(function (card, i) {
  if(card.rank == valorDeCarta && card.suit == paloABuscar){

  divoso = misCartas[c];
  cartaElegidosa = card;

  }
});


};
//});


}

};







export default {
 data(){
   const token = localStorage.usertoken;
   const decode = jwtDecode(token);
   return{
     container:{},
     deck:{},
     socket : io(json.IP + json.PORT),
     divElegido:{},
     cartaElegida:{},
     idJugador:0,
     usuario: decode
   };
 },
 created(){
   $('body').removeClass('modal-open');
   $('.modal-backdrop').remove();
   console.log(this.$route.params.sala);
   },
   beforeUpdate(){
   this.socket.off("cartasJugador");
   console.log("before update");
 },
    mounted(){
      this.socket.emit('CrearPartida', this.$route.params.sala);

    this.socket.on('mensaje', function(data) {
   console.log('Incoming message:', data);
});
   //this.deck = Deck.Deck();
   //this.deck.mount(document.getElementById("container"));
esteDeckardo = Deck.Deck();
   esteDeckardo.mount(document.getElementById("container"));

  this.socket.on('welcome', (data) => {
        
        });

var idJugador=0;
var idJugadorExtra=0;
let yaEntroCero = false;


let esteSocket = this.socket;
//let esteDeck = this.deck;
//esteDeckardo =this.deck;
let estaCartaElegida = this.cartaElegida;
let esteDivElegido = this.divElegido;


/*let contadorTiempo;
var x = setInterval(function() {
contadorTiempo=10;
 

 


  // Display the result in the element with id="demo"
  document.getElementById("timer").innerHTML =  contadorTiempo + "s ";
contadorTiempo--;
 
}, 1000);*/

this.socket.emit('getIdJugador', this.usuario._id, this.usuario.nickname);

let rutera =this.$route.params.sala;
  this.socket.on('idJugador',function(data){
    if(idJugador==0 && !yaEntroCero){
    	
      idJugador = data;
     yaEntroCero = true;
    }
    
    idJugadorExtra = data;
    esteSocket.emit('tieneId',rutera);
    this.idJugador = idJugador;
    idJugadoroso = idJugador;
  });

let contador = 0;
let delay = 1000;

let contadorExtra = 0;
let delayExtra = 1000;

var estoyJugandoYa = false;

var cartasDelJug1Colocada;
var cartasDelJug2Colocada;
var cartasDelJug3Colocada;

let yaEntroaPagina = false;
this.socket.on('cartasJugador', function(data, idSala){


let nuevaGalleta = getCookie("HasVisited"+idSala+idJugadorExtra);
document.cookie = "HasVisited"+idSala+idJugadorExtra+"=true";

if(nuevaGalleta){
  console.log("Ya entró a esta página");
  console.log("y esta es la id del jugador "+idJugadorExtra);

 
}else{
  console.log("Primera vez que entra");
}
 



let entro = false;
  for(let i = 0; i<=3; i++){
    cartasDelJug1Colocada = false;
    cartasDelJug2Colocada = false;
    cartasDelJug3Colocada = false;

    let arregloEnCuestion = data[i];
    contador = 0;
    delay = 1000;
    if(i == idJugadorExtra){

      for(let k = 0; k<=3; k++){
        let valorX;
        let valorY;
        contadorExtra = 0;
        delayExtra = 0;
        if(i == 0) {
          valorX = 400;
          valorY = 10;

            }else if(i == 1){
               valorX = 10;  
               valorY = -250;

            let cartasAbajo = data[0];
            if(!cartasDelJug1Colocada){
                   for(let j = 0; j<=3; j++){
               esteDeckardo.cards[cartasAbajo[j]].animateTo({
          delay: delayExtra,
          duration: 250,

          x: 400 + contadorExtra,
          y: 10
                    });


            contadorExtra = contadorExtra + 60;
            delayExtra = delayExtra + 200;
                                  }
                 cartasDelJug1Colocada = true;
                     }


            }else if(i == 2){
              valorX = -400;
              valorY = 10;

             let cartasAbajoJug1 = data[0];
              let cartasAbajoJug2 = data[1];
              if(!cartasDelJug1Colocada || !cartasDelJug2Colocada){
                 for(let j = 0; j<=3; j++){
               esteDeckardo.cards[cartasAbajoJug1[j]].animateTo({
          delay: delayExtra,
          duration: 250,

          x: 400 + contadorExtra,
          y: 10
                    });
                esteDeckardo.cards[cartasAbajoJug2[j]].animateTo({
          delay: delayExtra,
          duration: 250,

          x: 10 + contadorExtra,
          y: -250
                    });


            contadorExtra = contadorExtra + 60;
            delayExtra = delayExtra + 200;
                                  }
                                    cartasDelJug1Colocada = true;
                                    cartasDelJug2Colocada = true;
              }



            }else if(i == 3){
              valorX = 10;
              valorY = 190;

               let cartasAbajoJug1 = data[0];
              let cartasAbajoJug2 = data[1];
              let cartasAbajoJug3 = data[2];

                if(!cartasDelJug1Colocada || !cartasDelJug2Colocada || !cartasDelJug3Colocada){

                           for(let j = 0; j<=3; j++){
               esteDeckardo.cards[cartasAbajoJug1[j]].animateTo({
          delay: delayExtra,
          duration: 250,

          x: 400 + contadorExtra,
          y: 10
                    });
                esteDeckardo.cards[cartasAbajoJug2[j]].animateTo({
          delay: delayExtra,
          duration: 250,

          x: 10 + contadorExtra,
          y: -250
                    });

                esteDeckardo.cards[cartasAbajoJug3[j]].animateTo({
          delay: delayExtra,
          duration: 250,

          x: -400 + contadorExtra,
          y: 10
                    });


            contadorExtra = contadorExtra + 60;
            delayExtra = delayExtra + 200;
                                  }

                                    cartasDelJug1Colocada = true;
                                    cartasDelJug2Colocada = true;
                                    cartasDelJug3Colocada = true;
                }



            }


            if(k==3 && !estoyJugandoYa){
              let esIzquierda = false;
              if(i==2){
                esIzquierda =true;
              }
                  esteDeckardo.cards[arregloEnCuestion[k]].animateTo({
          delay: delay,
          duration: 250,

          x: valorX +contador,
          y: valorY,
          onComplete: function onComplete(){
             seleccionarCarta(valorY, esIzquierda);
          }
        });
                }else{
         esteDeckardo.cards[arregloEnCuestion[k]].animateTo({
          delay: delay,
          duration: 250,

          x: valorX +contador,
          y: valorY
        });
                }
    



 contador = contador + 60;
 delay = delay + 200;
 if(!estoyJugandoYa){

  esteDeckardo.cards[arregloEnCuestion[k]].setSide('front');


 }
      }
      estoyJugandoYa = true;
entro = true;

    }

  }


  

});

let llamarMetodo = this;
this.socket.on('cambiarDeLugarCarta', function(data){




	let arrayCartas1 = data[0];
	let arrayCartas2 = data[1];
	let arrayCartas3 = data[2];
	let arrayCartas4 = data[3];

	let cartaJugador1;
	let cartitaJugador1;
	let cartaJugador2;
	let cartaJugador3;
	let cartaJugador4;
  esteDeckardo.cards.forEach(function (card, i) {
  if(card.suit == arrayCartas1[0] && card.rank == arrayCartas1[1]){
  cartaJugador1 = card;
  }else if(card.suit == arrayCartas2[0] && card.rank == arrayCartas2[1]){
  cartaJugador2 = card;
  }else if(card.suit == arrayCartas3[0] && card.rank == arrayCartas3[1]){
  cartaJugador3 = card;
  }else if(card.suit == arrayCartas4[0] && card.rank == arrayCartas4[1]){
  cartaJugador4 = card;
  }


});


let xDel1 = cartaJugador1.x;


let yDel1 = cartaJugador1.y;
let yDel2 = cartaJugador2.y;
let yDel3 = cartaJugador3.y;
let yDel4 = cartaJugador4.y;




if(this.idJugador == 0){




cartaJugador1.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador2.x,
          y: cartaJugador2.y,
           onStart: function onStart() {
     
         
            divoso.parentElement.style.border = "";
            cartaJugador1.setSide('back');

          

          },
          onComplete: function onComplete(){
             
            

           
          }
        });
        


	cartaJugador2.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador3.x,
          y: cartaJugador3.y,
           onStart: function onStart() {
           
             cartaJugador2.setSide('back');
          },
          onComplete: function onComplete(){
           
           

           
          }
        });




	cartaJugador3.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador4.x,
          y: cartaJugador4.y,
           onStart: function onStart() {
           
             cartaJugador3.setSide('back');
          },
          onComplete: function onComplete(){
           
           

           
          }
        });




	cartaJugador4.animateTo({
          delay: 200,
          duration: 400,

          x: xDel1,
          y: yDel1,
           onStart: function onStart() {
           
            cartaJugador4.setSide('front');
          },
          onComplete: function onComplete(){
             
            
          seleccionarCarta(yDel1, false);
           llamarMetodo.tieneChancho();
          }
        });


}else if(this.idJugador == 1){



cartaJugador2.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador3.x,
          y: cartaJugador3.y,
           onStart: function onStart() {
     
            divoso.parentElement.style.border = "";
            cartaJugador2.setSide('back');
           
          },
          onComplete: function onComplete(){
             
            

           
          }
        });

	cartaJugador1.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador2.x,
          y: cartaJugador2.y,
           onStart: function onStart() {
           
                cartaJugador1.setSide('front');
          },
           onComplete: function onComplete(){
              seleccionarCarta(yDel2, false);
              llamarMetodo.tieneChancho();
        

           
          }
        });

	cartaJugador3.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador4.x,
          y: cartaJugador4.y,
           onStart: function onStart() {
          
             cartaJugador3.setSide('back');
          },
          onComplete: function onComplete(){
          
           

           
          }
        });

	cartaJugador4.animateTo({
          delay: 200,
          duration: 400,

          x: xDel1,
          y: yDel1,
           onStart: function onStart() {
           
            cartaJugador4.setSide('back');
          },
          onComplete: function onComplete(){
          
            

           
          }
        });



}else if(this.idJugador == 2){



cartaJugador3.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador4.x,
          y: cartaJugador4.y,
           onStart: function onStart() {
        
            divoso.parentElement.style.border = "";
            cartaJugador3.setSide('back');
           
          },
          onComplete: function onComplete(){
             
            

           
          }
        });

	cartaJugador2.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador3.x,
          y: cartaJugador3.y,
           onStart: function onStart() {
            
              cartaJugador2.setSide('front');

          },
          onComplete: function onComplete(){
         seleccionarCarta(yDel3, true);
         llamarMetodo.tieneChancho();
          
           
          }
        });
	cartaJugador4.animateTo({
          delay: 200,
          duration: 400,

          x: xDel1,
          y: yDel1,
           onStart: function onStart() {
           
             cartaJugador4.setSide('back');
          },
          onComplete: function onComplete(){
           
           

           
          }
        });

	cartaJugador1.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador2.x,
          y: cartaJugador2.y,
           onStart: function onStart() {
           
              cartaJugador1.setSide('back');
          },
          onComplete: function onComplete(){
          
          

           
          }
        });


}else if(this.idJugador == 3){


cartaJugador4.animateTo({
          delay: 200,
          duration: 400,

          x: xDel1,
          y: yDel1,
           onStart: function onStart() {
     
             divoso.parentElement.style.border = "";
            cartaJugador4.setSide('back');
          
          },
          onComplete: function onComplete(){
            

           
          }
        });

cartaJugador3.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador4.x,
          y: cartaJugador4.y,
           onStart: function onStart() {
            
            cartaJugador3.setSide('front');
          },
          onComplete: function onComplete(){
            seleccionarCarta(yDel4, false);
            llamarMetodo.tieneChancho();
            

           
          }
        });
cartaJugador1.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador2.x,
          y: cartaJugador2.y,
           onStart: function onStart() {
           
            cartaJugador1.setSide('back');
          },
          onComplete: function onComplete(){
        
            

           
          }
        });
cartaJugador2.animateTo({
          delay: 200,
          duration: 400,

          x: cartaJugador3.x,
          y: cartaJugador3.y,
           onStart: function onStart() {
          
             cartaJugador2.setSide('back');
          },
          onComplete: function onComplete(){
            
           

           
          }
        });


}



 document.getElementById("btnMover").style.display = "block";



});

this.socket.on("totalArregloChancho", function(data){
console.log("Este es el actual arreglo chancho "+data);
});

this.socket.on("finalizoPartida", function(data){
console.log("Ganador: "+data);
console.log("La partida ha finalizado");
let uri = json.IP + json.PORT + `sala/finalizo/${this.$route.params.sala}`;
this.axios.post(uri, {Ganador: data}).then(res => {
  this.$router.push({name: 'lobby'});
})

});

this.socket.on("botonChanchoMostrado", function(){
if(!elQueCantoChancho){
 document.getElementById("apretarChancho").style.display = "block";
 
}else{
  elQueCantoChancho = false;
}
});

let nombreUsu = this.usuario.nickname;
this.socket.on("repartirDespuesChancho", function(cartasRepartir, tablaPuntajeChanchos, nickMiembros){

//esteDeckardo.unmount();
//esteDeckardo.mount(document.getElementById("container"));







let cartonasJug1 = cartasRepartir[0];
let cartonasJug2 = cartasRepartir[1];
let cartonasJug3 = cartasRepartir[2];
let cartonasJug4 = cartasRepartir[3];

let nuevasCardsJug1 = [];
let nuevasCardsJug2 = [];
let nuevasCardsJug3 = [];
let nuevasCardsJug4 = [];
let contador = 0;

for(let j=0; j<cartonasJug1.length; j++){

    esteDeckardo.cards.forEach(function (card, i) {
       if(card.i == cartonasJug1[j]){
         nuevasCardsJug1.push(card);
       }else if(card.i == cartonasJug2[j]){
         nuevasCardsJug2.push(card);
       }else if(card.i == cartonasJug3[j]){
         nuevasCardsJug3.push(card);
       }else if(card.i == cartonasJug4[j]){
         nuevasCardsJug4.push(card);
       }
  
});
}


if(idJugadoroso == 0){

let contador = 0;

  for(let g=0; g<nuevasCardsJug1.length;g++){
    nuevasCardsJug1[g].setSide('front');

      nuevasCardsJug1[g].animateTo({
          delay: 1000 + g * 50,
          duration: 250,

          x: 400 +contador,
          y: 10,
          onComplete: function onComplete(){
             seleccionarCarta(10, false);
                console.log("complete g:"+g+" contador:"+contador+" jug"+1);
          }
        });
        

        nuevasCardsJug2[g].animateTo({
 delay: 1000  + g * 50,
          duration: 250,
          x: 10 +contador,
          y:-250  
});

 nuevasCardsJug3[g].animateTo({
 delay: 1000  + g * 50,
          duration: 250,
          x: -400 +contador,
          y:10
});

 nuevasCardsJug4[g].animateTo({
 delay: 1000  + g * 50,
          duration: 250,
          x: 10 +contador,
          y:190
});
  contador = contador + 60;

}
/*contador = 0;
for(let g=0; g<nuevasCardsJug2.length; g++){

nuevasCardsJug2[g].animateTo({
 delay: 1000,
          duration: 250,
          x: 10 +contador,
          y:-250,
          onComplete: function onComplete(){
            
          }
});
  contador = contador + 60;
}
  
*/

}else if(idJugadoroso == 1){
let contador = 0;

  for(let g=0; g<nuevasCardsJug1.length;g++){
nuevasCardsJug2[g].setSide('front');
      nuevasCardsJug1[g].animateTo({
          delay: 1000  + g * 50, 
          duration: 250,

          x: 400 +contador,
          y: 10
        });
        

        nuevasCardsJug2[g].animateTo({
 delay: 1000  + g * 50,
          duration: 250,
          x: 10 +contador,
          y:-250,
          onComplete: function onComplete(){
            seleccionarCarta(-250, false);
              
          }
});

 nuevasCardsJug3[g].animateTo({
 delay: 1000  + g * 50,
          duration: 250,
          x: -400 +contador,
          y:10
});

 nuevasCardsJug4[g].animateTo({
 delay: 1000  + g * 50,
          duration: 250,
          x: 10 +contador,
          y:190
});
  contador = contador + 60;

}


}else if(idJugadoroso == 2){

let contador = 0;
 
  for(let g=0; g<nuevasCardsJug1.length;g++){
 
nuevasCardsJug3[g].setSide('front');
      nuevasCardsJug1[g].animateTo({
          delay: 1000 + g * 50,
          duration: 250,

          x: 400 +contador,
          y: 10
        });
        

        nuevasCardsJug2[g].animateTo({
 delay: 1000 + g * 50,
          duration: 250,
          x: 10 +contador,
          y:-250
});

 nuevasCardsJug3[g].animateTo({
 delay: 1000 + g * 50,
          duration: 250,
          x: -400 +contador,
          y:10,
          onComplete: function onComplete(){
            seleccionarCarta(10, true);
              
          }
});

 nuevasCardsJug4[g].animateTo({
 delay: 1000 + g * 50,
          duration: 250,
          x: 10 +contador,
          y:190
});
  contador = contador + 60;

}
console.log("cartas despues");
  console.log(esteDeckardo.cards);

}else if(idJugadoroso == 3){


let contador = 0;

  for(let g=0; g<nuevasCardsJug1.length;g++){
    nuevasCardsJug4[g].setSide('front');

      nuevasCardsJug1[g].animateTo({
          delay: 1000 + g * 50,
          duration: 250,

          x: 400 +contador,
          y: 10,
          onComplete: function onComplete(){
            
          }
        });
        

        nuevasCardsJug2[g].animateTo({
 delay: 1000 + g * 50,
          duration: 250,
          x: 10 +contador,
          y:-250,
          onComplete: function onComplete(){
              
          }
});

 nuevasCardsJug3[g].animateTo({
 delay: 1000 + g * 50,
          duration: 250,
          x: -400 +contador,
          y:10,
          onComplete: function onComplete(){
              
          }
});


 nuevasCardsJug4[g].animateTo({
 delay: 1000 + g * 50,
          duration: 250,
          x: 10 +contador,
          y:190,
          onComplete: function onComplete(){
            seleccionarCarta(190, false);
          
          }
});
  contador = contador + 60;

}


}
var modal = document.getElementById("myModal");
var otroModal = document.getElementById("otroModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
modal.style.display = "block";

var titulo = document.createElement("p");
var para = document.createElement("p");
var para2 = document.createElement("p");
var para3 = document.createElement("p");
var para4 = document.createElement("p");

let puntajeJug1="";
for(let i = 0; i<tablaPuntajeChanchos[0].length; i++){
  puntajeJug1 = puntajeJug1+ tablaPuntajeChanchos[0][i];
}
let puntajeJug2="";
for(let i = 0; i<tablaPuntajeChanchos[1].length; i++){
  puntajeJug2 = puntajeJug2 + tablaPuntajeChanchos[1][i];
}
let puntajeJug3="";
for(let i = 0; i<tablaPuntajeChanchos[2].length; i++){
  puntajeJug3 = puntajeJug3 + tablaPuntajeChanchos[2][i];
}
let puntajeJug4="";
for(let i = 0; i<tablaPuntajeChanchos[3].length; i++){
  puntajeJug4 = puntajeJug4+ tablaPuntajeChanchos[3][i];
}

var nodeTitulo = document.createTextNode("Tabla de puntajes");
var node = document.createTextNode(nickMiembros[0]+" (Jugador 1): "+puntajeJug1);
var node2 = document.createTextNode(nickMiembros[1]+" (Jugador 2): "+puntajeJug2);
var node3 = document.createTextNode(nickMiembros[2]+" (Jugador 3): "+puntajeJug3);
var node4 = document.createTextNode(nickMiembros[3]+" (Jugador 4): "+puntajeJug4);

titulo.appendChild(nodeTitulo);
para.appendChild(node);
para2.appendChild(node2);
para3.appendChild(node3);
para4.appendChild(node4);

otroModal.appendChild(titulo);
otroModal.appendChild(para);
otroModal.appendChild(para2);
otroModal.appendChild(para3);
otroModal.appendChild(para4);



setTimeout(function(){
  modal.style.display = "none";
  $('#otroModal').empty();
 }, 5000);
/*
span.onclick = function() {
  modal.style.display = "none";
   $('#myModal div').empty();
}
*/


});


 },
 methods:{
     cantarChancho(){
       
       
       

     },
     apretaAlChancho(){
//hacer chequeo 
       if(this.tenesCartasIguales()){
         this.socket.emit("mostraElBotonChancho", this.$route.params.sala);
         elQueCantoChancho = true;
       }
       
       esteDeckardo.sort();

 esteDeckardo.cards.forEach(function (card, i) {
                card.setSide('back');
 });
       this.socket.emit("cantaChancho",{idJugador: idJugadoroso, idSala:this.$route.params.sala});

  document.getElementById("apretarChancho").style.display = "none";
  document.getElementById("btnChancho").style.display = "none";

     },
    tenesCartasIguales(){
      
       let cartasBocaArriba = document.getElementsByClassName('face');

        let todasCartasIguales = "";
        let sonIguales = false;
        let suma = 0;
       for(let h=0; h<cartasBocaArriba.length; h++){

         var classList = cartasBocaArriba[h].parentElement.className.split(' ');
        
        
         if(todasCartasIguales == ""){
           todasCartasIguales = classList[2];
         }else if(todasCartasIguales == classList[2])
         {
           sonIguales = true;
           suma++;
         }else{
           sonIguales = false;
         }

       }
      

      if(sonIguales && suma == 3){
        return true;
      }else{
        return false;
      }

    },
     tieneChancho(){



       let cartasBocaArriba = document.getElementsByClassName('face');

        let todasCartasIguales = "";
        let sonIguales = false;
        let suma = 0;
       for(let h=0; h<cartasBocaArriba.length; h++){

         var classList = cartasBocaArriba[h].parentElement.className.split(' ');
        
        
         if(todasCartasIguales == ""){
           todasCartasIguales = classList[2];
         }else if(todasCartasIguales == classList[2])
         {
           sonIguales = true;
           suma++;
         }else{
           sonIguales = false;
         }

       }
      

      if(sonIguales && suma == 3){
        document.getElementById("apretarChancho").style.display = "block";
      }else{
        document.getElementById("apretarChancho").style.display = "none";
        
      
      }

     },
     moverCarta(){

let misCartas = document.getElementsByClassName('face');





let indiceX = this.cartaElegida.x;
let indiceY =this.cartaElegida.y;

//let esteDeckito = this.deck;


let idSalaGeneral = this.$route.params.sala;
this.socket.emit('moverCarta',{palo: cartaElegidosa.suit, valor: cartaElegidosa.rank, idJugador: idJugadoroso, idSala: idSalaGeneral});


//por aca pasa una vez


  document.getElementById("btnMover").style.display = "none";

//this.deck = esteDeckito;


     }
 }
}
</script>

