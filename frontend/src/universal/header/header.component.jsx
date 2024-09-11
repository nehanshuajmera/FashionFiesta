import { Link, NavLink } from "react-router-dom";
import "./header.styles.scss";

export const Header = ({ currentUser, onSignOut }) => {
  return (
    <div className="header">
      <div className="logo-container">
        <Link to="/">
          <img src="Logo.png" alt="Logo" />
        </Link>
        <div>
          <div style={{ color: "#FF7886" }}>Fashion</div>
          <div style={{ color: "#B4DAFF" }}>Fiesta</div>
        </div>
      </div>
      <div className="options">
        <NavLink to="/shop" className="option">
          Shop
        </NavLink>
        <NavLink to="/contact" className="option">
          Contact
        </NavLink>
        {currentUser ? (
          <div className="option">
            {/* <span className="option">{currentUser.displayName}</span> Show user's name */}
            <button onClick={onSignOut}>Sign Out</button>{" "}
            {/* Sign Out button */}
          </div>
        ) : (
          <NavLink to="/signin" className="option">
            Sign In
          </NavLink>
        )}
      </div>
    </div>
  );
};
