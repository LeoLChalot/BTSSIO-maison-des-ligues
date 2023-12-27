import React, { useEffect } from 'react'
import './../page.css'
import './Dashboard.css'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FormArticle from '../../components/FormArticle/FormArticle'
import AsideMenu from '../../components/AsideMenu/AsideMenu'
import ErreurNonAdmin from '../ErreurNonAdmin'
import ArticlesList from './ArticlesList'

const Dashboard = () => {
  const navigate = useNavigate()
  const ls = localStorage

  const authCheck = async (oauth_token) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/m2l/admin/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${oauth_token}`,
        },
      })
      if (data.status != 'admin') {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (ls.getItem('oauth_token')) {
      authCheck(ls.getItem('oauth_token'))
    }else{
      navigate('/unauthorized')
    }
    
  }, [ls.getItem('isAuth')])

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
