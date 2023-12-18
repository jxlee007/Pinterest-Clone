var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./posts")
const localStrategy = require("passport-local");
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate())); 

router.get('/', function(req, res, next){
   res.send('index',{ title : "express"});
});

// register route using passport in local strategy
router.post('/register', function(req, res){
   const userdata = new userModel({
   // use to take data from input field defines with names
      username : req.body.username ,
      email :req.body.email,
      fullname :req.body.fullname,
   });
   // otherwise using object destructuring
   // const { username, email, fullname } = req.body;
   // const userdata = new userModel({ username, email, fullname});


   // if register successfully redirect to profile route
   userModel.register(userdata, req.body.password)
   .then(function (registereduser){
      passport.authenticate("local")(req, res, function(){
         res.redirect('/profile');
      })
   })
});

router.post('/login', passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect:"/"
   }), function(req, res){
});


module.exports = router;
