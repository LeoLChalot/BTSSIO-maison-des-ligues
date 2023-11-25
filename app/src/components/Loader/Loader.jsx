import React from 'react'
import './Loader.css'

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="surface">
        <div className="waves"></div>
        <div className="waves"></div>
      </div>
      <div className="loaders">
        <div className="loader"></div>
      </div>
      <div className="loaders">
        <div className="loader shadow"></div>
      </div>
    </div>
  )
}

export default Loader
