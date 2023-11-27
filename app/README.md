# Réalisation de l'atelier professionnel (AP3)

## Solution Légère - Association "Maison des Ligues de Lorraine (M2L)

L'entreprise (fictive) Horizon Web a pour objectif le développement d'une solution légère (application web) pour permettre à la Maison des Lignes de Lorraine de proposer à la vente des articles en rapport avec leurs associations

### Frontend - React / Vite

L'interface côté client est réalisée avec la bibliothèque Javascript React (en association avec l'outils Vite) et le framework CSS JoyUI

> [@React/doc](https://react.dev/reference/react)

> [@Vite/doc](https://vitejs.dev/guide/)

> [@joyUI/doc](https://mui.com/joy-ui/getting-started/)

### Backend - Node / Express

L'interface côté serveur est réalisée avec les frameworks Node et Express

> [@Node/doc](https://nodejs.org/en/docs)

> [@Express/doc](https://expressjs.com/fr/guide/routing.html)

### Sécurité - Bcrypt
L'enregistrement et la comparaison des mots de passe se fait avec la bibliothèque Bcrypt
> [@Bcrypt/doc](https://www.npmjs.com/package/bcrypt)

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:

> [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh ✅

```bash
npm i -D @vitejs/plugin-react-swc
```

```jsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
   plugins: [react()],
});
```

<p align="center">© Léo Larou-Chalot - BTS SIO option Slam (2ème année)</p>
