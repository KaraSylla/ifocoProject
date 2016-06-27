//module pour gérer les msg d'erreurs sur les urls en fonction du mode connecté ou non
// exports.emailConfirmation = (req, res, next) => {
//   if (!req.session.pseudo) {
//     res.status(403);
//     next();
//     return true;
//   }
// };
//
// exports.initSession = (req, res) => {
//   req.session.destroy();
// };

exports.testounet = function () {
  console.log('TESTOUNET')
};

// gestion mail de confirmation
var nodemailer = require('nodemailer');

// gestion mail de confirmation
exports.emailConfirmation = (req, res) => {

  var transporter = nodemailer.createTransport({
    service : 'Mailgun',
    auth : {
      user : process.env.MAILGUN_SMTP_LOGIN,
      pass: process.env.MAILGUN_SMTP_PASSWORD
    }
    // 'smtps://kara.sylla%40gmail.com:alchimiste1986.@smtp.gmail.com'
  });

  var emailOptions = {
    from: 'darkgenust@gmail.com',
    to: req.body.email,
    subject: 'mon objet depuis node js',
    text: 'message de test (ceci est un mail de confirmation); voici votre email : ' + req.body.email + ' et votre mdp ' + req.body.password
    // html : 'message de test (ceci est un mail de confirmation); <br> voici votre email : ' + req.body.email + ' et votre mdp ' + req.body.password
  };

  transporter.sendMail(emailOptions,  (error, info) => {
    if (error) {
      console.log('ça marche pas poulet :' + error);
      res.redirect('/');
    }else {
      console.log('dans ta maman :' + info.response);
      res.redirect('/');
    }
  });

  // transporter.close();

};
