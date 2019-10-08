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
     socket= io('localhost:4000');
     socket.on('cartasJugador', function(data){
         this.$methods.metodox();
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
         console.log("cartasJugador");
        this.idJugador=Math.random();
        console.log(this.idJugador);
     }
 }
}
 
</script>