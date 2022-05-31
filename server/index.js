const express = require("express");
const cors = require("cors")
const postRoutes = require("./routes/post-routes");
const userRoutes = require("./routes/user-routes");
const app = express()

app.use(express.json())
app.use(cors({
    origin: '*'
}))

app.use('/api', postRoutes.routes)
app.use('/api', userRoutes.routes)

app.listen(3800,()=>{
    console.log("Servidor iniciado")
})