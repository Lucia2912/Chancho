const express = require('express');
const users = express.Router();
const cors = require('cors');
const  jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User.model');
users.use(cors());

process.env.SECRET_KEY = 'secret';

users.post('/registro', (req, res) => {
    const hoy = new Date();
    const usuario = {
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
        creado: hoy
    }

    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(!user){
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                usuario.password = hash;
                User.create(usuario)
                .then(user => {
                    res.json({status: user.email + ' registrado'});
                })
                .catch(err => {
                    res.send('error: ' + err);
                })
            })
        } else {
            let errores = {errors:{email: 'El usuario ya existe'}};
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 422;
            res.send(errores);
        }
    })
    .catch(err => {
        res.send('error: ' + err);
    });
});


users.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                const payload = {
                    _id: user._id,
                    nickname: user.nickname,
                    email: user.email
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.send(token);
            } else {
                res.json({error: 'El usuario no existe'});
            }
        } else {
            res.json({error: 'El usuario no existe'});
        }
    })
    .catch(err => {
        res.send('error: ' + err);
    })
})

module.exports = users;