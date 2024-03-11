-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 14 fév. 2024 à 23:20
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

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
  `id_article` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nom` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `photo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'images\\no-image.png',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `prix` float(10,2) NOT NULL,
  `quantite` int NOT NULL,
  `categorie_id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_article`),
  UNIQUE KEY `nom` (`nom`),
  KEY `categorie_id` (`categorie_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `articles`
--

INSERT INTO `articles` (`id_article`, `nom`, `photo`, `description`, `prix`, `quantite`, `categorie_id`) VALUES
('690b7f6a-79ec-475d-86f8-ee87aee59e29', 'Ballon cecifoot sonore', 'images\\2d84ff09-9d08-4fef-a1e7-bc3131fe7c97.png1707948615199.png', 'La pratique du football en salle pour les mal-voyants', 28.50, 100, '193560de-2ae1-432c-afcf-e48f001ab660'),
('92138bf1-af8c-4f52-a697-1f74df584ad5', 'Ballon de football hybride fifa basic', 'images\\image_pixl.jpg1707948544169.jpg', 'Homologué par la FIFA pour vos entraînements et compétitions, nous avons conçu le F500 hybride, un ballon associant un bon confort d\'utilisation et résistance.', 11.40, 100, '193560de-2ae1-432c-afcf-e48f001ab660'),
('a2c3b01d-c43e-44c5-b2e7-194b46494506', 'Chasuble ajouree simple jaune fluo', 'images\\8653467_20201123093707-large..jpg1707947946127.jpg', 'Conçu pour constituer et différencier rapidement deux équipes en sports collectifs', 2.40, 100, '413875cb-cbc1-4971-8c72-e2e7e86219bf'),
('007162c3-795a-4278-aae6-c4fd44e142a6', 'Kit d entrainement modulaire plots lestés', 'images\\_20191003154451-large..jpg1707945553174.jpg', 'Conçu pour vos entraînements, pour des exercices rythmiques et de coordination motrice.', 50.00, 100, '413875cb-cbc1-4971-8c72-e2e7e86219bf'),
('45ab42f9-5d3d-4668-92b3-b52b2b6763ce', 'Chasubles numérotées 1 à 10 orange', 'images\\_20191009155859-large..jpg1707947029563.jpg', 'Conçues pour constituer et différencier rapidement deux équipes en sports collectifs', 36.00, 100, '413875cb-cbc1-4971-8c72-e2e7e86219bf'),
('232c3b2a-4ff2-4257-bda2-03179d785723', 'Kit d entrainement essentiel', 'images\\kit_dentrainement.jpg1707943733041.jpg', 'Conçu pour vos entraînements, pour des exercices rythmiques et de coordination motrice.', 30.00, 100, '413875cb-cbc1-4971-8c72-e2e7e86219bf'),
('160b484d-f51a-49ad-bec6-7a9eab468536', 'Ballon de futsal fs900', 'images\\image_pixl_(1).jpg1707948835701.jpg', 'Nous avons développé ce ballon pour les joueurs de Futsal qui maîtrisent tous les gestes techniques, recherchant un ballon résistant et précis.\r\nNos équipes de conception ont développé le ballon de Futsal FS900 cousu main et homologué FIFA Quality Pro pour une résistance optimale et un jeu à haute intensité.', 25.00, 100, '193560de-2ae1-432c-afcf-e48f001ab660'),
('d412570b-cfd2-4002-8c12-d4b51383a589', 'Vtc enfant riverside 100 20 pouces', 'images\\image_pixl-_1_.jpg1707948977728.jpg', 'Nous avons conçu ce vélo tout chemin pour les enfants de 6 à 9 ans (120 à 135 cm) souhaitant se balader dans les parcs urbains ou chemins aménagés.\r\nPour découvrir les premières balades à vélo sur tous les chemins, ce VTC enfant 20 pouces est robuste et simple d\'utilisation (1 seule vitesse)', 160.00, 50, 'f382d66b-1d13-4b50-b2b2-0172a8f372ad'),
('5ee8e6eb-78b5-4c58-be54-1f794fd289ff', 'Vélo pliant électrique', 'images\\image_pixl-_2_.jpg1707949110433.jpg', 'Très confortable pour se déplacer régulièrement en ville ou se balader. Il se stocke facilement chez soi, dans un coffre de voiture ou de camping-car.\r\nGrâce à ses roues de 20\", son cadre acier, sa potence et tige de selle réglables, ses accessoires (porte-bagage), son autonomie jusqu\'à 50km, il est le compagnon idéal pour de confortables balades.', 1099.00, 30, 'f382d66b-1d13-4b50-b2b2-0172a8f372ad'),
('321eeff5-5be6-4d1d-880e-da9099df60b5', 'Vélo vtt st 120 femme', 'images\\image_pixl-_3_.jpg1707949214965.jpg', 'Conçu pour vos premiers randonnées VTT, par temps sec, jusqu\'à 1h30.\r\nUn VTT performant et facile ! Aux commandes du VTT ST 120, vous vous sentez précis et léger grâce au mono plateau (1x9 vitesses) et à ses freins à disque mécaniques. Adaptez votre vitesse facilement.', 359.00, 50, 'f382d66b-1d13-4b50-b2b2-0172a8f372ad'),
('96289f22-803c-4123-b1d8-fa8e1591bf58', 'Kettlebell 8kg', 'images\\8662630_20210125182621-large..jpg1707949280706.jpg', 'La gamme de kettlebells Sveltus en fonte avec revêtement vinyle est conçue pour les cours collectifs et entraînements intensifs.\r\nAlliez renforcement musculaire et cardio !<br>Les entraînements avec KETTLEBELL vous apportent, plus de force, plus de puissance et aussi plus de souplesse et de résistance.', 28.00, 299, 'b9a2e2eb-3847-4b27-8f9c-c8d1c4c813d5'),
('2c4444b5-8774-408f-93be-79e0b0462c24', 'Cage de musculation cross-training', 'images\\8564931_20200828102758-large..jpg1707949346151.jpg', 'Conçu pour les exercices et les circuits de cross training.\r\nCage idéale pour le cross training avec barre de traction sur la partie haute de la cage.', 530.00, 15, 'b9a2e2eb-3847-4b27-8f9c-c8d1c4c813d5'),
('73594180-bd4c-416b-a38e-fcb360303321', 'Kit haltères de musculation 20kg', 'images\\image_pixl-_4_.jpg1707949447473.jpg', 'Ce kit haltères 20 kg permet la réalisation de nombreux exercices de musculation à domicile. Ajoutez des poids sur l\'haltère au fil de vos progrès.\r\nFacile à ranger et à transporter grâce à sa valise, ce kit haltères comprend 2 barres courtes et 12 poids (8x1kg + 4x2 kg). Sécurité assurée avec les barres filetées et ses poids tenus par un écrou.', 55.00, 100, 'b9a2e2eb-3847-4b27-8f9c-c8d1c4c813d5'),
('3927e11f-7014-4033-b348-00a0a23e73b6', 'Raquette de tennis adulte', 'images\\image_pixl-_5_.jpg1707949552054.jpg', 'Cette raquette a été conçue pour les joueurs et joueuses de tennis confirmés à la recherche d\'une raquette polyvalente.\r\nLa Wilson Blade 101L V8.0 est une version légère et au tamis plus grand. Elle conserve le contrôle emblématique de la série Blade en apportant ainsi plus de puissance et de tolérance.', 135.00, 100, '836256e6-ada2-48ad-be9d-61beb27e0aaf'),
('3c0854f4-b3c8-4a64-a3a4-f3cd9b8ed405', 'Raquette de tennis adulte aero', 'images\\image_pixl-_6_.jpg1707949652428.jpg', 'Cette raquette est conçue pour les joueurs et joueuses de tennis confirmés à la recherche de prise d\'effets et maniabilité.\r\nLa gamme innovante EVO de Babolat permet de profiter des avantages de la gamme Pure, avec plus de confort et plus de légèreté. Idéale pour les joueurs recherchant plus de polyvalence, avec de l\'effet', 130.00, 100, '836256e6-ada2-48ad-be9d-61beb27e0aaf'),
('58e8fc2e-daa3-4bb5-b007-1fb55e6a2cc1', 'Raquette de tennis adulte - tr960', 'images\\image_pixl-_7_.jpg1707949802507.jpg', 'Nos concepteurs ont développé cette raquette en collaboration avec Gaël Monfils pour les joueurs de tennis experts à la recherche de contrôle. Vendue non cordée\r\nLa TR960 CONTROL Pro est une raquette de 300g qui vous procure une sensation de stabilité à l\'impact et de contrôle tout en restant assez polyvalente. Raquette vendue non cordée.', 110.00, 60, '836256e6-ada2-48ad-be9d-61beb27e0aaf');

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id_categorie` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_categorie`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id_categorie`, `nom`) VALUES
('413875cb-cbc1-4971-8c72-e2e7e86219bf', 'Sports d\'extérieur'),
('193560de-2ae1-432c-afcf-e48f001ab660', 'Sports Co'),
('f382d66b-1d13-4b50-b2b2-0172a8f372ad', 'Vélos et sports urbains'),
('b9a2e2eb-3847-4b27-8f9c-c8d1c4c813d5', 'Musculation'),
('836256e6-ada2-48ad-be9d-61beb27e0aaf', 'Sports de raquettes'),
('7452c0f2-14f3-49f0-a9da-6b931638598a', 'Sports nautiques'),
('3b77cb56-b472-4ea8-9d88-e35686ccd760', 'Sport de combat');

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
CREATE TABLE IF NOT EXISTS `commandes` (
  `id` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `id_utilisateur` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `id_commande` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `prix_commande` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_utilisateur` (`id_utilisateur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `details_commandes`
--

DROP TABLE IF EXISTS `details_commandes`;
CREATE TABLE IF NOT EXISTS `details_commandes` (
  `id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_general_ci NOT NULL,
  `id_commande` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `id_article` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `quantite` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_article` (`id_article`),
  KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

DROP TABLE IF EXISTS `panier`;
CREATE TABLE IF NOT EXISTS `panier` (
  `id_panier` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `id_utilisateur` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_panier`),
  KEY `id_utilisateur` (`id_utilisateur`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `panier`
--

INSERT INTO `panier` (`id_panier`, `id_utilisateur`, `date`) VALUES
('0c6ed870-371f-4625-a266-0c6a3cbeb8a0', 'a89d7922-5546-41fb-8c57-913782f35d4e', '2024-02-14 21:31:18'),
('6b425798-348c-49f0-aac8-b00d076fcc8e', '7a4609f3-b825-4abb-973f-9477384f467d', '2024-02-14 21:26:03');

-- --------------------------------------------------------

--
-- Structure de la table `panier_produits`
--

DROP TABLE IF EXISTS `panier_produits`;
CREATE TABLE IF NOT EXISTS `panier_produits` (
  `id` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `id_panier` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `id_article` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_article` (`id_article`),
  KEY `id_panier` (`id_panier`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `panier_produits`
--

INSERT INTO `panier_produits` (`id`, `id_panier`, `id_article`) VALUES
('eaa1ef9e-beb7-4052-ae22-894e68dc0f21', '6b425798-348c-49f0-aac8-b00d076fcc8e', '96289f22-803c-4123-b1d8-fa8e1591bf58');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id_utilisateur` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `prenom` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `pseudo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mot_de_passe` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `pseudo` (`pseudo`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id_utilisateur`, `prenom`, `nom`, `pseudo`, `email`, `mot_de_passe`, `is_admin`, `register_date`) VALUES
('7a4609f3-b825-4abb-973f-9477384f467d', 'Leo', 'Larou-Chalot', 'LeoLChalot', 'l.larouchalot@gmail.com', '$2a$10$k/rib9Vgy8WH1GF70Ik/fONdtG07IgBPyXFF15jDPP1xN.VCUcl8K', 1, '2023-11-09 16:07:39'),
('a89d7922-5546-41fb-8c57-913782f35d4e', 'Test', 'User', 'usertest', 'user@example.com', '$2a$10$DJx3DinDxW/woOBtlTxrpups9Getk7YNPBhnqszsmIJgdmj3LhTY2', 0, '2024-02-14 21:17:40');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
