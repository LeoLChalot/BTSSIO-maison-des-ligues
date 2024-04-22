import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import Accueil from './pages/Accueil'
const Boutique = lazy(() => import('./pages/Boutique'))
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Profil from './pages/Profil'
import Dashboard from './pages/admin/Dashboard'
import ErreurNonAdmin from './pages/Erreurs/ErreurNonAdmin'
import Nav from './components/Navbar/NavbarFluid'
import './App.css'
import LoaderPage from './components/Loader/LoaderPage'
import ArticleDetail from './components/Articles/ArticleDetail'
import Erreur404 from './pages/Erreurs/Erreur404'
import PagePanier from './pages/Panier'
import ErreurAuth from './pages/Erreurs/ErreurAuth'
import { useAuth } from './hooks/useAuth'
import ArticlesList from './pages/admin/ArticlesList'
import FormArticle from './components/FormArticle/FormArticle'
import FooterFlowbite from './components/Footer/Footer'

const App = () => {
  const { isLoggedIn, isAdmin } = useAuth()
	console.log({"IsLoggedIn": isLoggedIn, "isAdmin": isAdmin});
  return (
    <>
      <Nav />
      <div className="App">
        <Suspense fallback={<LoaderPage />}>
          <Routes>
          {isLoggedIn && isAdmin 
          ? (<Route path="/" element={<Dashboard />} />) 
          : (<Route path="/" element={<Accueil />} />)}
            
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            {!isLoggedIn && (
              <>
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
              </>
            )}
            {isLoggedIn && !isAdmin && (
              <>
                <Route path="/profil/:pseudo" element={<Profil />} />
                <Route path="/panier/:pseudo" element={<PagePanier />} />
              </>
            )}
            {isLoggedIn && isAdmin && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/stock" element={<ArticlesList />} />
                <Route path="/ajout" element={<FormArticle />} />
                <Route path="/utilisateurs" element={<FormArticle />} />
              </>
            )}
            <Route path="/notyou" element={<ErreurAuth />} />
            <Route path="/404" element={<Erreur404 />} />
            <Route path="/unauthorized" element={<ErreurNonAdmin />} />
          </Routes>
        </Suspense>
      </div>
      <FooterFlowbite />
    </>
  )
}

export default App
