let largeurEcran = window.innerWidth;
let fontSize = "12px";
let nouvelleValeur;

window.addEventListener("resize", function () {
  largeurEcran = window.innerWidth;
   if (largeurEcran < 768) {
      fontSize = "12px"; // valeur pour les petits écrans
      document.documentElement.style.setProperty("--font-size", fontSize);
   } else if (largeurEcran >= 768 && largeurEcran < 1024){
      fontSize = "24px"; // valeur pour les grands écrans
      document.documentElement.style.setProperty("--font-size", fontSize);
   }
   // console.log(largeurEcran)
});

