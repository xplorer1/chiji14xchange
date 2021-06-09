var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PostCommentSchema = new Schema({
    'post' : {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }, //post
    'created_on' : {type: Date, default: new Date()},
    'last_updated' : {type: Date},
    'comment' : String
});

module.exports = mongoose.model('PostComment', PostCommentSchema);