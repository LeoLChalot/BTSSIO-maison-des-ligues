const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// +* Classes finies 
class Connection {
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

class Categorie {
   constructor(nom) {
      this.id_category = uuidv4();
      this.nom = nom;
   }

   static async getCategories() {
      try {
         const connection = Connection.connect();
         const sql = 'SELECT * FROM categories';
         const data = await connection.promise().query(sql);
         const categories = data[0];
         Connection.disconnect();
         return categories;
      } catch (error) {
         console.error('Error retrieving categories:', error);
         throw error;
      }
   }

   static async getCategorie(id_categorie) {
      try {
         const connection = Connection.connect();
         const sql = 'SELECT * FROM categories WHERE id_category = ?';
         const data = await connection.promise().query(sql, [id_categorie]);
         const category = data[0][0];
         Connection.disconnect();
         return category;
      } catch (error) {
         console.error('Error retrieving category:', error);
         throw error;
      }
   }

   static async addCategory(nom) {
      const id_categorie = uuidv4();
      try {
         const connection = Connection.connect();
         const query =
            'INSERT INTO categories (id_categorie, nom) VALUES (?, ?)';
         const result = await connection
            .promise()
            .query(query, [id_categorie, nom]);
         Connection.disconnect();
         return result;
      } catch (error) {
         console.error('Error adding category:', error);
         throw error;
      }
   }
   static async deleteCategory(id_category) {
      try {
         const connection = Connection.connect();
         const query = 'DELETE FROM categories WHERE id_categorie = ?';
         const result = await connection.promise().query(query, [id_category]);
         Connection.disconnect();
         return result;
      } catch (error) {
         console.error('Error deleting category:', error);
         throw error;
      }
   }
}

class Article {
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
         const connection = Connection.connect();
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
         const connection = Connection.connect();
         const query = 'SELECT * FROM articles WHERE id_article = ?';
         const result = await connection.promise().query(query, [id_article]);
         Connection.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }

   static async getArticlesByCategoryId(categoryId) {
      try {
         const connection = Connection.connect();
         const query = 'SELECT * FROM articles WHEREcategorie_id = ?';
         const result = await connection.promise().query(query, [categoryId]);
         Connection.disconnect();
         return result;
      } catch (error) {
         console.error('Error fetching articles by category id:', error);
         throw error;
      }
   }

   static async addArticle(article) {
      try {
         const values = [uuidv4(), ...Object.values(article)];
         const connection = Connection.connect();
         const query = 'INSERT INTO articles VALUES(?, ?, ?, ?, ?, ?, ?)';
         const result = await connection.promise().query(query, values);
         Connection.disconnect();
         return result;
      } catch (error) {
         console.error('Error adding article:', error);
         throw error;
      }
   }

   static async updateArticleById(updatedArticle) {
         try {
            const connection = Connection.connect();
            const values = [...Object.values(updatedArticle), updatedArticle.id_article];
            const query = 'UPDATE articles SET id_article = ?, nom = ?, photo = ?, description = ?, prix = ?, quantite = ?, categorie_id = ? WHERE id_article = ?';
            const result = await connection.promise().query(query, values);
            Connection.disconnect();
            return result;
         } catch (error) {
            console.error('Error updating article:', error);
            throw error;
         }
   }

   static async deleteArticleById(articleId) {
      try {
         const connection = Connection.connect();
         const query = 'DELETE FROM articles WHERE id_article = ?';
         const result = await connection.promise().query(query, [articleId]);
         Connection.disconnect();
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

// > Reste à completer
class User {
   constructor(firstName, lastName, pseudo, email, password) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.pseudo = pseudo;
      this.email = email;
      this.password = password;
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

class Panier {
   constructor() {
      this.articles = []; // tableau pour stocker les articles du panier
   }

   ajouterArticle(article) {
      this.articles.push(article); // ajouter un article au panier
   }

   supprimerArticle(article) {
      const index = this.items.indexOf(article);
      if (index > -1) {
         this.articles.splice(index, 1); // supprimer l'article du panier
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
   Categorie,
   Article,
   User,
   Panier,
};
