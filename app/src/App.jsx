import { Route, Routes } from 'react-router-dom'
import React, { lazy, Suspense } from 'react'

const Accueil = lazy(() => import('./pages/Accueil'))
const Boutique = lazy(() => import('./pages/Boutique'))
const Connexion = lazy(() => import('./pages/Connexion'))
const Inscription = lazy(() => import('./pages/Inscription'))
const Profil = lazy(() => import('./pages/Profil'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))

import Navbar from './components/Navbar/Navbar'
import './App.css'
import Loader from './components/Loader/Loader'

import { v4 } from 'uuid'


function App() {

  const uuid = v4();
  console.log(typeof uuid);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <div className="App">
        <Suspense fallback={<Loader />}>
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
