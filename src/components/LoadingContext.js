import React, { createContext, useState, useContext } from "react";
import ClipLoader from "react-spinners/ClipLoader";

// 로딩 컨텍스트 생성
const LoadingContext = createContext();

// 로딩 컨텍스트 프로바이더 생성
export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
            {loading && (
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <ClipLoader color="#17458d" size={50} />
                </div>
            )}
        </LoadingContext.Provider>
    );
};

// 로딩 컨텍스트를 사용하는 커스텀 훅
export const useLoading = () => useContext(LoadingContext);
