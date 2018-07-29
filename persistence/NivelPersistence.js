const mongoose= require('mongoose')

class NivelPersistence {
    constructor(connection) {
        this.connection = connection
        this.schema     = mongoose.Schema({
            nameeqp: String,
            ipeqp: String,
            namenivel: String
        })
    
        this.nivelModel = this.connection.model('Nivel',this.schema)
    }
 insert(nivel){
    return new Promise((resolve, reject)=>{
        const nivelRep = new this.nivelModel(nivel)
        nivelRep.save((err,res) => {
            if (err) {
                reject(err)
            }
                resolve(res)
      })
    })
  }   
  findAll(){
      return new Promise((resolve, reject)=>{
          this.nivelModel.find((err, res)=>{
              if (err) {
                reject(err)
              }
                resolve(res)
          })
      })
  } 
  findByNameeqp(nameeqp) {
      return new Promise ((resolve, reject)=>{
         this.nivelModel.findOne({nameeqp: nameeqp}, (err,res)=>{
            if (err || res == null ) {
                reject(err)
            }
                resolve(res)
         })
      })
  }
  findByIpeqp(ipeqp) {
      return new Promise ((resolve, reject)=>{
          this.nivelModel.findOne({ipeqp: ipeqp},(err, res)=>{
              if (err || res ==null) {
                reject(err)
              }
                resolve(res)
          })
      })
  }
  findByNamenivel(namenivel) {
      return new Promise ((resolve, result)=>{
        this .nivelModel.findOne({namenivel: namenivel},(err, res)=>{
            if (err || res ==null) {
                reject(err)                
            }
                resolve(res)
        })
      })

  }
}
module.exports = NivelPersistence