const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User.model');

const SalaSchema = new Schema({
   Nombre: {
       type: String,
       required: true
   },
   CantidadActual: {
       type: Number,
       default: 1
   },
   Estado: {
       type: String
   },
   Fecha: {
       type: Date,
       default: Date.now
   },
   Descripcion: {
       type: String
   },
   Creador: {
     type: Schema.ObjectId, 
     ref: 'User'
   },
   Miembros: [{type: Schema.ObjectId, ref: 'User'}],
   Ganador: {
    type: Schema.ObjectId, 
    ref: 'User'
  },
  Chancho: [{Jugador: {type: Schema.ObjectId, ref: 'User'}, Palabra: String}]
});

module.exports = Sala = mongoose.model('salas', SalaSchema);