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

    // 에디터 및 모달 관련 상태들
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
    const [maxMember, setMaxMember] = useState<number>(0);
    // thumbnail state: 업로드된 썸네일의 S3 URL (문자열)
    const [thumbnail, setThumbnail] = useState<string>('');
    // 다중 이미지 업로드 결과 (콤마로 구분된 URL 문자열)
    const [imageUrlsStr, setImageUrlsStr] = useState<string>('');

    // FileUploadButton(또는 MultiImageUpload) 컴포넌트에 접근하기 위한 ref
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

    // 모집기간 유효성 검사 함수
    const isEndDateValid = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        return (
            recruitmentPeriod.end > currentDate &&
            recruitmentPeriod.end > recruitmentPeriod.start
        );
    };

    // 해시태그 입력 처리
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

    /**
     * 모달 내 "확인" 버튼 클릭 시 처리하는 함수
     * - 모든 필드의 유효성을 검사합니다.
     * - 만약 다중 이미지 업로드(MultiImageUpload) 컴포넌트에 선택된 파일이 있다면(아직 업로드되지 않았을 경우),
     *   confirm 창을 띄워 업로드 진행 여부를 확인합니다.
     * - 사용자가 확인하면 multiImageUploadRef.current.uploadFiles()를 호출하여 업로드된 URL 배열을 받고,
     *   이를 콤마로 구분한 문자열(imageUrlsStr)로 변환하고, 첫 번째 URL은 썸네일로 사용합니다.
     * - 이후 게시글 API를 호출합니다.
     */
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
        let finalImageUrlsStr = imageUrlsStr; // 기존 업로드된 이미지 URL 문자열
        // 만약 multiImageUpload에 선택된 파일이 있다면
        if (
            multiImageUploadRef.current &&
            multiImageUploadRef.current.getSelectedCount() > 0
        ) {
            const shouldUpload = window.confirm(
                '선택된 이미지 파일이 있으나 아직 업로드되지 않았습니다. 업로드 후 진행하시겠습니까?'
            );
            if (!shouldUpload) {
                // 사용자가 취소하면 게시글 업로드 중단
                return;
            }
            // 파일 업로드 진행
            const uploadedUrls =
                await multiImageUploadRef.current.uploadFiles();
            if (uploadedUrls && uploadedUrls.length > 0) {
                finalImageUrlsStr = uploadedUrls.join(',');
                // 썸네일이 없으면 첫 번째 URL을 thumbnail로 설정
                if (!thumbnail) {
                    setThumbnail(uploadedUrls[0]);
                }
            } else {
                alert(
                    '이미지 업로드가 완료되지 않았습니다. 다시 시도해주세요.'
                );
                return;
            }
        }

        try {
            await postRecruitmentArticle({
                studyId,
                title,
                content,
                introduction,
                hashtags,
                region,
                recruitmentPeriod,
                maxMember,
                thumbnail, // 업로드된 썸네일의 S3 URL
                imageUrls: finalImageUrlsStr, // 콤마로 구분된 다중 이미지 URL 문자열
            });
            closeModal();
            alert('모집글이 성공적으로 게시되었습니다.');
        } catch (error) {
            console.error('모집글 게시 중 오류 발생:', error);
            alert('모집글 게시 중 오류가 발생했습니다.');
        }
    };

    // 업로드 경로는 studyId 기반으로 설정합니다.
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

            {/* 본문 영역: 에디터와 미리보기 */}
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
