-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 31 déc. 2023 à 01:38
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `m2l`
--

-- --------------------------------------------------------

--
-- Structure de la table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `id_article` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `photo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'images\\no-image.png',
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `prix` float(10,2) NOT NULL,
  `quantite` int NOT NULL,
  `categorie_id` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_article`),
  UNIQUE KEY `nom` (`nom`),
  KEY `categorie_id` (`categorie_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `articles`
--

INSERT INTO `articles` (`id_article`, `nom`, `photo`, `description`, `prix`, `quantite`, `categorie_id`) VALUES
('11dac32f-c4f2-46db-a850-14f00e3004e8', 'Raquette badminton Babolat First II', 'images\\260228-Raquette-badminton-Babolat-First-II-1.jpg1703699232799.jpg', 'La raquette de badminton Babolat First 2 permet d’accompagner les élèves de collèges et de lycées dans leurs progressions en EPS et pour les premières compétitions d’AS.\r\nC’est une raquette souple, avec une tête isométrique en aluminium et une tige en graphite.', 25.95, 5, 'f382d66b-1d13-4b50-b2b2-0172a8f372ad'),
('a7ff2614-03f3-4956-9f63-5ebd581760ac', 'Raquette badminton Arrowspeed 199', 'images\\Raquette-badminton-Talbot-Torro-Arrowspeed-199-Mt-439881-1.jpg1703698817364.jpg', 'La raquette de badminton Arrowspeed 199 est particulièrement adaptée aux séances d’EPS et au sport scolaire', 18.95, 100, 'f382d66b-1d13-4b50-b2b2-0172a8f372ad'),
('6f9f0dda-5b42-4838-8e58-31448d612854', 'Chaussures d’Athlétisme à Pointes', 'images\\ref.-143001-Chaussure-a-pointes-dathletisme.jpg1703699484113.jpg', 'Chaussures d’athlétisme à pointes\r\nProduit très polyvalent, pour le cross et la piste.\r\nLivré avec une housse de transport, 2 jeux de pointes (6 et 12mm) et 1 clé.', 34.95, 10, '193560de-2ae1-432c-afcf-e48f001ab660'),
('c4a1c009-7818-48d5-8577-b7abdef11f83', 'Haie de Vélocité – Athlétisme Course', 'images\\r_141008-Haie-vÃ©locitÃ©.png1703699744493.png', 'Haie de vélocité en PVC, pratique et facile à transporter.\r\nLargeur 50cm.\r\n4 hauteurs disponibles : 15 cm – 30 cm – 40 cm – 50 cm.\r\nVendue à l’unité.', 8.95, 2, '193560de-2ae1-432c-afcf-e48f001ab660'),
('6a565b19-1ab7-4cfd-928c-2b8865934b24', 'LUNETTES DE NATATION AIR-BOLD SWIPE VERRES MIROIRS', 'images\\ftp_m_magentoproduct_photos006832200_001_xl.webp1703958800577.undefined', 'Nage sportive Technologie Swipe Coupe parfaite', 51.90, 5, '413875cb-cbc1-4971-8c72-e2e7e86219bf');

-- --------------------------------------------------------

--
-- Structure de la table `authentication`
--

DROP TABLE IF EXISTS `authentication`;
CREATE TABLE IF NOT EXISTS `authentication` (
  `id_utilisateur` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `refresh_token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id_categorie` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_categorie`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id_categorie`, `nom`) VALUES
('413875cb-cbc1-4971-8c72-e2e7e86219bf', 'Natation'),
('193560de-2ae1-432c-afcf-e48f001ab660', 'Course'),
('f382d66b-1d13-4b50-b2b2-0172a8f372ad', 'Raquettes'),
('b9a2e2eb-3847-4b27-8f9c-c8d1c4c813d5', 'Combat'),
('836256e6-ada2-48ad-be9d-61beb27e0aaf', 'Catégorie 6'),
('7452c0f2-14f3-49f0-a9da-6b931638598a', 'Catégorie 7'),
('3b77cb56-b472-4ea8-9d88-e35686ccd760', 'Catégorie 9');

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
CREATE TABLE IF NOT EXISTS `commandes` (
  `id_commande` int NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_commande`),
  KEY `id_utilisateur` (`id_utilisateur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `details_commandes`
--

DROP TABLE IF EXISTS `details_commandes`;
CREATE TABLE IF NOT EXISTS `details_commandes` (
  `id` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `id_commande` int NOT NULL,
  `id_article` int NOT NULL,
  `quantite` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_article` (`id_article`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `oauth`
--

DROP TABLE IF EXISTS `oauth`;
CREATE TABLE IF NOT EXISTS `oauth` (
  `id_utilisateur` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `refresh_token` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_utilisateur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `oauth`
--

INSERT INTO `oauth` (`id_utilisateur`, `refresh_token`) VALUES
('7a4609f3-b825-4abb-973f-9477384f467d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdhNDYwOWYzLWI4MjUtNGFiYi05NzNmLTk0NzczODRmNDY3ZCIsInN0YXR1cyI6ImFkbWluIiwiaWF0IjoxNzAzMTAzMTczLCJleHAiOjE3MDM3MDc5NzN9.Ca8RxVtJcDxBN3iY5oTc06IARw-MIZCTrrve1Pq3FW4'),
('b45ef7af-d6a9-439f-adde-9e7f84194baf', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0NWVmN2FmLWQ2YTktNDM5Zi1hZGRlLTllN2Y4NDE5NGJhZiIsInN0YXR1cyI6InVzZXIiLCJpYXQiOjE3MDMxNDY2MzgsImV4cCI6MTcwMzc1MTQzOH0.WzygmtUVJULSvslSOwb-hUt_7K1Tc4gExjB0S84Pncs');

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

DROP TABLE IF EXISTS `panier`;
CREATE TABLE IF NOT EXISTS `panier` (
  `id_panier` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `id_utilisateur` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `prix` float NOT NULL DEFAULT '0',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ordered` varchar(25) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'waiting',
  PRIMARY KEY (`id_panier`),
  KEY `id_utilisateur` (`id_utilisateur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `panier`
--

INSERT INTO `panier` (`id_panier`, `id_utilisateur`, `prix`, `date`, `ordered`) VALUES
('aec488b3-0a00-4b2e-abe3-3fd4103f8fbc', '7a4609f3-b825-4abb-973f-9477384f467d', 0, '2023-12-30 14:54:47', 'waiting');

-- --------------------------------------------------------

--
-- Structure de la table `panier_produits`
--

DROP TABLE IF EXISTS `panier_produits`;
CREATE TABLE IF NOT EXISTS `panier_produits` (
  `id` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `id_panier` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `id_article` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_article` (`id_article`),
  KEY `id_panier` (`id_panier`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `panier_produits`
--

INSERT INTO `panier_produits` (`id`, `id_panier`, `id_article`) VALUES
('2303bc14-412c-44c0-b599-8a5c40431ba1', 'aec488b3-0a00-4b2e-abe3-3fd4103f8fbc', '6f9f0dda-5b42-4838-8e58-31448d612854'),
('f72551a5-85ff-4269-b9c4-2a2c7f4562ac', 'aec488b3-0a00-4b2e-abe3-3fd4103f8fbc', '6a565b19-1ab7-4cfd-928c-2b8865934b24'),
('4ca6dc6b-7dc5-42dd-b1a6-c0c8876891f7', 'aec488b3-0a00-4b2e-abe3-3fd4103f8fbc', '6a565b19-1ab7-4cfd-928c-2b8865934b24'),
('9a9e6495-0edd-4ab8-a637-a3f247aefdbf', 'aec488b3-0a00-4b2e-abe3-3fd4103f8fbc', 'c4a1c009-7818-48d5-8577-b7abdef11f83'),
('2002a8e1-b91d-4a1e-9a58-c4039e3c225e', 'aec488b3-0a00-4b2e-abe3-3fd4103f8fbc', '6f9f0dda-5b42-4838-8e58-31448d612854');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id_utilisateur` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `prenom` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pseudo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `mot_de_passe` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `photo_de_profil` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `pseudo` (`pseudo`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id_utilisateur`, `prenom`, `nom`, `pseudo`, `email`, `mot_de_passe`, `photo_de_profil`, `is_admin`, `register_date`) VALUES
('7a4609f3-b825-4abb-973f-9477384f467d', 'Leo', 'Larou-Chalot', 'LeoLChalot', 'l.larouchalot@gmail.com', '$2a$10$k/rib9Vgy8WH1GF70Ik/fONdtG07IgBPyXFF15jDPP1xN.VCUcl8K', '', 1, '2023-11-09 16:07:39'),
('b45ef7af-d6a9-439f-adde-9e7f84194baf', 'John', 'Doe', 'JohnDoe', 'john.doe@gmail.com', '$2a$10$A3iFBOo3nvxk5aRk3ewt.eCkTh78chTEFgTTpv9M2O8/ydDG3NSEG', '', 0, '2023-11-09 17:22:48'),
('4ec48f98-8ba2-49ae-91fb-b503884833f9', 'Florent', 'Bernier', 'fbernier', 'florentbernier@gmail.com', '$2a$10$c7/EqW/Kml1rJbVVPGuV.ekHre0fx3i7X4nAftxqF2Fen440wnS4i', '', 0, '2023-11-09 17:28:23'),
('41f2f062-326c-441c-a10f-e65e3937734a', 'userFirstName', 'userLastName', 'User', 'user@mail.com', '$2a$10$MUQ7vP4ZLdxvPrwuwCrxUO70rBch0wjqqWIgmpyvyHdsWtOGmpxJy', '', 0, '2023-11-26 18:16:47'),
('ca770102-5ed0-44d5-9bfe-aa6e054240ef', 'Jane', 'Doe', 'janedoe', 'janedoe@mali.com', '$2a$15$bOFnqzVtqz6OPskvj9x/R.B5f6svXkxl2T/6lYRxjiuyloY65HsLG', '', 0, '2023-12-07 16:21:11');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
