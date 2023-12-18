import React, { useEffect } from 'react'
import './../page.css'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FormArticle from '../../components/FormArticle/FormArticle'
import AsideMenu from '../../components/AsideMenu/AsideMenu'

const Dashboard = () => {
  const navigate = useNavigate()
  const ls = localStorage

  const authCheck = async (oauth_token) => {
    try {
      console.log(oauth_token)
      await axios.get(
        `http://localhost:3000/m2l/admin/`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${oauth_token}`,
          }
        }
      ).then((res) => {
        console.log(res)
      })
    } catch (error) {
      console.error(error)
      navigate('/')
    }
  }

  useEffect(() => {
    authCheck(ls.getItem('oauth_token'))
  }, [])

  return (
    <>
      <h1>Dashboard</h1>

      {/* <FormArticle /> */}
    </>
  )
}

export default Dashboard
