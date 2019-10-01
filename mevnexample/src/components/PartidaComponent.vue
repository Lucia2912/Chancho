<template>

<div>
<div id="container"></div>
<button @click="iniciarPartida">Iniciar Partida</button>
<button @click="mover">Mover</button>
</div>
</template>

<script>
//let cardeame = require('../../node_modules/deck-of-cards/dist/deck.min.js');
import Deck from 'deck-of-cards/dist/deck';

import io from 'socket.io-client';

import EventBus from './EventBus';
export default {
 data(){
   return{
     container:{},
     deck:{},
     socket : io('localhost:4000')
   };
 },
    mounted(){
   this.deck = Deck.Deck();
   this.deck.mount(document.getElementById("container"));

  this.socket.on('welcome', (data) => {
           console.log(data);
        });

var idJugador=0;
var idJugadorExtra=0;
let yaEntroCero = false;


let esteSocket = this.socket;
let esteDeck = this.deck;


this.socket.emit('getIdJugador');

  this.socket.on('idJugador',function(data){
    if(idJugador==0 && !yaEntroCero){
    	
      idJugador = data;
     yaEntroCero = true;
    }
    console.log(data);
    idJugadorExtra = data;
    esteSocket.emit('tieneId');
  });

let contador = 0;
let delay = 1000;

let contadorExtra = 0;
let delayExtra = 1000;

var estoyJugandoYa = false;

var cartasDelJug1Colocada;
var cartasDelJug2Colocada;
var cartasDelJug3Colocada;


this.socket.on('cartasJugador', function(data){
 


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
               esteDeck.cards[cartasAbajo[j]].animateTo({
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
               esteDeck.cards[cartasAbajoJug1[j]].animateTo({
          delay: delayExtra,
          duration: 250,

          x: 400 + contadorExtra,
          y: 10
                    });
                esteDeck.cards[cartasAbajoJug2[j]].animateTo({
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
               esteDeck.cards[cartasAbajoJug1[j]].animateTo({
          delay: delayExtra,
          duration: 250,

          x: 400 + contadorExtra,
          y: 10
                    });
                esteDeck.cards[cartasAbajoJug2[j]].animateTo({
          delay: delayExtra,
          duration: 250,

          x: 10 + contadorExtra,
          y: -250
                    });

                esteDeck.cards[cartasAbajoJug3[j]].animateTo({
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
                  esteDeck.cards[arregloEnCuestion[k]].animateTo({
          delay: delay,
          duration: 250,

          x: valorX +contador,
          y: valorY,
          onComplete: function onComplete(){
             //seleccionarCarta(valorY, esIzquierda);
          }
        });
                }else{
         esteDeck.cards[arregloEnCuestion[k]].animateTo({
          delay: delay,
          duration: 250,

          x: valorX +contador,
          y: valorY
        });
                }
    



 contador = contador + 60;
 delay = delay + 200;
 if(!estoyJugandoYa){

  esteDeck.cards[arregloEnCuestion[k]].setSide('front');

 }
      }
      estoyJugandoYa = true;
entro = true;

    }

  }


  

});





 },
 methods:{
     iniciarPartida(){
         this.deck.shuffle();
     },
     mover(){
       EventBus.$emit('partida', 'hola');
     }
 }
}
</script>

