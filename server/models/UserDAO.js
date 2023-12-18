const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('./ConnexionDAO')

class UserDAO {
   constructor(firstName, lastName, pseudo, email, password) {
      this.prenom = firstName;
      this.nom = lastName;
      this.pseudo = pseudo;
      this.email = email;
      this.mot_de_passe = password;
   }

   static async createUser(firstName, lastName, pseudo, email, password) {
      try {
         const values = [
            uuidv4(),
            firstName,
            lastName,
            pseudo,
            email,
            password,
         ];
         const connexion = ConnexionDAO.connect();
         const query =
            'INSERT INTO utilisateurs (id_utilisateur, prenom, nom, pseudo, email, mot_de_passe) VALUES(?, ?, ?, ?, ?, ?)';
         const result = await connexion.promise().query(query, values);
         ConnexionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error creating user:', error);
         throw error;
      }
   }

   static async connectUser(login, password) {
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'SELECT * FROM utilisateurs WHERE pseudo = ? OR email = ?';
         const result = await connexion.promise().query(query, [login, login]);

         if (result[0].length === 0) {
            return null;
         }

         const user = result[0][0];
         const validPassword = await bcrypt.compare(
            password,
            user.mot_de_passe
         );
         if (!validPassword) {
            return null;
         }

         


         ConnexionDAO.disconnect();
         return user;
      } catch (error) {
         console.error('Error connecting user:', error);
         throw error;
      }
   }

   static async getAllUsers() {
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs';
         const result = await connexion.promise().query(query);
         ConnexionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching users:', error);
         throw error;
      }
   }

   static async getUserByEmail(email) {
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE email = ?';
         const result = await connexion.promise().query(query, [email]);
         ConnexionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching user by email:', error);
         throw error;
      }
   }

   static async getUserByPseudo(pseudo) {
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE pseudo = ?';
         const result = await connexion.promise().query(query, [pseudo]);
         ConnexionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching user by pseudo:', error);
         throw error;
      }
   }

   static async getUserById(id) {
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE id = ?';
         const result = await connexion.promise().query(query, [id]);
         ConnexionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching user by id:', error);
         throw error;
      }
   }

   static async deleteUserById(id) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'DELETE FROM utilisateurs WHERE id = ?';
         const result = await connexion.promise().query(query, [id]);
         ConnexionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error deleting user by id:', error);
         throw error;
      }
   }

   getFirstName() {
      return this.firstName;
   }

   getLastName() {
      return this.lastName;
   }

   getPseudo() {
      return this.pseudo;
   }

   getEmail() {
      return this.email;
   }

   getPassword() {
      return this.password;
   }

   // Setter methods
   setFirstName(firstName) {
      this.firstName = firstName;
   }

   setLastName(lastName) {
      this.lastName = lastName;
   }

   setPseudo(pseudo) {
      this.pseudo = pseudo;
   }

   setEmail(email) {
      this.email = email;
   }

   setPassword(password) {
      this.password = bcrypt.hashSync(password, 10);
   }
}

module.exports = UserDAO;
