const DAOModel = require('./DAOModel');
class Panier_ProduitsDAO extends DAOModel {
   constructor() {
      super();
      this.table = 'panier_produits';
   }
}

module.exports = Panier_ProduitsDAO;
