import React, { useEffect } from 'react'
import './../page.css'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import NavbarAdmin from './NavbarAdmin'

const Dashboard = () => {
  const { isLoggedIn, isAdmin, pseudo, jwtToken, updateState } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {}, [])

  return (
    <div className="dashboard">
      <div className="dashboard-title">
        <h1>Dashboard</h1>
      </div>
    </div>
  )
}

export default Dashboard
