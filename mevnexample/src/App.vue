<template>
  <div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
    import EventBus from './components/EventBus';
   /* EventBus.$on('logged-in', test => {
        console.log(test);
    })*/
    export default{
        data(){
            return{
                auth: '',
                user: '',
                Token: ''
            }
        },
        methods: {
            logout(){
                localStorage.removeItem('usertoken');
                this.$router.push({name: 'login'});
            }
        },
        mounted(){
            if (localStorage.usertoken) {
            this.Token = localStorage.usertoken;
                this.auth = 'loggedin';
            }
            EventBus.$on('logged-in', status => {
                this.auth = status;
            });

            EventBus.$on('partida', data => {
                console.log(data);
            });
        }
    }
</script>