import { FunctionComponent } from "react";
import "../../styles/Header.css";
import { useNavigate } from "react-router";

const Header: FunctionComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="logo-parent">
        <img className="logo-icon" alt="" src="/logo.png" />
        <div className="user-info" onClick={() => navigate("/user-profile")}>
          <div className="name-surename">Nastavitve</div>
          <img className="user-profile-icon" alt="" src="/settings-icon.svg" />
        </div>
      </div>
    </div>
  );
};

export default Header;
