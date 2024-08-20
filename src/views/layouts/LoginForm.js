import { useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

export default function LoginForm({ onLogin }) {
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");
    const [setCookie] = useCookies(["token"]);
    const [isRemember, setIsRemember] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 제출 방지

        const url = "http://192.168.0.144:8080/login";
        // const url = "http://localhost:8080/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password: pw,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "로그인에 실패하였습니다.");
            }

            const token = response.headers.get('Authorization'); // 토큰 읽기

            if (token) {
                localStorage.setItem("token", token);
                console.log('Token ok');
                onLogin(username); // 로그인 성공 시 사용자 상태 업데이트
            } else {
                console.log('Token not received from the server');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleOnChange = (e) => {
        const { checked } = e.target;
        setIsRemember(checked);
    };

    return (
        <div className="w-1/4 min-w-96 py-6 min-h-96 rounded-lg bg-white/[.55] shadow-lg flex flex-col justify-center items-center">
            <p className="text-[#364f9b] text-3xl font-bold w-full px-8">
                Login
            </p>
            <form
                className="w-full px-8 pt-12 space-y-4 md:space-y-6"
                onSubmit={handleLogin}
            >
                <div>
                    <label
                        htmlFor="id"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        ID
                    </label>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="id"
                        name="id"
                        id="id"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@company.com"
                        required=""
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Password
                    </label>
                    <input
                        onChange={(e) => setPw(e.target.value)}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required=""
                    />
                </div>
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="remember"
                                onChange={handleOnChange}
                                checked={isRemember}
                                aria-describedby="remember"
                                type="checkbox"
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-700">
                                ID 저장
                            </label>
                        </div>
                    </div>
                    <div className="text-[#343077] font-bold text-sm">
                    <Link to="/Join">회원가입</Link>
                    </div>
                </div>
                <div className="py-1"></div>
                <button
                    type="submit"
                    className="w-full text-white bg-[#343077] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    로그인
                </button>
            </form>
        </div>
    );
}
