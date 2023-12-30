const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('./ConnexionDAO');

class UserDAO {
   constructor(
      id_utilisateur = uuidv4(),
      firstName,
      lastName,
      pseudo,
      email,
      password
   ) {
      this.id_utilisateur = uuidv4();
      this.prenom = firstName;
      this.nom = lastName;
      this.pseudo = pseudo;
      this.email = email;
      this.mot_de_passe = password;
   }

   static async addUser(connexion) {
      const query =
         'INSERT INTO utilisateurs (id_utilisateur, prenom, nom, pseudo, email, mot_de_passe) VALUES(?, ?, ?, ?, ?, ?)';
      try {
         const values = [
            this.id_utilisateur,
            this.firstName,
            this.lastName,
            this.pseudo,
            this.email,
            this.password,
         ];

         const result = await connexion.query(query, values);
         return result;
      } catch (error) {
         console.error('Error creating user:', error);
         throw error;
      }
   }

   static async login(connexion, login, password) {
      const query = 'SELECT * FROM utilisateurs WHERE pseudo = ? OR email = ?';
      try {
         const [rows] = await connexion.query(query, [login, login]);
         if (rows.length === 0) {
            return null;
         }
         const user = rows[0];
         const validPassword = await bcrypt.compare(
            password,
            user.mot_de_passe
         );
         if (!validPassword) {
            return null;
         }
         return user;
      } catch (error) {
         console.error('Error connecting user:', error);
         throw error;
      }
   }

   static async getAllUsers(connexion) {
      const query =
         'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs';
      try {
         const [rows] = await connexion.query(query);
         return rows;
      } catch (error) {
         console.error('Error fetching users:', error);
         throw error;
      }
   }

   static async getUserByEmail(connexion, email) {
      const query =
         'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE email = ?';
      try {
         const [rows] = await connexion.query(query, [email]);
         return rows;
      } catch (error) {
         console.error('Error fetching user by email:', error);
         throw error;
      }
   }

   static async getUserByPseudo(connexion, pseudo) {
      const query =
         'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE pseudo = ?';
      try {
         const [rows] = await connexion.query(query, [pseudo]);
         return rows;
      } catch (error) {
         console.error('Error fetching user by pseudo:', error);
         throw error;
      }
   }

   static async getUserById(connexion, id) {
      const query =
         'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE id = ?';
      try {
         const [rows] = await connexion.query(query, [id]);
         return rows;
      } catch (error) {
         console.error('Error fetching user by id:', error);
         throw error;
      }
   }

   static async deleteUserById(connexion, id) {
      const query = 'DELETE FROM utilisateurs WHERE id = ?';
      try {
         const result = await connexion.query(query, [id]);
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
