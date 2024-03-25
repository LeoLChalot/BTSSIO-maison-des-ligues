import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Banner.css'
import Carousel from '../Carousel/Carousel'

const Banner = ({ title, subtitle, buttonText }) => {

  const photos = [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]
  return (
    <div className="banner">
      <Carousel photos={photos} />
      <div className="banner-content">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        <Link to="/boutique" className="cta-button">
          {buttonText}
        </Link>
      </div>
    </div>
  )
}

Banner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
}

export default Banner
