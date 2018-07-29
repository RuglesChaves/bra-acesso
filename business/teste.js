const conexao = require ('../persistence/ConnectionDB')
const userPersistence = require('../persistence/UserPersistence')
const UserBusiness    = require('./UserBusiness')

const userRep = new userPersistence(conexao)
const userBusiness = new UserBusiness(userRep)
/*
userBusiness.insert('123', 'rugles','rugles@gmail.com', 60).then((res) => {
    console.log(res)
}).catch((res) => {
    console.log('usuario ja cadastrado com o nome '+ res.name)
})



userBusiness.findAll().then((res)=> {
    console.log(res)
}).catch((res)=>{
    console.log('nao localizado!')
})
*/

userBusiness.findByValue('L').then((res) => {
    console.log(res)
}).catch((res) => {
    console.log(res)
})