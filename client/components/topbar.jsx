import { useContext } from "react"
import { userContext } from "../contexts/userContext"
import styles from "../styles/Topbar.module.css"

export default function Topbar(){
    const { user } = useContext(userContext)

    return(
        <div className={styles.top_bar}>
            <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                <img className={styles.profile_image} src={"https://th.bing.com/th/id/R.d46ad813587990373de079329281673f?rik=RF3ZxYUE6yBAsQ&pid=ImgRaw&r=0"}/>
                <p>{ user.username }</p>
            </div>
            <h1>Woozup</h1>
            <div>
            <img className={styles.menu} src='/menu.svg'/>
            </div>
      </div>
    )
}