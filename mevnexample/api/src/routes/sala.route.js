const express = require('express');
const salas = express.Router();
const cors = require('cors');

const Sala = require('../models/sala.model');
const User = require('../models/User.model');


salas.post('/actualizar/:id', (req, res) => {
    Sala.findById(req.params.id, function(err, sala) {
        if (!sala)
          res.status(404).send("data is not found");
        else {
            sala.CantidadActual = req.body.Miembros.length;
            sala.Miembros = req.body.Miembros;
            if(sala.CantidadActual == 4){
                sala.Estado = "Completa";
            }
            sala.save().then(() => {
              res.json('Update complete');
          })
          .catch(() => {
                res.status(400).send("unable to update the database");
          });
        }
      });
})

salas.post('/crear', (req, res) => {
    const hoy = new Date();
    const sala = {
        Nombre: req.body.nombre,
        CantidadActual: 1,
        Estado: 'En espera',
        Fecha: hoy,
        Descripcion: req.body.descripcion,
        Creador: req.body.creador,
        Miembros: [req.body.creador]
    }
    Sala.create(sala)
    .then(sala=> {
        res.json({IDSala: sala._id});
    })
    .catch(err=> {
        res.send('error: '+ err);
    })
})

salas.get('/listar', (req,res)=> {
      Sala.find({}, function(err, salas) {
    	User.populate(salas, {path: "Creador"},function(err, salas){
            User.populate(salas, {path: "Miembros"}, function(err, salas){
                res.status(200).send(salas);
            })
        	
        }); 
    });

})


    module.exports = salas;