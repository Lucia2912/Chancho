const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');
const postRoute = require('./routes/post.route');
const userRoute = require('./routes/user.route');

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.use('/posts', postRoute);
app.use('/user', userRoute);

app.listen(PORT, function(){
  console.log('Servidor en puerto:',PORT);
});