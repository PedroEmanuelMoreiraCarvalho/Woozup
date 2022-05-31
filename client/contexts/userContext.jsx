import { createContext, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { v4 } from "uuid";

export const userContext = createContext({})

export default function UserProvider({children}){

    const [cookie, setCookie] = useCookies(["user"])
    const [new_post, setNewPost] = useState(false)
    const [new_comment, setNewComment] = useState(false)

    const [user, setUser] = useState({
        authenticated: false,
        username: "",
        profile_image: "",
    })

    const verifyUsername = (username)=>{
        if(username == ""){
            setUserName(cookie.user.user)
        }
    }

    useEffect(()=>{
        if(cookie.user == null)return
        setUser({
            username: cookie.user.user,
            profile_image: "https://th.bing.com/th/id/R.4b5ef573d1d8b28907c823ecf5badb3f?rik=OQlXZtnmwXrusg&pid=ImgRaw&r=0"
        })
    },[])

    const newPosts = useCallback(
        ()=>{
            setNewPost(!new_post)
        }
    ,[new_post,setNewPost])

    const newComment = useCallback(
        ()=>{
            setNewComment(!new_comment)
        }
    ,[new_comment,setNewComment])

    const setUserAuthenticated = useCallback(
        (newState) => {
            setUser({authenticated: newState})
        }
    ,[user, setUser])

    const setUserName = useCallback(
        (user_name) => {
            setUser({username: user_name})
        }
    ,[user, setUser])

    const login = useCallback(
        async (username,password)=>{
            let user_login = {
                username: username,
                password: password
            }
            let login_req = await fetch("http://localhost:3800/api/user/login",{
                method: 'POST',
                body: JSON.stringify(user_login),
                headers: {
                    "Content-type": "application/json"
                }
            })
            let login_res = await login_req.json()
            
            if(login_res.success){
                setUserAuthenticated(true)

                setUserName(username)

                setCookie("user", JSON.stringify({user: username}), {
                    path: "/",
                    maxAge: 259200, // Expira em 3 dias
                    sameSite: true,
                })
            }

            return login_res
        }
    ,[user, setUser])

    const singUp = useCallback(
        async (username,password)=>{
            let user_login = {
                username: username,
                password: password
            }
            let login_req = await fetch("http://localhost:3800/api/user",{
                method: 'POST',
                body: JSON.stringify(user_login),
                headers: {
                    "Content-type": "application/json"
                }
            })
            let login_res = await login_req.json()
            
            if(login_res.success){
                setUserAuthenticated(true)

                setUserName(username)

                setCookie("user", JSON.stringify({user: username}), {
                    path: "/",
                    maxAge: 259200, // Expira em 3 dias
                    sameSite: true,
                })
            }

            return login_res
        }
    ,[user, setUser])

    const uploadNewPost = async (image,legend)=>{
        if(user.username == "" || user.username==undefined){
            setUserName(cookie.user.user)
        }
        const image_url = `${image.name + v4()}`
        const imageRef = ref(storage, `posts/${image_url}`)
        await uploadBytes(imageRef,image)
        let new_post_data = {
            author: {
                name: user.username,
            },
            picture: image_url,
            legend: legend,
            tags: ["school","kaminari"]
        }
        
        let post_req = await fetch("http://localhost:3800/api/post",{
            method: 'POST',
            body: JSON.stringify(new_post_data),
            headers: {
                "Content-type": "application/json"
            }
        })
        let post_res = await post_req.json()
        
        return post_res
    }

    const addComment = useCallback(
      async(post_id, username, comment)=>{
        verifyUsername(username)
        let comment_data = {
            post_id: post_id,
            username: username,
            comment: comment
        }
        let comment_req = await fetch("http://localhost:3800/api/post/comment",{
            method: 'POST',
            body: JSON.stringify(comment_data),
            headers: {
                "Content-type": "application/json"
            }
        })
        let comment_res = await comment_req.json()
        
        return comment_res
      }  
    ,[])

    const deleteComment = useCallback(
        async(post_id, comment_id)=>{
            let comment_data = {
                post_id: post_id,
                comment_id: comment_id
            }
            let comment_req = await fetch("http://localhost:3800/api/post/comment",{
                method: 'DELETE',
                body: JSON.stringify(comment_data),
                headers: {
                    "Content-type": "application/json"
                }
            })
            let comment_res = await comment_req.json()
            
            return comment_res
        }  
    ,[])

    const delete_post = useCallback(
        async(post_id)=>{
            let post_data = {
                post_id: post_id
            }
            let post_req = await fetch("http://localhost:3800/api/post",{
                method: 'DELETE',
                body: JSON.stringify(post_data),
                headers: {
                    "Content-type": "application/json"
                }
            })
            let post_res = await post_req.json()
            
            return post_res
        }
    ,[])

    const handlelike = useCallback(
        async (username, post_id)=>{
            verifyUsername(username)

            let like_data = {
                post_id: post_id,
                username: username,
            }
            let like_req = await fetch("http://localhost:3800/api/post/like",{
                method: 'POST',
                body: JSON.stringify(like_data),
                headers: {
                    "Content-type": "application/json"
                }
            })
            let like_res = await like_req.json()
            
            return like_res
        }
    ,[])

    const getUser = useCallback(
        () => (
            { login, singUp, handlelike, uploadNewPost, newPosts, addComment, newComment, deleteComment, delete_post, user}
        )
    ,[user, setUser, handlelike, uploadNewPost, newPosts, addComment, newComment, deleteComment, delete_post])

    return(
        <userContext.Provider value={getUser()}>
            {children}
        </userContext.Provider>
    )
}