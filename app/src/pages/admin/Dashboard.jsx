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

  const authCheck = async (oauth_token) => {
    try {
      const data = await axios.get(
        `http://localhost:3000/m2l/admin/gettoken`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${oauth_token}`,
          },
        }
      )
      if (data.status === 200) {
        console.log(data)
        return data
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error(error)
      navigate('/')
    }
  }

  useEffect(() => {
    const access = authCheck(ls.getItem('oauth_token'))
  }, [])

  return (
    <>
      <h1>Dashboard</h1>

      {/* <FormArticle /> */}
    </>
  )
}

export default Dashboard
