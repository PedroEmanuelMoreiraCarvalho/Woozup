const { v4 } = require("uuid")
const db = require("../db")
const Post = require("../models/post")
const TimeLinePost = require("../models/time_line_post")
const firestore = db.firestore()
const PostsDatabase = firestore.collection('posts')

const addPost = async(req,res)=>{
    try {
        const { author, picture, legend, tags} = req.body
        if(picture == null){
            res.send({
                success: false,
                message: "image file is empty"
            })
            return
        }

        const post = new Post(author, picture, legend, tags)
        await PostsDatabase.doc().set(post)
        res.send({
            success: true,
            message: "post added successfully"
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

const ListPost = async(req,res)=>{
    try {
        const posts = []
        await PostsDatabase.orderBy('date').limit(10).get().then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                let {post_id, author_name, likes, picture, date, tags, comments_num, legend, users_that_liked} = (doc.data())
                posts.push(TimeLinePost(post_id, author_name, likes, picture, date, tags, comments_num, legend, users_that_liked))
            })
        })
        res.send(posts)
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

const getPostById = async(req,res)=>{
    try {
        const post_id = req.params.post_id
        let post = []
        await PostsDatabase.where('post_id', '==', post_id).get().then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                post.push(doc)
            })
        })
        res.send(post[0].data())
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

const likePost = async(req,res)=>{
    try {
        const {post_id, username} = req.body
        const post_to_like = []

        await PostsDatabase.where('post_id', '==', post_id).get().then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                post_to_like.push(doc)
            })
        })

        const post_to_update = post_to_like[0].data()
        let users_that_liked = post_to_update.users_that_liked
        
        let user_alreay_liked = false

        for(let i in users_that_liked){
            if(users_that_liked[i] == username){
                user_alreay_liked = true
            }
        }

        if(user_alreay_liked){
            users_that_liked = users_that_liked.filter((liked_username)=>{
                return liked_username != username
            })

            post_to_like[0].ref.update({
                users_that_liked: users_that_liked,
                likes: users_that_liked.length
            })

            res.send({
                success: true,
                message: "post disliked",
                likes: post_to_like[0].data().likes-1
            })

            return
        }

        users_that_liked.push(username)

        post_to_like[0].ref.update({
            users_that_liked: users_that_liked,
            likes: users_that_liked.length
        })

        res.send({
            success: true,
            message: "post liked",
            likes: post_to_like[0].data().likes+1
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

const deleteComment = async(req,res)=>{
    try {
        const {post_id, comment_id} = req.body
        const post_to_comment = []

        await PostsDatabase.where('post_id', '==', post_id).get().then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                post_to_comment.push(doc)
            })
        })

        const post_to_update = post_to_comment[0].data()
        let comments = post_to_update.comments

        let comment_deleted = comments.filter((comment)=>{
            return comment.comment_id != comment_id
        })

        post_to_comment[0].ref.update({
            comments: comment_deleted,
            comments_num: comment_deleted.length
        })

        res.send({
            success: true,
            message: "comment removed"
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

const deletePost = async(req,res)=>{
    try {
        const {post_id} = req.body
        const post_to_delete_ref = []

        await PostsDatabase.where('post_id', '==', post_id).get().then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                post_to_delete_ref.push(doc)
            })
        })

        post_to_delete_ref[0].ref.delete()

        res.send({
            success: true,
            message: "post deleted"
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

const commentPost = async(req,res)=>{
    try {
        const {post_id, username, comment} = req.body
        const post_to_comment = []

        await PostsDatabase.where('post_id', '==', post_id).get().then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                post_to_comment.push(doc)
            })
        })

        const post_to_update = post_to_comment[0].data()
        let comments = post_to_update.comments

        comments.push(
            {
                comment_id: `${username+v4()}`,
                author: username,
                comment: comment
            }
        )

        post_to_comment[0].ref.update({
            comments: comments,
            comments_num: comments.length
        })

        res.send({
            success: true,
            message: "post commented"
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addPost,
    ListPost,
    getPostById,
    likePost,
    commentPost,
    deleteComment,
    deletePost
}