import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import Login from "./views/Login";
import Menu1 from "./views/Menu1";
import Menu2 from "./views/Menu2";
// import Header from "./views/layouts/Header";
// import Footer from "./views/layouts/Footer";
import Layout from "./views/Layout";
import Home from "./views/Home";
// import { useRecoilValue, useRecoilState } from "recoil";
// import { AtomN } from "./views/layouts/AtomN";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/Login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="Menu1" element={<Menu1 />} />
                    <Route path="Menu2" element={<Menu2 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
