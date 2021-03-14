const mongoose = require('mongoose');

const collectionSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // reference to a Project
	name: String,
	locales: [String],
	properties: ['Property'], // array of property objects
}, 
{ 
	toJSON: { virtuals: true } 
});

// Virtual
// for join with the collection's items
collectionSchema.virtual('items', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'collection_id',
    justOne: false 
});

module.exports = mongoose.model('Collection', collectionSchema);