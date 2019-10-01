const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
   }
});

module.exports = Sala = mongoose.model('salas', SalaSchema);