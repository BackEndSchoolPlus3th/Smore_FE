import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../widgets/sidebar/Sidebar";
import Navbar from "../../widgets/navbarArticle/Navbar";

const MyStudyPage = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);

  // 사이드바 토글
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // 스터디 선택 시 해당 스터디 페이지로 이동
  const handleStudySelect = (study) => {
    if (study && study.id) {
      setSelectedStudy(study);
      navigate(`/study/${study.id}`);  // studyId를 URL에 추가하여 해당 스터디 페이지로 이동
    }
  };

  // 사용자의 스터디 목록을 가져오는 함수
  const token = localStorage.getItem("accessToken");

  const fetchStudies = async () => {
    try {
      const response = await fetch("http://localhost:8090/api/v1/user/studies", {
        method: "GET",
        headers: {
          "Authorization": `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setStudies(data);
    } catch (error) {
      console.error("스터디 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-1">
        {/* 사이드바 */}
        <Sidebar
          studies={studies}
          onStudySelect={handleStudySelect}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* 사이드바 토글 버튼 */}
        <div className="bg-muted-purple">
          <button
            onClick={toggleSidebar}
            className="px-4 py-2 bg-dark-purple text-white mb-4"
          >
            {isSidebarOpen ? "=" : "="}
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 pt-0 p-6 bg-purple-100">
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default MyStudyPage;
