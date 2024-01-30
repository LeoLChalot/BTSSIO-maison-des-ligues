import { Route, Routes } from 'react-router-dom'
import React, { lazy, Suspense } from 'react'

import Accueil from './pages/Accueil'
const Boutique = lazy(() => import('./pages/Boutique'))
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Profil from './pages/Profil'
import Dashboard from './pages/admin/Dashboard'
import ErreurNonAdmin from './pages/Erreurs/ErreurNonAdmin'
import Navbar from './components/Navbar/Navbar'
import './App.css'
import LoaderPage from './components/Loader/LoaderPage'
import ArticleDetail from './components/Articles/ArticleDetail'
import Erreur404 from './pages/Erreurs/Erreur404'
import PagePanier from './pages/Panier'
import ErreurAuth from './pages/Erreurs/ErreurAuth'
import { useAuth } from './hooks/useAuth'

function App() {

  const { isLoggedIn, isAdmin } = useAuth()
  return (
    <>
      <header>
        <Navbar />
      </header>
      <div className="App">
        <Suspense fallback={<LoaderPage />}>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            { !isLoggedIn && <Route path="/connexion" element={<Connexion />} /> }
            { !isLoggedIn && <Route path="/inscription" element={<Inscription />} /> }
            { isLoggedIn && <Route path="/profil/:pseudo" element={<Profil />} /> }
            { isLoggedIn && <Route path="/panier/:pseudo" element={<PagePanier />} /> }
            { isLoggedIn && isAdmin && <Route path="/dashboard" element={<Dashboard />} /> }
            <Route path="/notyou" element={<ErreurAuth />} />
            <Route path="*" element={<Erreur404 />} />
            <Route path="/unauthorized" element={<ErreurNonAdmin />} />
          </Routes>
        </Suspense>
      </div>
      <footer>{/* > Footer < */}</footer>
    </>
  )
}

export default App
