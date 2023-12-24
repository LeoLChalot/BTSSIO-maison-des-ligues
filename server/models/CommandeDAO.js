const { v4: uuidv4 } = require('uuid');

const ConnexionDAO = require('./ConnexionDAO');

class CommandeDAO {
   constructor(id_panier,id_utilisateur, prix, date) {
      this.id_commande = id_panier;
      this.id_utilisateur = id_utilisateur;
      this.prix = prix;
      this.date = date;
   }

   static async getCommandes() {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'SELECT * FROM commandes';
         const result = await connexion.promise().query(query);
         ConnexionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching commandes:', error);
         throw error;
      }
   }

   static async getCommandeById(id_commande) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'SELECT * FROM commandes WHERE id_commande = ?';
         const result = await connexion.promise().query(query, [id_commande]);
         ConnexionDAO.disconnect();
         return result[0];
      } catch (error) {
         console.error('Error fetching commande:', error);
         throw error;
      }
   }

   async addCommande() {
      try {
         const connexion = ConnexionDAO.connect();
         const query =
            'INSERT INTO commandes (id_commande, id_utilisateur, date, total) VALUES (?, ?, ?, ?)';
         const result = await connexion
            .promise()
            .query(query, [
               this.id_commande,
               this.id_utilisateur,
               this.date,
               this.prix
            ]);
         ConnexionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error adding commande:', error);
         throw error;
      }
   }

   static async deleteCommande(id_commande) {
      try {
         const connexion = ConnexionDAO.connect();
         const query = 'DELETE FROM commandes WHERE id_commande = ?';
         const result = await connexion.promise().query(query, [id_commande]);
         ConnexionDAO.disconnect();
         return result;
      } catch (error) {
         console.error('Error deleting commande:', error);
         throw error;
      }
   }
}

module.exports = CommandeDAO;
