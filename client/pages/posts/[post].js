import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Comments from "../../components/comments";
import Topbar from "../../components/topbar";
import { userContext } from "../../contexts/userContext";
import styles from "../../styles/PostPage.module.css"

export default function Post(){
    const router = useRouter()
    const [post_data, setPostData] = useState({
        comments: []
    })
    const { newComment } = useContext(userContext)
    const [ loading,setLoading ] = useState(true)
    const post_id = router.query.post

    useEffect(()=>{

        const loadPostData = async()=>{
            if(post_id == undefined)return
            const post_req = await fetch(`http://localhost:3800/api/post/${post_id}`)
            const postdata_ = await post_req.json()
            setPostData(postdata_)
            setLoading(false)
        }

        loadPostData()
    },[router,newComment])

    return(
        <div className={styles.post_page}>
            <Topbar/>
            <div className={styles.post}>
                <div className={styles.post_content}>
                {loading ?
                    <div>
                        <img className={styles.loading} src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/04de2e31234507.564a1d23645bf.gif"/>
                    </div>
                    :
                    <img className={styles.image_loaded} src={post_data.picture}/>
                }
                </div>
                <div className={styles.post_comments}>
                    <div>
                        <div style={{fontWeight: "bold"}}>{post_data.author_name}</div>
                        <div>{post_data.legend}</div>
                    </div>
                    <Comments post_id={post_id} comments={post_data.comments}/>
                </div>
            </div>
        </div>
    )
}