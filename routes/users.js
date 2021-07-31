var express = require('express');
var router = express.Router();
const usersRepo = require('../repositories/users')
const multer = require('multer');
router.get('/:id', async function(req, res, next) {
  res.send(await usersRepo.getUserdata(req.params.id));
});

router.post('/signup', async function(req, res, next) {
    let user = {}
    user.prenom = req.body.prenom
    user.nom = req.body.nom
    user.email = req.body.email
    user.phone = req.body.phone
    user.password = req.body.password
    user.bDate = req.body.bDate
    user.role = "user"
    res.send(await usersRepo.addUser(user));
    
  });

  router.post('/signin', async function(req, res, next) {
    let user = {}
    user.email = req.body.email
    user.password = req.body.password
    res.send(await usersRepo.verifUser(user))
  });

  router.put('/update', async function(req, res, next) {
    let user = {}
    user.prenom = req.body.prenom
    user.nom = req.body.nom
    user.email = req.body.email
    user.phone = req.body.phone
    user.bDate = req.body.bDate
    user.role = req.body.role
    res.send(await usersRepo.updateUser(user));
  });

  router.put('/changepass', async function(req, res, next) {
    let user = {}
    user.email = req.body.email
    user.oldpassword = req.body.oldpassword
    user.newpassword = req.body.newpassword
    res.send(await usersRepo.changepass(user));
  });

  router.delete('/delete', async function(req, res, next){
    const id = req.body.id
    const token = req.body.token
    const flag = await usersRepo.verifToken(id,token)
    if(flag){
    let user= req.body.email
    res.send(await usersRepo.deleteClient(user));
    }else{
      res.send("authentification error")
    }
  });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './CinImg');
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
  });
  const upload = multer({storage: storage});
  
  router.get('/ent', async function(req, res, next) {
      res.send(await usersRepo.getAllEnts());
  });
  
  router.get('/ent/:id', async function(req, res, next) {
      res.send(await usersRepo.getThisEnt(req.params.id));
  });
  
  router.post('/valide', async function(req, res, next) {
    const id = req.body.id
    const token = req.body.token
    const flag1 = await usersRepo.verifToken(id,token)
    if(flag1){
      const flag2 = await usersRepo.verifAdminRight(id,token)
      if(flag2){
        res.send(await usersRepo.ValideENT(req.body.id));
      }else{
        res.send("you are not an admin")
      }
    }else{
      res.send("authentification error")
    }
  });
  
  router.post('/ent/create',async function(req, res, next) {
    const id = req.body.id
    const token = req.body.token
    const flag = await usersRepo.verifToken(id,token)
    if(flag){
      let entreprise = {}
      entreprise.id=id
      entreprise.nomE = req.body.nomE
      entreprise.typeE = req.body.typeE
      entreprise.nbrAssocies = req.body.nbrAssocies
      entreprise.listWithNomAndPathCin = req.body.listWithNomAndPathCin
      entreprise.listGerant = req.body.listGerant
      entreprise.sectActi = req.body.sectActi
      entreprise.capital = req.body.capital
      entreprise.validationComptable = "en cours"
      res.send(await usersRepo.addEnt(entreprise));
    }else{
      res.send("authentification error")
    }
    });
  
    router.post('/ent/addCinImg',upload.single('CinImg'),async function(req, res, next) {
      console.log(JSON.stringify(req.file))
      var response = '<a href="/">Home</a><br>'
      response += "Files uploaded successfully.<br>"
      response += `<img src="${req.file.path}" /><br>`
      return res.send(response)
    });
  
    router.put('/ent/update', async function(req, res, next) {
      const id = req.body.id
      const token = req.body.token
      const flag = await usersRepo.verifToken(id,token)
      if(flag){
        let entreprise = {}
        entreprise.id=id
        entreprise.nomE = req.body.nomE
        entreprise.typeE = req.body.typeE
        entreprise.nbrAssocies = req.body.nbrAssocies
        entreprise.listWithNomAndPathCin = req.body.listWithNomAndPathCin
        entreprise.listGerant = req.body.listGerant
        entreprise.sectActi = req.body.sectActi
        entreprise.capital = req.body.capital
        entreprise.validationComptable = req.body.validationComptable
        entreprise.ClientId = req.body.ClientId
        res.send(await usersRepo.updateEnt(entreprise));
      }else{
        res.send("authentification error")
      }
    });

module.exports = router;
