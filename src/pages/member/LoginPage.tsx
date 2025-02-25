import React from "react";
import "./LoginPage.css"; // CSS 파일을 따로 관리

const LoginPage = () => {
  return (
    <div className="container bg-gray-300">
      <div className="login-box">
        <h1 className="title">Smore</h1>
        <div className="input-group">
          <label>이메일 :</label>
          <input type="text" className="input-field" />
        </div>
        <div className="input-group">
          <label>비밀번호 :</label>
          <input type="password" className="input-field" />
        </div>
        <button className="login-button">로그인</button>
      </div>
    </div>
  );
};

export default LoginPage;