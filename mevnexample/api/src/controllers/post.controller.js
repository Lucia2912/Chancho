// Require Post model in our routes module
let Post = require('../models/post.model');

exports.create = (req,res) => {
    let post = new Post(req.body);
  post.save()
    .then(() => {
      res.status(200).json({'business': 'business in added successfully'});
    })
    .catch(() => {
      res.status(400).send("unable to save to database");
    });
}

exports.index = (req, res) => {
    Post.find(function(err, posts){
        if(err){
          res.json(err);
        }
        else {
          res.json(posts);
        }
      });
}

exports.edit = (req,res) => {
    let id = req.params.id;
    Post.findById(id, function (err, post){
        if(err) {
          res.json(err);
        }
        res.json(post);
    });
}

exports.update = (req,res) => {
    Post.findById(req.params.id, function(err, post) {
        if (!post)
          res.status(404).send("data is not found");
        else {
            post.title = req.body.title;
            post.body = req.body.body;
            post.save().then(() => {
              res.json('Update complete');
          })
          .catch(() => {
                res.status(400).send("unable to update the database");
          });
        }
      });
}

exports.delete = (req,res) => {
    Post.findByIdAndRemove({_id: req.params.id}, function(err){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
}