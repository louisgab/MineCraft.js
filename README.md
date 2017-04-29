<p align="center"><img src="https://minecraftjs2017.herokuapp.com/img/logo.png"></p>
<p align="center">MineCraft.Js est un jeu multijoueur ayant pour objectif de ressembler au célèbre <a href="https://minecraft.net/">MineCraft</a> dans une version 2D dans le navigateur.
</p>



## Installation
#### Technologies nécessaires

- HTML5 / CSS3 / Javascript (testé avec Chrome 57).
- Node.js (pour le serveur multijoueur).
- Npm (pour la gestion de paquets) avec Socket.io (pour la communication serveur) et Express (pour gérer plus facilement les routes étant donné le nombre important de fichiers externes).
---
#### Démarrage

- Si besoin, modifiez vos préférences dans le fichier `config.json` (ip, port, dimensions).
- Téléchargez les dépendances avec `npm install`.
- Lancez le serveur avec `npm start`.
- Le jeu sera accessible à l'adresse `http://localhost:8080` par défaut.

#### Démonstration

Le jeu est déployé à l'adresse [https://minecraftjs2017.herokuapp.com/](https://minecraftjs2017.herokuapp.com/) (compte heroku gratuit, serveur un peu lent).



## Règles du jeu
#### But

Minecraft est un jeu de type "bac à sable" c'est à dire que le joueur est complétement libre de définir ses propres objectifs selon sa créativité. Les possibilités sont normalement : exploration, collecte de ressources, artisanat et combat.

#### Contrôles

Déplacez-vous au moyen des touches directionnelles `haut`, `bas`, `gauche`, `droite`. Faites défiler votre inventaire en scrollant (inutile pour l'instant).



## Fonctionnalités
#### Implémentées...

- Gestion multijoueur en temps réel avec gestion des connexions/déconnexions et des pertes de connexion.
- Adaptation de la zone de jeu à la taille de l'écran (Responsive design).
- Préchargement des images avec pixellisation forcée.
- Animation possible avec Stop&Go.
- Exploration du monde avec "camera" suivant le joueur.
- Gestion des collisions avec auto-jump et chute.
- Génération aléatoire du monde avec des caves.
- Contrôle clavier et souris.
- Construction et destruction du terrain dans le périmetre d'action (2 cases alentours).

#### ... Et à implémenter
- Animation pixel par pixel pour des déplacements, des chutes et des sauts fluides.
- Inventaire et collecte des ressources.
- Chat et commandes textuelles.
- Artisanat, mode survie, ennemis et combat...



## Architecture

A la racine du répertoire, il y a le fichier `serveur.js` où se déroule la gestion serveur qui se charge d'appeler les fonctions de traitement situées dans le fichier `game.js`. Notamment,
Il y a également deux fichiers de configuration `config.json` et `sources.js` contenant respectivement les variables essentielles du jeu et les urls des graphismes.

Enfin, le fichier `index.html` correspond à la partie client. Toutes les ressources nécessaires se trouvent dans le dossier `public`, lui-même divisé en 3 dossiers correspondant au type de fichier. Dans le dossier `js`, il y a le fichier principal `client.js` ainsi que les différents modules.



## Répartition tes tâches

Bien qu'au début du projet nous nous étions attribués des tâches spécifiques (gestion multijoueur par Louis-Gabriel, grille de jeu par Alex), très vite nous avons basculé dans un mode simultanné en travaillant conjointement sur chaque fonctionnalité pour éviter de devoir attendre et dépendre des choix d'implémentation de l'autre. Ainsi, la quasi-totalité du code a été réalisé en étroite collaboration.



## Crédits

Les graphismes sont issus des ressources suviantes :
- Pack de textures téléchargé sur  [MineCraftForum](http://www.minecraftforum.net/forums/mapping-and-modding/resource-packs/resource-pack-discussion/1249790-16x-32x-64x-1-8-the-default-texture-files?comment=1).
- Logo généré par [TextCraft](https://textcraft.net/).

Certains bouts de code ont été inspirés ou adaptés des ressources suivantes :
- Préchargement d'image, coordonnées de la souris, et animation stop&go sur  [html5canvastutorials](http://www.html5canvastutorials.com/).
- Génération des caves par automates cellulaires sur [tutplus](https://gamedevelopment.tutsplus.com/tutorials/generate-random-cave-levels-using-cellular-automata--gamedev-9664).
- Gestion de la camera et du déplacement sur une grille de tuiles sur [mozilla](https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps/Square_tilemaps_implementation:_Scrolling_maps).
