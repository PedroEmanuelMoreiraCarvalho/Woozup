const { v4 } = require("uuid")

function Post(author, picture, legend, tags){
    return {
        post_id: `${author.name + v4()}`,
        author_name: author.name,
        picture: `https://firebasestorage.googleapis.com/v0/b/woozup.appspot.com/o/posts%2F${picture}?alt=media`,
        legend: legend,
        tags: tags,
        date: Date.now(),
        likes: 0,
        comments_num: 0,
        comments: [],
        users_that_liked: []
    }
}

module.exports = Post