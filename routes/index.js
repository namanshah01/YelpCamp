var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// lanodng page
router.get("/", function(req, res){
	res.render("landing");
});

// sign up route
router.get("/register", function(req, res){
	res.render("register");
});

// sign up logic
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if (err){
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});


// login route
router.get("/login", function(req, res){
	res.render("login");
});

// login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){
	// just filling in the empty space
})


// logout route
router.get("/logout", function(req, res){
	req.flash("success", "you have been logged out");
	req.logout();
	res.redirect("/campgrounds");
});

module.exports = router;