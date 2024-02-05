const Post = require('../models/postModel.js')
const User = require("../models/userModel")
const path = require("path")
const fs = require('fs')
const {v4: uuid} = require('uuid')
const HttpError = require('../models/errorModel')

//============================= Create a post
// POST : api/posts
// PROTECTED
const createPost = async (req, res, next) =>{
    try {
        let {title, category, description} = req.body;
        if (!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422))
        }
        const {thumbnail} = req.files;
        // check the file size
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail too big.file should be less than 2mb."))
        }

        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1]
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError(err))
            } else {
              const newPost = await Post.create({title, category, description, thumbnail: newFilename, creator: req.user.id})
              if (!newPost) {
                return next(new HttpError("Post couldn't be created.", 422))
              }

              // find user and increase post count by1
              const currentUser = await User.findById(req.user.id);
              const userPostCount = currentUser.posts + 1;
              await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})

              res.status(201).json(newPost)
            }
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}


//============================= Get all posts
// POST : api/posts
// PROTECTED
const getPosts = async (req, res, next) =>{
    try {
        const posts = await Post.find().sort({updatedAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//============================= Get single post
// GET : api/posts/:id
// PROTECTED
const getPost = async (req, res, next) =>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}



//============================= Getpost by category
// GET : api/posts/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) =>{
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.status(200).json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//============================= Get user/author post
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) =>{
    try {
     const {id} = req.params;
     const posts = await Post.find({creator: id}).sort({createdAt: -1})   
     res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}




//============================= Edit post
// PATCH : api/posts/:id
// UNPROTECTED
const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        if (!req.files) {
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
        } else {
            const oldPost = await Post.findById(postId);

            // Delete old thumbnail
            fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                if (err) {
                    return next(new HttpError(err));
                }

                const { thumbnail } = req.files;

                if (thumbnail.size > 2000000) {
                    return next(new HttpError("Thumbnail too big. Should be less than 2mb"));
                }

                fileName = thumbnail.name;
                let splittedFilename = fileName.split('.');
                newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];

                try {
                    await thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename));
                    updatedPost = await Post.findByIdAndUpdate(
                        postId,
                        { title, category, description, thumbnail: newFilename },
                        { new: true }
                    );

                    if (!updatedPost) {
                        return next(new HttpError("Couldn't update post.", 400));
                    }

                    res.status(200).json(updatedPost);
                } catch (err) {
                    return next(new HttpError(err));
                }
            });
        }
    } catch (error) {
        return next(new HttpError(error));
    }
};

//============================= Delete post
// DELETE : api/posts/:id
// UNPROTECTED
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post unavailable.", 400));
        } 
        
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;

        fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
            if (err) {
                return next(new HttpError(err));
            } else {
                try {
                    await Post.findByIdAndDelete(postId); // Delete post
                    const currentUser = await User.findById(req.user.id);

                    // Ensure the user exists and their post count is more than 0 before decrementing
                    if (currentUser && currentUser.posts > 0) {
                        const userPostCount = currentUser.posts - 1;
                        await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
                    }
                    res.json(`post ${postId} deleted successfully`);
                } catch (error) {
                    return next(new HttpError(error));
                }
            }
        });
    } catch (error) {
        return next(new HttpError(error));
    }
};


module.exports = {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost}


