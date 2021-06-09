const PostModel = require('../models/PostModel');
const PostCommentModel = require('../models/PostCommentModel');

const cloudinary = require('cloudinary').v2; //for saving our file uploads.
const config = require('../../config');

const fs = require("fs");
const util = require("util");
const unLinkFile = util.promisify(fs.unlink); //for deleting uploaded files after being sent to cloudinary.

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

const imageId = function () {
    return Math.random().toString(36).substr(2, 4);
};

module.exports = {

    /**
     * 
     * @param {post_body, (optional)post_image} req object post_body and optional post_image in multipart formdata.
     * @param {object} res success message.
     * @returns {object} success or error response object.
    */

    createPost: async function(req, res) {
        if(!req.body.post_body || !req.body.post_title) return res.status(400).json({status: 400, message: "Post body and title required."});

        try {

            let runCreatePost = async (image) => {
                let new_post = new PostModel();

                new_post.post_title = req.body.post_title;
                new_post.post_body = req.body.post_body;
                new_post.post_image = image;
                new_post.last_updated = new Date();

                await new_post.save();

                return res.status(200).json({status: 200, message: "Post successfully created."});
            }

            if(req.file && req.file.path) {
                cloudinary.uploader.upload(req.file.path, {public_id: "posts/post_image" + imageId()},
                    async function(error, result) {
                        if(error) return res.status(500).json({message: error.message, status: 500 });
                        runCreatePost(result.secure_url);

                        await unLinkFile(req.file.path);
                    }
                );
            } else {
                runCreatePost();
            }

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error: error,
                status: 500,
            });
        }
    },

    /**
     * 
     * @param {post_id} req object takes a post_id as params.
     * @param {object} res post object
     * @returns {object} success or error response object.
    */

    getPostById: async function(req, res) {
        try {

            let post = await PostModel.findOne({_id: req.params.post_id}).exec();
            if(!post) return res.status(404).json({status: 404, message: "Post not found."});

            return res.status(200).json({status: 200, data: post});

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500,
            });
        }
    },

    /**
     * 
     * @param {*} req object.
     * @param {object} res posts object
     * @returns {object} success or error response object.
    */

    listPosts: async function(req, res) {
        let { page = 1, limit = 10 } = req.query;

        console.log("req.query: ", req.query);
        
        try {

            if(req.query.page && req.query.limit) {
                let posts = await PostModel.find({}).limit(limit * 1).skip((page - 1) * limit).exec();
                let count = await PostModel.countDocuments({}).exec();

                return res.status(200).json({data: posts, totalpages: Math.ceil(count / limit), currentpage: page, elements: count});

            } else {
                let posts = await PostModel.find({}).exec();

                return res.status(200).json({status: 200, data: posts});
            }

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500,
            });
        }
    },

    /**
     * 
     * @param {post_id} req object takes a post_id as params.
     * @param {object} res success message.
     * @returns {object} success or error response object.
     */

    updatePost: async function(req, res) {
        try {

            let post = await PostModel.findOne({_id: req.params.post_id}).exec();
            if(!post) return res.status(404).json({message: "Post not found."});

            let runUpdate = async (image) => {

                post.post_body = req.body.post_body ? req.body.post_body : post.post_body;
                post.post_title = req.body.post_title ? req.body.post_title : post.post_title;
                post.post_image = image;
                post.last_updated = new Date();

                await post.save();

                return res.status(200).json({status: 200, message: "Post successfully updated."});
            }

            if(req.file && req.file.path) {
                cloudinary.uploader.upload(req.file.path, {public_id: "posts/post_image" + imageId()},
                    async function(error, result) {
                        if(error) return res.status(500).json({message: 'Unable to process your request.', error: error });
                        runUpdate(result.secure_url);

                        await unLinkFile(req.file.path);
                    }
                );
            } else {
                runUpdate(post.post_image);
            }

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500,
            });
        }
    },
    
    /**
     * 
     * @param {post_id} req object takes a post_id as params.
     * @param {object} res success message
     * @returns {object} success or error response object.
     */

    deletePost: async function(req, res) {
        try {

            let post = await PostModel.findOne({_id: req.params.post_id}).exec();
            if(!post) return res.status(404).json({message: "Post not found.", status: 404});

            let delete_post = await PostModel.deleteOne({_id: req.params.post_id}).exec();
            if(!delete_post.deletedCount) return res.status(500).json({message: "Unable to delete post.", status: 500});

            return res.status(200).json({status: 200, message: "Post successfully deleted."});

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500,
            });
        }
    },

    /**
     * 
     * @param {post_comment && post_id} req object post_comment in req body and post_id in req params.
     * @param {object} res success message.
     * @returns {object} success or error response object.
    */

    createPostComment: async function(req, res) {
        if(!req.body.post_comment) return res.status(400).json({status: 400, message: "Post comment required."});

        try {

            let post = await PostModel.findOne({_id: req.params.post_id}).exec();
            if(!post) return res.status(404).json({status: 404, message: "Post not found."});

            let new_comment = new PostCommentModel();

            new_comment.comment = req.body.post_comment;
            new_comment.post = req.params.post_id;
            new_comment.last_updated = new Date();

            new_comment.save();

            return res.status(200).json({status: 200, message: "Comment successfully created."});

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500,
            });
        }
    },

    /**
     * 
     * @param {post_id} req object.
     * @param {object} res posts object
     * @returns {object} success or error response object.
    */

    listPostComments: async function(req, res) {
        
        try {

            let comments = await PostCommentModel.find({post: req.params.post_id}).populate("post").exec();
            return res.status(200).json({status: 200, data: comments});

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500,
            });
        }
    },

    /**
     * 
     * @param {comment_id} req object takes a comment_id as params.
     * @param {object} res post object
     * @returns {object} success or error response object.
    */

    getCommentById: async function(req, res) {
        try {

            let comment = await PostCommentModel.findOne({_id: req.params.comment_id, post: req.params.post_id}).populate("post").exec();
            if(!comment) return res.status(404).json({status: 404, message: "Comment not found."});

            return res.status(200).json({status: 200, data: comment});

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500,
            });
        }
    },

    /**
     * 
     * @param {comment_id} req object takes a comment_id as params.
     * @param {object} res success message.
     * @returns {object} success or error response object.
    */

     updateComment: async function(req, res) {
        try {

            let comment = await PostCommentModel.findOne({_id: req.params.comment_id, post: req.params.post_id}).exec();
            if(!comment) return res.status(404).json({message: "Comment not found."});

            comment.comment = req.body.comment ? req.body.comment : comment.comment;
            comment.last_updated = new Date();

            await comment.save();

            return res.status(200).json({status: 200, message: "Comment successfully updated."});

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500,
            });
        }
    },
    
    /**
     * 
     * @param {comment_id} req object takes a comment_id as params.
     * @param {object} res success message
     * @returns {object} success or error response object.
     */

    deleteComment: async function(req, res) {
        try {

            let comment = await PostCommentModel.findOne({_id: req.params.comment_id, post: req.params.post_id}).exec();
            if(!comment) return res.status(404).json({message: "Comment not found."});

            let delete_comment = await PostCommentModel.deleteOne({_id: req.params.comment_id, post: req.params.post_id}).exec();
            if(!delete_comment.deletedCount) return res.status(500).json({message: "Unable to delete comment.", status: 500});

            return res.status(200).json({status: 200, message: "Comment successfully deleted."});

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500,
            });
        }
    },
}