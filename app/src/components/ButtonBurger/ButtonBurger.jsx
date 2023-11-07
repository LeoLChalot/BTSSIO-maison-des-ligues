import React from 'react'
import './ButtonBurger.css'

const ButtonBurger = ({ isActive, setIsActive }) => {
  const toggleBurger = (e) => {
    if (isActive == 'hide') {
      setIsActive('show')
      document.getElementById('button-burger').classList.add('active')
    } else {
      setIsActive('hide')
      document.getElementById('button-burger').classList.remove('active')
    }
  }

  return (
    <div id="button-burger" onClick={toggleBurger}>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </div>
  )
}

export default ButtonBurger
