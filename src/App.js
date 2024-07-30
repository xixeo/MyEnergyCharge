import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import Login from "./views/Login";
// import Header from "./views/layouts/Header";
// import Footer from "./views/layouts/Footer";
import Home from "./views/Layout";
// import { useRecoilValue, useRecoilState } from "recoil";
// import { AtomN } from "./views/layouts/AtomN";

function App() {
    return (
        // <RecoilRoot>
        <div className="App flex flex-col w-full h-screen overflow-y-auto ">
            <BrowserRouter>
                <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </div>
        // </RecoilRoot>
    );
}

export default App;
