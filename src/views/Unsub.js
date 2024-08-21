import React from 'react';
import { useRecoilState } from "recoil";
import { useNavigate } from 'react-router-dom';
import { useAlert } from "../components/AlertContext";
import { AtomN } from "../views/layouts/AtomN";

const Unsub = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [user, setUser] = useRecoilState(AtomN);

  const handleUnsub = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://192.168.0.144:8080/members/unsub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('회원탈퇴 요청에 실패했습니다.');
      }

      const data = await response.text();
      alert(data);

      setUser(""); // 사용자 상태 초기화
      localStorage.removeItem("user"); // localStorage에서 사용자 정보 제거
      localStorage.removeItem("token"); // localStorage에서 토큰 제거

      // 로그인 페이지로 리다이렉트
      navigate('/login');
    } catch (error) {
      console.error('There was an error unsubscribing!', error);
      showAlert("회원탈퇴 중 문제가 발생했습니다.", "error");
    }
  };

  return (
    <button onClick={handleUnsub} className='text-sm text-white font-light w-full border rounded-md p-2'>
      회원탈퇴
    </button>
  );
};

export default Unsub;
