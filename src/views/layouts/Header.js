import { MdOutlineLogout } from "react-icons/md";
import { useRecoilState } from "recoil";
import { AtomN } from "./AtomN";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [user, setUser] = useRecoilState(AtomN);
    const user1 = user.split('@', 1)
    console.log(user, "useer");
    const navigate = useNavigate();
    const onLogout = (e) => {
        e.preventDefault();
        setUser("");
        localStorage.removeItem("user");
        navigate("/");
    };
    return (
        <header className="flex justify-between items-center text-2xl font-bold min-h-10 bg-[#2e236d] text-teal-50 p-5 ">
            <div className="">리액트 </div>
            <div className="flex items-center">
                <span className="text-sm ">{user1}님</span>
                <button
                    onClick={onLogout}
                    type="submit"
                    className="text-whitebg-[#343077] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    <MdOutlineLogout className="text-teal-50 " />
                </button>
            </div>
        </header>
    );
}
