import { useNavigate, NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import { AtomN } from "./AtomN";
import { useState, useEffect } from "react";
import data from "../menu/Menu";
import Unsub from "../Unsub";
import { ReactComponent as ArrowR } from "../../assets/icons/svg/arrowR.svg";
import { ReactComponent as Logo } from "../../assets/icons/svg/logo.svg";
import { ReactComponent as Close } from "../../assets/icons/svg/close.svg";

export default function Header() {
    const [navs] = useState(data);
    const [user, setUser] = useRecoilState(AtomN);
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const userName = user ? user.split("@")[0] : "Guest";

    useEffect(() => {
        const lsUser = localStorage.getItem("user");
        if (lsUser) {
            setUser(lsUser); // 로컬 스토리지에 저장된 사용자 정보로 상태 복원
        }
    }, [setUser]);

    const onLogout = (e) => {
        e.preventDefault();

        if (window.confirm("로그아웃 하시겠습니까?")) {
            try {
                setUser(""); // 사용자 상태 초기화
                localStorage.removeItem("user"); // localStorage에서 사용자 정보 제거
                localStorage.removeItem("token"); // localStorage에서 토큰 제거
                navigate("/Login"); // 로그인 페이지로 이동
            } catch (error) {
                console.error("로그아웃 처리 중 오류 발생:", error);
                alert("로그아웃 처리 중 오류가 발생했습니다.");
            }
        }
    };

    const sideNave = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuClick = () => {
        setIsOpen(false);
    };

    return (
        <header
            className={`flex flex-col justify-between transition-all duration-300 ${
                isOpen ? "w-[65px]" : "w-[250px]"
            } text-xl font-bold bg-white pt-8 headerWrap`}
        >
            <div>
                <div className="Logo flex items-center text-white px-5 pl-4">
                    <Logo width="24px" height="24px" />
                    {isOpen ? (
                        <div className="pt-7"></div>
                    ) : (
                        <span className="ml-2">나의 전력량</span>
                    )}
                </div>

                <button
                    onClick={sideNave}
                    className="p-2 pl-1.5 bg-[#092856] rounded rounded-s-none sideNavBtn"
                >
                    {isOpen ? (
                        <ArrowR color="white" width="16px" height="16px" />
                    ) : (
                        <Close width="13px" height="13px" />
                    )}
                </button>

                <div className="UserInfo px-5 h-[58px] pt-5">
                    {isOpen ? (
                        ""
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-sm text-white font-normal">
                                    {userName}
                                    <span className="ml-2">님</span>
                                </span>
                            </div>
                            {user ? (
                                <button
                                    onClick={onLogout}
                                    type="button"
                                    className="text-white border border-white hover:bg-primary-700 focus:ring-4 py-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-2 text-center"
                                >
                                    로그아웃
                                </button>
                            ) : (
                                <NavLink
                                    to="/Login"
                                    className="text-zinc-300 border border-zinc-300 hover:border-white hover:text-white font-medium rounded-lg text-xs px-2 py-1 text-center"
                                >
                                    로그인
                                </NavLink>
                            )}
                        </div>
                    )}
                </div>
                <hr className="border-[#ffffff25] mb-5" />
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
                                        `w-full flex items-center p-2 px-1 ${
                                            isActive
                                                ? "text-white"
                                                : "text-gray-500"
                                        }
                                            ${
                                                isOpen
                                                    ? "justify-center"
                                                    : "justify-between"
                                            }`
                                    }
                                    onClick={handleMenuClick}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className="flex items-center">
                                                <nav.icon
                                                    width="20px"
                                                    height="20px"
                                                    className={`transition-colors duration-300 ${
                                                        isActive
                                                            ? "text-white"
                                                            : "text-gray-500"
                                                    }`}
                                                />
                                                {!isOpen && (
                                                    <span className="text-[1rem] ml-4">
                                                        {nav.title}
                                                    </span>
                                                )}
                                            </div>
                                            {isOpen ? (
                                                ""
                                            ) : (
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
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="p-10 text-center">
                <Unsub />
            </div>
        </header>
    );
}
