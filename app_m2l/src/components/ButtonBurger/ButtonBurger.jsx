import React, { useState } from 'react'
import './ButtonBurger.css'

const ButtonBurger = ({ isActive, setIsActive }) => {
  const [burgerActive, setBurgerActive] = useState("")
  const toggleBurger = (e) => {
    if (isActive == 'hide') {
      setIsActive('show')
    } else {
      setIsActive('hide')
    }
  }

  return (
    <div id="button-burger" className={isActive} onClick={toggleBurger}>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </div>
  )
}

export default ButtonBurger
