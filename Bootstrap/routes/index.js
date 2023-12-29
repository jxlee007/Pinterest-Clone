var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./posts")
const upload = require('./multer')
const passport = require('passport');

const localStrategy = require("passport-local");
const users = require('./users');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res, next) {
   res.render('index');
});

router.get('/login', function (req, res) {
   console.log(req.flash("error"))
   res.render('login', { error: req.flash("error") });
});

router.get('/sample', function (req, res, next) {
   res.render('sample');
});

router.get('/profile', isLoggedIn, async function (req, res, next) {

   const user = await userModel.findOne({
      username: req.session.passport.user
   }).populate('posts')
   console.log(user)
   res.render('profile', { user });
});

router.get('/feed', function (req, res, next) {
   res.render('feed')
})

router.post('/upload', isLoggedIn, upload.single('image'), async function (req, res) {
   if (!req.file) {
      return res.status(400).send("No Files were uploaded.");
   }
   const user = await userModel.findOne({ username: req.session.passport.user });
   const post = await postModel.create ({
      image: req.file.filename,
      imageText: req.body.imagecaption,
      user: user._id
   })

   user.posts.push(post._id);
   await user.save();
   res.redirect("/profile")

})

// register route using passport in local strategy
router.post('/register', function (req, res) {
   const userdata = new userModel({
      // use to take data from input field defines with names
      username: req.body.username,
      email: req.body.email,
      fullname: req.body.fullname,
   });
   // otherwise using object destructuring
   // const { username, email, fullname } = req.body;
   // const userdata = new userModel({ username, email, fullname});


   // if register successfully redirect to profile route
   userModel.register(userdata, req.body.password)
      .then(function (registereduser) {
         passport.authenticate("local")(req, res, function () {
            res.redirect('/profile');
         })
      })
});

router.post('/login', passport.authenticate('local', {
   successRedirect: '/profile',
   failureRedirect: "/login",
   failureFlash: true, //flash msg will shown if login fails
}), function (req, res) {
});

router.get('/logout', function (req, res, next) {
   req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect("/login")
   });
});

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect("/login")
};


module.exports = router;
