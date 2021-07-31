const { Paper } = require('../models')
module.exports = {
    async getPaperList() {
        return Paper.findAll({
            attributes: ['id','type']
          })
   }
}