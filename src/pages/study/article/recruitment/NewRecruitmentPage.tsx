import React, { useState, useRef, KeyboardEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './NewRecruitmentStyle.css';
import {
    Editor,
    MarkdownPreview,
    RecruitmentModal,
} from '../../../../components';
import {
    postRecruitmentArticle,
    MultiImageUploadRef,
} from '../../../../features';

const NewRecruitmentPage: React.FC = () => {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    // 에디터와 모달 관련 상태들
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [introduction, setIntroduction] = useState('');
    const [hashtagInput, setHashtagInput] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [region, setRegion] = useState('');
    const [recruitmentPeriod, setRecruitmentPeriod] = useState({
        start: '',
        end: '',
    });
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [maxMember, setMaxMember] = useState<number>(0);

    const multiImageUploadRef = useRef<MultiImageUploadRef>(null);

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    if (!studyId) {
        alert('잘못된 접근입니다.');
        navigate('/');
        return null;
    }

    // 모달 열기/닫기
    const handlePublishClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, 300);
    };

    const isEndDateValid = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        return (
            recruitmentPeriod.end > currentDate &&
            recruitmentPeriod.end > recruitmentPeriod.start
        );
    };

    // 해시태그 처리 함수
    const handleHashtagKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        const newHashtag = hashtagInput.trim().toLowerCase();
        const hashtagRegex = /^[a-zA-Z0-9가-힣]+$/;
        if (
            e.key === 'Enter' &&
            newHashtag !== '' &&
            hashtags.length < 5 &&
            !hashtags.includes(newHashtag) &&
            hashtagRegex.test(newHashtag)
        ) {
            setHashtags([...hashtags, newHashtag]);
            setHashtagInput('');
        }
    };

    const handleRemoveHashtag = (index: number) => {
        setHashtags(hashtags.filter((_, i) => i !== index));
    };

    // 모달 내 "확인" 버튼 클릭시 호출
    const handleModalConfirm = async () => {
        if (
            !title ||
            !content ||
            !introduction ||
            !region ||
            !recruitmentPeriod.start ||
            !recruitmentPeriod.end ||
            !isEndDateValid()
        ) {
            alert('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        try {
            // 먼저 MultiImageUpload 컴포넌트의 uploadFiles를 호출하여 이미지 업로드
            let uploadedUrls: string[] = [];
            if (multiImageUploadRef.current) {
                uploadedUrls = await multiImageUploadRef.current.uploadFiles();
                console.log('업로드된 이미지 URL들:', uploadedUrls);
            }

            await postRecruitmentArticle({
                studyId,
                title,
                content,
                introduction,
                hashtags,
                region,
                recruitmentPeriod,
                maxMember,
                thumbnail,
            });
            closeModal();
            alert('모집글이 성공적으로 게시되었습니다.');
        } catch (error) {
            console.error('모집글 게시 중 오류 발생:', error);
            alert('모집글 게시 중 오류가 발생했습니다.');
        }
    };

    const uploadPath = `study/${studyId}/images`;

    return (
        <div className="flex flex-col min-h-full">
            {/* 상단 헤더 영역 */}
            <div className="sticky top-0 bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">새 모집글 작성</h1>
                <div className="flex space-x-4">
                    <button className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded focus:outline-none cursor-pointer">
                        임시저장
                    </button>
                    <button
                        onClick={handlePublishClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none cursor-pointer"
                    >
                        게시
                    </button>
                </div>
            </div>

            {/* 본문 영역 */}
            <div className="p-4">
                <div className="flex flex-row space-x-4">
                    <Editor
                        title={title}
                        content={content}
                        setTitle={setTitle}
                        setContent={setContent}
                        textAreaRef={textAreaRef}
                        uploadPath={uploadPath}
                        multiImageUploadRef={multiImageUploadRef}
                    />
                    <MarkdownPreview content={content} />
                </div>
            </div>

            {/* 모달 팝업 */}
            {isModalOpen && (
                <RecruitmentModal
                    title={title}
                    introduction={introduction}
                    setIntroduction={setIntroduction}
                    hashtagInput={hashtagInput}
                    setHashtagInput={setHashtagInput}
                    hashtags={hashtags}
                    onHashtagKeyPress={handleHashtagKeyPress}
                    onRemoveHashtag={handleRemoveHashtag}
                    region={region}
                    setRegion={setRegion}
                    recruitmentPeriod={recruitmentPeriod}
                    setRecruitmentPeriod={setRecruitmentPeriod}
                    maxMember={maxMember}
                    setMaxMember={setMaxMember}
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                    isClosing={isClosing}
                    closeModal={closeModal}
                    onConfirm={handleModalConfirm}
                    isEndDateValid={isEndDateValid}
                />
            )}
        </div>
    );
};

export default NewRecruitmentPage;
