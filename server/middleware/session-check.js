sessionChecker = (req, res, next) => {    
    // On vient vérifier si la session existe 
    if (req.session) {
        console.log(`Session found ! Proceed`);
        // Si c'est on on passe au middleware suivant
        next();
    } else {
        // Sinon on redirige vers la page de login 
        console.log(`No User Session Found`);
        res.redirect('/login');
    }
};

module.exports = sessionChecker;