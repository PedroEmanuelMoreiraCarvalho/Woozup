import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react';
import { userContext } from '../contexts/userContext';
import styles from '../styles/Post.module.css'

export default function Post(props){
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(props.post.likes)
    const { user, newPosts, handlelike, delete_post } = useContext(userContext)
    const router = useRouter()

    function ConverteDate(date){
        let date_ = new Date(date);
        return date_.toDateString();
    }

    async function Handlelike(){
        const like_res = await handlelike(user.username, props.post.post_id)
        setLikes(like_res.likes)
    }

    const Like = useCallback(
        () => {
            Handlelike()
            setLiked(true)
        }
    ,[liked, setLiked])

    const Dislike = useCallback(
        () => {
            Handlelike()
            setLiked(false)
        }
    ,[liked, setLiked])

    const DeletePost = useCallback(
        async () => {
            const post_deletation = await delete_post(props.post.post_id)
            if(post_deletation.success){
                newPosts()
            }
        }
    ,[])

    useEffect(()=>{
        props.post.users_that_liked.map((user_that_liked)=>{
            if(user_that_liked == user.username){
                setLiked(true)
            }
        })
    },[])

    return(
        <div className={styles.post}>
            {
                props.post.author_name == user.username ?
                <img onClick={()=>{DeletePost()}} className={styles.delete_post} src="https://www.pinclipart.com/picdir/middle/342-3422954_png-file-svg-icone-de-lixeira-png-clipart.png"/>
                : null
            }
            <div className={styles.post_header}>
                <img className={styles.profile_image} src='https://th.bing.com/th/id/R.d46ad813587990373de079329281673f?rik=RF3ZxYUE6yBAsQ&pid=ImgRaw&r=0'/>
                <p>{props.post.author_name}</p>
            </div>
            <div className={styles.post_legend}>{ConverteDate(props.post.date)}</div>
            <img onClick={()=>{router.push(`/posts/${props.post.post_id}`)}} className={styles.post_image} src={props.post.picture}/>
            <p className={styles.post_legend}>{props.post.legend}</p>
            <div className={styles.post_footer}>
                <div className={styles.post_option}>
                    <p>
                        {likes}
                    </p>
                    { liked ?
                        <img onClick={()=>{Dislike()}} className={styles.menu} src='/liked.svg'/>:
                        <img onClick={()=>{Like()}} className={styles.menu} src='/like.svg'/>
                    }
                </div>
                
                <div className={styles.post_option} onClick={()=>{router.push(`/posts/${props.post.post_id}`)}}>
                    <p>{props.post.comments_num}</p>
                    <img className={styles.menu} src='/comment.svg'/>
                </div>
                <div className={styles.post_option}>
                    <img className={styles.menu} src='/save.svg'/>
                </div>
            </div>
        </div>
    )
}