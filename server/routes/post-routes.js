const express = require("express");
const { addPost, ListPost, getPostById, likePost, commentPost, deleteComment, deletePost} = require("../controllers/PostController")
const router = express.Router()

router.get('/post', ListPost)
router.get('/post/:post_id', getPostById)
router.post('/post/like', likePost)
router.post('/post/comment', commentPost)
router.delete('/post/comment', deleteComment)
router.delete('/post', deletePost)
router.post('/post', addPost)

module.exports = {
    routes: router
}