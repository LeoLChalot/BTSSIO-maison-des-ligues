import React, { useEffect } from 'react'
import './../page.css'
import './Dashboard.css'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FormArticle from '../../components/FormArticle/FormArticle'
import AsideMenu from '../../components/AsideMenu/AsideMenu'
import ErreurNonAdmin from '../Erreurs/ErreurNonAdmin'
import ArticlesList from './ArticlesList'
import { useAuth } from '../../hooks/useAuth'

const Dashboard = () => {
  const { isLoggedIn, isAdmin, pseudo, jwtToken, updateState } = useAuth()
  const navigate = useNavigate()
  const ls = localStorage

  const authCheck = async (oauth_token) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/m2l/boutique/articles`)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!(isLoggedIn || isAdmin) ) navigate('/notyou')
    }
  }, [])

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
        </div>
        <div className="dashbord-components">
          {/* Ajout <FormCategorie /> */}
          <FormArticle />
          <ArticlesList />
        </div>
      </div>
    </>
  )
}

export default Dashboard
