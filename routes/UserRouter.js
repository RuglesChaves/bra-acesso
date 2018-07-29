const express    = require ('express')
const bodyParse = require ('body-parser')
const router    = express.Router()

router.use(bodyParse.urlencoded({extended: true}))
router.use(bodyParse.json())

class UserRouter{
    constructor(userBusiness){
        this.userBusiness = userBusiness
        this.initializeRouter()
        this.router = router
    }   

    initializeRouter() {
        router.get('/buscar', ( req, res) => {
            this.userBusiness.findAll().then((resp)=>{
                res.json(resp)
            }).catch((resp)=>{
                res.send(resp)
            })
        })

        router.post('/insert',(req, res)=>{
            this.userBusiness.insert(req.body.name, req.body.key, req.body.value, req.body.eqp).then((resp) => {
                res.send(resp)
            }).catch((resp) => {
                res.send('usuario ja cadastrado com o nome '+ resp.name)
                console.log('usuario ja cadastrado com o nome '+ resp.name)
            })
        })

        router.get('/buscar/:tag', (req, res)=>{
            this.userBusiness.findByTag(req.params.tag).then((resp) => {
               // console.log(resp)
                res.send(resp)
            }).catch((resp) => {
                //console.log('Usuario  -----  ' +''  +req.params.tag+' não Cadastrado') 
                res.send('Usuario -----  ' +''  +req.params.tag+' não Cadastrado')              
            })
        })

        router.post('/add', (req,res)=>{
            this.userBusiness.addCredits(req.body.tag, req.body.credits).then((resp) => {
                //console.log(res)
                res.send(resp)
            }).catch((resp) => {
                //console.log(resp)
                res.send(resp)
            })
        })

            router.post('/remover', (req,res)=>{
                this.userBusiness.rmCredits(req.body.tag, req.body.credits).then((resp) => {
                    console.log(res)
                    res.send(resp)
                }).catch((resp) => {
                    console.log(resp)
                    res.send(resp)
            })
        })

    }

} 
module.exports = UserRouter