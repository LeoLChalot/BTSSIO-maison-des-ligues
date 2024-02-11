# Projet Activité Professionnelle: Application E-commerce pour l'Association Sportive de la Maison des Ligues de Lorraine

## Description
Ce projet est une activité professionnelle réalisée dans le cadre de mon BTS SIO à l'IPSSI. L'objectif est de développer une application web e-commerce en utilisant React.js pour le front-end et Node.js pour le back-end, destinée à l'association sportive de la Maison des Ligues de Lorraine. L'application permettra aux membres de l'association de parcourir et de une simuler l'achat de produits liés à leurs activités sportives, ainsi qu'à l'administration de gérer les produits, les commandes et les utilisateurs.

## Fonctionnalités
- Interface utilisateur conviviale permettant aux membres de l'association de parcourir les produits, de les ajouter au panier et de passer des commandes.
- Système d'authentification sécurisé pour les membres, avec des fonctionnalités telles que l'inscription et la connexion.
- Tableau de bord administratif permettant à l'administration de gérer les produits, les commandes et les utilisateurs, avec des fonctionnalités telles que l'ajout, la modification et la suppression.
- Fonctionnalités de recherche avancées pour permettre aux utilisateurs de trouver facilement les produits qu'ils recherchent.
- Gestion des stocks pour assurer la disponibilité des produits et éviter les commandes en rupture de stock.

## Technologies Utilisées
- **Front-end**: React, React Router Dom, Axios
- **Back-end**: Node.js, Express.js, MySQL
- **Authentification et Sécurité**: JSON Web Tokens (JWT), Bcrypt.js
- **Autres Outils**: Git/GitHub pour le contrôle de version, ESLint et Prettier pour le linting et le formatage du code, dotenv pour la gestion des variables d'environnement

## Installation
1. Cloner le repository GitHub sur votre machine locale.
2. Installer les dépendances front-end et back-end en exécutant `npm install` à la racine du dossier `app/` et `server`.
3. Configurer les variables d'environnement en créant un fichier `.env` et en y ajoutant les informations nécessaires (`PORT`,`DB_HOST`,`DB_NAME`,`DB_USER`,`DB_PASS` et `SECRET_KEY`).
4. Lancer le serveur front-end et back-end en exécutant `npm start` à la racine du dossier `app/` et `nodemon` à la racine du dossier `server`.

## Contributeurs
- Larou-Chalot Léo

## Licence
Ce projet n'est pas sous licence. Cela signifie que les lois sur les droits d'auteur s'appliquent par défaut, et de ce fait que personne ne peut reproduire, distribuer ou créer des œuvres dérivées de ce travail.
