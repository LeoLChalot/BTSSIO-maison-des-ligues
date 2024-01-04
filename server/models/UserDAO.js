const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const ConnexionDAO = require('./ConnexionDAO');

class UserDAO {
   constructor(
      id = uuidv4(),
      prenom,
      nom,
      pseudo,
      email,
      mot_de_passe,
      photo = null,
      is_admin = false,
      register_date = null
   ) {
      this.id_utilisateur = id;
      this.prenom = prenom;
      this.nom = nom;
      this.pseudo = pseudo;
      this.email = email;
      this.mot_de_passe = mot_de_passe;
      this.photo = photo;
      this.is_admin = is_admin;
      this.register_date = register_date;
   }

   async addUser(connexion) {
      const query =
         'INSERT INTO utilisateurs (id_utilisateur, prenom, nom, pseudo, email, mot_de_passe) VALUES(?, ?, ?, ?, ?, ?)';
      try {
         const values = [
            this.id_utilisateur,
            this.prenom,
            this.nom,
            this.pseudo,
            this.email,
            this.mot_de_passe,
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
      const query = 'SELECT * FROM utilisateurs';
      try {
         const [rows] = await connexion.query(query);
         return rows;
      } catch (error) {
         console.error('Error fetching users:', error);
         throw error;
      }
   }

   static async getUserByEmail(connexion, email) {
      const query = 'SELECT * FROM utilisateurs WHERE email = ?';
      try {
         const [rows] = await connexion.query(query, [email]);
         return rows;
      } catch (error) {
         console.error('Error fetching user by email:', error);
         throw error;
      }
   }

   static async getUserByPseudo(connexion, pseudo) {
      const query = 'SELECT * FROM utilisateurs WHERE pseudo = ?';
      try {
         const [rows] = await connexion.query(query, [pseudo]);
         const user = new UserDAO(
            rows[0].id_utilisateur,
            rows[0].prenom,
            rows[0].nom,
            rows[0].pseudo,
            rows[0].email,
            rows[0].mot_de_passe,
            rows[0].photo,
            rows[0].is_admin,
            rows[0].register_date
         );
         console.log(user);
         return user;
      } catch (error) {
         console.error('Error fetching user by pseudo:', error);
         throw error;
      }
   }

   static async getUserById(connexion, id) {
      const query = 'SELECT * FROM utilisateurs WHERE id = ?';
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

   getId() {
      return this.id_utilisateur;
   }

   getPrenom() {
      return this.prenom;
   }

   getNom() {
      return this.nom;
   }

   getPseudo() {
      return this.pseudo;
   }

   getEmail() {
      return this.email;
   }

   getMotDePasse() {
      return this.mot_de_passe;
   }

   // Setter methods
   setPrenom(prenom) {
      this.prenom = prenom;
   }

   setNom(nom) {
      this.nom = nom;
   }

   setPseudo(pseudo) {
      this.pseudo = pseudo;
   }

   setEmail(email) {
      this.email = email;
   }

   setMotDePasse(mot_de_passe) {
      this.mot_de_passe = bcrypt.hashSync(mot_de_passe, 10);
   }
}

module.exports = UserDAO;
