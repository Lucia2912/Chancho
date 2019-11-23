<template>
<div class="container">
    <cabecera>
</cabecera>
<div class="row">
    <div class="col-lg-12">
        <!-- start:lobby -->
        <div class="box">
            <div class="chat-room">
                <!-- start:aside lobby kiri -->
                <!-- end:aside lobby kiri -->
                <!-- start:aside lobby tengah -->
                <aside class="tengah-side">
                    <div class="room-desk">
                        <h2 class="pull-left">Sala de espera</h2>
                        <div class="row">
         <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
Crear sala
</button>  
<div class="col-md-4"></div>  
 <div class="col-md-4">
    <input v-model="search" placeholder="Buscar sala" class="form-control mr-sm-2" type="search"/>
</div>
                        </div>
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Crear sala</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       <input type="text" class="bton form-control search-btn col-xs-6" placeholder="Nombre..." name="fname" v-model="salaNueva.nombre" v-bind:class="{ 'is-invalid': hasErrors.nombre }">
        <div class="invalid-feedback">
            <span v-if="hasErrors.nombre" class="help-lock">
                <strong>{{errorMessage.nombre}}</strong>
            </span>
        </div>
       <input type="text" name="lname" class="bton form-control search-btn col-xs-6" placeholder="Breve descripción" maxlength="100" v-model="salaNueva.descripcion">
      </div>
      <div class="modal-footer">
          <button @click.stop="crearSalita" type="button" class="btn btn-primary" data-dismiss="modal">Crear</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
      </div>
    </div>
  </div>
</div>
                   
                   <div>
                         <div v-for="salita in filteredSala" :key="salita._id" class="room-box" v-chat-scroll>
                            <h5 ><span class="text-muted">Nombre: </span><a href="#chat-room.html">{{ salita.Nombre }}</a> </h5>
                            <h5 class="cortito"><span class="text-muted">Descripcion: </span> {{ salita.Descripcion }} </h5>
                           
                            <h5><span class="text-muted">Creador: </span> {{ salita.Creador.nickname }} | <span class="text-muted">Miembros: </span>{{ salita.CantidadActual }} |    <button @click="ingresar(salita)" id="btnIngresar">UNIRME</button>
                       </h5>
                           </div>
                    </div>
                   
                    </div>
                    
                </aside>
              
                <aside class="kanan-side">
                    
                    <div class="invite-row">
                        <chatsito></chatsito>
                    </div>
                    
                  
                </aside>

                <!-- end:aside lobby kanan -->
            </div>
            <!-- end:lobby -->
        </div>
        
        <!-- end:lobby -->
    </div>
</div>
</div>
</template>

<style>
/*
    =================================
    CHAT ROOM
    =================================
*/
.cortito{
    word-wrap: break-word;
}
.bton{
    margin:5px;
}
.otra{
    margin-top: 10px;
}
.divSalita {
   background-color: #a4a7a8;

width: 500px;

height: 200px;

overflow: auto;

margin: 0 auto;

    margin-top: 0px;

margin-top: 10px;
}
.chat-room {
    border-collapse: collapse;
    border-spacing: 0;
    display: table;
    table-layout: fixed;
    width: 100%;
    position: relative;
}

.chat-room aside {
    display: table-cell;
    float: none;
    height: 100%;
    padding: 0;
    vertical-align: top;
}

.chat-room .kiri-side {
    width: 25%;
    background: #e5e8ef;
    border-radius: 4px 0 0 4px;
    -webkit-border-radius: 4px 0 0 4px;
}

.chat-room .tengah-side {
    width: 50%;
    background: #fff;
    border-right: 1px solid #e5e8ef;
}

.chat-room .kanan-side {
    width: 25%;
    background: #fff;
}

.chat-room .kiri-side .user-head {
    background: #39bbdb;
    color: #FFFFFF;
    min-height: 70px;
    padding: 15px;
}

.chat-room .kanan-side .user-head {
    background: #39bbdb;
    color: #FFFFFF;
    min-height: 70px;
    padding: 10px;
    border-left: 1px solid #39bbdb;
    margin-left: -1px;
    position: relative;
}

.chat-room .user-head i {
    float: left;
    font-size: 40px;
    margin-right: 10px;
}

.chat-room .user-head h3 {
    margin: 6px 0 0 0;
    font-weight: 100;
    letter-spacing: 1px;
}

.chat-room-head {
    background: #39bbdb;
    color: #FFFFFF;
    min-height: 70px;
    padding: 15px;
}

.chat-room-head h3 {
    margin: 5px 0 0;
    font-weight: 100;
    letter-spacing: 1px;
    display: inline-block;
}

.chat-room-head .search-btn {
    width: 20px;
    -webkit-transition: all .3s ease;
    -moz-transition: all .3s ease;
    -ms-transition: all .3s ease;
    -o-transition: all .3s ease;
    transition: all .3s ease;
    box-shadow: none;
    background: #eee;
    padding: 0 5px 0 35px;
    margin-top: 2px;
    border: none;
    color: #fff;
}

.chat-room-head .search-btn:focus {
    width: 180px;
    box-shadow: none;
    -webkit-transition: all .3s ease;
    -moz-transition: all .3s ease;
    -ms-transition: all .3s ease;
    -o-transition: all .3s ease;
    transition: all .3s ease;
    /*background: #01a6b2;*/
    font-weight: 300;
    color: #fff;
}

.chat-room-head .search-btn:focus::-moz-placeholder {
    color: #fff;
}

ul.chat-list li a {
    color: #6a6a6a;
    display: block;
    padding: 15px;
    font-weight: 300;
    text-decoration: none;
}

ul.chat-list li a:hover,
ul.chat-list li.active a {
    color: #00a9b4;
    background: #f2f4f7;
}

ul.chat-list li h4 {
    padding: 17px 15px;
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #D5D7DE;
}

ul.chat-list li h4 i {
    padding-right: 5px;
}

ul.chat-list li a span {
    padding-left: 10px;
}

ul.chat-list li a i.fa-times {
    color: #9fa3b0;
}

ul.chat-list li.active {
    color: #00a9b4;
    background: #f2f4f7;
}

ul.chat-list {
    border-bottom: 1px solid #d5d7de;
    padding-left: 0;
    list-style: none;
}

ul.chat-user {
    margin-bottom: 200px;
}

ul.chat-user li {
    border-bottom: none;
}

ul.chat-user li a:hover {
    background: none;
    color: #6a6a6a;
}

.chat-room .kiri-side footer {
    background: #d5d7de;
    padding: 15px;
    height: 70px;
    width: 25%;
    position: absolute;
    bottom: 0;
}

.chat-room .tengah-side footer {
    background: #f6f6f6;
    padding: 15px;
    height: 70px;
    width: 50%;
    position: absolute;
    bottom: 0;
    border-right: 1px solid #E5E8EF;
}

.chat-room .kanan-side footer {
    background: #fff;
    padding: 15px;
    height: 70px;
    width: 25%;
    position: absolute;
    bottom: 0;
    border-top: 1px solid #E5E8EF;
}

.chat-room .kiri-side footer .chat-avatar img {
    width: 40px;
    height: 40px;
    border: 2px solid #fff;
    float: left;
}

.chat-room .kiri-side footer .user-status {
    float: left;
    margin: 10px;
}

.chat-room .kiri-side footer .user-status i {
    padding-right: 5px;
}

.chat-room .left-side footer a.chat-dropdown {
    background: #96979a;
    border-radius: 2px;
    color: #fff;
    font-size: 10px;
    margin-top: 10px;
    padding: 3px 5px;
}

.room-desk {
    display: inline-block;
    margin-bottom: 30px;
    width: 100%;
    padding: 15px;
}

.room-desk h4 {
    text-transform: uppercase;
    font-weight: 300;
    font-size: 16px;
    margin: 5px 0 0 0;
}

.room-box {
   border: 1px solid #f7f8fa;

background: #f7f8fa;

padding: 10px;

display: inline-block;

width: 460px;

margin-top: 10px;

margin-left: 10px;
}

.room-box h5 {
    margin: 0 0 5px 0;
    font-weight: 300;
    font-size: 16px;
}

.room-box h5 a {
    color: #00a9b4;
}

.chat-tools {
    float: right;
    padding: 3px;
    width: 40px;
    height: 35px;
    line-height: 30px;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    text-align: center;
    margin-top: 6px;
    margin-left: 10px;
}

.chat-tools i {
    font-size: 16px !important;
    float: none !important;
    margin-right: 0 !important;
    color: #fff;
}

.btn-key {
    background: #1abc9c;
}

.btn-key:hover {
    background: #16a085;
}

.invite-row {
    background: #E5E8EF;
    padding: 6px 10px;
    display: inline-block;
    width: 100%;
}

.invite-row h4 {
    font-size: 16px;
    font-weight: 300;
}

ul.chat-available-user {
    padding: 10px;
    list-style: none;
}

ul.chat-available-user li {
    margin-bottom: 15px;
}

ul.chat-available-user li a {
    color: #6a6a6a;
    text-decoration: none;
}

ul.chat-available-user li i {
    padding-right: 5px;
    font-size: 10px;
}

.group-rom {
    width: 100%;
    float: left;
    border-bottom: 1px solid #eaebee;
}

.group-rom .first-part,
.group-rom .second-part,
.group-rom .third-part {
    float: left;
    padding: 15px;
}

.group-rom .first-part {
    width: 25%;
}

.group-rom .first-part.odd {
    background: #f7f8fa;
    color: #6a6a6a;
    font-weight: 600;
}

.group-rom .second-part {
    width: 60%;
}

.group-rom .third-part {
    width: 15%;
    color: #d4d3d3;
}

a.guest-on {
    color: #6a6a6a;
    margin-top: 8px;
    display: inline-block;
}

a.guest-on i {
    background: #40cabe;
    color: #fff;
    padding: 4px;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    margin-right: 5px;
}

.chat-txt {
    float: left;
    width: 70%;
    margin-right: 5px;
}

.lobby {
    padding: 0 !important;
}
</style>

<script>
import json from '../../environments/env.json'
import chatsito from './Chat';
import * as io from 'socket.io-client'
import jwtDecode from 'jwt-decode';
import EventBus from './EventBus';
    import cabecera from './cabecera';
export default {
    components:{
        chatsito,
         cabecera
    },
        data(){
            const token = localStorage.usertoken;
        const decode = jwtDecode(token);
            return{
            inputs:[],
            salitas:[],
            salaNueva:{},
            usuario: decode,
            errors: [],
            chat: {},
            rooms:[],
            socket: io(json.IP + json.PORT),
            Jugadores: [],
            search: "",
            hasErrors: {
                nombre: false
            },
            errorMessage: {
                nombre: null
            }     
        };
        },
        created(){
              let uri = json.IP + json.PORT + 'sala/listar';
    this.axios.get(uri).then(res => {
        this.salitas = res.data;
      // this.$router.push({name: 'lobby'});
    })
    this.axios.get(json.IP + json.PORT + 'room')
    .then(response => {
      this.rooms = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
        }, 
    methods: {
        ingresar(salita){
            for(let i =0; i<salita.Miembros.length; i++){
                this.Jugadores.push(salita.Miembros[i]._id);
            }
            if(!this.Jugadores.includes(this.usuario._id) && salita.Miembros.length < 4){
              salita.Miembros.push(this.usuario);
                if(salita.CantidadActual < 4){
                let uri = json.IP + json.PORT + `sala/actualizar/${salita._id}`;
                this.axios.post(uri, salita).then(res => {
                    this.$router.push({name: 'partida',  params: {sala: salita._id}});
                })
                } else {
                     alert('Solo se admiten hasta 4 usuarios');
                }
            } else {
               this.$router.push({name: 'partida',  params: {sala: salita._id}});
            }
        },
        addRow(txt){
      this.inputs.push({
        one: txt
      });
    },
    deleteRow(index) {
            this.inputs.splice(index, 1);
        },
        crearSalita(){
            let vm = this.hasErrors;
          vm.nombre = false;
          let _vm = this.errorMessage;
          _vm.nombre = null;
        this.salaNueva.creador = this.usuario;
        let uri = json.IP + json.PORT + 'sala/crear';
    this.axios.post(uri, this.salaNueva).then(res => {
       this.$router.push({name: 'partida', params: {sala: res.data.IDSala}});
    }) .catch(error => {
        let err = error.response;
        console.log(err);
        if (err.statusText === "Unprocessable Entity") {
            if (err.data) {
                  if (err.data.errors.nombre) {
                    vm.nombre = true;
                    _vm.nombre = "El nombre de la sala se encuentra en uso";
                    setTimeout(function() {
                      vm.nombre = false;
                      _vm.nombre = null;
                      }, 5000);
                  }
                }
              }
    });
    }
    },
    mounted() {
        this.chat.message = this.usuario.nickname + ' se unió a la sala'
      this.axios.post(json.IP + json.PORT + 'chat', this.chat)
      .then(response => {
        this.socket.emit('save-message', { nickname: this.usuario.nickname, message: 'se unió a la sala', created_date: new Date().toDateString() });
      })
      .catch(e => {
        this.errors.push(e)
      })
    },
     computed: {
    filteredSala: function() {
      return this.salitas.filter(sala => {
        return sala.Nombre.toUpperCase().match(this.search.toUpperCase()) || sala.Creador.nickname.toUpperCase().match(this.search.toUpperCase());
      });
    }
  }
};
</script>
