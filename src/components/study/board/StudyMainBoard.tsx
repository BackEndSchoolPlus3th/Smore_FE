import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../shared';

interface Study {
    id: number;
    title: string;
    introduction: string;
    hashTags: string[];
}

const StudyMainBoard: React.FC = () => {
    const { studyId } = useParams();
    const navigate = useNavigate();
    const [study, setStudy] = useState<Study>();
    const token = localStorage.getItem("accessToken");
    const [studies, setStudies] = useState([]);
    const [articles, setArticles] = useState([]);

    const fetchStudy = async () => {
        try {
            const response = await apiClient(`/api/v1/study/${studyId}`);

            if (response.status !== 200) {
                throw new Error(`Error: ${response.status}`);
            }

            setStudy(response.data);
        } catch (error) {
            console.error('스터디 정보 가져오기 실패:', error);
        }
    };

    const fetchStudies = async () => {
        try {
            const response = await apiClient.get(`/api/v1/user/studies`);

            setStudies(response.data);
        } catch (error) {
            console.error("스터디 목록 가져오기 실패:", error);
        }
    };

    const handleExitClick = async () => {
        const userConfirmed = window.confirm("탈퇴하시겠습니까?");
        if (userConfirmed) {
            try {
                const response = await fetch(`/api/v1/study/${studyId}/delete`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `${token}`,
                        "Content-Type": "application/json",  // Content-Type이 필요할 경우 추가
                    },
                });

                if (!response.ok) {
                    throw new Error(`탈퇴 요청 실패: ${response.statusText}`);
                }

                alert("탈퇴가 완료되었습니다.");
                navigate("/");  // 탈퇴 후 메인 페이지로 이동
            } catch (error) {
                console.error("탈퇴 요청 실패:", error);
                alert("탈퇴 요청 실패");
            }
        }
    };

    useEffect(() => {
        fetchStudy();
        fetchStudies();
    }, []);

    useEffect(() => {
        if (studyId) {
            apiClient.get(`/api/v1/study/${studyId}/articles`)
                .then((response) => {
                    setArticles(response.data);
                })
                .catch((error) => console.error("게시글 가져오기 실패:", error));
        }
    }, [studyId]);

    const handleArticleClick = (articleId) => {
        navigate(`/study/${studyId}/articles/${articleId}`);
    };

    if (!study) {
        return <div>로딩 중...</div>;
    }

    return (
    <div className='p-10'>
        <div className="flex items-center space-x-4 justify-center">
            <div className="w-50 h-50 bg-gray-500 rounded-full"></div>
            <div className="pl-10">
                <div className="text-xl font-bold pb-5">{study.title}</div>
                <div className="text-sm text-gray-700 pb-5">
                    {study.introduction}
                </div>
                <div className="text-sm text-gray-700">
                    {study.hashTags && study.hashTags.join(', ')}
                </div>
            </div>
        </div>
        <div className="grid grid-cols-4 gap-4 py-10">
            {articles.slice(0, 8).length > 0 ? (
                articles.slice(0, 8).map((article, index) => (
                    <div key={article.id} onClick={() => handleArticleClick(article.id)} className="cursor-pointer p-4 bg-white shadow rounded">
                        <div
                            className="w-full h-32 bg-gray-300"></div>
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="bg-gray-600 w-8 h-8 rounded-full"></div>
                            <button
                                className="text-black text-xl mt-1"
                            >
                                {article.title}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">게시글이 없습니다.</div>
            )}
        </div>

        <div className="flex justify-end">
            <button
                className="px-1 py-1 bg-dark-purple text-white font-semibold cursor-pointer rounded mt-2"
                onClick={handleExitClick}
            >
                탈퇴
            </button>
        </div>
    </div>
    );
};

export default StudyMainBoard;
