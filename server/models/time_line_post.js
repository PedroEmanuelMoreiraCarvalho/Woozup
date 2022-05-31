function TimeLinePost(post_id, author_name, likes, picture, date, tags, comments_num, legend, users_that_liked){
    return {
        post_id: post_id,
        author_name: author_name,
        likes: likes,
        comments_num: comments_num,
        picture: picture,
        legend: legend,
        date: date,
        tags: tags, 
        users_that_liked: users_that_liked
    }
}

module.exports = TimeLinePost