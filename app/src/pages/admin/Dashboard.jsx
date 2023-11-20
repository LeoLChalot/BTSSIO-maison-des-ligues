import React, { useEffect } from 'react'
import './../page.css'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Dashboard = () => {
  const view = useParams().params
  // console.log(view)
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
        <aside>
          <Link to="/dashboard/articles" className="link">
            Magasin
          </Link>
          <Link to="/dashboard/users" className="link">
            Liste des utilisateurs
          </Link>
        </aside>
        <main id="page-dashboard">
          {view == 'articles' && <h2>Liste des articles</h2>}
          {view == 'users' && <h2>Liste des users</h2>}
        </main>
      </div>
    </>
  )
}

export default Dashboard
