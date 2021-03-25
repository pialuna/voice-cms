const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// mongoose.set('debug', true);

const Project = require("../models/project");

// Handle incoming GET, POST, PATCH, DELETE requests to /projects

router.get("/", (req, res, next) => {
	Project.find()
		.select("-__v") // don't show '__v'. a thing, that mongoDB creates
		.exec()
		.then(docs => {
			res.status(200).json({
				count: docs.length,
				projects: docs.map(doc => {
					return {
						_id: doc._id,
						url: "http://localhost:1234/projects/" + doc._id,
						name: doc.name,
						locales: doc.locales
						// collections not needed here
					};
				}),
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

router.get("/:projectId", async (req, res, next) => {
	const query = req.query;
	console.log(query);
	// for getting the whole project
	let populateParam = {
		path: 'collections',
		model: 'Collection',
		select: '-__v',
		populate: {
			path: 'items',
			model: 'Item',
			select: '-__v'
		}
	};
	if (!query.complete) {
		console.log("normal getProject");
		// for getting the project just with collections, without items
		populateParam = {
			path: 'collections',
			model: 'Collection',
			select: '-__v'
		};
	}
	// /:projectId?complete=true
	const id = req.params.projectId;
	try {
		const project = await Project.findById(id)
			.select("-__v")
			// do pseudo full join
			.populate(populateParam)
			.exec();
		if (!project) {
			return res.status(404).json({
				message: "Project not found"
			});
		}
		res.status(200).json({
			project: {
				_id: id,
				url: "http://localhost:1234/projects/" + id,
				name: project.name,
				locales: project.locales,
				collections: project.collections
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: err.message
		});
	}
});

router.post("/", (req, res, next) => {
	// see models/project.js
	const project = new Project({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		locales: req.body.locales
	});
	project.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: "Created Project successfully",
				createdProject: {
					_id: result._id,
					name: result.name,
					locales: result.locales
				},
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.patch('/:projectId', (req, res, next) => {
	const id = req.params.projectId;
	let update = {};
	for (const prop in req.body) {
		update[prop] = req.body[prop];
	}
	console.log("update:");
	console.log(update);
	Project.update({ _id: id }, { $set: update }) // $set is understood by mongodb/mongoose
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Project updated",
				_id: id,
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: err.message
			});
		});
});

router.put('/:projectId', (req, res, next) => {
	res.status(200).json({
		message: 'PUT: not implemented. Use PATCH for Update.',
		id: req.params.projectId
	});
});

router.delete("/:projectId", (req, res, next) => {
	Project.remove({ _id: req.params.projectId })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Project deleted",
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;
