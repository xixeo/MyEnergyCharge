import { useNavigate, NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import { AtomN } from "./AtomN";
import { useState } from "react";
import data from "../menu/Menu";
import { ReactComponent as User } from "../../assets/icons/svg/user.svg";
import { ReactComponent as ArrowR } from "../../assets/icons/svg/arrowR.svg";

export default function Header() {
    //MenuList
    const [navs] = useState(data);
    const [user, setUser] = useRecoilState(AtomN);
    const navigate = useNavigate();
    //메일 앞 부분에서 사용자 이름 추출
    const userName = user ? user.split("@")[0] : "";

    const onLogout = (e) => {
        e.preventDefault();
        if (window.confirm("로그아웃 하시겠습니까?")) {
            setUser("");
            localStorage.removeItem("user");
            navigate("/Login");
        }
    };

    return (
        <header className="w-[250px] text-xl font-bold bg-white pt-8 headerWrap">
            <div className="Logo text-white px-5">나의 전력량</div>

            <div className="UserInfo px-5">
                {user ? (
                    <div className="flex items-center justify-between pt-5">
                        <div className="flex items-center">
                            {/* <User width="16px" height="16px" className="mr-2"/> */}
                            <span className="text-sm text-white font-normal">
                                {userName}
                                <span className="ml-2">님</span>
                            </span>
                        </div>
                        <button
                            onClick={onLogout}
                            type="button"
                            className="text-white border border-whtie hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-2 py-1 text-center"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center pt-5">
                        <div className="flex items-center">
                            {/* <User width="16px" height="16px"  className="mr-2"/> */}
                            <span className="text-sm text-white font-normal">
                                Guest
                                <span className="ml-2">님</span>
                            </span>
                        </div>
                        <NavLink
                            to="/login"
                            className="text-zinc-300 border border-zinc-300 hover:border-white hover:text-white font-medium rounded-lg text-xs px-2 py-1 text-center"
                        >
                            로그인
                        </NavLink>
                    </div>
                )}
            </div>
            <hr className="border-[#ffffff25] mt-3 mb-5" />
            <div className="MenuList px-3">
                <ul className="text-md">
                    {navs.map((nav, index) => (
                        <li
                            key={index}
                            className="my-2 rounded-md hover:bg-[#ffffff10] md:border-0 md:p-0"
                        >
                            <NavLink
                                to={nav.link}
                                className={({ isActive }) =>
                                    `w-full flex justify-between items-center p-2 px-1 ${
                                        isActive
                                            ? "text-white"
                                            : "text-gray-500"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center">
                                            <nav.icon
                                                width="20px"
                                                height="20px"
                                                className={`transition-colors duration-300 mr-4 ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-gray-500"
                                                }`}
                                            />
                                            <span className="text-[1.1rem]">
                                                {nav.title}
                                            </span>
                                        </div>
                                        <span>
                                            <ArrowR
                                                width="18px"
                                                height="18px"
                                                className={`transition-colors duration-300 ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-gray-500"
                                                }`}
                                            />
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
