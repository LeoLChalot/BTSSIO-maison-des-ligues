const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('./ConnexionDAO')

class UserDAO {
   constructor(id_utilisateur = uuidv4(), firstName, lastName, pseudo, email, password) {
      this.id_utilisateur = uuidv4();
      this.prenom = firstName;
      this.nom = lastName;
      this.pseudo = pseudo;
      this.email = email;
      this.mot_de_passe = password;
   }

   static async addUser() {
      try {
         const values = [
            this.id_utilisateur,
            this.firstName,
            this.lastName,
            this.pseudo,
            this.email,
            this.password,
         ];
         const connexion = ConnexionDAO.connect();
         const query =
            'INSERT INTO utilisateurs (id_utilisateur, prenom, nom, pseudo, email, mot_de_passe) VALUES(?, ?, ?, ?, ?, ?)';
         const result = await connexion.promise().query(query, values);
         return result;
      } catch (error) {
         console.error('Error creating user:', error);
         throw error;
      }finally {
         ConnexionDAO.disconnect();
      }
   }

static async login(login, password) {
   try {
      const connexion = ConnexionDAO.connect();
      const query =
         'SELECT * FROM utilisateurs WHERE pseudo = ? OR email = ?';
      const [rows] = await connexion.promise().query(query, [login, login]);

      if (rows.length === 0) {
         return null;
      }
      
      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.mot_de_passe);
      if (!validPassword) {
         return null;
      }
      return user;
   } catch (error) {
      console.error('Error connecting user:', error);
      throw error;
   } finally {
      ConnexionDAO.disconnect();
   }
}

static async getAllUsers() {
   try {
      const connexion = ConnexionDAO.connect();
      const query =
         'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs';
      const [rows] = await ConnexionDAO.promise().query(query);
      return rows;
   } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
   } finally {
      ConnexionDAO.disconnect();
   }
}

   static async getUserByEmail(email) {
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE email = ?';
         const [rows] = await connexion.promise().query(query, [email]);
         return rows;
      } catch (error) {
         console.error('Error fetching user by email:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   static async getUserByPseudo(pseudo) {
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE pseudo = ?';
         const [rows] = await connexion.promise().query(query, [pseudo]);
         return rows;
      } catch (error) {
         console.error('Error fetching user by pseudo:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   static async getUserById(id) {
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE id = ?';
         const [rows] = await connexion.promise().query(query, [id]);
         return rows;
      } catch (error) {
         console.error('Error fetching user by id:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   static async deleteUserById(id) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'DELETE FROM utilisateurs WHERE id = ?';
         const result = await connexion.promise().query(query, [id]);
         return result;
      } catch (error) {
         console.error('Error deleting user by id:', error);
         throw error;
      } finally {
         ConnexionDAO.disconnect();
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
