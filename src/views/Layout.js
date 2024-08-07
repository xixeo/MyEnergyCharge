import "../App.scss";
import Header from "../views/layouts/Header";
import Footer from "../views/layouts/Footer";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
    return (
        <div className="App flex flex-col h-screen">
            <Header />
            <main className="flex-1 overflow-y-hidden">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
