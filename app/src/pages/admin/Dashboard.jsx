import React, { useEffect } from 'react'
import './../page.css'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FormArticle from '../../components/FormArticle/FormArticle'
import AsideMenu from '../../components/AsideMenu/AsideMenu'

const Dashboard = () => {
  const view = useParams().params
  const navigate = useNavigate()
  const ls = localStorage
  useEffect(() => {
    const authCheck = () => {
      !ls.getItem('isAdmin') ? navigate('/') : null
    }
    authCheck()
  }, [ls.getItem('isAdmin')])

  return (
    <>
      <div className="page">
        <AsideMenu />
        <main id="page-dashboard">
          {view == 'general' && <h2>Dashboard Admin</h2>}
          {view == 'articles' && (
            <>
              <h2>Liste des articles</h2>
              <FormArticle />
            </>
          )}
          {view == 'users' && <h2>Liste des users</h2>}
        </main>
      </div>
    </>
  )
}

export default Dashboard
