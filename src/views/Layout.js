import "../App.scss";
import Header from "../views/layouts/Header";
import Footer from "../views/layouts/Footer";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
    return (
        <div className="App flex h-screen">
            <Header />
            <main className="flex-1 pt-16 overflow-y-scroll">
                <Outlet />
            </main>
            {/* <Footer /> */}
        </div>
    );
}
