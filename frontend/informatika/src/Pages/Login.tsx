import {FunctionComponent} from "react";
import "../styles/LoginSignupForm.css";
import {TextField} from "@mui/material";
import {Link} from "react-router-dom";

const Login: FunctionComponent = () => {
    return (<>
            <div className="navbar">
                <div className="logo-parent">
                    <Link to={"/"}><img className="logo-icon" alt="" src="/public/logo.png"/></Link>
                    <div className="loginregister">
                        <div className="prijava">Prijava</div>
                        <Link className="registracija" to={"/signup"}>Registracija</Link>
                    </div>
                </div>
            </div>
            <div className="body">
                <div className="form">
                    <div className="title">Prijava</div>

                    <div className="inputs">
                        <div className="input">
                            <TextField
                                id="filled-email-input"
                                label="Email"
                                type="email"
                                required
                            />
                        </div>
                        <div className="input">
                            <TextField
                                id="filled-password-input"
                                label="Geslo"
                                type="password"
                                required
                            />
                        </div>
                        <div className="button">
                            <button>PRIJAVI SE</button>
                        </div>
                    </div>
                    <div className="or">
                        <img className="line" alt="" src="/public/line.svg"/>
                    </div>
                    <div className="google">
                        <div className="google-button">
                            <img
                                className="google-logo"
                                alt=""
                                src="/public/google-logo.svg"
                            />
                            <div>Sign in with Google</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
