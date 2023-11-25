import React, { useState, useEffect } from 'react'
import './Carousel.css'

const Carousel = ({ photos }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const scrollPhotos = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    )
  }

  useEffect(() => {
    const interval = setInterval(scrollPhotos, 3000) // Change the interval duration as per your requirement (3000ms = 3 seconds)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="carousel">
      <img src={photos[currentPhotoIndex]} alt="Carousel Photo" />
    </div>
  )
}

export default Carousel
