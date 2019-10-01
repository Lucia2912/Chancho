<template>
<div class="row">
    <div class="col-12">
        <h2>
            Chat Room - <button @click.stop="logout()">Logout</button>
        </h2>
        <ul class="list-group panel-body" v-chat-scroll>
            <li v-for="(item, index) in chats" class="chat">
                <div class="left clearfix" v-if="item.nickname === nickname">
                    <div class="chat-body clearfix">
                        <div class="header">
                            <strong class="primary-font">{{ item.nickname }}</strong> <small class="pull-right text-muted">
                                <span class="glyphicon glyphicon-time"></span>{{ item.created_date }}</small>
                        </div>
                        <p>{{ item.message }}</p>
                    </div>
                </div>
                <div class="right clearfix" v-else>
                    <div class="chat-body clearfix">
                        <div class="header">
                            <strong class="primary-font">{{ item.nickname }}</strong> <small class="pull-right text-muted">
                                <span class="glyphicon glyphicon-time"></span>{{ item.created_date }}</small>
                        </div>
                        <p>{{ item.message }}</p>
                    </div>
                </div>
            </li>
        </ul>
        <ul v-if="errors && errors.length">
            <li v-for="error of errors">
                {{error.message}}
            </li>
        </ul>
        <form @submit="onSubmit" class="chat-form">
            <div class="input-group">
                <input class="form-input" id="message" v-model.trim="chat.message" />
                <div class="input-group-append">
                    <button type="submit">Send</button>
                </div>
            </div>
        </form>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import * as io from 'socket.io-client'
import jwtDecode from 'jwt-decode';
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)
export default {
    name: 'ChatRoom',
    data() {
        const token = localStorage.usertoken;
        const decode = jwtDecode(token);
        return {
            usuario: decode,
            chats: [],
            errors: [],
            nickname: this.$route.params.nickname,
            chat: {},
            socket: io('http://localhost:4000')
        }
    },
    created() {
        this.axios.get(`http://localhost:4000/chat/`)
            .then(response => {
                this.chats = response.data
            })
            .catch(e => {
                this.errors.push(e)
            })
        this.socket.on('new-message', function (data) {
                this.chats.push(data.message)
        }.bind(this))
    },
    methods: {
        logout() {
            this.socket.emit('save-message', {
                nickname: this.usuario.nickname,
                message: this.usuario.nickname + ' left this room',
                created_date: new Date()
            });
        },
        onSubmit(evt) {
            evt.preventDefault()
            this.chat.nickname = this.usuario.nickname
            this.axios.post(`http://localhost:4000/chat`, this.chat)
                .then(response => {
                    this.socket.emit('save-message', response.data)
                    this.chat.message = ''
                })
                .catch(e => {
                    this.errors.push(e)
                })
        }
    }
}
</script>

<style>
.chat .left .chat-body {
    text-align: left;
    margin-left: 100px;
}

.chat .right .chat-body {
    text-align: right;
    margin-right: 100px;
}

.chat .chat-body p {
    margin: 0;
    color: #777777;
}

.panel-body {
    overflow-y: scroll;
    height: 350px;
}

.chat-form {
    margin: 20px auto;
    width: 80%;
}
</style>
