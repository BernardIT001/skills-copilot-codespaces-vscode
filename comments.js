// Create web server 
// Create a new comment
// Get all comments
// Get a comment by id
// Update a comment by id
// Delete a comment by id

// Load modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('../models/comment');
var Verify = require('./verify');
var cors = require('./cors');

// Create router
var commentRouter = express.Router();

// Configure router to parse body data
commentRouter.use(bodyParser.json());

// Create routes
commentRouter.route('/')
	// OPTIONS request
	.options(cors.corsWithOptions, function(req, res) {
		res.sendStatus(200);
	})
	// GET request
	.get(cors.cors, function(req, res, next) {
		Comment.find(req.query)
			.populate('postedBy')
			.exec(function(err, comment) {
				if (err) {
					return next(err);
				}
				res.json(comment);
			});
	})
	// POST request
	.post(cors.corsWithOptions, Verify.verifyOrdinaryUser, function(req, res, next) {
		Comment.create(req.body, function(err, comment) {
			if (err) {
				return next(err);
			}
			console.log('Comment created!');
			var id = comment._id;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Added the comment with id: ' + id);
		});
	})
	// DELETE request
	.delete(cors.corsWithOptions, Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
		Comment.remove({}, function(err, resp) {
			if (err) {
				return next(err);
			}
			res.json(resp);
		});
	});

commentRouter.route('/:commentId')
	// OPTIONS request
	.options(cors.corsWithOptions, function(req, res) {
		res.sendStatus(200);
	})
	// GET request
	.get(cors.cors, function(req, res, next) {
		Comment.findById(req.params.commentId)
			.populate('postedBy')
			.exec(function(err, comment) {
				if (err) {
					return next(err);
				}
				res.json(comment);
			});
	})
	// PUT request
	.put(cors.corsWithOptions, Verify.verifyOrdinaryUser, function(req,
