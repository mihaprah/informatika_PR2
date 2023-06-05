import { FunctionComponent } from "react";
import "../../styles/Sidebar.css";
import { useNavigate } from "react-router";
const Sidebar: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebardefault">
      <div className="comparison" onClick={() => navigate("/comparison")}>
        <div className="background1" />
        <div className="content">
          <img className="clip-path-group" alt="" src="/comparison-icon.svg" />
          <div className="zgodovina">
            <p className="primerjava">Primerjava</p>
          </div>
        </div>
      </div>
      <div className="history" onClick={() => navigate("/history")}>
        <div className="background1" />
        <div className="content1">
          <img className="vector-icon" alt="" src="/history-icon.svg" />
          <div className="zgodovina">Zgodovina</div>
        </div>
      </div>
      <div className="home" onClick={() => navigate("/")}>
        <div className="background3" />
        <div className="content1">
          <img className="vector-icon1" alt="" src="/home-icon.svg" />
          <div className="zgodovina">Domov</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
