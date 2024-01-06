const DAOModel = require('./DAOModel');
class ArticleDAO extends DAOModel {
   constructor() {
      super();
      this.table = 'utilisateurs';
   }
}

module.exports = ArticleDAO;
