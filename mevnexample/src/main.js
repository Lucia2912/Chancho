
import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faUser } from '@fortawesome/free-solid-svg-icons'
import { faCalendarCheck  } from '@fortawesome/free-regular-svg-icons'
import { faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'deck-of-cards/example/example.css';
import cardeame from 'deck-of-cards'
Vue.use(cardeame);
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)
//Object.defineProperty(Vue.prototype, '$cardeame', { value: cardeame});
library.add(faUserSecret, faUser)
library.add(faFontAwesome)
library.add(faCalendarCheck)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueAxios from 'vue-axios';
import axios from 'axios';

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

import HomeComponent from './components/HomeComponent.vue';
import lobitComponent from './components/lobit.vue';
import login from './components/Login.vue';
import registrarse from './components/Register.vue';
import miperfil from './components/Perfil.vue';
import pruebaSocket from './components/SocketinComponent.vue';

import cabecera from './components/cabecera.vue';
import PartidaComponent from './components/PartidaComponent.vue';

const routes = [
  {
      name: 'home',
      path: '/',
      component: HomeComponent
  },
  {
    name: 'lobby',
    path: '/lobby',
    component: lobitComponent
},
{
    name: 'registrarse',
    path: '/registrarse',
    component: registrarse
},
{
    name: 'login',
    path: '/login',
    component: login
},
{
    name: 'miperfil',
    path: '/miperfil',
    component: miperfil
},
{
    name: 'partida',
    path: '/partida/:sala',
    component: PartidaComponent
},
{
    name: 'cabecera',
    path: '/cabecera',
    component: cabecera
},
{
    name: 'socketin',
    path: '/socketin',
    component: pruebaSocket
}
];

const router = new VueRouter({ mode: 'history', routes: routes});

new Vue(Vue.util.extend({ router }, App)).$mount('#app');