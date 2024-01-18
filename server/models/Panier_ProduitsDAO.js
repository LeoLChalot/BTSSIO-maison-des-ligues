const DAOModel = require('./DAOModel');
class Panier_ProduitsDAO extends DAOModel {
   constructor() {
      super();
      this.table = 'panier_produits';
   }

   async find_and_group(connexion, id_panier) {
      try {
         const query = `
         SELECT 
            pp.*, 
            COUNT(pp.id_article) AS quantite_articles, 
            a.prix AS prix_unite
         FROM panier_produits pp
         JOIN articles a 
         ON pp.id_article = a.id_article
         WHERE pp.id_panier = ?
         GROUP BY pp.id_panier, pp.id_article, a.prix`;
         const rows = await connexion.query(query, [id_panier]);
         console.log(rows);
         return rows;
      } catch (error) {
         console.error('Error fetching articles:', error);
         throw error;
      }
   }
}

module.exports = Panier_ProduitsDAO;
