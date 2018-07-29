const express         = require('express')
const app             = express()
const conexao         = require ('./persistence/ConnectionDB')
const userPersistence = require('./persistence/UserPersistence')
const UserBusiness    = require('./business/UserBusiness')
const UserRouter      = require ('./routes/UserRouter')

const userRep      = new userPersistence(conexao)
const userBusiness = new UserBusiness(userRep)
const userRouter   = new UserRouter(userBusiness)

app.get('/', (req, res)=>{
    res.send('Homepage')
})


app.use('/user', userRouter.router)


module.exports = app