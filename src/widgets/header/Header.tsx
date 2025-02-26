// import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate("/");
  };

  const goToChatPage = () => {
    navigate("/chat");
  };

  const goToStudyMainPage = () => {
    navigate("/mystudy");
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between bg-gray-300 p-4">
      <div className="text-5xl font-bold cursor-pointer" onClick={goToMainPage}>
        LOGO
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="text-lg font-semibold cursor-pointer"
          onClick={goToStudyMainPage}
        >
          내스터디
        </button>
        <button
          className="text-lg font-semibold cursor-pointer"
          onClick={goToChatPage}
        >
          채팅페이지
        </button>
        <div className="text-lg font-semibold cursor-pointer">알림</div>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
          onClick={goToLoginPage}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default Header;