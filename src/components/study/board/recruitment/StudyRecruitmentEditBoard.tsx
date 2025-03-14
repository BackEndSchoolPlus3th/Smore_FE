import React, { useState, useRef, KeyboardEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Editor,
    MarkdownPreview,
    RecruitmentModal,
} from '../../../../components';
import {
    postRecruitmentArticle,
    MultiImageUploadRef,
} from '../../../../features';
import { SubmitButton, CancleButton } from '../../../../shared';

const StudyRecruitmentRegisterBoard: React.FC = () => {
    const { studyId, recruitmentId } = useParams<{
        studyId: string;
        recruitmentId: string;
    }>();
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
    // 다중 이미지 업로드 결과는 이제 따로 state로 관리하지 않고, uploadFiles() 호출 시 반환받음

    // FileUploadButton 또는 MultiImageUpload 컴포넌트에 접근하기 위한 ref
    const multiImageUploadRef = useRef<MultiImageUploadRef>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const uploadPath = `study/${studyId}/images`;

    if (!studyId) {
        alert('잘못된 접근입니다.');
        navigate('/');
        return null;
    }

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
     * - 모든 필드의 유효성을 검사
     * - 만약 다중 이미지 업로드에 선택된 파일이 있으면서 아직 업로드되지 않았다면,
     *   confirm 창을 띄워 업로드 진행 여부를 확인
     * - 사용자가 확인하면 multiImageUploadRef.current.uploadFiles()를 호출하여 업로드된 URL 배열을 받고,
     *   이를 그대로 finalImageUrlsList (string[])로 사용하며, 썸네일이 없으면 첫 번째 URL을 thumbnail로 설정
     * - 최종적으로 게시글 API 호출 전에 상태를 콘솔 로그로 확인
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
        let finalImageUrlsList: string[] = [];
        if (
            multiImageUploadRef.current &&
            multiImageUploadRef.current.getSelectedCount() > 0
        ) {
            const uploadedUrls =
                await multiImageUploadRef.current.uploadFiles();
            if (uploadedUrls && uploadedUrls.length > 0) {
                finalImageUrlsList = uploadedUrls;
                if (!thumbnail) {
                    setThumbnail(uploadedUrls[0]);
                    console.log(
                        'Thumbnail set from multiImageUpload:',
                        uploadedUrls[0]
                    );
                }
                console.log('Uploaded multi image URLs:', finalImageUrlsList);
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
                thumbnail,
                imageUrls: finalImageUrlsList,
            });
            closeModal();
            alert('모집글이 성공적으로 게시되었습니다.');
            navigate(`/study/${studyId}/recruitment`);
        } catch (error) {
            console.error('모집글 게시 중 오류 발생:', error);
            alert('모집글 게시 중 오류가 발생했습니다.');
        }
    };

    const handlePublishClick = () => {
        setIsModalOpen(true);
    };

    const handleCancelClick = () => {
        navigate(`/study/${studyId}/recruitment`);
    };

    return (
        <>
            {/* 상단 헤더 */}
            <h1 className="text-xl font-bold col-span-10 border-b-2">
                모집글 수정
            </h1>
            <CancleButton onClick={handleCancelClick} className="col-span-1" />
            <SubmitButton
                onClick={handlePublishClick}
                label="게시"
                className="col-span-1"
            />

            {/* 본문 영역: 에디터 및 미리보기 */}
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
        </>
    );
};

export default StudyRecruitmentRegisterBoard;
