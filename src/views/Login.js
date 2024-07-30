import { useEffect } from "react";
import styles from "../assets/theme/login.module.css";
import LoginForm from "./layouts/LoginForm";
import { useRecoilState } from "recoil";
import { AtomN } from "./layouts/AtomN";

import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(AtomN);
    console.log(user)

    // 로그인 성공 시 Home 페이지로 리디렉션
    const handleLogin = (username) => {
        localStorage.setItem("user", username);
        setUser(username);
        navigate("/"); //홈으로 이동
    };

    // 컴포넌트 마운트 시 로컬스토리지에서 사용자 정보 가져오기
    useEffect(() => {
        const lsUser = localStorage.getItem("user");
        if (lsUser) {
            setUser(lsUser);
            navigate("/"); // 이미 로그인된 경우 홈 페이지로 이동
        }
    }, [setUser, navigate]);

    return (
        <div
            className={`w-full h-screen ${styles.login_wrap} flex justify-center items-center`}
        >
            <LoginForm onLogin={handleLogin} />
        </div>
    );
}
