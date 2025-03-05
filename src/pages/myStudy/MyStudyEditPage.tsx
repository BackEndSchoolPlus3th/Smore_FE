import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../widgets/sidebar/Sidebar";
import Navbar from "../../widgets/navbarArticle/Navbar";

const MyStudyEditPage = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    files: []
  });

  const handleStudySelect = (study) => {
    setSelectedStudy(study);
  };

  const contentRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const goToStudyMainPage = () => {
    navigate("/mystudy");
  };
  const goToSchedulePage = () => {
    navigate("/mystudyschedule");
  };
  const goToDocumentPage = () => {
    navigate("/document");
  };
  const goToStudyArticlePage = () => {
    navigate("/study/:studyId/article");
  };
  const goToSettingPage = () => {
    navigate("/studysetting");
  };
  const goToStudyEditPage = () => {
    navigate("/studyedit");
  };
  const goToStudyArticleDetailPage = () => {
    navigate("/studydetail");
  }

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      files: [...prevData.files, ...files]
    }));
  };

  const handleRemoveFile = (fileIndex) => {
    setFormData((prevData) => {
      const updatedFiles = prevData.files.filter((_, index) => index !== fileIndex); // Remove file by index
      return { ...prevData, files: updatedFiles };
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const userConfirmed = window.confirm("글을 업로드하시겠습니까?");
    if (userConfirmed) {
      alert("글 작성이 완료되었습니다.");
      navigate("/MyStudy"); // Redirect after submission
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

              {/* 파일 업로드 */}
              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-semibold mb-2">파일 업로드</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded cursor-pointer"
                  multiple
                />
                {formData.files.length > 0 && (
                  <div className="mt-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex mb-2">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="ml-2 text-red-600 cursor-pointer"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 업롤드 버튼 */}
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
