import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './page.css'

const Profil = () => {
  const { pseudo } = useParams()
  const navigate = useNavigate()
  const ls = localStorage

  const authCheck = () => {
    return ls.getItem('pseudo') === pseudo && ls.getItem('isAuth') === '1'
  }

  useEffect(() => {
    if (!authCheck()) {
      navigate('/')
    }
  }, [ls.getItem('pseudo'), ls.getItem('isAuth')])

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
