import { useContext, useState } from "react"
import { userContext } from "../contexts/userContext"
import styles from "../styles/PostPage.module.css"

export default function Comments(props){
    const [comment, setComment] = useState("")
    const [can_delete_comments, setCanDeleteComents] = useState(false)
    const post_id = props.post_id
    const { user,addComment,newComment,deleteComment } = useContext(userContext)

    async function Comment(){
        if(!post_id) return
        if(comment.trim() == "") return
        const comment_res = await addComment(post_id,user.username,comment)
        if(comment_res.success){
            newComment()
        }
    }

    async function DeleteComment(comment_id){
        if(!comment_id) return
        if(!post_id) return
        const delete_comment_res = await deleteComment(post_id, comment_id)
        if(delete_comment_res.success){
            newComment()
        }
    }

    return(
        <div>
            <div className={styles.add_comment}>
                <input onChange={(e)=>{setComment(e.target.value)}} type="text" placeholder="add new comment"/>
                <button onClick={()=>{Comment()}}>{">"}</button>
            </div>
            {props.comments.length && props.comments.map((post_comment,key)=>{
                return(
                    <div className={styles.comment} key={key}>
                        <div className={styles.comment_author}>{post_comment.author}</div>
                        <div>{post_comment.comment}</div>
                        {
                            post_comment.author == user.username ?
                            <img onClick={()=>{DeleteComment(post_comment.comment_id)}} className={styles.delete_comment} src="https://www.pinclipart.com/picdir/middle/342-3422954_png-file-svg-icone-de-lixeira-png-clipart.png"/>
                            : null
                        }
                    </div>
                )
            })}
        </div>
    )
}