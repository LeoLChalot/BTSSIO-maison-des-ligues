import { Route, Routes } from 'react-router-dom'
import Accueil from './pages/Accueil'
import Boutique from './pages/Boutique'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Profil from './pages/Profil'

import Navbar from './components/Navbar/Navbar'

import './App.css'


function App() {
  return (
    <>
      <div className="App">
        <header>
          <Navbar />
        </header>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/boutique" element={<Boutique />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
        <footer>
          {/* TODO Footer */}
        </footer>
      </div>
    </>
  )
}

export default App
