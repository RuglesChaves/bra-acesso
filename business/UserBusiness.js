class userBusiness{
    constructor(repository){
        this.repository = repository
    }
    insert(name,key,value,eqp) {
        return new Promise((resolve, reject) =>{
         /*  this.repository.fineByKey(tag).then((res) =>{
                reject(res)
            }).catch((res) => {
                */
                this.repository.insert({
                    name: name,
                    key: key,
                    value: value,
                    eqp: eqp
                }).then((res) => {
                    resolve(res)
                }).catch((res) => {
                    reject(res)
                })
           // })
        })
    }

    findAll(){
        return new Promise((resolve, reject) => {
            this.repository.findAll().then((res)=>{
                if (res =="") {
                    Console.log('SEM REGISTRO')
                }
                resolve(res)
            }).catch((res)=>{
                reject(res)

            })
        })
    }

    //Pesquisa expecifica Value
    findByValue(value){
        return new Promise((resolve, reject)=>{
            this.repository.findByValue(value).then((res) =>{
                resolve(res)
            }).catch((res) => { 
                reject('teste')
            })
        })
    }

    //Pesquisa expecifica key
    findByKey(key){
        return new Promise((resolve, reject)=>{
            this.repository.findByKey(key).then((res) =>{
                resolve(res)
            }).catch((res) => { 
                reject('teste')
            })
        })
    }

    //Pesquisa expecifica
    findByTag(tag){
        return new Promise((resolve, reject)=>{
            this.repository.findByTag(tag).then((res) =>{
                resolve(res)
            }).catch((res) => { 
                reject('teste')
            })
        })
    }
    //pesquisa e adicionar creditos
    addCredits(tag, credits){
      return new Promise((resolve, reject)=>{
        if (credits < 2) {
           reject('NO MINIMO R$ 2,00')               
        }
           this.repository.addCredits(tag, +credits).then((res)=>{
                const userTemp = {
                    name: res.name,
                    credits: res.credits +parseFloat(credits)
                }
                resolve(userTemp)
                
           }).catch((res)=>{
            reject('NAO FOI POSSIVEL ADD CREDITOS!!')
           })
        })
    }

    //pesquisa e retira creditos
    rmCredits(tag,credits){
        return new Promise((resolve, reject)=>{

            //debugar
            
           
            //if (parseFloat(credits) > credits ||credits < 2) {
           //  reject('CREDITOS INSUFICIENTES')
           // }
            this.repository.addCredits(tag, -credits).then((res)=>{
                //reotno JSON 
                const userTemp = {
                    name: res.name,
                    credits: res.credits  -parseFloat(credits)
                }
                resolve(userTemp)
            }).catch((res) =>{
                reject('NAO FOI POSSIVEL REMOVER CREDITOS!!')
            })
        })
    }
}

module.exports = userBusiness