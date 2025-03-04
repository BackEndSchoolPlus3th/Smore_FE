import React, { useState } from "react";
import axios from 'axios';
import "./LoginPage.css"; // CSS 파일을 따로 관리
import { apiClient } from "../../shared";
const LoginPage = () => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태

  // 이메일 입력 변경 핸들러
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // 비밀번호 입력 변경 핸들러
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // 로그인 요청 함수
  const handleLogin = async () => {
    // 요청 보낼 데이터
    console.log(email," ",password);
    try {
      const response = await axios.post(
        "http://localhost:8090/api/member/login",
        {
          email,
          password
        },
        {
          withCredentials: true, // 쿠키 포함
        }
      );
      console.log("response ",response.headers);
      const accessToken = response.headers["authorization"];
      console.log("accessToken",accessToken);
      if(accessToken){
        localStorage.setItem("accessToken", accessToken);
      }
      window.location.href = '/';
      alert("로그인 성공!");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="container bg-gray-300">
      <div className="login-box">
        <h1 className="title">Smore</h1>
        <div className="input-group">
          <label>이메일 :</label>
          <input
            type="text"
            className="input-field"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="input-group">
          <label>비밀번호 :</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;