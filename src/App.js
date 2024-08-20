import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import Login from "./views/Login";
import Join from "./views/Join";
import Menu1 from "./views/Menu1";
import Menu2 from "./views/Menu2";
import Layout from "./views/Layout";
import Home from "./views/Home";
import { createTheme, ThemeProvider } from "@mui/material";
import { AlertProvider } from "./components/AlertContext";
import { LoadingProvider } from "./components/LoadingContext"; // 추가

const theme = createTheme({
    typography: {
        fontFamily: "Pretendard",
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AlertProvider>
                <LoadingProvider> 
                    <BrowserRouter>
                        <Routes>
                            <Route path="/Login" element={<Login />} />
                            <Route path="/Join" element={<Join />} />
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Home />} />
                                <Route path="Menu1" element={<Menu1 />} />
                                <Route path="Menu2" element={<Menu2 />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </LoadingProvider> 
            </AlertProvider>
        </ThemeProvider>
    );
}

export default App;
