import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './page.css'

const Profil = () => {
  const navigate = useNavigate()
  const ls = localStorage

  useEffect(() => {
    const authCheck = () => {
      !ls.getItem('pseudo') ? navigate('/') : null
    }
    authCheck()
  },[ls.getItem('isAuth')])

  return (
    <section id="page-profil" className="page">
      <div id="profil-header">
        <h1>Salut {ls.getItem('pseudo')} !</h1>
        <h3>Content de vous voir :)</h3>
      </div>
      
    </section>
  )
}

export default Profil
