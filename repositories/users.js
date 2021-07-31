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
            return await User.findOne({
                where: {       
                id:uid 
                },
                attributes: ['id','prenom','nom', 'email', 'phone','bDate', 'role','createdAt','updatedAt']
            });
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




    async getAllEnts() { 
        let __ents = await User.findAll({
        attributes: ['id','prenom','nom', 'nomE', 'typeE', 'nbrAssocies','listWithNomAndPathCin','listGerant','sectActi', 'capital', 'validationComptable','createdAt','updatedAt']
        });
        
        __ents.forEach(element => {
            element.listWithNomAndPathCin =element.listWithNomAndPathCin.toString().split(";")
            element.listGerant =element.listGerant.toString().split(";")
        });
        
        return __ents
      },
    async getThisEnt(Uid) { 
        let __ents = await User.findOne({
        where: {
            id : Uid
        },
        attributes: ['id','prenom','nom', 'nomE', 'typeE', 'nbrAssocies','listWithNomAndPathCin','listGerant','sectActi', 'capital', 'validationComptable','createdAt','updatedAt']
        });
        if(__ents.listWithNomAndPathCin) __ents.listWithNomAndPathCin =__ents.listWithNomAndPathCin.toString().split(";")
        if(__ents.listGerant) __ents.listGerant =__ents.listGerant.toString().split(";")
        return __ents
      },
    async updateEnt(entreprise) {
        const __entreprise = await this.getThisEnt(entreprise.id)
        if (__entreprise == null) return "can't update entreprise"
        if(entreprise.listWithNomAndPathCin){
            var listNomPath = "" 
            entreprise.listWithNomAndPathCin.forEach(s=>{
                listNomPath = listNomPath + s + ";"
            });
        }
        if(entreprise.listGerant){
            var listG = ""
            entreprise.listGerant.forEach(s=>{
                listG = listG + s + ";"
            });
        }
        let newEntData = {}
        newEntData.nomE = entreprise.nomE
        newEntData.typeE = entreprise.typeE
        newEntData.nbrAssocies = entreprise.nbrAssocies
        newEntData.listWithNomAndPathCin = listNomPath
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