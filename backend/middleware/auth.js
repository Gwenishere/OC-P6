const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
 try {
     const token = req.headers.authorization.split(' ')[1];
     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // la clé correspond à celle dans controllers user
     const userId = decodedToken.userId;
     if (req.body.userId && req.body.userId !== userId) {
         throw 'User ID non valable, désolé !';
     } else {
         next();
     }
 } catch (error) {
     res.status(401).json({ error: error | 'Requête non authentifiée' }); // pour un pb d'authenfication
 }
};