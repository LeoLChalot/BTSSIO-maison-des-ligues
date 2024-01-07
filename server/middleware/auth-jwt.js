const jwt = require("jsonwebtoken");
require('dotenv').config();

// Midddlewares d'authentification avec jwt
// Méthode avec les cookies
cookieJwtAuth = (req, res, next) => {
  // On récupère le token dans le cookie
  const token = req.cookies['token'];

  console.log(token);

  // On vérifie le token avec la clé secrète
  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);

    // On ajoute les infos utilisateurs à la requete
    req.user = user;

    // On passe au middleware suivant
    next();
  } catch (err) {

    // Si le token n'est pas valide, on le supprime
    res.clearCookie("token");
    // Et on redirige vers la page de login (qui est aussi /)
    return res.redirect("/");
  }
};

// Méthode avec les headers, c'est à dire le jwt est envoyé 
// dans le header de la requete via Authorization: Bearer <token>

// const decodeToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//
//   On récupère la partie du header qui nous intéresse, c'est à dire le token
//   const token = authHeader.split(" ")[1];
//
//   On vérifie le token
//   try {
//     const decoded = jwt.verify(token, process.env.SECRET);
//
//     On ajoute l'id de l'utilisateur à la requete
//     req.userId = decoded.id;
//
//     On passe au middleware suivant
//     next();
//
//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };


module.exports = cookieJwtAuth;