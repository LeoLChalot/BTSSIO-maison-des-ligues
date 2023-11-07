require('dotenv').config();
const express = require('express');
const app = express();
const questions = require('./questions.json');
const mysql = require('mysql2');
let cors = require('cors');
const PORT = 3000;

const connection = mysql.createConnection({
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   user: process.env.DB_USER,
   password: process.env.DB_PASS,
});

connection.connect((err) => {
   if (err) {
      console.log('Erreur de connexion : ' + err.stack);
      return;
   } else {
      console.log(`Connexion réussie à la BDD : ${process.env.DB_NAME}!`);
   }
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
   res.writeHead(200, { 'Content-Type': 'text/html' });
   res.end(`<h1>Quizz !</h1>`);
});

app.get('/boutique', async (req, res) => {
   const filtre = req.query.filtre;

   if (filtre) {
      console.log(filtre);
      try {
         let query = `SELECT id_categorie FROM categories WHERE nom = "${filtre.toLowerCase()}"`;
         let result = await connection.promise().query(query);
         const categorieId = await result[0][0]['id_categorie'];
         console.log(categorieId);
         query = `SELECT * FROM articles WHERE categorie = "${categorieId}"`;
         const listeArticle = await connection.promise().execute(query);
         res.status(200).json(listeArticle[0][0]);
      } catch (err) {
         throw err;
      }
   } else {
      try {
         const query = `SELECT * FROM articles`;
         const result = await connection.promise().query(query);
         res.status(200).json(result[0]);
      } catch (err) {
         throw err;
      }
   }
});

app.get('/question/:id', (req, res) => {
   const id = parseInt(req.params.id);
   try {
      Number.isInteger(id);
   } catch {
      res.status(404).end('<h1>Question invalide !</h1>');
   }
});

// * Add body{id,theme,question,reponse}
app.post('/question', (req, res) => {
   try {
      res.status(200).end('Question ajoutée !');
   } catch (err) {
      throw err;
   }
});

app.delete('/question/:id', (req, res) => {
   const id = parseInt(req.params.id);
   try {
      Number.isInteger(id);
      if (id < questions.length + 1 && id >= 0) {
         const laQuestion = questions.find((question) => question.id === id);
         questions.splice(questions.indexOf(laQuestion), 1);
         res.status(200).json(laQuestion);
      } else {
         res.status(404).end('<h1>Question introuvable !</h1>');
      }
   } catch {
      res.status(404).end('<h1>Question invalide !</h1>');
   }
});

app.put('/question/:id', (req, res) => {
   const id = parseInt(req.params.id);
   try {
      Number.isInteger(id);
      if (id < questions.length + 1 && id >= 0) {
         const question = questions.find((question) => question.id === id);
         question.theme = req.body.theme;
         question.question = req.body.question;
         question.reponse = req.body.reponse;
         res.status(200).json(question);
      } else {
         res.status(404).end('<h1>Question introuvable !</h1>');
      }
   } catch {
      res.status(404).end('<h1>Question invalide !</h1>');
   }
});

app.listen(PORT, () => {
   console.log(`Listen on port ${PORT}`);
});
