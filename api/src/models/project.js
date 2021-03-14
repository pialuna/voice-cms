const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	locales: [String]
}, 
{ 
	toJSON: { virtuals: true } 
});

// Virtual
// for join with the project's collections
projectSchema.virtual('collections', {
    ref: 'Collection',
    localField: '_id',
    foreignField: 'project_id',
    justOne: false 
});

module.exports = mongoose.model('Project', projectSchema);

// Example
// http://frontendcollisionblog.com/mongodb/2016/01/24/mongoose-populate.html
// http://thecodebarbarian.com/mongoose-virtual-populate
