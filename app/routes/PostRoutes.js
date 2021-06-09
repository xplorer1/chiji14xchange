const express = require('express');
const router = express.Router();

const PostController = require('../controllers/PostController');

// const multer = require('multer');  //for handling multipart form data.
// const upload = multer({dest: 'uploads/'});

// router.route('/')
//     .post(upload.single('post_image'), PostController.createPost) //specifies that this route accepts multipart form data.
//     .get(PostController.listPosts);

// router.route('/:post_id')
//     .get(PostController.getPost)
//     .put(upload.single('post_image'), PostController.updatePost)//specifies that this route accepts multipart form data.
//     .delete(PostController.deletePost)

// router.route('/:post_id/comments')
//     .get(PostController.getComments)
//     .post(PostController.createComment)

// router.route('/:post_id/comments/comment_id')
//     .get(PostController.getCommentById)
//     .put(upload.single('post_image'), PostController.updatePost)
//     .delete(PostController.deletePost)

    
router.use(function(req, res) {
    return res.status(404).send({ message: 'The url you visited does not exist.' });
});

module.exports = router;