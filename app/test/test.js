const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
chai.should();

const server = require('../../server');
chai.use(chaiHttp);

const PostModel = require('../models/PostModel');
const PostCommentModel = require('../models/PostCommentModel');

describe('post/', () => {

    before((done) => { //Before each test we empty the posts document.
        PostModel.remove({}, (err) => {
            done();
        });
    });

    /*
    * Test the /post create a post.
    */

    describe('/POST create post', () => {
        it('it should not create a post without at least post_body and post_title', (done) => {
            let postbody = {
                post_body: "",
                post_title: ""
            }
    
            chai
                .request(server)
                .post("/api/v1/posts")
                .set("Content-Type", "multipart/form-data")
                .field("post_body", postbody.post_body)
                .field("post_title", postbody.post_title)
                .end((err, res) => {
                    if(err) console.log(err.message);
    
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Post body and title required.');
                    done();
                });
        });

        it('it should create a post using only post_body and post_title ', (done) => {
            let postbody = {
                post_title: "The making of a legend: the Roger and Carolyn story",
                post_body: "In 1971, Roger and Carolyn Perron move into a farmhouse in Harrisville, Rhode Island, with their five daughters Andrea, Nancy, Christine, Cindy, and April. Their dog Sadie refuses to enter the house, and Nancy and Christine, while playing a game of 'hide and clap', find a boarded-up entrance to the cellar."
            }
    
            chai
                .request(server)
                .post("/api/v1/posts")
                .set("Content-Type", "multipart/form-data")
                .field("post_body", postbody.post_body)
                .field("post_title", postbody.post_title)
                .end((err, res) => {
                    if(err) console.log(err.message);
    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Post successfully created.');
                    done();
                });
        });

        it('it should create a post using post_image, post_title and post_body ', (done) => {
            let new_post = {
                post_title: "The making of a legend: the Roger and Carolyn story",
                post_body: "In 1971, Roger and Carolyn Perron move into a farmhouse in Harrisville, Rhode Island, with their five daughters Andrea, Nancy, Christine, Cindy, and April. Their dog Sadie refuses to enter the house, and Nancy and Christine, while playing a game of 'hide and clap', find a boarded-up entrance to the cellar."
            }
    
            chai
                .request(server)
                .post("/api/v1/posts")
                .set("Content-Type", "multipart/form-data")
                .field("post_body", new_post.post_body)
                .field("post_title", new_post.post_title)
                .attach("post_image", path.resolve(__dirname, "../data/upload.jpg"))
                .end((err, res) => {
                    if(err) console.log(err.message);
    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Post successfully created.');
                    done();
                });
        });
    });

    /*
    * Test the /get all posts route.
    */

    describe('/GET posts', () => {
        it('it should GET all the posts', (done) => {
            chai.request(server)
                .get('/api/v1/posts')
                .end((err, res) => {
                    if(err) console.log(err.message);
                    
                    res.should.have.status(200);
                    res.body.should.have.property('data')
                    res.body.data.should.be.a('array');
                    done();
                });
        });
    });

    /*
    * Test the /get post by :post_id route.
    */

    describe('/GET/:post_id post', () => {
        it('it should GET a post by the given post_id', (done) => {
            let new_post = new PostModel({
                post_title: "The Friendly Teacher.",
                post_body: "Again, there’s no right way to write these first posts, but if it feels like you’re having a hard time getting your ideas down, it can help to create an outline first, or make a bullet list of things you want to cover."
            });

            new_post.save((err, post) => {
                chai.request(server)
                    .get('/api/v1/posts/' + post._id)
                    .end((err, res) => {
                        if(err) console.log(err.message);

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /put update post by :post_id route.
    */

    describe('/PUT/:post_id post', () => {
        it('it should UPDATE a post given the post_id', (done) => {
            let new_post = new PostModel({ 
                post_body: "One of the important task which most of the developers ignores ( i used to ignore too ) is writing unit tests for your code.",
                post_title: "Writing tests"
            });

            new_post.save((err, post) => {
                chai.request(server)
                    .put('/api/v1/posts/' + post._id)
                    .set("Content-Type", "multipart/form-data")
                    .field("post_body", post.post_body)
                    .field("post_title", "The in-alinable task of writing tests.")
                    .attach("post_image", path.resolve(__dirname, "../data/upload.jpg"))
                    .end((err, res) => {
                        if(err) console.log(err.message);

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Post successfully updated.');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /delete post route.
    */

    describe('/delete/:post_id post', () => {
        it('it should Delete a post by the given post_id', (done) => {
            let new_post = new PostModel({ post_title: "The Lord of the Rings", post_body: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment"});

            new_post.save((err, post) => {
                chai.request(server)
                    .delete('/api/v1/posts/' + post._id)
                    .end((err, res) => {
                        if(err) console.log(err.message);

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Post successfully deleted.');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /post create a comment for a post route.
    */

    describe('/post create comment.', () => {
        it('it should create comment for a post.', (done) => {
            let new_post = new PostModel({ post_title: "The Lord of the Rings", post_body: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment"});

            new_post.save((err, post) => {
                let new_comment = {
                    post_comment: "So blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will.",
                    post: post._id
                };

                chai.request(server)
                    .post('/api/v1/posts/' + post._id + "/comments")
                    .send(new_comment)
                    .end((err, res) => {
                        if(err) console.log("error: ", err.message);

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Comment successfully created.');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /get all the comments for a post route.
    */

    describe('/get get comments.', () => {
        it('it should get comment for a post.', (done) => {
            let new_post = new PostModel({ post_title: "The Lord of the Rings", post_body: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment"});

            new_post.save((err, post) => {
                chai.request(server)
                    .get('/api/v1/posts/' + post._id + "/comments")
                    .end((err, res) => {
                        if(err) console.log(err.message);

                        res.should.have.status(200);
                        res.body.should.have.property('data')
                        res.body.data.should.be.a('array');
                        done();
                    });
                });
        });
    });

    /*
    * Test the /get comment by comment_id and post_id for a post route.
    */

    describe('/GET/:post_id/comments/:comment_id', () => {
        it('it should GET a comment by the given post_id and comment_id', (done) => {
            let new_post = new PostModel({
                post_title: "The Friendly Teacher.",
                post_body: "Again, there’s no right way to write these first posts, but if it feels like you’re having a hard time getting your ideas down, it can help to create an outline first, or make a bullet list of things you want to cover."
            });

            let comment = "So blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will.";

            new_post.save((err, post) => {
                let new_comment = new PostCommentModel({
                    comment: comment,
                    post: post._id
                });

                new_comment.save((err, saved_comment) => {
                    chai.request(server)
                        .get('/api/v1/posts/' + post._id + "/comments/" + saved_comment._id)
                        .end((err, res) => {
                            if(err) console.log(err.message);

                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('data');
                            done();
                        });
                });
            });
        });
    });

    /*
    * Test the /put update comment by comment_id and post_id for a post route.
    */

    describe('/PUT/:post_id/comments/:comment_id', () => {
        it('it should update a comment by the given post_id and comment_id', (done) => {
            let new_post = new PostModel({
                post_title: "The Friendly Teacher.",
                post_body: "Again, there’s no right way to write these first posts, but if it feels like you’re having a hard time getting your ideas down, it can help to create an outline first, or make a bullet list of things you want to cover."
            });

            let comment = "So blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will.";
            let to_be_saved_comment = "In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. ";

            new_post.save((err, post) => {
                let new_comment = new PostCommentModel({
                    comment: comment,
                    post: post._id
                });

                new_comment.save((err, saved_comment) => {
                    chai.request(server)
                        .put('/api/v1/posts/' + post._id + "/comments/" + saved_comment._id)
                        .field("comment", to_be_saved_comment)
                        .end((err, res) => {
                            if(err) console.log(err.message);

                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message');
                            done();
                        });
                });
            });
        });
    });

    /*
    * Test the /delete delete comment by comment_id and post_id for a post route.
    */

    describe('/DEL/:post_id/comments/:comment_id', () => {
        it('it should update a comment by the given post_id and comment_id', (done) => {
            let new_post = new PostModel({
                post_title: "The Friendly Teacher.",
                post_body: "Again, there’s no right way to write these first posts, but if it feels like you’re having a hard time getting your ideas down, it can help to create an outline first, or make a bullet list of things you want to cover."
            });

            let comment = "So blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will.";

            new_post.save((err, post) => {
                let new_comment = new PostCommentModel({
                    comment: comment,
                    post: post._id
                });

                new_comment.save((err, saved_comment) => {
                    chai.request(server)
                        .del('/api/v1/posts/' + post._id + "/comments/" + saved_comment._id)
                        .end((err, res) => {
                            if(err) console.log(err.message);
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message');
                            done();
                        });
                });
            });
        });
    });

});