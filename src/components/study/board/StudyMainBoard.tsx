import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../shared';
import { CancleButton } from '../../../shared';
import { BookOpen } from 'lucide-react';
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
                const response = await apiClient.delete(`/api/v1/study/${studyId}/delete`);

                if (response.status === 200) {
                    alert("탈퇴가 완료되었습니다.");
                    navigate("/");  // 탈퇴 후 메인 페이지로 이동
                } else {
                    throw new Error(`탈퇴 요청 실패: ${response.statusText}`);
                }
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
        navigate(`/study/${studyId}/article/${articleId}`);
    };

    if (!study) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className='p-10 w-full'>
            <div className="flex items-center space-x-4 justify-normal pb-4 border-b-2 border-gray-300 relative">
    <div className="w-50 h-50 bg-gray-300 rounded-full flex justify-center items-center">
        <BookOpen color={"white"} size={130} />
    </div>
    <div className="pl-10 flex-1 flex flex-col relative">
        <div className="text-xl font-bold pb-5">{study.title}</div>
        <div className="h-30 text-sm text-gray-700 pb-5">
            {study.introduction}
        </div>
        <div className="text-sm text-gray-700">
            {study.hashTags && study.hashTags.join(', ')}
        </div>
        {/* 버튼을 오른쪽 하단에 배치 */}
        <div className="absolute -bottom-6 right-0">
            <CancleButton label="탈퇴" onClick={handleExitClick} />
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

           
        </div>
    );
};

export default StudyMainBoard;
