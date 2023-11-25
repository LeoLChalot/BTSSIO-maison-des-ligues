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
      <h1>dashboard</h1>
      <FormArticle />
    </>
  )
}

export default Dashboard
