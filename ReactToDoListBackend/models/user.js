const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
	name: {
		type: String,
		// required: true,
	},
	email: {
		type: String,
		// required: true,
	},
	password: {
		type: String,
		// required: true,
	},
	notes: {
		type: Array,
		// required: true,
	},
	createdAt: {
		type: Number,
		default: new Date().getTime(),
	},
	isActive: {
		type: Boolean,
		// required: true,
	}
})

module.exports = mongoose.model('users', postSchema);
