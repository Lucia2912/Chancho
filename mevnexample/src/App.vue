<template>
  <div class="container">
   <nav class="navbar navbar-expand-lg navbar-dark bg-dark" style="max-height: 50px; background-color: #000 !important;">
  
    <div class="navbar-collapse collapse w-100 dual-collapse2 order-1 order-md-0" style="margin-left: 20%;">
        <ul class="navbar-nav ml-auto text-center">
            <li class="nav-item active">
                <a class="nav-link" href="#">Chancho va!</a>
            </li>
           
        </ul>
    </div>
    <div class="mx-auto my-2 order-0 order-md-1 position-relative">
        <a class="mx-auto" href="#">
            <img src="./assets/logoFinal.png" class="rounded-circle">
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span class="navbar-toggler-icon"></span>
        </button>
    </div>
    <div class="navbar-collapse collapse w-100 dual-collapse2 order-2 order-md-2">
        <ul class="navbar-nav mr-auto text-center">
            <li class="nav-item" v-if="auth=='loggedin'">
                <router-link class="nav-link" to="/lobby">Buscar partidas</router-link>
            </li>
        </ul>
    </div>
      <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item" v-if="auth=='loggedin'">
                <router-link class="nav-link" to="/miperfil">Mi perfil</router-link>
            </li>
            <li class="nav-item" v-if="auth=='loggedin'">
                <a class="nav-link" href="" v-on:click="logout">Salir</a> 
            </li>
            <li class="nav-item" v-if="auth==''">
                <router-link class="nav-link" to="/registrarse">Registrarse</router-link>
            </li>
             <li class="nav-item" v-if="auth==''">
                <router-link class="nav-link" to="/login">Login</router-link>
            </li>
        </ul>
    </div>
</nav>
<br />
<br />
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style>
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
</style>

<script>
    import EventBus from './components/EventBus';
    EventBus.$on('logged-in', test => {
        console.log(test);
    })
    export default{
        data(){
            return{
                auth: '',
                user: ''
            }
        },
        methods: {
            logout(){
                localStorage.removeItem('usertoken');
                this.$router.push({name: 'login'});
            }
        },
        mounted(){
            EventBus.$on('logged-in', status => {
                this.auth = status;
            })
        }
    }
</script>