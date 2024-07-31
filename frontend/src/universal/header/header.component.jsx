import { Link, NavLink } from 'react-router-dom';
import './header.styles.scss';

export const Header = () => {
  return (
    <div className="header">
      <div className="logo-container">
        <Link to="/">
          <img src="Logo.png" alt="Logo" />
        </Link>
        <div>
          <div style={{color: "#FF7886"}}>Fashion</div>
          <div style={{color: "#B4DAFF"}}>Fiesta</div>
        </div>
      </div>
      <div className="options">
        <NavLink to="/shop" className="option">Shop</NavLink>
        <NavLink to="/contact" className="option">Contact</NavLink>
      </div>
    </div>
  )
}