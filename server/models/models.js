const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

class ConnectionDAO {
   constructor() {
      this.connection = null;
   }

   static connect() {
      require('dotenv').config();
      const mysql = require('mysql2');
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

class CategorieDAO {
   constructor(nom) {
      this.id_category = uuidv4();
      this.nom = nom;
   }

   static async getCategories() {
      try {
         const connection = ConnectionDAO.connect();
         const sql = 'SELECT * FROM categories';
         const data = await connection.promise().query(sql);
         const categories = data[0];
         ConnectionDAO.disconnect();
         return categories;
      } catch (error) {
         console.error('Error retrieving categories:', error);
         throw error;
      }
   }

   static async getCategoryById(id_categorie) {
      try {
         const connection = ConnectionDAO.connect();
         const sql = 'SELECT * FROM categories WHERE id_categorie = ?';
         const data = await connection.promise().query(sql, [id_categorie]);
         const category = data[0][0];
         ConnectionDAO.disconnect();
         return category;
      } catch (error) {
         console.error('Error retrieving category:', error);
         throw error;
      }
   }

   static async getCategoryByName(nom) {
      try {
         const connection = ConnectionDAO.connect();
         const sql = 'SELECT * FROM categories WHERE nom = ?';
         const data = await connection.promise().query(sql, [nom]);
         const category = data[0][0];
         ConnectionDAO.disconnect();
         return category;
      } catch (error) {
         console.error('Error retrieving category:', error);
         throw error;
      }
   }

   static async addCategory(nom) {
      const id_categorie = uuidv4();
      try {
         const connection = ConnectionDAO.connect();
         const query =
            'INSERT INTO categories (id_categorie, nom) VALUES (?, ?)';
         const result = await connection
            .promise()
            .query(query, [id_categorie, nom]);
         ConnectionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error adding category:', error);
         throw error;
      }
   }
   static async deleteCategory(id_category) {
      try {
         const connection = ConnectionDAO.connect();
         const query = 'DELETE FROM categories WHERE id_categorie = ?';
         const result = await connection.promise().query(query, [id_category]);
         ConnectionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error deleting category:', error);
         throw error;
      }
   }
}

class ArticleDAO {
   constructor(id, title, description, photo, price, quantite, id_category) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.photo = photo;
      this.price = price;
      this.quantite = quantite;
      this.id_category = id_category;
   }

   static async getAllArticles() {
      try {
         const connection = ConnectionDAO.connect();
         const query = 'SELECT * FROM articles';
         const result = await connection.promise().query(query);
         connection.end();
         return result[0];
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   static async getArticleById(id_article) {
      try {
         const connection = ConnectionDAO.connect();
         const query = 'SELECT * FROM articles WHERE id_article = ?';
         const result = await connection.promise().query(query, [id_article]);
         ConnectionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   static async getArticlesByCategoryId(categoryId) {
      try {
         const connection = ConnectionDAO.connect();
         const query = 'SELECT * FROM articles WHEREcategorie_id = ?';
         const result = await connection.promise().query(query, [categoryId]);
         ConnectionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error fetching articles by category id:', error);
         throw error;
      }
   }

   static async addArticle(article) {
      try {
         const values = [uuidv4(), ...Object.values(article)];
         const connection = ConnectionDAO.connect();
         const query = 'INSERT INTO articles VALUES(?, ?, ?, ?, ?, ?, ?)';
         const result = await connection.promise().query(query, values);
         ConnectionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error adding article:', error);
         throw error;
      }
   }

   static async updateArticle(updatedArticle) {
      const {
         id_article,
         nom,
         photo,
         description,
         prix,
         quantite,
         categorie_id,
      } = updatedArticle;
      const query = `UPDATE articles SET id_article = ?, nom = ?, photo = ?, description = ?, prix = ?, quantite = ?, categorie_id = ? WHERE id_article = ?`;
      const result = await ConnectionDAO.connect()
         .promise()
         .query(query, [
            id_article,
            nom,
            photo,
            description,
            prix,
            quantite,
            categorie_id,
            id_article,
         ]);
      return result;
   }

   static async deleteArticleById(articleId) {
      try {
         const connection = ConnectionDAO.connect();
         let query = `SELECT quantite FROM articles WHERE id_article = ?`;
         let result = await connection.promise().query(getNumber, [articleId]);
         let quantite = result[0][0].quantite;
         if (quantite === 0) {
            return;
         } else {
            quantite = quantite - 1;
            query = 'UPDATE articles SET quantite = ? WHERE id_article = ?';
            result = await connection
               .promise()
               .query(query, [quantite, articleId]);
         }
         ConnectionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error deleting article:', error);
         throw error;
      }
   }

   // Getter methods
   getId() {
      return this.id;
   }

   getTitle() {
      return this.title;
   }

   getDescription() {
      return this.description;
   }

   getPrice() {
      return this.price;
   }

   // Setter methods
   setId(id) {
      this.id = id;
   }

   setTitle(title) {
      this.title = title;
   }

   setDescription(description) {
      this.description = description;
   }

   setPrice(price) {
      this.price = price;
   }
}

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
         const connection = ConnectionDAO.connect();
         const query =
            'INSERT INTO utilisateurs (id_utilisateur, prenom, nom, pseudo, email, mot_de_passe) VALUES(?, ?, ?, ?, ?, ?)';
         const result = await connection.promise().query(query, values);
         ConnectionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error creating user:', error);
         throw error;
      }
   }

   static async connectUser(login, password) {
      try {
         const connection = ConnectionDAO.connect();
         const query =
            'SELECT * FROM utilisateurs WHERE pseudo = ? OR email = ?';
         const result = await connection.promise().query(query, [login, login]);

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
         ConnectionDAO.disconnect();
         return user;
      } catch (error) {
         console.error('Error connecting user:', error);
         throw error;
      }
   }

   static async getAllUsers() {
      try {
         const connection = ConnectionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs';
         const result = await connection.promise().query(query);
         ConnectionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching users:', error);
         throw error;
      }
   }

   static async getUserByEmail(email) {
      try {
         const connection = ConnectionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE email = ?';
         const result = await connection.promise().query(query, [email]);
         ConnectionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching user by email:', error);
         throw error;
      }
   }

   static async getUserByPseudo(pseudo) {
      try {
         const connection = ConnectionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE pseudo = ?';
         const result = await connection.promise().query(query, [pseudo]);
         ConnectionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching user by pseudo:', error);
         throw error;
      }
   }

   static async getUserById(id) {
      try {
         const connection = ConnectionDAO.connect();
         const query =
            'SELECT prenom, nom, pseudo, email, register_date FROM utilisateurs WHERE id = ?';
         const result = await connection.promise().query(query, [id]);
         ConnectionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching user by id:', error);
         throw error;
      }
   }

   static async deleteUserById(id) {
      try {
         const connection = ConnectionDAO.connect();
         const query = 'DELETE FROM utilisateurs WHERE id = ?';
         const result = await connection.promise().query(query, [id]);
         ConnectionDAO.disconnect();
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

class PanierDAO {
   constructor() {
      this.id_panier = null;
      this.articles = []; // tableau pour stocker les articles du panier
      this.totalPrix = 0;
      this.nombreArticles = this.articles.length;
   }

   static async createPanier(id_utilisateur) {
      const id_panier = uuidv4();
      try {
         const connection = ConnectionDAO.connect();
         const query =
            'INSERT INTO panier (id_panier, id_utilisateur) VALUES (?, ?)';
         const result = await connection
            .promise()
            .query(query, [id_panier, id_utilisateur]);

         ConnectionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error creating panier:', error);
         throw error;
      }
   }

   static async getPanier(id_utilisateur) {
      try {
         const connection = ConnectionDAO.connect();
         const query = 'SELECT * FROM panier WHERE id_utilisateur = ?';
         const result = await connection
            .promise()
            .query(query, [id_utilisateur]);
         ConnectionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching panier:', error);
         throw error;
      }
   }

   static async addArticleToPanier(id_panier, id_article) {
      const article = await ArticleDAO.getArticleById(id_article);
      if (article) {
         console.log(article);
         this.articles += article[0];
         
         const id = uuidv4();
         try {
            const connection = ConnectionDAO.connect();
            const query =
               'INSERT INTO panier_produits (id, id_panier, id_article) VALUES (?, ?, ?)';
            const result = await connection
               .promise()
               .query(query, [id, id_panier, id_article]);
            ConnectionDAO.disconnect();
            return result;
         } catch (error) {
            console.error('Error creating panier:', error);
            throw error;
         }
      }
   }

   static async deleteArticleFromPanier(id_panier, id_article) {
      try {
         const connection = ConnectionDAO.connect();
         const query =
            'DELETE FROM panier_produits WHERE id_panier = ? AND id_article = ?';
         const result = await connection
            .promise()
            .query(query, [id_panier, id_article]);
         ConnectionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error deleting article from panier:', error);
         throw error;
      }
   }

   viderPanier() {
      this.articles = []; // vider le panier
   }

   getNombreArticles() {
      return this.items.length; // obtenir le nombre d'articles dans le panier
   }

   getTotalPrix() {
      let total = 0;
      for (let i = 0; i < this.articles.length; i++) {
         total += this.articles[i].prix; // calculer le prix total du panier
      }
      return total;
   }
}

module.exports = {
   CategorieDAO,
   ArticleDAO,
   UserDAO,
   PanierDAO,
};
