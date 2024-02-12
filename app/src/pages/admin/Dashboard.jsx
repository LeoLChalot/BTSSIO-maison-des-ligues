import React, { useEffect } from 'react'
import './../page.css'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import NavbarAdmin from './NavbarAdmin'
import AdminTabs from '../../components/AdminTabs/AdminTabs'

const Dashboard = () => {
  const { isLoggedIn, isAdmin, pseudo, jwtToken, updateState } = useAuth()



  return (
    <div className="container">

      <AdminTabs />

    </div>
  )
}

export default Dashboard
