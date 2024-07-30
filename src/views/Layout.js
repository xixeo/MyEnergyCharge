import { Routes, Route } from "react-router-dom";
import "../App.scss";
import Header from "../views/layouts/Header";
import Footer from "../views/layouts/Footer";
import Menu1 from "./Menu1";
import Menu2 from "./Menu2";
import Home from "./Home";

export default function Layout() {
    return (
        <div className="App flex flex-col w-full h-screen overflow-y-auto ">
            <Header />
            <main className="main_wrap h-screen overflow-y-auto flex items-center justify-center">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/menu1" element={<Menu1/>}/>
                    <Route path="/menu2" element={<Menu2/>}/>
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
