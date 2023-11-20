import { Route, Routes } from 'react-router-dom'
import Accueil from './pages/Accueil'
import Boutique from './pages/Boutique'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Profil from './pages/Profil'

import Navbar from './components/Navbar/Navbar'

import './App.css'
import Dashboard from './pages/admin/Dashboard'

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <div className="App">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/boutique" element={<Boutique />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/dashboard/:params" element={<Dashboard />} />
        </Routes>
      </div>
      <footer>{/* TODO Footer */}</footer>
    </>
  )
}

export default App
