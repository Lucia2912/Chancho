<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 mt-5 mx-auto">
                <form @submit.prevent="registro">
                    <h1 class="h3 mb-3 font-weight-normal">Registro</h1>
                    <div class="form-group">
                        <label for="nick">Nickname</label>
                        <input type="text" v-model="usuario.nickname" class="form-control" name="nick" placeholder="Ingrese su nickname">
                    </div>
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
                        <input type="password" v-model="usuario.password" class="form-control" name="password">
                    </div>
                    <button class="btn btn-lg btn-primary btn-block">Registrarse</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

export default {
        data(){
        return {
          usuario:{},
          hasErrors: {
        correo: false
      },
      errorMessage: {
        correo: null
      }
        }
    },
    methods: {
      registro(){
          let vm = this.hasErrors;
          vm.correo = false;
          let _vm = this.errorMessage;
          _vm.correo = null;
    let uri = 'http://localhost:4000/user/registro';
    this.axios.post(uri, this.usuario).then(res => {
        console.log(res);
       this.$router.push({name: 'login'});
    })
    .catch(error => {
        let err = error.response;
        if (err.statusText === "Unprocessable Entity") {
            if (err.data) {
                  if (err.data.errors.email) {
                    vm.correo = true;
                    _vm.correo = "El correo se encuentra en uso";
                    setTimeout(function() {
                      vm.correo = false;
                      _vm.correo = null;
                      }, 5000);
                  }
                }
              }
    });
},
    }
  }
</script>