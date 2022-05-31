function User(user_name,password){
    return {
        username: user_name,
        password: password,
        join_date: Date.now(),
        posts: [],
        followers: [],
        following: [],
        profile_image: "https://th.bing.com/th/id/R.4b5ef573d1d8b28907c823ecf5badb3f?rik=OQlXZtnmwXrusg&pid=ImgRaw&r=0"
    }
    
}
module.exports = User