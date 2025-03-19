import { apiClient, CancleButton, SubmitButton } from '../../../../shared';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MarkdownPreview } from '../../../../components';

interface ArticleData {
    title: string;
    content: string;
    member: {
        id: string;
        nickname: string;
    };
    imageUrls?: string;
}

interface EditedData {
    title: string;
    content: string;
}

interface InputChangeEvent
    extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}

const StudyArticleDetailBoard: React.FC = () => {
    const navigate = useNavigate();
    const { studyId, articleId } = useParams();

    const [articleData, setArticleData] = useState<ArticleData | null>(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ title: '', content: '' });

    const [permissions, setPermissions] = useState({
        recruitManage: [],
        articleManage: [],
        calendarManage: [],
        settingManage: [],
    });

    const fetchCurrentUser = async () => {
        try {
            // apiClient를 사용하여 GET 요청
            const response = await apiClient.get('/api/v1/current-user');

            if (response.status === 200) {
                return response.data; // 사용자 정보를 반환
            } else {
                throw new Error('사용자 정보를 가져올 수 없습니다.');
            }
        } catch (error) {
            console.error('사용자 정보 가져오기 실패:', error);
            throw error; // 오류 처리
        }
    };

    const fetchPermissions = async (studyId: string) => {
        try {
            // apiClient를 사용하여 GET 요청
            const response = await apiClient.get(
                `/api/v1/study/${studyId}/checkPermission`
            );

            if (response.status === 200) {
                setPermissions(response.data); // 권한 데이터를 상태에 저장
            } else {
                throw new Error('권한을 조회할 수 없습니다.');
            }
        } catch (error) {
            console.error('권한 조회 실패:', error);
        }
    };

    useEffect(() => {
        if (studyId) {
            fetchPermissions(studyId);
        }
    }, [studyId]);

    const handleEditArticle = () => {
        setIsEditing(true); // 수정 폼을 보이게 설정
        if (articleData) {
            setEditedData({
                title: articleData.title,
                content: articleData.content,
            }); // 수정할 데이터 초기화
        }
    };

    const handleSaveEdit = async () => {
        const updatedData = {
            title: editedData.title,
            content: editedData.content,
        };

        try {
            // apiClient를 사용하여 PUT 요청
            const response = await apiClient.put(
                `/api/v1/study/${studyId}/articles/${articleId}`,
                updatedData
            );

            if (response.status === 200) {
                alert('수정 성공');
                setArticleData(response.data); // 수정된 데이터로 업데이트
                setIsEditing(false); // 수정 폼을 닫음
                navigate(`/study/${studyId}`, { replace: true });
            } else {
                alert('수정 실패');
            }
        } catch (error) {
            console.error('수정 실패:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleInputChange = (e: InputChangeEvent) => {
        const { name, value } = e.target;
        setEditedData((prevState: EditedData) => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                // apiClient를 사용하여 GET 요청
                const response = await apiClient.get(
                    `/api/v1/study/${studyId}/articles/${articleId}`
                );

                if (response.status === 200) {
                    setArticleData(response.data); // 게시글 데이터를 상태로 설정
                } else {
                    console.error('게시글을 불러오는 데 실패했습니다.');
                    navigate(`/`, { replace: true });
                }
            } catch (error) {
                console.error('게시글 불러오기 오류:', error);
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
        const confirmDelete = window.confirm(
            '정말로 이 게시글을 삭제하시겠습니까?'
        );
        if (confirmDelete) {
            try {
                // apiClient를 사용하여 DELETE 요청
                const response = await apiClient.delete(
                    `/api/v1/study/${studyId}/articles/${articleId}`
                );

                if (response.status === 200) {
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
                // apiClient를 사용하여 GET 요청
                const response = await apiClient.get(
                    `/api/v1/study/${studyId}/articles/${articleId}`
                );

                if (response.status === 200) {
                    setArticleData(response.data); // 성공적으로 데이터 설정
                } else {
                    console.error('게시글을 불러오는 데 실패했습니다.');
                    navigate(`/study/${studyId}`, { replace: true });
                }
            } catch (error) {
                console.error('게시글 불러오기 오류:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userResponse = await fetchCurrentUser(); // 이미 apiClient를 사용하는 fetchCurrentUser 함수가 있음
                setCurrentUser(userResponse); // 현재 로그인한 사용자 정보 저장
            } catch (error) {
                console.error('사용자 정보 로딩 실패:', error);
            }
        };

        fetchArticleData();
        fetchUserData();
    }, [studyId, articleId, navigate]);

    // const handleDownload = async (key: string) => {
    //     try {
    //         // apiClient 사용하여 GET 요청 보내기
    //         const response = await apiClient.get(
    //             `/api/v1/study/download/${key}`,
    //             {
    //                 responseType: 'blob', // Blob 응답을 받을 수 있도록 설정
    //             }
    //         );

    //         if (response.status === 200) {
    //             const blob = response.data; // Blob 데이터
    //             const downloadUrl = window.URL.createObjectURL(blob);
    //             const link = document.createElement('a');
    //             link.href = downloadUrl;
    //             link.download = key.split('/').pop() || 'download'; // S3 key에서 파일 이름 추출
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //         } else {
    //             alert('파일 다운로드 실패');
    //         }
    //     } catch (error) {
    //         console.error('다운로드 중 오류 발생:', error);
    //     }
    // };

    if (!articleData || !currentUser) {
        return <div>Loading...</div>;
    }
    const isAuthor = articleData.member.id === currentUser;

    if (!articleData) return <div>Loading...</div>;

    return (
        <div
            className="flex flex-co bg-[#fafbff] col-span-12 p-6 rounded-lg shadow-lg
        "
        >
            {/* 게시글 상세 정보 */}
            <form className="grid grid-cols-11 gap-6 w-full">
                {/* 제목 */}
                <div className="col-span-12">
                    <label
                        htmlFor="title"
                        className="block text-sm font-semibold mb-2"
                    >
                        제목
                    </label>
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
                <div className="col-span-12">
                    <label
                        htmlFor="username"
                        className="block text-sm font-semibold mb-2"
                    >
                        작성자
                    </label>
                    <input
                        id="username"
                        name="username"
                        value={articleData.member.nickname}
                        disabled
                        className="w-full p-2 border rounded bg-gray-100"
                    />
                </div>
                {/* 내용 */}
                <div className="col-span-12">
                    <label
                        htmlFor="content"
                        className="block text-sm font-semibold mb-2"
                    >
                        내용
                    </label>
                    {isEditing ? (
                        <textarea
                            id="content"
                            name="content"
                            value={editedData.content}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                    ) : (
                        <MarkdownPreview content={articleData.content} />
                    )}
                </div>
                {/* 첨부파일 */}
                {articleData.imageUrls && (
                    <div className="col-span-12 mt-6">
                        <label className="block text-sm font-semibold mb-2">
                            첨부파일
                        </label>
                        <div>
                            {/* 이미지라면 미리보기 */}
                            {articleData.imageUrls.match(
                                /\.(jpeg|jpg|gif|png)$/
                            ) && (
                                <img
                                    src={articleData.imageUrls}
                                    alt="첨부파일"
                                    className="w-24 h-24 object-cover mt-2"
                                />
                            )}
                        </div>
                    </div>
                )}

                {(isAuthor || permissions.articleManage) &&
                    (isEditing ? (
                        <>
                            <CancleButton
                                label="취소"
                                onClick={handleCancelEdit}
                                className="col-start-11 col-span-1"
                            />
                            <SubmitButton
                                label="저장"
                                onClick={handleSaveEdit}
                                className="col-start-12 col-span-1"
                            />
                        </>
                    ) : (
                        <>
                            <CancleButton
                                label="삭제"
                                onClick={handleDeleteArticle}
                                className="col-start-11 col-span-1"
                            />
                            <SubmitButton
                                label="수정"
                                onClick={handleEditArticle}
                                className="col-start-12 col-span-1"
                            />
                        </>
                    ))}
            </form>
        </div>
    );
};

export default StudyArticleDetailBoard;
