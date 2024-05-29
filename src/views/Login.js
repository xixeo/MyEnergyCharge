import { useEffect, useState } from "react";
import styles from "../assets/theme/login.module.css";
import LoginForm from "./layouts/LoginForm";
import { useRecoilValue, useRecoilState } from "recoil";
import { AtomN } from "./layouts/AtomN";

import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(AtomN);

    const handleLogin = (username) => {
        localStorage.setItem("user", username);
        setUser(username);
        navigate("/Home");
    };

    useEffect(() => {
        const lsUser = localStorage.getItem("user");
        if (lsUser) setUser(lsUser);
    }, []);

    return (
        <div
            className={`w-full h-screen ${styles.login_wrap} flex justify-center items-center`}
        >
            <LoginForm onLogin={handleLogin} />
        </div>
    );
}
