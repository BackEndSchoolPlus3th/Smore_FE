import React, { useState, useRef } from 'react';
import { apiClient, SubmitButton } from '../../../../shared';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor, MarkdownPreview } from '../../../../components';
import { MultiImageUploadRef } from '../../../../features';

const StudyArticleRegisterBoard: React.FC = () => {
    const { studyId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState<string>('');
    const multiImageUploadRef = useRef<MultiImageUploadRef>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    if (!studyId) {
        alert('잘못된 접근입니다.');
        navigate('/');
        return null;
    }

    const handlePublishClick = () => {
        handleSubmit();
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            alert('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        let finalImageUrl: string | null = null;

        if (
            multiImageUploadRef.current &&
            multiImageUploadRef.current.getSelectedCount() > 0
        ) {
            // 업로드된 이미지 URL 목록을 가져옵니다
            const uploadedUrls =
                await multiImageUploadRef.current.uploadFiles();
            if (uploadedUrls && uploadedUrls.length > 0) {
                finalImageUrl = uploadedUrls[0]; // 첫 번째 이미지 URL을 사용
                if (!thumbnail) {
                    setThumbnail(uploadedUrls[0]); // 첫 번째 이미지 URL을 썸네일로 설정
                }
            } else {
                alert(
                    '이미지 업로드가 완료되지 않았습니다. 다시 시도해주세요.'
                );
                return;
            }
        }

        // 서버로 전송할 FormData 생성
        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('content', content);

        // 이미지 URL이 있다면, file로 추가
        if (finalImageUrl) {
            formDataToSend.append('file', finalImageUrl); // 단일 이미지 URL을 전송
        }

        try {
            const response = await apiClient.post(
                `/api/v1/study/${studyId}/articles`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 201) {
                alert('글 작성이 완료되었습니다.');
                navigate(`/study/${studyId}/article`);
            } else {
                const errorData = response.data;
                console.error('서버 응답 오류:', errorData);
                alert(
                    '글 작성에 실패했습니다: ' +
                        (errorData.message || '알 수 없는 오류')
                );
            }
        } catch (error) {
            console.error('글 작성 실패:', error);
            alert('글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 업로드 경로는 studyId 기반으로 설정
    const uploadPath = `study/${studyId}/article/images`;

    return (
        <>
            {/* 상단 헤더 */}
            <div
                className="sticky top-0 w-full shadow-md p-2 col-span-12 rounded-md z-30
                grid grid-cols-12 gap-6 h-fit bg-[#fafbff] border border-gray-200"
            >
                <h1
                    className="text-xl font-bold col-span-2
                    flex items-center justify-start ml-4"
                >
                    새 글 작성
                </h1>
                <SubmitButton
                    label="임시저장"
                    onClick={() => alert('임시저장')}
                    className="col-span-2 col-start-10 justify-self-end"
                    color="bg-gray-300 text-white"
                    clickColor="hover:bg-gray-400 active:bg-gray-500"
                    isFit={true}
                />
                <SubmitButton
                    label="게시"
                    onClick={handlePublishClick}
                    className="col-span-1"
                    isFit={false}
                />
            </div>


            <div className="col-span-6 min-h-[49rem]">
                <Editor
                    title={title}
                    content={content}
                    setTitle={setTitle}
                    setContent={setContent}
                    textAreaRef={textAreaRef}
                    uploadPath={uploadPath}
                    multiImageUploadRef={multiImageUploadRef}
                />
            </div>
            <div className="col-span-6">
                <MarkdownPreview content={content} />

            </div>
        </>
    );
};

export default StudyArticleRegisterBoard;
