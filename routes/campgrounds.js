var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// See all campgrounds
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	});
});

// CREATE campground
router.post("/", middleware.isLogedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	newCampgrounds = {name: name, price: price, image: image, description: desc, author: author};
	Campground.create(newCampgrounds, function(err, campground){
		if (err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// NEW campground
router.get("/new", middleware.isLogedIn, function(req, res){
	res.render("campgrounds/new.ejs");
});

// SHOW campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
			// console.log(err);
			// res.redirect("/campgrounds")
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT campground
router.get("/:id/edit", middleware.checkOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE campground
router.put("/:id", middleware.checkOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY campground
router.delete("/:id", middleware.checkOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: {$in: campgroundRemoved.comments} }, function(err){
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    })
})

module.exports = router;