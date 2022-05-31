const db = require("../db")
const User = require("../models/user")
const firestore = db.firestore()

const UserDataBase = firestore.collection('users')

const getBasicUserInfo = async(req,res)=>{
    //lembrar de mudar a função para que mostre todos os dados do usuário
    try {
        const username = req.params.username
        
        let user = []
        await UserDataBase.where('username', '==', username).get().then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                user.push(doc.data())
            })
        })

        if(!user.length){
            res.send({
                success: false,
                message: "user not found"
            })
            return
        }

        const the_user = user[0]
        const basic_user_info = {
            username: the_user.username,
            profile_image: the_user.profile_image
        }

        res.send(basic_user_info)

    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
} 

const createUser = async(req,res)=>{
    try {
        const { username, password } = req.body

        const userAlreadyExists = []
        await UserDataBase.where('username', '==', username).get().then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                userAlreadyExists.push(doc.data())
            })
        })

        if(userAlreadyExists.length){
            res.send({
                success: false,
                message: "user already exists"
            })
            return
        }

        const user = new User(username, password)
        await UserDataBase.doc().set(user)

        res.send({
            success: true,
            message: "user created successfully"
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

const login = async(req,res)=>{
    try {
        const { username, password } = req.body

        const userAlreadyExists = []
        await UserDataBase.where('username', '==', username).get().then((snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                userAlreadyExists.push(doc.data())
            })
        })

        if(!userAlreadyExists.length){
            res.send({
                success: false,
                message: "user not found"
            })
            return
        }

        const user_to_log = userAlreadyExists[0]
        if(password !== user_to_log.password){
            res.send({
                success: false,
                message: "incorrect password"
            })
            return
        }
        res.send({
            success: true,
            message: "login successfully"
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getBasicUserInfo,
    createUser,
    login
}