import { useEffect } from "react";
import styles from "../assets/theme/login.module.scss";
import LoginForm from "./layouts/LoginForm";
import { useRecoilState } from "recoil";
import { AtomN } from "./layouts/AtomN";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(AtomN);

    const handleLogin = (username) => {
        localStorage.setItem("user", username); // 로컬 스토리지에 사용자명 저장
        setUser(username); // Recoil 상태 업데이트
        navigate("/"); // 홈으로 이동
    };

    useEffect(() => {
        const lsUser = localStorage.getItem("user");
        if (lsUser) {
            setUser(lsUser); // 이미 로그인된 경우 Recoil 상태 업데이트
            navigate("/"); // 홈 페이지로 이동
        }
    }, [setUser, navigate]);

    return (
        <div className={`w-full h-screen ${styles.login_wrap} flex justify-center items-center`}>
            <LoginForm onLogin={handleLogin} />
        </div>
    );
}
