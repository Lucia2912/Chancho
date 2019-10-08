<template>
    <div class="container">
        <cabecera>
</cabecera>
        <div class="row">
            <div class="col-md-6 mt-5 mx-auto">
                <form @submit.prevent="login">
                    <h1 class="h3 mb-3 font-weight-normal">Login</h1>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" v-model="usuario.email" class="form-control" name="email" placeholder="Ingrese su correo" v-bind:class="{ 'is-invalid': hasErrors.correo }">
                        <div class="invalid-feedback">
                            <span v-if="hasErrors.correo" class="help-lock">
                            <strong>{{errorMessage.correo}}</strong>
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" v-model="usuario.password" class="form-control" name="password" v-bind:class="{ 'is-invalid': hasErrors.cont }">
                        <div class="invalid-feedback">
                            <span v-if="hasErrors.cont" class="help-lock">
                            <strong>{{errorMessage.cont}}</strong>
                            </span>
                        </div>
                    </div>
                    <button class="btn btn-lg btn-primary btn-block">Ingresar</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import EventBus from './EventBus';
import cabecera from './cabecera';
    export default{
        components:{
          cabecera

        },
        data(){
        return {
          usuario:{},
          hasErrors: {
        correo: false,
        cont: false
      },
      errorMessage: {
        correo: null,
        cont: null
      }
        }
    },
    methods: {
      login(){
          let vm = this.hasErrors;
          vm.correo = false;
          vm.cont = false;
          let _vm = this.errorMessage;
          _vm.correo = null;
          _vm.cont = null;
    let uri = 'http://localhost:4000/user/login';
    this.axios.post(uri, this.usuario).then(res => {       
       //localStorage.setItem('usertoken', res.data);
       localStorage.usertoken = res.data;
       this.usuario.email = '';
       this.usuario.password = '';
       this.$router.push({name: 'miperfil'});
    })
    .catch(error => {
      console.log(error);
        let err = error.response;
        if (err.statusText === "Unprocessable Entity") {
            if (err.data) {
                  if (err.data.errors.email) {
                    vm.correo = true;
                    _vm.correo = "El usuario no existe";
                    setTimeout(function() {
                      vm.correo = false;
                      _vm.correo = null;
                      }, 5000);
                  }
                  if (err.data.errors.pass) {
                    vm.cont = true;
                    _vm.cont = "Contraseña incorrecta";
                    setTimeout(function() {
                      vm.cont = false;
                      _vm.cont = null;
                      }, 5000);
                  }
                }
              }
    });
    this.emitMethod();
},
emitMethod(){
    EventBus.$emit('logged-in', 'loggedin');
}
    },
  }
</script>