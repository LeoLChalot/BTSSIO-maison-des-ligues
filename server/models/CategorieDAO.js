const DAOModel = require('./DAOModel');
class CategorieDAO extends DAOModel {
   constructor() {
      super();
      this.table = 'utilisateurs';
   }
}

module.exports = CategorieDAO;
