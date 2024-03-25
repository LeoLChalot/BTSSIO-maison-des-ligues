import PropTypes from 'prop-types';
import './ButtonBurger.css'

const ButtonBurger = ({ isActive, setIsActive }) => {

  const toggleBurger = () => {
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

ButtonBurger.propTypes = {
  isActive: PropTypes.string.isRequired, // or PropTypes.oneOf(['show', 'hide'])
  setIsActive: PropTypes.func.isRequired
};