import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../widgets/sidebar/Sidebar";
import Navbar from "../../widgets/navbarArticle/Navbar";

const MyStudyDocumentPage = () => {
  const navigate = useNavigate();
  const { studyId } = useParams();
  const [files, setFiles] = useState([]);
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      console.log("서버에서 반환된 데이터:", data); // 데이터 확인
      setStudies(data);
    } catch (error) {
      console.error("스터디 목록 가져오기 실패:", error);
    }
  };

  const fetchFiles = async (studyId) => {
    try {
      const response = await fetch(`http://localhost:8090/api/v1/study/document/${studyId}`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("파일 목록 가져오기 실패:", error);
    } finally {
    }
  };
  
  useEffect(() => {
    fetchStudies();
  }, []);

  useEffect(() => {
    if (studyId) {
      fetchFiles(studyId); // URL에서 studyId를 이용해 파일을 자동으로 로드
    }
    fetchStudies(); // 스터디 목록을 항상 로드
  }, [studyId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const handleDownload = (fileName) => {
    alert(`${fileName}을 다운로드합니다.`);
  };

  const handleStudySelect = (study) => {
    setSelectedStudy(study);
  };

  console.log(files);

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

        {/* 문서함 */}
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-bold mb-4">문서함</h2>

          {files.length === 0 ? (
              <p>현재 첨부된 파일이 없습니다.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center">
                    {/* 이미지 미리보기 */}
                    {file && file.match(/\.(jpeg|jpg|gif|png)$/i) && (
                      <div className="w-32 h-32" overflow="hidden">
                        <img
                          src={file}  // 파일의 URL을 사용하여 미리보기
                          alt="첨부파일 미리보기"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="text-lg font-semibold mb-2">{file.name}</div>

                    {/* 다운로드 버튼 */}
                    <button
                      onClick={() => handleDownload(file.url, file.name)}  // 다운로드 URL과 파일 이름을 전달
                      className="px-4 py-2 bg-dark-purple text-white rounded cursor-pointer"
                    >
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default MyStudyDocumentPage;
