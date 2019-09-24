<template>
<div>
<div id="container"></div>
<button @click="iniciarPartida">Iniciar Partida</button>
<button @click="mover">Mover</button>
</div>
</template>

<script>
//let cardeame = require('../../node_modules/deck-of-cards/dist/deck.min.js');
import Deck from 'deck-of-cards/dist/deck'
export default {
 data(){
   return{
     container:{},
     deck:{}
   };
 },
    mounted(){
   this.deck = Deck.Deck();
   this.deck.mount(document.getElementById("container"));
 },
 methods:{
     iniciarPartida(){
         this.deck.shuffle();
     },
     mover(){

     }
 }
}
</script>