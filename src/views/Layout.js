import { Routes, Route } from "react-router-dom";
import "../App.css";
import Header from "../views/layouts/Header";
import Footer from "../views/layouts/Footer";
import Subway from "./Subway";


export default function Layout() {
    return (
        <div className="App flex flex-col w-full h-screen overflow-y-auto ">
            <Header />
            <main className="h-screen overflow-y-auto flex items-center justify-center">
              <Subway/>
                {/* <Routes>
                    <Route path="/Subway" element={<Subway />} />
                </Routes> */}
            </main>
            <Footer />
        </div>
    );
}
