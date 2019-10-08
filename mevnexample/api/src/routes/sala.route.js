const express = require('express');
const salas = express.Router();
const cors = require('cors');

const Sala = require('../models/sala.model');

salas.post('/crear', (req, res) => {
    const hoy = new Date();
    const sala = {
        Nombre: req.body.nombre,
        Descripcion: req.body.descripcion,
        Fecha: hoy
    }
    Sala.create(sala)
    .then(sala=> {
        res.json({status: sala.Nombre + ' registrada' });
    })
    .catch(err=> {
        res.send('error: '+ err);
    })
})

salas.get('/listar', (req,res)=> {
    Sala.find(function(err, salas){
        if(err){
          res.json(err);
        }
        else {
          res.json(salas);
        }
      });

})


    module.exports = salas;