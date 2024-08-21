// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import Login from './views/Login';
import Join from './views/Join';
import Menu1 from './views/Menu1';
import Menu2 from './views/Menu2';
import Layout from './views/Layout';
import Home from './views/Home';
import Admin from './views/Admin'; 
import { createTheme, ThemeProvider } from '@mui/material';
import { AlertProvider } from './components/AlertContext';
import { LoadingProvider } from './components/LoadingContext';
import { AuthProvider } from './components/AuthContext';


const theme = createTheme({
    typography: {
        fontFamily: 'Pretendard',
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AlertProvider>
                <LoadingProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/Login" element={<Login />} />
                                <Route path="/Join" element={<Join />} />
                                <Route path="/" element={<Layout />}>
                                    <Route index element={<Home />} />
                                    <Route path="Menu1" element={<Menu1 />} />
                                    <Route path="Menu2" element={<Menu2 />} />
                                    <Route path="Admin" element={<Admin />} /> 
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </AuthProvider>
                </LoadingProvider>
            </AlertProvider>
        </ThemeProvider>
    );
}

export default App;
