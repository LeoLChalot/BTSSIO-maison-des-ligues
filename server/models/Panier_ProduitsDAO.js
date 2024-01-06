const DAOModel = require("./DAOModel");
class Panier_ProduitsDAO extends DAOModel {
   constructor() {
      super();
      this.table = 'utilisateurs';
   }
}

module.exports = Panier_ProduitsDAO;
