const express = require('express');
const salas = express.Router();
const cors = require('cors');

const Sala = require('../models/sala.model');
const User = require('../models/User.model');


salas.post('/actualizar/:id', (req, res) => {
    Sala.findById(req.params.id, function (err, sala) {
        if (!sala)
            res.status(404).send("data is not found");
        else {
            sala.CantidadActual = req.body.Miembros.length;
            sala.Miembros = req.body.Miembros;
            if (sala.CantidadActual == 4) {
                sala.Estado = "Completa";
            }
            let ultimoIngresado = req.body.Miembros[req.body.Miembros.length - 1];
            sala.Chancho.push({Jugador: ultimoIngresado, Palabra: null});
            sala.save().then(() => {
                res.json('Update complete');
            })
                .catch(() => {
                    res.status(400).send("unable to update the database");
                });
        }
    });
})

salas.post('/finalizo/:id', (req, res) => {
    Sala.findById(req.params.id, function (err, sala) {
        if (!sala){
            res.status(404).send("data is not found");
        }
        else {
                sala.Estado = "Finalizada";

                User.findOne({
                    _id: req.body.Ganador
                })
                .then(user => {
                    if(!user){
                        sala.Ganador = null;
                        console.log("No encontro al ganador");
                    }else{
                        sala.Ganador = user;
                    }
                })
                
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
        Miembros: [req.body.creador],
        Chancho: [{ Jugador: req.body.creador, Palabra: null }]
    }
    Sala.findOne({Creador: req.body.creador
    }).then(salaC => {
        if(salaC){
            if(salaC.Estado === "Finalizada"){
                Sala.findOne({
                    Nombre: req.body.nombre
                })
                    .then(salita => {
                        if (!salita) {
                            Sala.create(sala)
                                .then(sala => {
                                    res.json({ IDSala: sala._id });
                                })
                                .catch(err => {
                                    res.send('error: ' + err);
                                })
                        } else {
                            if(salita.Estado === "Finalizada"){
                                Sala.create(sala)
                                .then(sala => {
                                    res.json({ IDSala: sala._id });
                                })
                                .catch(err => {
                                    res.send('error: ' + err);
                                })
                            } else {
                            console.log("Ya existe con ese nombre");
                            let errores = { errors: { nombre: 'Ya existe una sala con ese nombre' } };
                            res.setHeader('Content-Type', 'application/json');
                            res.statusCode = 422;
                            res.send(errores);
                            }
                        }
                    })
                    .catch(err => {
                        res.send('error: ' + err);
                    });
            } else {
                console.log("Ya tiene una sala creada en espera");
                let errores = { errors: { nombre: 'Ya tienes una sala creada' } };
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 422;
                res.send(errores);
            }
        } else {
            Sala.findOne({
                Nombre: req.body.nombre
            })
                .then(salita => {
                    if (!salita) {
                        Sala.create(sala)
                            .then(sala => {
                                res.json({ IDSala: sala._id });
                            })
                            .catch(err => {
                                res.send('error: ' + err);
                            })
                    } else {
                        if(salita.Estado === "Finalizada"){
                            Sala.create(sala)
                            .then(sala => {
                                res.json({ IDSala: sala._id });
                            })
                            .catch(err => {
                                res.send('error: ' + err);
                            })
                        } else {
                            console.log("Ya existe con ese nombre");
                        let errores = { errors: { nombre: 'Ya existe una sala con ese nombre' } };
                        res.setHeader('Content-Type', 'application/json');
                        res.statusCode = 422;
                        res.send(errores);
                        }
                    }
                })
                .catch(err => {
                    res.send('error: ' + err);
                });
        }
    })
    
});

salas.get('/listar', (req, res) => {
    Sala.find({Estado: "En espera", Estado: "Completa"}, function (err, salas) {
        User.populate(salas, { path: "Creador" }, function (err, salas) {
            User.populate(salas, { path: "Miembros" }, function (err, salas) {
                res.status(200).send(salas);
            })

        });
    });

})


module.exports = salas;