const mongoose = require('mongoose')

class UserPersistence {
        constructor(connetion) {
            this.connetion = connetion
            this.schema    = mongoose.Schema({
               // tag: String,
                name: String,
                key: String,
                value: String,
                eqp: String,
                //email: String,
                //credits: Number
            }) 
            this.userModel = this.connetion.model('User', this.schema)
        }

        insert(user) {
            return new Promise((resolve, reject) => {
                const userRep = new this.userModel(user)
                userRep.save((err, res) => {

                    if (err) {
                        reject(err)                    
                    }
                        resolve(res)
               })

            })
        }

        findAll() {
            return new Promise((resolve, reject) => {
                this.userModel.find((err, res) => {
                    if (err) {
                        reject(err)
                    }
                        resolve(res)
                })
            })
        }
            //find value
          findByValue(value) {
            return new Promise((resolve,reject) => {
                this.userModel.findOne({value: value}, (err, res) => {
                    if (err || res == null) {
                        reject(err)
                    }
                        resolve(res)
                })
            })
        }

        //Pesquisa expecifica key
        findByKey(key) {
            return new Promise((resolve,reject) => {
                this.userModel.findOne({key: key}, (err, res) => {
                    if (err || res == null) {
                        reject(err)
                    }
                        resolve(res)
                })
            })
        }


        findByTag(tag) {
            return new Promise((resolve,reject) => {
                this.userModel.findOne({tag: tag}, (err, res) => {
                    if (err || res == null) {
                        reject(err)
                    }
                        resolve(res)
                })
            })
        }

        addCredits(tag, credits){
            return new Promise((resolve,reject) =>{
                this.userModel.findOneAndUpdate({ tag: tag },{$inc:{credits: credits}},(err, res) => {
                    if (err) {
                        reject(err)                        
                    }
                        resolve(res)
                })
            })
            
        }
}

module.exports = UserPersistence







