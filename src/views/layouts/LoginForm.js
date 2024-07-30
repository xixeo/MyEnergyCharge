import { useState } from "react";
import { useCookies } from "react-cookie";

export default function LoginForm({ onLogin }) {
    const [username, setUsername] = useState();
    const [pw, setPw] = useState();
    const [setCookie, removeCookie] = useCookies(["rememberOK"]);
    const [isRemember, setIsRemember] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        //추후 서버와의 인증 과정 추가
        if ((username === "user@naver.com") && (pw === "1234")) {
            onLogin(username);
        } else {
            alert("로그인에 실패하였습니다.");
        }
    };

    const handleOnChange = (e) => {
        const { checked } = e.target;
        setIsRemember(checked);
        if (checked) {
            setCookie("rememberOK", username, { maxAge: 7 * 24 * 60 * 60 });
        } else {
            removeCookie("rememberOK");
        }
    };

    return (
        <div className="w-1/4 min-w-96 h-1/2 min-h-96 rounded-lg bg-white/[.55] shadow-lg flex flex-col justify-center items-center">
            <p className="text-[#364f9b] text-3xl font-bold">
                Sign in to your account
            </p>
            <form className="w-full px-8 pt-12 space-y-4 md:space-y-6" action="#">
                <div>
                    <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Your email
                    </label>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="email"
                        name="email"
                        id="email"
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
                <div className="flex items-center justify-between">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="remember"
                                onChange={handleOnChange}
                                checked={isRemember}
                                aria-describedby="remember"
                                type="checkbox"
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                required=""
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-700">
                                Remember me
                            </label>
                        </div>
                    </div>
                    {/* <a href="#" className="text-sm font-medium text-[#343077] hover:underline ">Forgot password?</a> */}
                </div>
                <div className="py-1"></div>
                <button
                    onClick={handleLogin}
                    type="submit"
                    className="w-full text-white bg-[#343077] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    Sign in
                </button>
            </form>
        </div>
    );
}
