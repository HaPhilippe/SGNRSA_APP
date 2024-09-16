const express = require('express')


const auth_controller = require('../../controllers/administration/auth_admin.controller')

const authRouter = express.Router()

authRouter.post('/login', auth_controller.login)
authRouter.delete('/logout', auth_controller.logout)
authRouter.post('/access_token', auth_controller.getNewAccessToken)

module.exports = authRouter

// /administration/auth/login
// /administration/auth/logout