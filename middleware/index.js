// Middleware
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLogedIn = function(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to log in to do that");
	res.redirect("/login");
}

middlewareObj.checkOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if (err || !foundCampground){
				req.flash("error", "Error, campground not found");
				res.redirect("back");
			} else {
				if (foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}
				
			}
		});
	} else {
		req.flash("error", "You need to log in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to log in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkAdminOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				// console.log(req.params.id);
				// console.log(req.user._id)
				Campground.findById(req.params.id, function(err, foundCampground){
					if (err){
						res.redirect("back");
					} else {
						if (foundComment.author.id.equals(req.user._id) || foundCampground.author.id.equals(req.user._id)){
							next();
						} else {
							req.flash("error", "You do not have permission to do that");
							res.redirect("back");
						}
					}
				})
				
			}
		});
	} else {
		req.flash("error", "You need to log in to do that");
		res.redirect("back");
	}
}

module.exports = middlewareObj