const express = require('express'); // installé
const app = express();  
const bodyParser = require('body-parser'); // installé
const mongoose = require('mongoose'); // installé
const path = require('path'); // installé
const dotenv = require('dotenv');
dotenv.config(); // installé
const helmet = require('helmet'); // installé
app.use(helmet());


const userRoutes = require('./routes/user') 
const saucesRoutes = require('./routes/sauces')

/**FIXME: 
// 2 types de droits administrateur à la base de données doivent être définis : un accès
//pour supprimer ou modifier des tables, et un accès pour éditer le contenu de la base
//de données ;
*/

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;