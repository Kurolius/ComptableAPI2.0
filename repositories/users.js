const { User } = require('../models')
const { PaperAdvancement } = require('../models')
const paperAdv = require('../repositories/paperAdvancements')
const moment = require('moment')
var CryptoJS = require("crypto-js");
var md5 = require('md5');
module.exports = { 
    async verifUser(usr) {
       
        var count= await User.count({
        where: {
          
            email: usr.email,
            password: md5(usr.password)
          
        }
      });
      if(count != 0){
        const __user = await this.getUserByEmail(usr.email)
        let data = {}
        if (__user != null){
            var token = CryptoJS.AES.encrypt(md5(usr.password), 'SuckMyDick').toString();
            data.id = __user.id
            data.email = __user.email
            data.prenom = __user.prenom
            data.nom = __user.nom
            data.bDate = __user.bDate
            data.token = token
            data.role = __user.role
            data.createdAt = __user.createdAt
            data.updatedAt = __user.updatedAt
            return data
        }
      }
      return null
    },
    async getUserByEmail(email) { 
        return await User.findOne({
            where: {       
            email 
            },
            attributes: ['id','prenom','nom', 'email', 'phone','bDate', 'role','createdAt','updatedAt']
        });
        },
        async getUserdata(uid) { 
            let user = await User.findOne({
                where: {       
                id:uid 
                },
                attributes: ['id','prenom','nom', 'email', 'phone','bDate', 'role','createdAt','updatedAt']
            });
            user.createdAt = user.createdAt.toString().split("T")
            user.createdAt = user.createdAt[0]
            user.updatedAt = user.updatedAt.toString().split("T")
            user.updatedAt = user.updatedAt[0]
            return user
            },
    async addUser(usr) {
        const created = await User.create({prenom: usr.prenom, nom: usr.nom , email: usr.email, phone: usr.phone, bDate: usr.bDate,
            password: md5(usr.password), role: usr.role,
            createdAt : moment().format("YYYY/MM/DD h:mm:ss"),
            updatedAt : moment().format("YYYY/MM/DD h:mm:ss"),
        });
        let data = {}
        if (created != null){
            return this.verifUser(usr)
        }
        return "error"
    },
    async updateUser(usr) {
        const __user = await this.getUserByEmail(usr.email)
        if (__user == null) return "can't update user"
        try{
        const updated = await User.update(usr, {
            where: {
            id: __user.id
            }
        });
        if (updated == 1) return usr;
        else throw new Error()
        } catch(error){
        return "can't update this user"
        }
    },
    async changepass(usr) {
        var count= await User.count({
            where: {
              
                email: usr.email,
                password: md5(usr.oldpassword)  
              
            }
          });
        if(count != 0){
            const __user = await this.getUserByEmail(usr.email)
            if (__user == null) return "can't update user"
            let newusr = {}
            newusr.password = md5(usr.newpassword) 
            try{
            const updated = await User.update(newusr, {
                where: {
                id: __user.id
                }
            });
            if (updated == 1){ 
                let newtoken = {}
                newtoken.email= __user.email
                newtoken.password= usr.newpassword
                return await this.verifUser(newtoken);
            }else throw new Error()
            } catch(error){
            return "can't update this user"
            }
        }else{
            return "wrong password"
        }
    },
    async deleteUser(email) {
        const __user = await this.getUserByEmail(email)
        if (__user == null) return "user not found"
        await User.destroy({
            where: {
            id:__user.id
            },
            attributes:['id','prenom','nom', 'email', 'phone','bDate', 'role','createdAt','updatedAt']
        });
        return __user;
    },
    async verifToken(idu,token){
        var bytes  = CryptoJS.AES.decrypt(token, 'SuckMyDick');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        var count= await User.count({
            where: {
              
                id: idu,
                password: originalText 
              
            }
          });
          if(count != 0){
              return true
          }
          return false
    },
    async verifAdminRight(idu,token){
        var bytes  = CryptoJS.AES.decrypt(token, 'SuckMyDick');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        var compte= await User.findOne({
            where: {
              
                id: idu,
                password: originalText 
              
            },
            attributes:['id','role']
          });
          if(compte.role == "admin"){
              return true
          }
          return false
    },

    async verifAdminRightWithPass(usr){
        var compte= await User.findOne({
            where: {
              
                email: usr.email,
                password: md5(usr.password)
              
            },
            attributes:['id','role']
          });
          if(compte.role == "admin"){
              return true
          }
          return false
    },


    async getAllEnts() { 
        let __ents = await User.findAll({
        attributes: ['id','prenom','nom', 'nomE', 'typeE', 'nbrAssocies','listAssocies','listGerant','sectActi', 'capital', 'validationComptable','createdAt','updatedAt']
        });
        
        __ents.forEach(element => {

            if( element.listAssocies){
                element.listAssocies =element.listAssocies.toString().split(";")
                let string = ""
                element.listAssocies.forEach(element => {
                    string = string + element + " / "
                })
                string = string.slice(0, -3)
                element.listAssocies = string
            }
            if(element.listGerant){
                element.listGerant = element.listGerant.toString().split(";")
                let string = ""
                element.listGerant.forEach(element => {
                    string = string + element + " / "
                })
                string = string.slice(0, -3)
                element.listGerant = string
            }
            element.createdAt = element.createdAt.toString().split("T")
            element.createdAt = element.createdAt[0]
            element.updatedAt = element.updatedAt.toString().split("T")
            element.updatedAt = element.updatedAt[0]
            
        });
        
        return __ents
      },
    async getThisEnt(Uid) { 
        let __ents = await User.findOne({
        where: {
            id : Uid
        },
        attributes: ['id','prenom','nom', 'nomE', 'typeE', 'nbrAssocies','listAssocies','listGerant','sectActi', 'capital', 'validationComptable','createdAt','updatedAt']
        });
        if(__ents.listAssocies){ 
            __ents.listAssocies =__ents.listAssocies.toString().split(";")
            let string = ""
            __ents.listAssocies.forEach(element => {
                    string = string + element + " / "
                })
                string = string.slice(0, -3)
                __ents.listAssocies = string
        }
        if(__ents.listGerant){
            __ents.listGerant = __ents.listGerant.toString().split(";")
                let string = ""
                __ents.listGerant.forEach(element => {
                    string = string + element + " / "
                })
                string = string.slice(0, -3)
                __ents.listGerant = string
        }
        __ents.createdAt = __ents.createdAt.toString().split("T")
        __ents.createdAt = __ents.createdAt[0]
        __ents.updatedAt = __ents.updatedAt.toString().split("T")
        __ents.updatedAt = __ents.updatedAt[0]
        return __ents
      },
    async updateEnt(entreprise) {
        const __entreprise = await this.getThisEnt(entreprise.id)
        if (__entreprise == null) return "can't update entreprise"
        if(entreprise.listAssocies){
            var listNomPath = "" 
            entreprise.listAssocies.forEach(s=>{
                listNomPath = listNomPath + s + ";"
            });
        }
        listNomPath=listNomPath.slice(0, -1)
        if(entreprise.listGerant){
            var listG = ""
            entreprise.listGerant.forEach(s=>{
                listG = listG + s + ";"
            });
        }
        listG=listG.slice(0, -1)
        let newEntData = {}
        newEntData.nomE = entreprise.nomE
        newEntData.typeE = entreprise.typeE
        newEntData.nbrAssocies = entreprise.nbrAssocies
        newEntData.listAssocies = listNomPath
        newEntData.listGerant = listG
        newEntData.sectActi = entreprise.sectActi
        newEntData.capital = entreprise.capital
        newEntData.validationComptable = entreprise.validationComptable
        try{
        const updated = await User.update(newEntData, {
            where: {
            id: __entreprise.id
            }
        });
        if (updated == 1) return newEntData;
        else throw new Error()
        } catch(error){
        return "can't update this entreprise"
        }
    },
    async ValideENT(id){
        let entreprise ={}
        entreprise.id = id
        entreprise.validationComptable = "valide"
        const __rep = this.updateEnt(entreprise)
        var  count= await PaperAdvancement.count({
            where: {
                UserId: id
            }
          });
        if(count == 0){
            try{
                var __paperAdv = {}
                __paperAdv.UserId = id
                __paperAdv.advancement = "en cours"
                for(i = 1; i <= 9; i++){
                    __paperAdv.paperId = i
                    console.log(__paperAdv)
                    paperAdv.addPaperAdv(__paperAdv) 
                }
            } catch(error){
                return "there is a problem please contact an admin"
            }
        }
        return(__rep)
    }
}