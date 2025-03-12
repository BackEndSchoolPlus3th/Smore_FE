import React from 'react';
import Toolbar from './Toolbar';

interface EditorProps {
    title?: string;
    content: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
    // 추가: 이미지 업로드 경로
    uploadPath: string;
    // MultiImageUpload의 ref를 전달 (Toolbar로 전달)
    multiImageUploadRef: React.Ref<any>;
    isViewTitle?: boolean;
    isViewImageUpload?: boolean;
}

const Editor: React.FC<EditorProps> = ({
    title = '제목 입력',
    content,
    setTitle,
    setContent,
    textAreaRef,
    uploadPath,
    multiImageUploadRef,
    isViewTitle = true,
    isViewImageUpload = true,
}) => {
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

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

    return (
        <div className="flex flex-col h-full w-full">
            {isViewTitle && (
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={handleTitleChange}
                    maxLength={50}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-2xl focus:outline-none focus:border-purple-500 bg-white"
                />
            )}
            <Toolbar
                onBold={handleBoldClick}
                onItalic={handleItalicClick}
                onLink={handleLinkClick}
                onCode={handleCodeClick}
                uploadPath={uploadPath}
                multiImageUploadRef={multiImageUploadRef}
                isViewImageUpload={isViewImageUpload}
            />
            <textarea
                ref={textAreaRef}
                placeholder="본문을 작성하세요..."
                value={content}
                onChange={handleContentChange}
                className="w-full h-full border border-gray-300 rounded p-3 resize-none focus:outline-none focus:border-purple-500 bg-white"
            />
        </div>
    );
};

export default Editor;
