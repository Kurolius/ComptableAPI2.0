var express = require('express');
var router = express.Router();
const usersRepo = require('../repositories/users')
const multer = require('multer');
var nodemailer = require('nodemailer');
/*
var mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-gmail-password'
  }
});
*/

router.get('/user/:id', async function(req, res, next) {
  res.send(await usersRepo.getUserdata(req.params.id));
});

router.post('/signup', async function(req, res, next) {
    let user = {}
    user.prenom = req.body.prenom
    user.prenom = user.prenom[0].toUpperCase() + user.prenom.slice(1).toLowerCase()
    user.nom = req.body.nom
    user.nom = user.nom[0].toUpperCase() + user.nom.slice(1).toLowerCase()
    user.email = req.body.email.toLowerCase()
    user.phone = req.body.phone
    user.password = req.body.password
    user.bDate = req.body.bDate
    user.role = "user"

    /*
    var mailOptions = {
      from: 'youremail@gmail.com',
      to: user.email,
      subject: 'Account verification',
      text: 'put the msg here'
    };
      
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });*/

    res.send(await usersRepo.addUser(user));
    
  });

  router.post('/signin', async function(req, res, next) {
    let user = {}
    user.email = req.body.email.toLowerCase()
    user.password = req.body.password
    res.send(await usersRepo.verifUser(user))
  });

  router.post('/signin/admin', async function(req, res, next) {
    let user = {}
    user.email = req.body.email.toLowerCase()
    user.password = req.body.password
    const flag = await usersRepo.verifAdminRightWithPass(user)
    if(flag){
      res.send(await usersRepo.verifUser(user))
    }else{
      res.send("you are not an admin")
    }
  });

  router.put('/update', async function(req, res, next) {
    const id = req.body.id
    const token = req.body.token
    const flag = await usersRepo.verifToken(id,token)
    if(flag){
      let user = {}
      user.prenom = user.prenom[0].toUpperCase() + user.prenom.slice(1).toLowerCase()
      user.nom = req.body.nom
      user.nom = user.nom[0].toUpperCase() + user.nom.slice(1).toLowerCase()
      user.email = req.body.email.toLowerCase()
      user.phone = req.body.phone
      user.bDate = req.body.bDate
      user.role = req.body.role
      res.send(await usersRepo.updateUser(user));
    }else{
      res.send("authentification error")
    }
  });

  router.put('/changepass', async function(req, res, next) {
    let user = {}
    user.email = req.body.email.toLowerCase()
    user.oldpassword = req.body.oldpassword
    user.newpassword = req.body.newpassword
    res.send(await usersRepo.changepass(user));
  });

  router.post('/delete', async function(req, res, next){
    const id = req.body.id
    const token = req.body.token
    const flag = await usersRepo.verifToken(id,token)
    if(flag){
    let user= req.body.email.toLowerCase()
    res.send(await usersRepo.deleteUser(user));
    }else{
      res.send("authentification error")
    }
  });
  router.post('/delete/admin', async function(req, res, next){
    const id = req.body.id
    const token = req.body.token
    const idAS = req.body.idAS
    const flag1 = await usersRepo.verifToken(id,token)
    if(flag1){
      const flag2 = await usersRepo.verifAdminRight(id,token)
      if(flag2){

        res.send(await usersRepo.deleteUserById(idAS));
      }else{
        res.send("you are not an admin")
      }
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
    const idAV = req.body.idAV
    const flag1 = await usersRepo.verifToken(id,token)
    if(flag1){
      const flag2 = await usersRepo.verifAdminRight(id,token)
      if(flag2){
        res.send(await usersRepo.ValideENT(idAV));
      }else{
        res.send("you are not an admin")
      }
    }else{
      res.send("authentification error")
    }
  });
  
  router.post('/ent/create',upload.array('CinImg',2000),async function(req, res, next) {
    const id = req.body.id
    const token = req.body.token
    const flag = await usersRepo.verifToken(id,token)
    if(flag){
      let entreprise = {}
      entreprise.id=id
      entreprise.nomE = req.body.nomE
      entreprise.typeE = req.body.typeE
      entreprise.nbrAssocies = req.body.nbrAssocies
      entreprise.listAssocies = req.body.listAssocies
      entreprise.listGerant = req.body.listGerant
      entreprise.sectActi = req.body.sectActi
      entreprise.capital = req.body.capital
      entreprise.validationComptable = "en cours"

      /*var mailOptions = {
        from: 'youremail@gmail.com',
        to: 'put Comptable email here',
        subject: 'New Account created ',
        text: 'put the msg here'
      };
        
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });*/


      res.send(await usersRepo.updateEnt(entreprise));
    }else{
      res.send("authentification error")
    }
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
        entreprise.listAssocies = req.body.listAssocies
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
