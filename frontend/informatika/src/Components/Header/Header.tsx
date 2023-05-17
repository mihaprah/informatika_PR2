import { FunctionComponent, useCallback } from "react";
import "../../styles/Header.css";
const Header: FunctionComponent = () => {
    const onUserInfoContainerClick = useCallback(() => {
        // Please sync "User Profile" to the project
    }, []);

    return (
        <div className="navbar">
            <div className="logo-parent">
                <img className="logo-icon" alt="" src="/logo.png" />
                <div className="user-info" onClick={onUserInfoContainerClick}>
                    <div className="name-surename">Janez Novak</div>
                    <img className="user-profile-icon" alt="" src="/user-profile.svg" />
                </div>
            </div>
        </div>
    );
};

export default Header;

  