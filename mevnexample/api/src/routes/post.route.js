const express = require('express');
const Routes = express.Router();
const postController = require('../controllers/post.controller');


// Defined store route
Routes.post('/add', postController.create);

// Defined get data(index or listing) route
Routes.get('/', postController.index);

// Defined edit route
Routes.get('/edit/:id', postController.edit);

//  Defined update route
Routes.post('/update/:id', postController.update);

// Defined delete | remove | destroy route
Routes.delete('/delete/:id', postController.delete);

module.exports = Routes;