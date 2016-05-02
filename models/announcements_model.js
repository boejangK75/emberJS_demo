var mongoose = require('mongoose');

exports.announcementsSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	duration : {
		type : String,
		required : true
	},
	priority : {
		type : String,
		required : true
	},
	value : {
		type : String,
		required : true
	}
});

exports.AnnouncementsModel = mongoose.model('announcements', exports.announcementsSchema);