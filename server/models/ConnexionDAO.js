require('dotenv').config();
const mysql = require('mysql2');
class ConnexionDAO {
  constructor() {
     this.connection = null;
  }

  static connect() {
     this.connection = mysql.createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
     });

     this.connection.connect((err) => {
        if (err) {
           console.log('Erreur de connexion : ' + err.stack);
           return;
        } else {
           console.log(`Connexion réussie à la BDD : ${process.env.DB_NAME}!`);
        }
     });
     return this.connection;
  }

  static disconnect() {
     this.connection.end((err) => {
        if (err) {
           console.log('Erreur lors de la déconnexion : ' + err.stack);
           return;
        } else {
           console.log('Déconnexion réussie de la BDD !');
        }
     });
  }
}

module.exports = ConnexionDAO