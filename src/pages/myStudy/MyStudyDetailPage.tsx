import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../widgets/sidebar/Sidebar";
import Navbar from "../../widgets/navbarArticle/Navbar";

const MyStudyDetailPage = () => {
  const navigate = useNavigate();
  const { studyId, articleId } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ title: "", content: "" });

  const [studies, setStudies] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const token = localStorage.getItem("accessToken");

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const fetchCurrentUser = async () => {
    const response = await fetch('http://localhost:8090/api/v1/urrent-user', {
      method: 'GET',
      headers: {
        'Authorization': `${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;  // { id, username, name 등 로그인한 사용자 정보 반환 }
    } else {
      throw new Error('사용자 정보를 가져올 수 없습니다.');
    }
  };

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

  const handleStudySelect = (study) => {
    if (study && study.id) {
      setSelectedStudy(study);
      navigate(`/study/${study.id}`);  // studyId를 URL에 추가하여 해당 스터디 페이지로 이동
    }
  };

  const handleEditArticle = () => {
    setIsEditing(true); // 수정 폼을 보이게 설정
    setEditedData({ title: articleData.title, content: articleData.content }); // 수정할 데이터 초기화
  };

  const handleSaveEdit = async () => {
    const updatedData = {
      title: editedData.title,
      content: editedData.content,
    };

    try {
      const response = await fetch(`http://localhost:8090/api/v1/study/${studyId}/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('수정 성공');
        const data = await response.json();
        setArticleData(data);  // 수정된 데이터로 업데이트
        setIsEditing(false);    // 수정 폼을 닫음
        navigate(`/study/${studyId}`, { replace: true });
      } else {
        alert('수정 실패');
      }
    } catch (error) {
      console.error('수정 실패:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // 수정 취소
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await fetch(`http://localhost:8090/api/v1/study/${studyId}/articles/${articleId}`, {
          method: "GET",
          headers: {
            "Authorization": `${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setArticleData(data);
        } else {
          console.error("게시글을 불러오는 데 실패했습니다.");
          navigate(`/`, { replace: true });
        }
      } catch (error) {
        console.error("게시글 불러오기 오류:", error);
        navigate(`/`, { replace: true });
      }
    };

    const fetchUserData = async () => {
      try {
        const userResponse = await fetchCurrentUser();
        setCurrentUser(userResponse); // 현재 로그인한 사용자 정보 저장
      } catch (error) {
        console.error('사용자 정보 로딩 실패:', error);
      }
    };

    fetchArticleData();
    fetchUserData();
  }, [studyId, articleId, navigate]);

  const handleDeleteArticle = async () => {
    const confirmDelete = window.confirm('정말로 이 게시글을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8090/api/v1/study/${studyId}/articles/${articleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${token}`,
          },
        });
        if (response.ok) {
          alert('삭제 성공');
        navigate(`/study/${studyId}/articles`, { replace: true });
        } else {
          alert('삭제 실패');
        }
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  useEffect(() => {
    const fetchArticleData = async () => {
      try {

        const response = await fetch(`http://localhost:8090/api/v1/study/${studyId}/articles/${articleId}`, {
          method: "GET",
          headers: {
            "Authorization": `${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setArticleData(data);
        } else {
          console.error("게시글을 불러오는 데 실패했습니다.");
          navigate(`/study/${studyId}`, { replace: true });
        }
      } catch (error) {
        console.error("게시글 불러오기 오류:", error);
      }

    };

    const fetchUserData = async () => {
      try {
        const userResponse = await fetchCurrentUser();
        setCurrentUser(userResponse); // 현재 로그인한 사용자 정보 저장
      } catch (error) {
        console.error('사용자 정보 로딩 실패:', error);
      }
    };

    fetchArticleData();
    fetchUserData();
  }, [studyId, articleId, articleData]);

  if (!articleData || !currentUser) {
    return <div>Loading...</div>;
  }
  const isAuthor = articleData.member.id === currentUser;

  if (!articleData) return <div>Loading...</div>;
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

          {/* 게시글 상세 정보 */}
          <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
            <form>
              {/* 제목 */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-semibold mb-2">제목</label>
                {isEditing ? (
                <input
                type="text"
                id="title"
                name="title"
                value={editedData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-gray-100"
              />
              ) : (
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={articleData.title}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                )}
              </div>
              <div>
                <div className="mb-6">
                  <label htmlFor="username" className="block text-sm font-semibold mb-2">작성자</label>
                  <input
                    id="username"
                    name="username"
                    value={articleData.member.nickname}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
              </div>
              {/* 내용 */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-semibold mb-2">내용</label>
                {isEditing ? (
                <textarea
                id="content"
                name="content"
                value={editedData.content}
                onChange={handleInputChange}
                rows="6"
                className="w-full p-2 border rounded bg-gray-100"
              />
              ) : (
                <textarea
                  id="content"
                  name="content"
                  value={articleData.content}
                  disabled
                  rows="6"
                  className="w-full p-2 border rounded bg-gray-100"
                />
              )}
              </div>
              {isAuthor && (
                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <button type="button" className="p-1 bg-purple-500 text-white rounded cursor-pointer" onClick={handleSaveEdit}>저장</button>
                      <button type="button" className="p-1 bg-gray-500 text-white rounded cursor-pointer" onClick={handleCancelEdit}>취소</button>
                    </>
                  ) : (
                    <>
                  <button className="p-1 bg-purple-500 text-white rounded cursor-pointer" onClick={handleEditArticle}>수정</button>
                  <button className="p-1 bg-purple-500 text-white rounded cursor-pointer" onClick={handleDeleteArticle}>삭제</button>
                  </>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStudyDetailPage;
