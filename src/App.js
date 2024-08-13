import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import Login from "./views/Login";
import Menu1 from "./views/Menu1";
import Menu2 from "./views/Menu2";
import Layout from "./views/Layout";
import Home from "./views/Home";

import { createTheme, ThemeProvider } from "@mui/material";
import { AlertProvider } from "./components/AlertContext";

const theme = createTheme({
    typography: {
        fontFamily: "Pretendard",
    },
});
// MUI 컴포넌트에 'Pretendard'폰트 전역으로 지정

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AlertProvider>
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
            </AlertProvider>
        </ThemeProvider>
    );
}

export default App;
