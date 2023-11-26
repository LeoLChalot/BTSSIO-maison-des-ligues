module.exports = async (req, res, next) => {
   const params = req.body;
   Object.getOwnPropertyNames(params).filter((prop) => prop == 'id_article')
      .length != 0
      ? next()
      : res.status(403).send('Article introuvable');
};
