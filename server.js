const express         = require('express')
const app             = require('./app')
const port            = 3333
const host            = 'localhost'

const server = app.listen(port, (err, res) =>{
    if (err) {
        console.log('erro ao iniciar o Server')
        throw new Error(err)
    }
   // console.log('iniciado o Server no http://' +host + ':' +port) 
})
module.exports = server