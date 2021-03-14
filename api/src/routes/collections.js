const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Collection = require("../models/collection");
const Item = require("../models/item");

// Handle incoming GET, POST, PATCH, DELETE requests to /collections

router.get("/", (req, res, next) => {
	Collection.find()
		.select("-__v")
		.exec()
		.then(docs => {
			res.status(200).json({
				count: docs.length,
				collections: docs.map(doc => {
					return {
						_id: doc._id,
						project_id: doc.project_id,
						url: "http://localhost:1234/collections/" + doc._id,
						name: doc.name,
						locales: doc.locales,
						properties: doc.properties
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

router.get("/:collectionId", async (req, res, next) => {
	const id = req.params.collectionId;
	try {
		const collection = await Collection.findById(id)
			.select("-__v")
			// do pseudo full join with items
			.populate({
				path: 'items',
				model: 'Item',
				select: '-__v'
			})
			.exec();
		if (!collection) {
			return res.status(404).json({
				message: "Collection not found"
			});
		}
		res.status(200).json({
			collection: collection,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: err.message
		});
	}
});

router.post("/", (req, res, next) => {
	const collection = new Collection({
		_id: new mongoose.Types.ObjectId(),
		project_id: req.body.project_id,
		name: req.body.name,
		properties: req.body.properties,
		locales: req.body.locales
	});
	collection.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: "Created Collection successfully",
				createdCollection: {
					_id: result._id,
					project_id: result.project_id,
					name: result.name,
					properties: result.properties,
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

router.patch('/:collectionId', (req, res, next) => {
	const id = req.params.collectionId;
	let update = {};
	for (const prop in req.body) {
		update[prop] = req.body[prop];
	}
	console.log("update:");
	console.log(update);
	Collection.update({ _id: id }, { $set: update }) // $set is understood by mongodb/mongoose
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Collection updated",
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

router.put('/:collectionId', (req, res, next) => {
	res.status(200).json({
		message: 'PUT: not implemented. Use PATCH for Update.',
		id: req.params.collectionId
	});
});

router.delete("/:collectionId", (req, res, next) => {
	Collection.remove({ _id: req.params.collectionId })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Collection deleted",
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;
