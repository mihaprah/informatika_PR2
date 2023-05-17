import { FunctionComponent, useCallback } from "react";
import "../../styles/Sidebar.css";
const Sidebar: FunctionComponent = () => {
  const onComparisonContainerClick = useCallback(() => {
    // Please sync "Comparison" to the project
  }, []);

  const onHistoryContainerClick = useCallback(() => {
    // Please sync "History" to the project
  }, []);

  const onHomeContainerClick = useCallback(() => {
    // Please sync "Home - day" to the project
  }, []);

  return (
    <div className="sidebardefault">
      <div className="comparison" onClick={onComparisonContainerClick}>
        <div className="background1" />
        <div className="content">
          <img className="clip-path-group" alt="" src="/clip-path-group.svg" />
          <div className="zgodovina">
            <p className="primerjava">Primerjava</p>
          </div>
        </div>
      </div>
      <div className="history" onClick={onHistoryContainerClick}>
        <div className="background1" />
        <div className="content1">
          <img className="vector-icon" alt="" src="/vector.svg" />
          <div className="zgodovina">Zgodovina</div>
        </div>
      </div>
      <div className="home" onClick={onHomeContainerClick}>
        <div className="background3" />
        <div className="content1">
          <img className="vector-icon1" alt="" src="/vector1.svg" />
          <div className="zgodovina">Domov</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
