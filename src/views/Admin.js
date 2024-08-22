import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../assets/theme/login.module.scss";
import { ReactComponent as Person } from "../assets/icons/svg/admin.svg";

const Admin = () => {
  const { auth, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth || !isAdmin) {
      // 인증되지 않았거나 admin이 아닌 경우 메시지 설정
      setError("관리자만 접속 가능한 화면입니다.");
      // 일정 시간 후 자동으로 로그인 페이지로 리디렉션할 수도 있습니다.
      setTimeout(() => {
          navigate('/Login');
      }, 6000); // 6초 후 리디렉션
    }
  }, [auth, isAdmin, navigate]);

  if (error) {
    return (
      <div className="w-full h-2/3 flex justify-center flex-col items-center">
        <Person width={500} height={500}/>
        <h1 className="text-2xl text-sky-600 font-bold py-2">{error}</h1>
        <h1>잠시 후 메인 화면으로 이동합니다.</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Page</h1>
      {/* 관리자 전용 콘텐츠 */}
    </div>
  );
};

export default Admin;
