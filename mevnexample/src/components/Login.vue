<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 mt-5 mx-auto">
                <form @submit.prevent="login">
                    <h1 class="h3 mb-3 font-weight-normal">Login</h1>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" v-model="usuario.email" class="form-control" name="email" placeholder="Ingrese su correo">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" v-model="usuario.password" class="form-control" name="password">
                    </div>
                    <button class="btn btn-lg btn-primary btn-block">Ingresar</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import EventBus from './EventBus';
export default {
        data(){
        return {
          usuario:{}
        }
    },
    methods: {
      login(){
    let uri = 'http://localhost:4000/user/login';
    this.axios.post(uri, this.usuario).then(res => {
       localStorage.setItem('usertoken', res.data);
       this.usuario.email = '';
       this.usuario.password = '';
       this.$router.push({name: 'perfil'});
    })
    .catch(err => {
        console.log(err);
    });
    this.emitMethod();
},
emitMethod(){
    EventBus.$emit('logged-in', 'loggedin');
}
    }
  }
</script>