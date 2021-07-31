const router = require('express').Router();
const paperAdvRepo = require('../repositories/paperAdvancements')
const usersRepo = require('../repositories/users')

router.get('/:id', async function(req, res, next) {
    res.send(await paperAdvRepo.getMypaper(req.params.id))
});
router.put('/update', async function(req, res, next) {
    const id = req.body.id
    const token = req.body.token
    const flag1 = await usersRepo.verifToken(id,token)
    if(flag1){
        const flag2 = await usersRepo.verifAdminRight(id,token)
        if(flag2){
            let paperAdv = {}
            paperAdv.UserId = req.body.UserId
            paperAdv.PaperId = req.body.PaperId
            paperAdv.advancement = req.body.advancement
            res.send(await paperAdvRepo.updatePaperAdv(paperAdv))
        }else{
            res.send("you are not an admin")
        }
    }else{
        res.send("authentification error")
    }
});
module.exports = router;