var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// new comment route
router.get("/new", middleware.isLogedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

// new comment logic
router.post("/", middleware.isLogedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err); 
			res.redirect("campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err){
					req.flash("error", "Something went wrong, couldn't post comment");
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment added successfuly");
					res.redirect("/campgrounds/" + campground._id)
				}
			});
		}
	});
});

// edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if (err || !foundCampground){
			req.flash("error", "Campground not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});

// update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err){
			req.flash("error", "Something went wrong, couldn't update comment");
			res.redirect("back");
		} else {
			req.flash("success", "Comment updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// delete route
/*router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if (err){
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});*/

router.delete("/:comment_id", middleware.checkAdminOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if (err){
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

module.exports = router;