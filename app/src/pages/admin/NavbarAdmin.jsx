import { Link } from 'react-router-dom';

const NavbarAdmin = () => {
  return (
    <div>
      <Link to="/dashboard/ajout">Ajouter un article</Link>
      <Link to="/dashboard/stock">Accès au Stock</Link>
    </div>
  )
}

export default NavbarAdmin
