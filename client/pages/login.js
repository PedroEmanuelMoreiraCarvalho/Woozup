import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { userContext } from "../contexts/userContext"
import styles from "../styles/Login.module.css"

export default function Login(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [warning, setWarning] = useState("")
    const router = useRouter()

    const { login, singUp } = useContext(userContext)

    function handleUsername(e){
        setUsername(e.target.value)
    }

    function handlePassword(e){
        setPassword(e.target.value)
    }

    function isThereSomeEmptyField(){
        if(username.trim() == ""){setWarning("please, inform a username"); return true}
        if(password.trim() == ""){setWarning("please, inform a password"); return true}
    }

    async function Login(){
        if(isThereSomeEmptyField()) return
        setWarning("")
        const login_data = await login(username,password)
        if(login_data.success){
            router.push("/")
            return
        }
        setWarning(login_data.message)
    }

    async function SingUp(){
        if(isThereSomeEmptyField()) return
        setWarning("")
        const login_data = await singUp(username,password)
        if(login_data.success){
            router.push("/")
            return
        }
        setWarning(login_data.message)
    }

    return(
        <div className={styles.background}>
            { !!warning ? <div className={styles.warning}>
                {warning}
            </div>: null}
            <h1>Woozup</h1>
            <div className={styles.login_area}>
                <input onChange={(e)=>{handleUsername(e)}} placeholder="username"/>
                <input onChange={(e)=>{handlePassword(e)}} placeholder="password"/>
                <div className={styles.options}>
                    <button onClick={()=>{Login()}}>Login</button>
                    <button onClick={()=>{SingUp()}}>Sing up</button>
                </div>
            </div>
        </div>
    )
}