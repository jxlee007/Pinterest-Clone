var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./posts")
const localStrategy = require("passport-local");
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate())); 

router.get('/', function(req, res, next){
   res.render('index');
});

router.get('/login', function(req, res, next){
   console.log(req.flash("error"))
   res.render('login', {error: req.flash("error")});
});
router.get('/sample', function(req, res, next){
   res.render('sample');
});

router.get('/profile', isLoggedIn , function(req, res, next){
   res.render('profile');
});

router.get('/feed',function (req, res, next) {
   res.render('feed')
})

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
      failureRedirect:"/login",
      failureFlash: true, //flash msg will shown if login fails
   }), function(req, res){
});

router.get('logout' , function(req, res,next){
   req.logout(function(err){
      if(err) { return next(err); }
      res.redirect("/")
   });
});

function isLoggedIn(req, res, next){
   if (req.isAuthenticated()){
      return next();
   }
   res.redirect("/login")
};


module.exports = router;
