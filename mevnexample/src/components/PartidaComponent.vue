<template>

<div>
<div id="container"></div>
<button v-on:click.stop="iniciarPartida">Iniciar Partida</button>
<button @click="moverCarta">Mover</button>
<button id="btnChancho" style="display: none;">Chancho!</button>
</div>
</template>

<script>
import EventBus from './EventBus';
import $ from 'jquery';
import jwtDecode from 'jwt-decode';
//let cardeame = require('../../node_modules/deck-of-cards/dist/deck.min.js');
import Deck from 'deck-of-cards/dist/deck';
import json from '../../environments/env.json'
import io from 'socket.io-client';

let cartaElegidosa;
let idJugadoroso;
let divoso;

let esteDeckardo;

let socketardo = io('localhost:4000');




function seleccionarCarta(alturita, posicionIzquierda){
 let misCartas = document.getElementsByClassName('face');

  console.log(misCartas);

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

console.log(divoso.parentElement);
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


this.socket.emit('getIdJugador', this.usuario._id);

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


this.socket.on('cartasJugador', function(data, idSala){
 console.log("cartaJugador con idSala: "+idSala);


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



console.log("este es divoso: ");
console.log(divoso.parentElement);
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







});

 },
 methods:{
     iniciarPartida(){
      console.log(cartaElegidosa);
      console.log(idJugadoroso);
      this.socket.emit('tieneId');
      this.socket.on('cartasJugador', function(data){
        console.log("cartasJugador");
      });


     },
     tieneChancho(){



       let cartasBocaArriba = document.getElementsByClassName('face');

        let todasCartasIguales = "";
        let sonIguales = false;
        let suma = 0;
       for(let h=0; h<cartasBocaArriba.length; h++){

         var classList = cartasBocaArriba[h].parentElement.className.split(' ');
        
         console.log(classList[2]);
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
       console.log("Son iguales "+sonIguales+" "+suma);

      if(sonIguales && suma == 3){
        document.getElementById("btnChancho").style.display = "block";
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




//this.deck = esteDeckito;


     }
 }
}
</script>

