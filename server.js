// déclaration & lancement du module express
var express = require('express');
var app = express();

// session
var session = require('express-session');
var cookieParser = require('cookie-parser');

// charge module dotenv pour utiliser les variables d'environnement
var dotenv = require('dotenv');
// utilisations des utilitaires
var utilitaires = require('./utilitaires');

// récupère les valeurs du body
var bodyParser = require('body-parser');
// charge module mongodb + récupération de la propriété Mongoclient de l'obj mongodb
var MongoClient = require('mongodb').MongoClient;
// var URL ='mongodb://karaIfocop:Alchi86.@ds011903.mlab.com:11903/multijoueur';
// url de connexion à la base mongodb
// var URL ='mongodb://:27017/reseausocial';
var URL = process.env.MONGODB_URI;
// var URL ='mongodb://KaraSylla:database86..@ds023644.mlab.com:23644/socialgenust';
// déclaration variable pour la bdd
var maDb;


//chargement des variables d'environnement du fichier .env
dotenv.load();
app.set('port', process.env.PORT || 5000);

// fixation du moteur de visualisation & indication de l'emplacement des fichiers jade
app.set('view engine', 'jade');
app.set('views', 'jadefiles');

// gestion des fichiers statiques
app.use(express.static(__dirname + '/staticfiles/src'));
app.use(express.static(__dirname + '/staticfiles/img'));

// gestion des sessions
// app.use(session({
//   secret:'motdepassequiretouvelefichiercorrespondantauclienthttp01++',
//   saveUninitialized : true,
//   resave: false
//   // maxAge: 900000000000000000000000000000000000000000000000
// }));

// app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: false
}));


// app.post('/verification-formulaire-inscription', (req, res) => {
//
// });
// gestion des routes en mode non connecté
app.get('/', (req, res) => {
  // initialisation des données de la session
  // var collection = maDb.collection('');
  // maDb.collection
  res.render('login');
});

app.get('/inscription', (req, res) => {
  // initialisation des données de la session

  var collection = maDb.collection('members');
  // collection.insert({pseudonyme :'ton père', mdp: 'tasoeur'}, function (err, result) {
  //   console.log(result);
  // });
  res.render('inscription');
});


app.get('/index', (req, res) => {
  // initialisation des données de la session
  res.render('index');

});

app.post('/verification-formulaire-inscription', (req, res) => {
  //
  // utilitaires.emailConfirmation(req,res);
  var messageErr = '';
  var messageSucces = '';
  if(req.body.pseudo == '' || req.body.firstMdp == '' || req.body.secondMdp == '') {
    messageErr += 'veuillez saisir tous les champs';
    res.render('login', {msgErr : messageErr});
  }else {
    if (req.body.firstMdp != req.body.secondMdp) {
        messageErr += 'les mots de passe ne correspondent pas';
        res.render('login', {msgErr : messageErr});
    }else {
      // gestion bdd
      var collection = maDb.collection('membres');
      collection.find({pseudo: req.body.pseudo}).toArray((err, data) => {
        if (data == '') {
          collection.insert({pseudo : req.body.pseudo, firstMdp: req.body.firstMdp, secondMdp:req.body.secondMdp}, (err, result) => {
            collection.find({pseudo:req.body.pseudo}).toArray(function (err, data) {
              messageSucces += 'votre compte est bien créé';
              res.render('login', {msgeSucces : messageSucces});
            });
          });
        }else {
          // identifiant ou mot de passe existant dans la bdd
          messageErr += 'identifiant déja existant';
          res.render('login', {msgErr : messageErr});
        }
      });
    }
  }
});

app.post('/test', (req, res) => {
  utilitaires.emailConfirmation(req,res);
});






// page des scores
// app.get('/resultat', (req, res, next) => {
//
// });

// gestion des routes pour les formulaires ...
// app.get('/formulaire-inscription', (req, res) => {
//   // initialisation des données de la session
//
// });

// app.get('/formulaire-connexion', (req, res) => {
//   // initialisation des données de la session
//
// });

// gestion des routes en mode connecté
// app.get('/jeumulti', (req, res, next) => {
// });


///////////////////////////////////////////////SOCKET///////////////////////////
// association du serveur websocket au serveur http ce serveur
// accept une requette upgrade (connexion persistante)
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
// gestion d'une requête WebSocket provenant d'un client WebSocket
// socket est un objet représentant la connexion








// connexion à la base de donnée
MongoClient.connect(URL, (err, db) => {
  if(err){
    return;
    console.log('impossible de se connecter à la base de donnée');
  }
  maDb = db;
  app.listen(app.set('port'), () => {
    console.log('serveur en écoute sur le port, ' + app.set('port'));
  });
});
