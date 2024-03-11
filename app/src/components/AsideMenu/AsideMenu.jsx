import React from 'react';
import { Link } from 'react-router-dom';

const AsideMenu = ({ links }) => {
  return (
    <aside>
      {links.map((link, index) => (
        <Link key={index} to={link.to} className="link">
          {link.label}
        </Link>
      ))}
    </aside>
  );
};

export default AsideMenu;
