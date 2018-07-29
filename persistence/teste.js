const conexao = require ('./ConnectionDB')
const userPersistence = require('./UserPersistence')
const nivelPersistence = require('./NivelPersistence')
const bc               =require('../config/teste.json')
const nivelRep = new nivelPersistence(conexao)
const userRep = new userPersistence(conexao)
//const namenivel = null
/*
nivelRep.insert({
    
   nameeqp: 'Entrada',
   ipeqp: '010.000.000.173',
   namenivel: 'DP'
   
    
}).then((res) => {
    console.log(res)
}).catch((res) => {
    console.log(res)
})
  */
 userRep.findByKey('10').then((res) =>{
    //console.log(res
    //  'NOME EQUIPAMENTO :' +res.nameeqp+'\n',
    //   'IP DO EQUIPAMENTO:' +res.ipeqp+'\n',
    //   'LIBERACAO:' +res.namenivel+'\n'
   // )

    if (res.key == '10') {
        console.log('ok Key')
    }else{
        console.log('Nok Key')
    }
}).catch((res) => {
    console.log(res)
})


 //console.log(bc.nivel) ({namenivel: namenivel},(err, res)
 nivelRep.findByIpeqp('010.000.000.172',(err, res) =>{

    console.log(res)
    //console.log(res
    //  'NOME EQUIPAMENTO :' +res.nameeqp+'\n',
    //   'IP DO EQUIPAMENTO:' +res.ipeqp+'\n',
    //   'LIBERACAO:' +res.namenivel+'\n'
   // )

    if (res.ipeqp == '') {
        console.log('ok')
    }else{
        console.log('Nok')
    }
}).catch((res) => {
    console.log(res)
})



/*
userRep.findByKey('25').then((res) =>{
    console.log(
        'CARTAO :' +res.key+'\n',
       'NOME:' +res.name+'\n',
       'LIBERACAO:' +res.value+'\n'
    )
}).catch((res) => {
    console.log(res)
})
/*
 
userRep.findAll().then((res)=> {
    console.log(res)
}).catch((res) => {
    console.log(res)
})

userRep.fineByTag('123').then((res) =>{
    console.log(res)
}).catch((res) => {
    console.log(res)
})

userRep.addCredits('123', 5).then((res) => {
    console.log(res)
}).catch((res) => {
    console.log(res)    
})*/