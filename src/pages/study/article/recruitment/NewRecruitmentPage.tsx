import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './NewRecruitmentStyle.css';
import { FaBold, FaItalic, FaLink, FaCode, FaImage } from 'react-icons/fa';
import { MarkdownRenderer } from '../../../../shared';

const NewRecruitmentPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
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

        // 새롭게 삽입된 부분 중 플레이스홀더나 감싼 텍스트 위치 계산
        const newSelectionStart = start + opening.length;
        const newSelectionEnd = selectedText
            ? newSelectionStart + selectedText.length
            : newSelectionStart + placeholder.length;

        // setTimeout을 사용하여 state 업데이트 후 textarea에 포커스 및 selection 적용
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
        }, 0);
    };

    // 각 버튼 클릭 핸들러
    const handleBoldClick = () => {
        insertMarkdown('**', '**', 'bold');
    };

    const handleItalicClick = () => {
        insertMarkdown('*', '*', 'italic');
    };

    const handleLinkClick = () => {
        // 선택된 텍스트가 있으면 링크 텍스트로 사용하고, 없으면 플레이스홀더 'text' 삽입, url은 'url'로 추가.
        const textarea = textAreaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.slice(start, end);
        if (selectedText) {
            // 선택된 텍스트를 링크 텍스트로 감싸고, 뒤에 (url) 추가
            const insertText = `[${selectedText}](url)`;
            const newContent =
                content.slice(0, start) + insertText + content.slice(end);
            setContent(newContent);
            // 커서를 url 부분 바로 앞에 위치하도록 (대괄호와 괄호 길이 고려)
            const newCursorPos = start + selectedText.length + 3; // [ ] 와 ( 의 길이 고려
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        } else {
            // 플레이스홀더 'text'와 'url' 삽입
            const insertText = `[text](url)`;
            const newContent =
                content.slice(0, start) + insertText + content.slice(end);
            setContent(newContent);
            // 'text' 부분 선택
            const newSelectionStart = start + 1; // [ 바로 뒤
            const newSelectionEnd = newSelectionStart + 4; // 'text' 길이 = 4
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
            }, 0);
        }
    };

    const handleCodeClick = () => {
        insertMarkdown('`', '`', 'code');
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
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none cursor-pointer">
                        출간
                    </button>
                </div>
            </div>

            {/* 본문 컨텐츠 영역 */}
            <div className="p-4">
                {/* 제목 입력 */}
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-2xl focus:outline-none focus:border-purple-500 bg-white"
                />

                {/* 에디터와 미리보기 영역 */}
                <div className="flex flex-row space-x-4">
                    {/* 에디터 영역 */}
                    <div className="flex flex-col w-1/2">
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
                    <div className="w-1/2 h-180 border border-gray-300 rounded p-3 overflow-y-auto bg-white markdown-preview">
                        <MarkdownRenderer content={content} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewRecruitmentPage;
