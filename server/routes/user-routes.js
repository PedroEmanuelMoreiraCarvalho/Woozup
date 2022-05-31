const express = require("express");
const { getBasicUserInfo, createUser, login } = require("../controllers/UserController")
const router = express.Router()

router.get('/user/:username', getBasicUserInfo)
router.post('/user', createUser)
router.post('/user/login', login)

module.exports = {
    routes: router
}