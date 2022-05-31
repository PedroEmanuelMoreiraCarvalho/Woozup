import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import AddPost from '../components/addpost'
import Post from '../components/post'
import Topbar from '../components/topbar'
import { userContext } from '../contexts/userContext'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [posts,setPosts] = useState([])
  const { newPosts } = useContext(userContext)
  const [ cookie ] = useCookies(["user"])
  const router = useRouter()

  useEffect(()=>{

    if(!cookie.user){
      router.push("/login")
      return
    }

    const getServerData = async()=>{

      const post_req = await fetch("http://localhost:3800/api/post")
      const posts = await post_req.json()
      // const posts = [
      //   {
      //     post_id: "pdasdaonfskdbnsidhvnc_ve0s",
      //     author_id: "safnskfsgsdfs-1",
      //     author_name: "kaminari jhonsons",
      //     picture: "https://i.pinimg.com/originals/b0/2d/b6/b02db6606b07a4cacfa0c530fb689818.jpg",
      //     legend: "sei la mano",
      //     likes: 30,
      //     comments: [
      //       {
      //         author_id: "sndvkcjvxckso-2",
      //         author_name: "midoriya shounen",
      //         comment: "vai estudar mano, fica so nessas de bateria humana, isso n dá futuro",
      //         likes: 4
      //       },
      //       {
      //         author_id: "sifubasodjfsd-3",
      //         author_name: "bakugou XD",
      //         comment: "figurante",
      //         likes: 2
      //       }
      //     ]
      //   }
      // ]

      setPosts(posts.reverse())
    }

    getServerData()
  },[newPosts])

  return (
    <div className={styles.home_page}>
      <Topbar/>
      <AddPost/>
      <div className={styles.posts}>
        {posts.map((post, key)=>{
          return(
            <Post post={post} key={key}/>
          )
        })}
      </div>
    </div>
  )
}
