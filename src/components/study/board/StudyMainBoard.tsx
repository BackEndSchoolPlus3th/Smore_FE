import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient, CancleButton } from '../../../shared';
import { BookOpen } from 'lucide-react';
import { ArticleCard } from '../../../widgets';
import { StudyResponse } from '../../../entities';

const StudyMainBoard: React.FC = () => {
    const { studyId } = useParams();
    const navigate = useNavigate();
    const [study, setStudy] = useState<StudyResponse>();
    const [articles, setArticles] = useState<StudyResponse[]>([]);

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

    const handleExitClick = async () => {
        const userConfirmed = window.confirm('탈퇴하시겠습니까?');
        if (userConfirmed) {
            try {
                const response = await apiClient.delete(
                    `/api/v1/study/${studyId}/delete`
                );

                if (response.status === 200) {
                    alert('탈퇴가 완료되었습니다.');
                    navigate('/'); // 탈퇴 후 메인 페이지로 이동
                } else {
                    throw new Error(`탈퇴 요청 실패: ${response.statusText}`);
                }
            } catch (error) {
                console.error('탈퇴 요청 실패:', error);
                alert('탈퇴 요청 실패');
            }
        }
    };

    useEffect(() => {
        fetchStudy();
    }, []);

    useEffect(() => {
        if (studyId) {
            apiClient
                .get(`/api/v1/study/${studyId}/articles`)
                .then((response) => {
                    setArticles(response.data);
                })
                .catch((error) =>
                    console.error('게시글 가져오기 실패:', error)
                );
        }
    }, [studyId]);

    if (!study) {
        return <div>로딩 중...</div>;
    }

    return (
        <>
            <div className="col-start-3 col-span-3 flex justify-center items-center">
                <div className="w-full aspect-w-1 aspect-h-1">
                    <BookOpen color={'black'} className="w-full h-full" />
                </div>
            </div>
            <div className="col-span-5 flex flex-col border border-gray-200 rounded-md p-5 shadow-md">
                <div className="text-xl font-bold pb-5">{study.title}</div>
                <div className="h-30 text-sm text-gray-700 pb-5">
                    {study.introduction}
                </div>
                <div className="text-sm text-gray-700">
                    {study.hashTags && study.hashTags.split(', ')}
                </div>
            </div>
            <div className="col-start-12 col-span-1 flex justify-end items-start h-fit">
                <CancleButton label="탈퇴" onClick={handleExitClick} />
            </div>

            {articles.slice(0, 8).length > 0 ? (
                articles
                    .slice(0, 8)
                    .map((article) => (
                        <ArticleCard
                            key={article.id}
                            title={article.title}
                            content={article.introduction}
                            imageUrl={
                                article.imageUrls
                                    ? article.imageUrls.split(',')[0]
                                    : null
                            }
                            hashtagList={
                                article.hashTags
                                    ? article.hashTags.split(',')
                                    : null
                            }
                            link={`/study/${studyId}/article/${article.id}`}
                        />
                    ))
            ) : (
                <div className="text-center text-gray-500">
                    게시글이 없습니다.
                </div>
            )}
        </>
    );
};

export default StudyMainBoard;
