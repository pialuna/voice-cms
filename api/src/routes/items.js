const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Item = require('../models/item');

// Handle incoming GET, POST, PATCH, DELETE requests to /items

router.get('/', (req, res, next) => {
	Item.find()
		.select("-__v")
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				items: docs.map(doc => {
					return {
						_id: doc._id,
						url: "http://localhost:1234/items/" + doc._id,
						data: doc.data
					}
				})
			};
			res.status(200).json(response);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: err.message
			});
		});
});

router.get('/:itemId', (req, res, next) => {
	const id = req.params.itemId;
	Item.findById(id)
		.select("-__v")
		.exec()
		.then(doc => {
			console.log(doc);
			if (doc) {
				res.status(200).json({
					item: doc,
				});
			} else {
				res.status(404).json({ message: 'No valid entry found for this ID' })
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: err.message
			});
		});
});

router.post('/', (req, res, next) => {
	// dynamic item content is put into "data" (see models/item.js)
	let data = req.body.data
	if (!data) {
		data = {}
	}
	let item = new Item({
		_id: new mongoose.Types.ObjectId(),
		collection_id: req.body.collection_id,
		data: data
	});
	item.save()
		.then(result => {
			res.status(201).json({
				message: 'Created item successfully',
				createdItem: result,
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: err.message
			});
		});
});

router.patch('/:itemId', (req, res, next) => {
	const id = req.params.itemId;
	let update = {};
	for (const prop in req.body) {
		update[prop] = req.body[prop];
	}
	console.log("update:");
	console.log(update);
	Item.update({ _id: id }, { $set: update }) // $set is understood by mongodb/mongoose
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Item updated",
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

router.put('/:itemId', (req, res, next) => {
	res.status(200).json({
		message: 'PUT: not implemented. Use PATCH for Update.',
		id: req.params.itemId
	});
});

router.delete('/:itemId', (req, res, next) => {
	const id = req.params.itemId;
	Item.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Deleted item successfully",
				result: result
			});
		})
		.catch(err => {
			res.status(500).json({
				message: err.message
			})
		})
});

module.exports = router;