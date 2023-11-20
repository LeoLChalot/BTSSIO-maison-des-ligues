import React, { useEffect } from 'react'
import './../page.css'
import axios from 'axios'

const Dashboard = () => {
  const ls = localStorage
  const isAdmin = async () => {
    console.log(`Is admin : ${parseInt(ls.getItem('isAdmin'))}`)

    let admin = axios
      .post('http://localhost:3000/admin', {
        isAdmin: 1,
      })
      .then((res) => console.log(res))
  }

  useEffect(() => {
    isAdmin()
  }, [])

  return (
    <>
      <div className="page">
        <aside>
          <p>Ajouter un article</p>
          <p>Modifier un article</p>
          <p>Liste des utilisateurs</p>
        </aside>
        <main id="page-dashboard">Dashboard admin</main>
      </div>
    </>
  )
}

export default Dashboard
