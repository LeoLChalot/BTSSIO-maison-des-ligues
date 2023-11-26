
const { v4, validate } = require('uuid');
const express = require('express');
const app = express();
const axios = require('axios').default;
let cors = require('cors');
const { uuid } = require('uuidv4');
const PORT = 3000;

const isAdmin = require('./middleware/is-admin');
const routesBoutique = require('./routes/boutique');
const routesLoginOut = require('./routes/user-connexion');
const routesAdmin = require('./routes/admin');


app.use(express.json());

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   );
   res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
   );
   next();
});


// ? Router inscription / connexion
app.use('/m2l/user', routesLoginOut);

// ? Router Boutique
app.use('/m2l/boutique', routesBoutique)

// ? Router Admin
app.use('/m2l/admin', isAdmin, routesAdmin);



// app.use('/admin', isAdmin);
app.get('/admin', async (req, res) => {
   res.status(200).send(`Bienvenue Admin`);
});

app.get('/dashboard/:view', async (req, res) => {
   const view = req.params.view;
   res.status(200).send(`Dashboard ${view}`);
});

app.listen(PORT, () => {
   console.log(`Listen on port ${PORT}`);
});
