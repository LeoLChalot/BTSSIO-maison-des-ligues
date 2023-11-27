module.exports = (req, res, next) => {
   const oauth = req.headers.oauth;
   if (oauth != "admin") {
      res.status(401).send('Unauthorized');
      return;
   }
   next()   
};
