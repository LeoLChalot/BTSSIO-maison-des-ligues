module.exports = (req, res, next) => {
   console.log(req.body);
   const isAdmin = req.body.isAdmin;
   console.log(isAdmin);
   if (isAdmin == 1) {
      next();
   } else {
      console.log('status 401 - Non autorisé');
      res.status(401).send(
         'Oops il semblerait que vous ne soyez pas autorisé à vous trouver ici'
      );
   }
};
