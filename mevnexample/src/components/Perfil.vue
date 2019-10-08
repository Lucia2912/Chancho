<template>
    <div class="container">
          <cabecera>
</cabecera>
        <div class="jumbotron mt-5">
            <div class="col-sm-8 mx-auto">
                <h1 class="text-center">Perfil</h1>
            </div>
            <table class="table col-md-6 mx-auto">
                <tbody>
                    <tr>
                        <td>Nick</td>
                        <td>{{usuario.nickname}}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{{usuario.email}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import jwtDecode from 'jwt-decode';
import cabecera from './cabecera';
    export default{
        components:{
          cabecera
        },
    data(){
        const token = localStorage.usertoken;
        const decode = jwtDecode(token);
        return{
            usuario: decode
        }
    }
}
</script>