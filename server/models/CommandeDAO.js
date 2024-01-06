const DAOModel = require('./DAOModel');
class CommandesDAO extends DAOModel {
   constructor() {
      super();
      this.table = 'utilisateurs';
   }
}

module.exports = CommandesDAO;
