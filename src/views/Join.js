import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅 추가
import styles from "../assets/theme/login.module.scss";
import Btn from "../components/Btn";
import { useAlert } from "../components/AlertContext";

export default function Join() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [showPopup, setShowPopup] = useState(false); // 팝업 상태 추가
    const { showAlert } = useAlert();
    const [popupMessage, setPopupMessage] = useState("");
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.username || !formData.email || !formData.password) {
            showAlert("모든 필드를 입력해주세요.", "error");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            const result = await response.text();
    
            if (response.ok) {
                if (result.includes("님, 가입을 축하합니다!")) {
                    // 성공 메시지 처리
                    setPopupMessage(result); // 팝업 메시지 설정
                    setShowPopup(true); // 성공 메시지 팝업 표시
                } else {
                    // 실패 메시지 처리
                    showAlert(result, "error");
                }
            } else {
                showAlert(result, "error");
            }
        } catch (error) {
            console.error("회원가입 요청 중 오류가 발생했습니다.", error);
            showAlert("회원가입 요청 중 오류가 발생했습니다.", "error");
        }
    };   
    

    const handleNavigateToLogin = () => {
        setShowPopup(false); // 팝업 닫기
        navigate("/login"); // 로그인 페이지로 이동
    };

    return (
        <div
            className={`w-full h-screen ${styles.join_wrap} flex justify-center items-center`}
        >
            <div className="w-1/4 min-w-96 py-6 min-h-96 rounded-lg bg-white/[.55] shadow-lg flex flex-col justify-center items-center">
                <p className="text-[#364f9b] text-3xl font-bold w-full px-8">
                    Sign up
                </p>
                <form
                    className="w-full px-8 pt-12 space-y-4 md:space-y-6"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-4 w-full">
                        <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            ID
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="ID"
                        />
                    </div>
    
                    <div className="mb-4 w-full">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            이메일
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="e-mail"
                        />
                    </div>
    
                    <div className="mb-4 w-full">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="password"
                        />
                    </div>
    
                    <div className="py-1" />
                    <button
                        type="submit"
                        className="w-full text-white bg-[#343077] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        회원가입
                    </button>
                </form>
            </div>
    
            {showPopup && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60">
                    <div className="bg-white w-80 text-center px-4 py-10 rounded-lg shadow-lg">
                        <p className="text-xl font-bold pb-10">{popupMessage}</p>
                        <button
                            onClick={handleNavigateToLogin}
                            className="mt-4 bg-[#343077] text-white px-4 py-2 rounded"
                        >
                            로그인 페이지로 이동
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
}
