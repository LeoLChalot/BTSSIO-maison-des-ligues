require('dotenv').config();
const mysql = require('mysql2/promise');

class ConnexionDAO {
  static pool;

  static createPool() {
    if (!this.pool) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        connectionLimit: 20, // ajustez selon vos besoins
      });
    }
    return this.pool;
  }

  static async connect() {
    const pool = this.createPool();
    const connection = await pool.getConnection();
    return connection;
  }

  static disconnect(connection) {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = ConnexionDAO;
