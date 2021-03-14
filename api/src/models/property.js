const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
	name: String,
	type: String,
	i18n: Boolean
});

module.exports = mongoose.model('Property', propertySchema);