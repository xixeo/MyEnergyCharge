import { useNavigate, NavLink } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import { useRecoilState } from "recoil";
import { AtomN } from "./AtomN";
import { useState, useEffect } from "react";
import data from "../menu/Menu";

export default function Header() {
    //MenuList
    const [navs] = useState(data);
    const [user, setUser] = useRecoilState(AtomN);
    const navigate = useNavigate();
    //메일 앞 부분에서 사용자 이름 추출
    const userName = user ? user.split("@")[0] : "";

    // console.log(user, "useer");
    const onLogout = (e) => {
        e.preventDefault();
        if (window.confirm("로그아웃 하시겠습니까?")) {
            setUser("");
            localStorage.removeItem("user");
            navigate("/Login");
        }
    };

    // 로그인이 되어있지 않으면 로그인 페이지로 이동
    useEffect(() => {
        if (!user) {
            navigate("/Login");
        }
    }, [user, navigate]);

    return (
        <header className="flex justify-between items-center text-2xl font-bold min-h-10 bg-[#2e236d] text-teal-50 p-5">
            <div className="Logo">logo</div>
            <div className="MenuList">
                <ul className="flex justify-center items-center gap-4 text-md">
                    {navs.map((nav, index) => (
                        <li key={index} className="py-2 px-3 rounded-sm hover:bg-[#ffffff10] md:hover:bg-transparent md:border-0 md:hover:text-[#f1edb2] md:p-0">
                            <NavLink to={nav.link} className={({ isActive }) => (isActive ? 'text-white' : 'text-gray-400')}>
                                {nav.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-center UserInfo">
                {user ? (
                    <>
                        <span className="text-sm">{userName}님</span>
                        <button
                            onClick={onLogout}
                            type="button"
                            className="text-white bg-[#2E236D] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            <MdOutlineLogout className="text-teal-50" />
                        </button>
                    </>
                ) : (
                    <NavLink
                        to="/login"
                        className="text-white bg-[#343077] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        로그인
                    </NavLink>
                )}
            </div>
        </header>
    );
}