class niveBusiness{
    constructor(repository){
        this.repository = repository     
    }
    insert(nameeqp,ipeqp,nomenivel) {
        return new Promise((resolve, reject)=>{
            this.repository.insert({
                nomeeqp:nomeeqp,
                ipeqp: ipeqp,
                namenivel
            }).then((res)=>{
                resolve(res)
            }).catch((res)=>{
                reject(res)
            })
        })
    }
    findAll(){
        return new Promise ((resolve,reject)=>{
            this.repository.findAll().then((res) =>{
              if (res == "") {
                  console.log('sem registrso')                  
              }  
               resolve(res)
            }).catch((res)=>{
               reject(res)
            })
        })
    }
    findByNameeqp() {
        return new Promise((resolve, reject)=>{
            this.repository.findByNameeqp(nameeqp).then((res)=>{
                resolve(res)
            }).catch((res)=>{
                reject(res)
            })
        })
    }
    findByIpeqp(){
        return new Promise((resolve, reject)=>{
            this.repository.findByIpeqp(ipeqp).then((res)=>{
                resolve(res)
            }).catch((res)=>{
                reject(res)
            })
        })
    }
    findBynamenivel(){
        return new Promise((resolve, reject)=>{
            this.repository.findBynamenivel(namenivel).then((res)=>{
                resolve(res)
            }).catch((res)=>{
                reject(res)
            })
        })
    }

}
module.exports = niveBusiness