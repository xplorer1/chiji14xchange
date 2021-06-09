var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PostSchema = new Schema({
    'post_body' : String, //post content
    'post_title' : String, //post title
    'post_image' : String, //post image
    'created_on' : {type: Date, default: new Date()},
    'last_updated' : {type: Date}
});

module.exports = mongoose.model('Post', PostSchema);