import PropTypes from 'prop-types'
import './SmallList.css'

const SmallList = ({ titre, items }) => {
  const titreListe =
    titre != undefined ? (
      <li className="liste-titre">
        <p>
          <small>{titre}</small>
        </p>
      </li>
    ) : null

  return (
    <div className="liste">
      <ul>
        {titreListe}
        {items.map((item) => (
          <li key={item}>
            <p>
              <small>{item}</small>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

SmallList.propTypes = {
  titre: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default SmallList
