const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }, // reference to a Collection
	// Schema props have to be defined, the number of props can't be unknown
	//  -> so put everything into the "data" object
	data: Object
});

module.exports = mongoose.model('Item', itemSchema);