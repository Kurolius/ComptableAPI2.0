const { PaperAdvancement } = require('../models')
const { Paper } = require('../models')

const moment = require('moment')
module.exports = {
    async getMypaper(id) {
        return await PaperAdvancement.findAll({
            attributes: ['advancement'],
            include: { model: Paper,attributes: ["type"]},
            where: {
                UserId : id,
            }
          });
      },
    async addPaperAdv(paperAdv) { 
        const created = await PaperAdvancement.create({UserId: paperAdv.UserId, PaperId : paperAdv.paperId,
            advancement: paperAdv.advancement,
            createdAt : moment().format("YYYY/MM/DD h:mm:ss"),
            updatedAt : moment().format("YYYY/MM/DD h:mm:ss"),
        });
        let data = {}
        if (created != null){
        data.UserId = created.UserId
        data.paperId =  created.paperId
        data.advancement = created.advancement
        }
        return data
    },
    async updatePaperAdv(paperAdv) {
        try{
        const updated = await PaperAdvancement.update(paperAdv, {
            where: {
                UserId : paperAdv.UserId,
                PaperId : paperAdv.PaperId
            }
        });
        if (updated) return paperAdv;
        else throw new Error()
        } catch(error){
        return "can't update this PaperAdvancement"
        }
    },
    async deletePaperAdv(idu) { 
        return await PaperAdvancement.destroy({
            where: {
                UserId:idu
            },
            attributes:['UserId', 'paperId', 'advancement']
        });
    },
    
}