import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../widgets/sidebar/Sidebar";
import Navbar from "../../widgets/navbarArticle/Navbar";

const MyStudyEditPage = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // 사이드바에서 스터디 선택 처리
  const handleStudySelect = (study) => {
    if (study && study.id) {
      navigate(`/study/${study.id}/edit`);
      setSelectedStudy(study);
    } else {
      console.error("선택된 스터디에 id가 없습니다.");
    }
  };

  const contentRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const token = localStorage.getItem("accessToken");

  const fetchStudies = async () => {
    try {
      const response = await fetch(`http://localhost:8090/api/v1/user/studies`, {
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

  // 글 작성 후 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm("글을 업로드하시겠습니까?");
    if (userConfirmed) {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);

      console.log('Form Data:', formDataToSend);

      try {
        const response = await fetch(`http://localhost:8090/api/v1/study/${studyId}/articles`, {
          method: "POST",
          headers: {
            "Authorization": `${token}`,
          },
          body: formDataToSend,
        });

        if (response.ok) {
          const data = await response.json();
          alert("글 작성이 완료되었습니다.");
          navigate(`/study/${studyId}`);
        } else {
          alert("글 작성에 실패했습니다.");
        }
      } catch (error) {
        console.error("글 작성 실패:", error);
      }
    } else {
      console.log("글 작성을 취소했습니다.");
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, [formData.content]);

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      <div className="flex flex-1">
        {/* 사이드바 */}
        <Sidebar
          studies={studies}
          onStudySelect={handleStudySelect}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* 버튼을 클릭하여 사이드바를 열고 닫을 수 있도록 */}
        <div className="bg-muted-purple">
          <button
            onClick={toggleSidebar}
            className="px-4 py-2 bg-dark-purple text-white mb-4"
          >
            {isSidebarOpen ? '=' : '='}
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 pt-0 p-6 bg-purple-100">
          <div>
            {/* 네브 바 */}
            <Navbar />
          </div>

          {/* 글쓰기 폼 */}
          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">글 작성</h2>
            <form onSubmit={handleSubmit}>
              {/* 제목 입력 */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-semibold mb-2">제목</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* 내용 입력 */}
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-semibold mb-2">내용</label>
                <textarea
                  ref={contentRef}
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* 업로드 버튼 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-dark-purple text-white font-semibold rounded"
                >
                  업로드
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStudyEditPage;
