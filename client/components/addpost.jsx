import { useContext, useState } from "react"
import { userContext } from "../contexts/userContext"
import styles from "../styles/AddPost.module.css"

export default function AddPost(){
    const [upload_image,  setUploadImage] = useState(null)
    const [legend, setLegend] = useState("")
    const [allert, setAllert] = useState("")
    const [loading, setLoading] = useState(false)
    const { uploadNewPost, newPosts } = useContext(userContext)

    const UploadNewPost = async()=>{
        if(loading){setAllert("Please, wait until the last post be loaded");return}
        if(upload_image == null){setAllert("Please add some image");return}
        setLoading(true)
        const new_post_res = await uploadNewPost(upload_image,legend)
        if(new_post_res.success){
            setLoading(false)
            setAllert(new_post_res.message)
            newPosts()
        }
    }

    return(
        <div className={styles.new_post}>
            <div className={styles.new_post_input}>
                <div className={styles.inputs}>
                    <input onChange={(e)=>{setUploadImage(e.target.files[0])}} type="file" />
                    <input onChange={(e)=>{setLegend(e.target.value)}} placeholder="What's up?"/>
                </div>
                <button onClick={()=>{UploadNewPost()}}>Enviar</button>
            </div>
            {allert? <div className={styles.allert}>{allert}</div> : null}
        </div>
    )
}