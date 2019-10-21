<template>

<div>

<button v-on:click.stop="iniciarPartida">Iniciar Partida</button>

</div>
</template>

<script>
import io from 'socket.io-client';
import Vue from 'vue';
let socket; 
export default {
 beforeUpdate(){
   socket.off("cartasJugador");
   console.log("befoUpd");
 },mounted: function mounted () {
   let algo = this;
     socket= io('localhost:4000');
     socket.on('cartasJugador', function(data){
     
        algo.metodox();
      });
 },
 data(){
   return{
     idJugador:0
   };
 },
 methods:{
     iniciarPartida(){
           socket.emit('tieneId');
      
     },
     metodox(){
        /* console.log("cartasJugador");
        this.idJugador=Math.random();
        console.log(this.idJugador);*/

        console.log("hace algo");
     }
 }
}
 
</script>