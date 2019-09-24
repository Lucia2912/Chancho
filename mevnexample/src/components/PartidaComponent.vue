<template>
<div v-model="container"></div>
</template>

<script>
export default {
 data(){
   return{
     container:{}
   };
 },
 created(){
   let deck = this.$cardeame().Deck();
   deck.mount(this.container);
 }
}
</script>

