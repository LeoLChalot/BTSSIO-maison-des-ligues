import { Route, Routes } from 'react-router-dom'
import React, { lazy, Suspense } from 'react'

import Accueil from './pages/Accueil'
const Boutique = lazy(() => import('./pages/Boutique'))
// import Boutique from './pages/Boutique'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Profil from './pages/Profil'
import Dashboard from './pages/admin/Dashboard'
import ErreurNonAdmin from './pages/ErreurNonAdmin'

import Navbar from './components/Navbar/Navbar'
import './App.css'

import LoaderPage from './components/Loader/LoaderPage'
import LoaderArticle from './components/Loader/LoaderArticle'

import { v4 } from 'uuid'

function App() {
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
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/profil/:pseudo" element={<Profil />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </div>
      <footer>{/* > Footer < */}</footer>
    </>
  )
}

export default App
