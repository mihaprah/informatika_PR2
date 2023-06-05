import {FunctionComponent, useState} from "react";
import "../styles/Login.css";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import "../global.css";
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase';
import {useNavigate} from "react-router";

const Login: FunctionComponent = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

    }

    return (
        <>
            <div className="navbar">
                <div className="logo-parent">
                    <Link to={"/"}>
                        <img className="logo-icon" alt="" src="/public/logo.png" />
                    </Link>
                </div>
            </div>
            <div className="body">
                <div className="form">
                    <div className="title">Prijava</div>

                    <div className="inputs">
                        <div className="input">
                            <TextField id="filled-email-input" label="Email" type="email" required  onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div className="input">
                            <TextField id="filled-password-input" label="Geslo" type="password" required  onChange={(e)=>setPassword(e.target.value)}/>
                        </div>
                        <div>
                            <Button onClick={onLogin} variant="outlined">PRIJAVI SE</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;