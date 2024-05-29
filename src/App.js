import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./views/Login";
// import Header from "./views/layouts/Header";
// import Footer from "./views/layouts/Footer";
import Home from "./views/Layout";
// import { useRecoilValue, useRecoilState } from "recoil";
// import { AtomN } from "./views/layouts/AtomN";

function App() {
    return (
        // <RecoilRoot>
        <BrowserRouter>
            <div className="App flex flex-col w-full h-screen overflow-y-auto ">
                <Routes>
                    <Route path="/" element={  <Login />}/>              
                    <Route path="/Home" element={<Home />} />
                </Routes>
            </div>
        </BrowserRouter>
        // </RecoilRoot>
    );
}

export default App;
