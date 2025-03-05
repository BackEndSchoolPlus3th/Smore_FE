import React, { useState, useRef, KeyboardEvent } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import './NewRecruitmentStyle.css';
import { FaBold, FaItalic, FaLink, FaCode, FaImage } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { MarkdownRenderer, apiClient } from '../../../../shared';

const regionOptions = [
    { value: '전국', label: '전국' },
    { value: '서울', label: '서울' },
    { value: '부산', label: '부산' },
    { value: '대구', label: '대구' },
    { value: '인천', label: '인천' },
    { value: '광주', label: '광주' },
    { value: '대전', label: '대전' },
    { value: '울산', label: '울산' },
    { value: '세종', label: '세종' },
    { value: '경기', label: '경기' },
    { value: '강원', label: '강원' },
    { value: '충북', label: '충청북도' },
    { value: '충남', label: '충청남도' },
    { value: '전북', label: '전라북도' },
    { value: '전남', label: '전라남도' },
    { value: '경북', label: '경상북도' },
    { value: '경남', label: '경상남도' },
    { value: '제주', label: '제주도' },
];

const NewRecruitmentPage: React.FC = () => {
    const { studyId } = useParams<{ studyId: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [introduction, setIntroduction] = useState('');
    const [hashtagInput, setHashtagInput] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [region, setRegion] = useState(''); // 선택한 지역 값 (예: '서울')
    const [recruitmentPeriod, setRecruitmentPeriod] = useState({
        start: '',
        end: '',
    });
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [maxMember, setMaxMember] = useState<number>(0);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleIntroductionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setIntroduction(e.target.value);
    };

    // 공통 함수: 선택된 텍스트가 있으면 감싸고, 없으면 플레이스홀더를 삽입 후 해당 부분을 선택함.
    const insertMarkdown = (
        opening: string,
        closing: string,
        placeholder: string
    ) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.slice(start, end);
        const insertText = selectedText
            ? opening + selectedText + closing
            : opening + placeholder + closing;
        const newContent =
            content.slice(0, start) + insertText + content.slice(end);
        setContent(newContent);

        const newSelectionStart = start + opening.length;
        const newSelectionEnd = selectedText
            ? newSelectionStart + selectedText.length
            : newSelectionStart + placeholder.length;

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
        }, 0);
    };

    const handleBoldClick = () => {
        insertMarkdown('**', '**', 'bold');
    };

    const handleItalicClick = () => {
        insertMarkdown('*', '*', 'italic');
    };

    const handleLinkClick = () => {
        const textarea = textAreaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.slice(start, end);
        if (selectedText) {
            const insertText = `[${selectedText}](url)`;
            const newContent =
                content.slice(0, start) + insertText + content.slice(end);
            setContent(newContent);
            const newCursorPos = start + selectedText.length + 3;
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        } else {
            const insertText = `[text](url)`;
            const newContent =
                content.slice(0, start) + insertText + content.slice(end);
            setContent(newContent);
            const newSelectionStart = start + 1;
            const newSelectionEnd = newSelectionStart + 4;
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
            }, 0);
        }
    };

    const handleCodeClick = () => {
        insertMarkdown('`', '`', 'code');
    };

    // "게시" 버튼 클릭 시 모달 열기
    const handlePublishClick = () => {
        setIsModalOpen(true);
    };

    // 모달 내에서 파일 선택 시
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };

    const fetchRecruitmentArticle = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('introduction', introduction);
        formData.append('region', region);
        formData.append('maxMember', maxMember.toString());
        formData.append(
            'startDate',
            new Date(recruitmentPeriod.start).toISOString().split('T')[0]
        );
        formData.append(
            'endDate',
            new Date(recruitmentPeriod.end).toISOString().split('T')[0]
        );
        if (hashtags.length > 0) {
            formData.append('hashtags', hashtags.join(','));
        }
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            await apiClient.post(
                `/v1/study/${studyId}/recruitmentArticle`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            closeModal();
            alert('모집글이 성공적으로 게시되었습니다.');
        } catch (error) {
            console.error('모집글 게시 중 오류 발생:', error);
            alert('모집글 게시 중 오류가 발생했습니다.');
        }
    };

    // 모달의 "확인" 버튼 클릭 시 실제 게시 처리 로직 추가 가능
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

        await fetchRecruitmentArticle();
    };

    const isEndDateValid = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        return (
            recruitmentPeriod.end > currentDate &&
            recruitmentPeriod.end > recruitmentPeriod.start
        );
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, 300);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

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

            {/* 본문 컨텐츠 영역 */}
            <div className="p-4">
                {/* 에디터와 미리보기 영역 */}
                <div className="flex flex-row space-x-4">
                    {/* 에디터 영역 */}
                    <div className="flex flex-col w-1/2">
                        {/* 제목 입력 */}
                        <input
                            type="text"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={handleTitleChange}
                            maxLength={50}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-2xl focus:outline-none focus:border-purple-500 bg-white"
                        />
                        {/* 간단한 툴바 */}
                        <div className="flex space-x-2 mb-2">
                            <button
                                className="p-2 rounded focus:outline-none cursor-pointer"
                                title="Bold"
                                onClick={handleBoldClick}
                            >
                                <FaBold />
                            </button>
                            <button
                                className="p-2 rounded focus:outline-none cursor-pointer"
                                title="Italic"
                                onClick={handleItalicClick}
                            >
                                <FaItalic />
                            </button>
                            <button
                                className="p-2 rounded focus:outline-none cursor-pointer"
                                title="Link"
                                onClick={handleLinkClick}
                            >
                                <FaLink />
                            </button>
                            <button
                                className="p-2 rounded focus:outline-none cursor-pointer"
                                title="Code"
                                onClick={handleCodeClick}
                            >
                                <FaCode />
                            </button>
                            <button
                                className="p-2 rounded focus:outline-none cursor-pointer"
                                title="Image"
                            >
                                <FaImage />
                            </button>
                        </div>
                        {/* 마크다운 에디터 */}
                        <textarea
                            ref={textAreaRef}
                            placeholder="본문을 작성하세요..."
                            value={content}
                            onChange={handleContentChange}
                            className="w-full h-170 border border-gray-300 rounded p-3 resize-none focus:outline-none focus:border-purple-500 bg-white"
                        />
                    </div>

                    {/* 미리보기 영역 */}
                    <div className="w-1/2 h-196.5 border border-gray-300 rounded p-3 overflow-y-auto bg-white markdown-preview">
                        <MarkdownRenderer content={content} />
                    </div>
                </div>
            </div>

            {/* 모달 팝업 */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-gray-800/75 z-50"
                    onClick={handleOverlayClick}
                >
                    <div
                        className={`bg-white rounded-lg shadow-lg max-w-lg w-full p-6 ${
                            isClosing ? 'modal-slide-down' : 'modal-slide-up'
                        }`}
                    >
                        <h2 className="text-2xl font-bold mb-4">{title}</h2>

                        {/* 소개글 */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                소개글
                            </label>
                            <input
                                type="text"
                                value={introduction}
                                onChange={handleIntroductionChange}
                                maxLength={200}
                                placeholder="소개글을 입력하세요"
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* 해시태그 */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                해시태그
                            </label>
                            <input
                                type="text"
                                value={hashtagInput}
                                onChange={(e) =>
                                    setHashtagInput(e.target.value)
                                }
                                onKeyPress={handleHashtagKeyPress}
                                placeholder="해시태그를 입력하고 엔터를 누르세요"
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {hashtags.map((hashtag, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-1 rounded-full text-sm font-semibold bg-muted-purple flex items-center"
                                    >
                                        {hashtag}
                                        <MdOutlineCancel
                                            className="ml-2 cursor-pointer"
                                            onClick={() =>
                                                handleRemoveHashtag(index)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                            {hashtags.length >= 5 && (
                                <p className="text-red-500 text-sm mt-2">
                                    해시태그는 최대 5개까지 추가할 수 있습니다.
                                </p>
                            )}
                        </div>

                        {/* 지역 (react-select) */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                지역
                            </label>
                            <Select
                                options={regionOptions}
                                value={
                                    region
                                        ? regionOptions.find(
                                              (option) =>
                                                  option.value === region
                                          )
                                        : null
                                }
                                onChange={(selectedOption) =>
                                    setRegion(selectedOption?.value || '')
                                }
                                placeholder="지역을 선택하세요"
                                styles={{
                                    control: (styles) => ({
                                        ...styles,
                                        border: '1px solid gray-300',
                                        borderRadius: '0.375rem',
                                        padding: '0.1rem',
                                        cursor: 'pointer',
                                    }),
                                    option: (styles, { isSelected }) => ({
                                        ...styles,
                                        backgroundColor: isSelected
                                            ? '#c5baff'
                                            : 'white',
                                        color: isSelected ? 'white' : 'black',
                                        cursor: 'pointer',
                                    }),
                                    placeholder: (styles) => ({
                                        ...styles,
                                        color: '#7743db',
                                    }),
                                }}
                            />
                        </div>

                        {/* 모집기간 */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                모집기간
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="date"
                                    value={recruitmentPeriod.start}
                                    onChange={(e) =>
                                        setRecruitmentPeriod({
                                            ...recruitmentPeriod,
                                            start: e.target.value,
                                        })
                                    }
                                    className="w-1/2 border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
                                />
                                <input
                                    type="date"
                                    value={recruitmentPeriod.end}
                                    onChange={(e) =>
                                        setRecruitmentPeriod({
                                            ...recruitmentPeriod,
                                            end: e.target.value,
                                        })
                                    }
                                    className="w-1/2 border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            {!isEndDateValid() && (
                                <p className="text-red-500 text-sm mt-2">
                                    마감일은 현재 시간과 시작일 이후여야 합니다.
                                </p>
                            )}
                        </div>

                        {/* 최대 인원 */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                최대 인원
                            </label>
                            <input
                                type="number"
                                value={maxMember}
                                onChange={(e) => setMaxMember(+e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* 썸네일 */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                썸네일
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500 cursor-pointer"
                            />
                        </div>

                        {/* 모달 하단 버튼 */}
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded focus:outline-none cursor-pointer"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleModalConfirm}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none cursor-pointer"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewRecruitmentPage;
